import axios from 'axios'

export interface GoldPrice {
  pricePerGram: number
  pricePerOunce: number
  currency: string
  updatedAt: string
  isLive: boolean
}

const TROY_OUNCE_GRAMS = 31.1035

// Fallback fiyat (canlı API başarısız olursa)
const FALLBACK_PRICE_EUR_PER_OUNCE = 2750

const buildFallback = (): GoldPrice => ({
  pricePerOunce: FALLBACK_PRICE_EUR_PER_OUNCE,
  pricePerGram: FALLBACK_PRICE_EUR_PER_OUNCE / TROY_OUNCE_GRAMS,
  currency: 'EUR',
  updatedAt: new Date().toISOString(),
  isLive: false,
})

// GoldAPI.io — VITE_GOLD_API_KEY env değişkeni gerekir
const fetchFromGoldApi = async (): Promise<GoldPrice> => {
  const apiKey = import.meta.env.VITE_GOLD_API_KEY as string | undefined
  if (!apiKey) throw new Error('No GOLD_API_KEY')

  const { data } = await axios.get('https://www.goldapi.io/api/XAU/EUR', {
    headers: { 'x-access-token': apiKey },
  })

  return {
    pricePerOunce: data.price,
    pricePerGram: data.price / TROY_OUNCE_GRAMS,
    currency: 'EUR',
    updatedAt: new Date().toISOString(),
    isLive: true,
  }
}

// MetalpriceAPI.com — VITE_METALPRICE_API_KEY env değişkeni gerekir
const fetchFromMetalpriceApi = async (): Promise<GoldPrice> => {
  const apiKey = import.meta.env.VITE_METALPRICE_API_KEY as string | undefined
  if (!apiKey) throw new Error('No METALPRICE_API_KEY')

  const { data } = await axios.get(
    `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=XAU&currencies=EUR`
  )

  const eurPerOunce = 1 / data.rates.EUR

  return {
    pricePerOunce: eurPerOunce,
    pricePerGram: eurPerOunce / TROY_OUNCE_GRAMS,
    currency: 'EUR',
    updatedAt: new Date().toISOString(),
    isLive: true,
  }
}

// 15 dakika cache
let cache: { data: GoldPrice; fetchedAt: number } | null = null
const CACHE_TTL_MS = 15 * 60 * 1000

export const fetchGoldPrice = async (): Promise<GoldPrice> => {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data
  }

  const fetchers = [fetchFromGoldApi, fetchFromMetalpriceApi]

  for (const fetcher of fetchers) {
    try {
      const data = await fetcher()
      cache = { data, fetchedAt: Date.now() }
      return data
    } catch {
      // sonraki kaynağa geç
    }
  }

  // Tüm kaynaklar başarısız → fallback
  const fallback = buildFallback()
  cache = { data: fallback, fetchedAt: Date.now() }
  return fallback
}
