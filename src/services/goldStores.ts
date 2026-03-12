export interface GoldStore {
  id: string
  name: string
  city: string
  address: string
  website: string
  phone: string
  rating: number
  description: string
  lat: number
  lng: number
}

export const GERMANY_GOLD_STORES: GoldStore[] = [
  {
    id: 'pro-aurum-munich',
    name: 'pro aurum',
    city: 'München',
    address: 'Sedanstraße 3, 80538 München',
    website: 'https://www.proaurum.de',
    phone: '+49 89 2020 2020',
    rating: 4.7,
    description: "Almanya'nın önde gelen altın ve gümüş satıcısı. Geniş ürün yelpazesi.",
    lat: 48.1351,
    lng: 11.5820,
  },
  {
    id: 'pro-aurum-hamburg',
    name: 'pro aurum',
    city: 'Hamburg',
    address: 'Ballindamm 27, 20095 Hamburg',
    website: 'https://www.proaurum.de',
    phone: '+49 40 2020 2020',
    rating: 4.6,
    description: 'Hamburg şubesi. Gün içi teslimat mümkün.',
    lat: 53.5511,
    lng: 10.0014,
  },
  {
    id: 'degussa-frankfurt',
    name: 'Degussa Goldhandel',
    city: 'Frankfurt',
    address: 'Kettenhofweg 29, 60325 Frankfurt am Main',
    website: 'https://www.degussa-goldhandel.de',
    phone: '+49 69 860068 0',
    rating: 4.8,
    description: 'Almanya genelinde 11 şube. Güvenilir ve şeffaf fiyatlandırma.',
    lat: 50.1109,
    lng: 8.6821,
  },
  {
    id: 'degussa-hamburg',
    name: 'Degussa Goldhandel',
    city: 'Hamburg',
    address: 'Gänsemarkt 35, 20354 Hamburg',
    website: 'https://www.degussa-goldhandel.de',
    phone: '+49 40 860068 0',
    rating: 4.7,
    description: 'Hamburg merkezi konumunda. Altın, gümüş ve platin.',
    lat: 53.5550,
    lng: 9.9937,
  },
  {
    id: 'degussa-berlin',
    name: 'Degussa Goldhandel',
    city: 'Berlin',
    address: 'Kurfürstendamm 152, 10709 Berlin',
    website: 'https://www.degussa-goldhandel.de',
    phone: '+49 30 860068 0',
    rating: 4.6,
    description: 'Berlin Ku\'damm şubesi. Randevusuz ziyaret edilebilir.',
    lat: 52.5037,
    lng: 13.3087,
  },
  {
    id: 'solit-gruppe',
    name: 'SOLIT Gruppe',
    city: 'Wiesbaden',
    address: 'Michelsberg 2, 65187 Wiesbaden',
    website: 'https://www.solit-kapital.de',
    phone: '+49 611 9090 8700',
    rating: 4.5,
    description: 'Fiziksel altın depolama ve satın alma hizmeti. Online sipariş mevcut.',
    lat: 50.0782,
    lng: 8.2397,
  },
  {
    id: 'pim-gold',
    name: 'PIM Gold',
    city: 'Heusenstamm',
    address: 'Borsigstraße 1, 63150 Heusenstamm',
    website: 'https://www.pimgold.com',
    phone: '+49 6104 669 8888',
    rating: 4.3,
    description: 'Toplu altın alımı ve düzenli tasarruf planları.',
    lat: 50.0536,
    lng: 8.8014,
  },
]

export const filterByCity = (city: string): GoldStore[] =>
  city === 'all'
    ? GERMANY_GOLD_STORES
    : GERMANY_GOLD_STORES.filter(s => s.city === city)

export const getUniqueCities = (): string[] =>
  [...new Set(GERMANY_GOLD_STORES.map(s => s.city))].sort()
