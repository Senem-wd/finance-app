<template>
  <div class="gold">
    <!-- Header -->
    <div class="gold__header">
      <div>
        <p class="text-label">{{ t('gold.subtitle') }}</p>
        <h1 class="text-h2">{{ t('gold.title') }}</h1>
      </div>
      <span class="badge badge--gold" v-if="goldPrice">
        {{ goldPrice.isLive ? t('gold.livePriceTag') : t('gold.estimatedTag') }}
      </span>
    </div>

    <!-- Top Row: Price + Investment Budget -->
    <div class="gold__top-row">
      <div class="card gold__price-card">
        <p class="text-label" style="margin-bottom: var(--spacing-md);">{{ t('gold.currentPrice') }}</p>
        <div v-if="loadingPrice" class="gold__loading">
          <div class="gold__spinner"></div>
          <span class="text-small text-muted">{{ t('gold.loading') }}</span>
        </div>
        <div v-else-if="goldPrice" class="gold__price-values">
          <div class="gold__price-main">
            <p class="gold__price-gram text-gold">{{ fmt(goldPrice.pricePerGram) }}</p>
            <p class="text-caption text-muted">{{ t('gold.perGram') }}</p>
          </div>
          <div class="gold__price-secondary">
            <div class="gold__price-item">
              <p class="text-caption text-muted">{{ t('gold.ounce') }}</p>
              <p class="text-small" style="font-weight: 600;">{{ fmt(goldPrice.pricePerOunce) }}</p>
            </div>
            <div class="gold__price-item">
              <p class="text-caption text-muted">{{ t('gold.updatedAt') }}</p>
              <p class="text-small" style="font-weight: 600;">{{ formatTime(goldPrice.updatedAt) }}</p>
            </div>
          </div>
        </div>
        <p v-if="goldPrice && !goldPrice.isLive" class="gold__api-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {{ t('gold.apiNote') }}
        </p>
      </div>

      <div class="card gold__budget-card">
        <p class="text-label" style="margin-bottom: var(--spacing-md);">{{ t('gold.investmentAdvice') }}</p>
        <p class="text-caption text-muted" style="margin-bottom: var(--spacing-sm);">{{ t('gold.budgetDesc') }}</p>
        <p class="gold__budget-value text-gold">{{ fmt(investmentBudget) }}</p>
        <div v-if="goldPrice" class="gold__budget-grams">
          <p class="text-caption text-muted">{{ t('gold.buyableGrams') }}</p>
          <p class="text-small amount--positive" style="font-weight: 700;">
            {{ (investmentBudget / goldPrice.pricePerGram).toFixed(2) }} {{ t('gold.gram') }}
          </p>
        </div>
        <div class="gold__portfolio" v-if="goldStore.investments.length > 0">
          <div class="gold__portfolio-divider"></div>
          <div class="gold__portfolio-stats">
            <div>
              <p class="text-caption text-muted">{{ t('gold.totalGold') }}</p>
              <p class="text-small text-gold" style="font-weight: 700;">{{ goldStore.totalGrams.toFixed(2) }}g</p>
            </div>
            <div>
              <p class="text-caption text-muted">{{ t('gold.totalSpent') }}</p>
              <p class="text-small" style="font-weight: 600;">{{ fmt(goldStore.totalSpent) }}</p>
            </div>
            <div v-if="goldPrice">
              <p class="text-caption text-muted">{{ t('gold.currentValue') }}</p>
              <p class="text-small amount--positive" style="font-weight: 700;">{{ fmt(goldStore.totalGrams * goldPrice.pricePerGram) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calculator -->
    <div class="card gold__calc-card">
      <h2 class="text-h3" style="margin-bottom: var(--spacing-md);">{{ t('gold.calculator') }}</h2>
      <div class="gold__calc-grid">
        <div class="field-group">
          <label>{{ t('gold.budget') }} ({{ settings.currency }})</label>
          <input v-model.number="calcBudget" type="number" min="0" step="10" class="input" />
        </div>
        <div class="field-group">
          <label>{{ t('gold.grams') }}</label>
          <input v-model.number="calcGrams" type="number" min="0" step="0.1" class="input" />
        </div>
      </div>
      <div class="gold__calc-results" v-if="goldPrice">
        <div class="gold__calc-result-item">
          <span class="text-caption text-muted">{{ calcBudget }} {{ settings.currency }} {{ t('gold.calcWith') }}</span>
          <span class="text-small text-gold" style="font-weight: 700;">{{ calcGramsFromBudget.toFixed(3) }} {{ t('gold.gram') }}</span>
        </div>
        <div class="gold__calc-divider"></div>
        <div class="gold__calc-result-item">
          <span class="text-caption text-muted">{{ calcGrams }}g {{ t('gold.calcFor') }}</span>
          <span class="text-small text-gold" style="font-weight: 700;">{{ fmt(calcCostFromGrams) }}</span>
        </div>
      </div>
    </div>

    <!-- Purchase History -->
    <div class="card gold__history-card">
      <div class="gold__history-header">
        <h2 class="text-h3">{{ t('gold.historyTitle') }}</h2>
        <button class="btn btn--gold" @click="showAddForm = !showAddForm">
          <svg v-if="!showAddForm" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          {{ showAddForm ? t('gold.cancel') : t('gold.add') }}
        </button>
      </div>

      <Transition name="slide">
        <form v-if="showAddForm" @submit.prevent="handleAddInvestment" class="gold__form">
          <div class="field-group">
            <label>{{ t('gold.gramsLabel') }}</label>
            <input v-model.number="addForm.gramsAmount" type="number" min="0" step="0.01" class="input" required />
          </div>
          <div class="field-group">
            <label>{{ t('gold.pricePerGram') }} ({{ settings.currency }})</label>
            <input v-model.number="addForm.pricePerGram" type="number" min="0" step="0.01" class="input" required />
          </div>
          <div class="field-group">
            <label>{{ t('gold.store') }}</label>
            <input v-model="addForm.store" type="text" class="input" :placeholder="t('gold.storePlaceholder')" />
          </div>
          <div class="field-group">
            <label>{{ t('gold.date') }}</label>
            <input v-model="addForm.date" type="date" class="input" required />
          </div>
          <div class="field-group">
            <label>{{ t('gold.note') }}</label>
            <input v-model="addForm.note" type="text" class="input" :placeholder="t('gold.notePlaceholder')" />
          </div>
          <button type="submit" class="btn btn--gold gold__form-submit">{{ t('gold.save') }}</button>
        </form>
      </Transition>

      <p v-if="goldStore.investments.length === 0 && !showAddForm" class="gold__empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        {{ t('gold.historyEmpty') }}
      </p>

      <ul class="gold__history-list">
        <li v-for="inv in goldStore.investments" :key="inv.id" class="gold__history-item">
          <div class="gold__history-gram">
            <span class="text-gold" style="font-weight: 700; font-size: 1rem;">{{ inv.gramsAmount }}g</span>
          </div>
          <div class="gold__history-info">
            <p class="text-small" style="font-weight: 600;">{{ inv.store || '—' }}</p>
            <p class="text-caption text-muted">{{ formatDate(inv.date) }} · {{ fmt(inv.pricePerGram) }}/g</p>
            <p class="text-caption text-muted" v-if="inv.note">{{ inv.note }}</p>
          </div>
          <div class="gold__history-right">
            <span class="amount--negative" style="font-weight: 700; font-size: 0.9375rem; font-variant-numeric: tabular-nums;">{{ fmt(inv.totalPaid) }}</span>
            <button class="icon-btn icon-btn--danger" @click="goldStore.deleteInvestment(inv.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- German Gold Stores -->
    <div class="card gold__stores-card">
      <div class="gold__stores-header">
        <h2 class="text-h3">{{ t('gold.storesTitle') }}</h2>
      </div>

      <!-- Location Finder -->
      <div class="gold__location-box">
        <p class="text-label" style="margin-bottom: var(--spacing-md);">{{ t('gold.locationTitle') }}</p>
        <div class="gold__location-row">
          <div class="field-group gold__location-input">
            <label>{{ t('gold.postcodeLabel') }}</label>
            <input
              v-model="postcodeInput"
              type="text"
              class="input"
              :placeholder="t('gold.postcodePlaceholder')"
              maxlength="5"
              @keyup.enter="searchByPostcode"
            />
          </div>
          <button class="btn btn--primary gold__location-btn" @click="searchByPostcode" :disabled="locationLoading">
            <svg v-if="!locationLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <div v-else class="gold__spinner gold__spinner--sm"></div>
            {{ t('gold.findNearest') }}
          </button>
          <button class="btn btn--ghost gold__location-btn" @click="useGeolocation" :disabled="locationLoading">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ t('gold.useMyLocation') }}
          </button>
        </div>
        <p v-if="locationError" class="gold__location-error">{{ locationError }}</p>
        <p v-if="userLocation" class="gold__location-success">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ locationLabel }}
        </p>
      </div>

      <!-- Sort + City Filters -->
      <div class="gold__stores-toolbar">
        <div class="gold__stores-filters">
          <button
            v-for="city in ['all', ...uniqueCities]"
            :key="city"
            class="filter-pill filter-pill--sm"
            :class="{ 'filter-pill--gold': cityFilter === city }"
            @click="cityFilter = city"
          >
            {{ city === 'all' ? t('gold.allCities') : city }}
          </button>
        </div>
        <div class="gold__sort-toggle" v-if="userLocation">
          <button
            class="gold__sort-btn"
            :class="{ 'gold__sort-btn--active': sortBy === 'distance' }"
            @click="sortBy = 'distance'"
          >{{ t('gold.sortByDistance') }}</button>
          <button
            class="gold__sort-btn"
            :class="{ 'gold__sort-btn--active': sortBy === 'rating' }"
            @click="sortBy = 'rating'"
          >{{ t('gold.sortByRating') }}</button>
        </div>
      </div>

      <div class="gold__stores-grid">
        <div v-for="store in displayedStores" :key="store.id" class="gold__store-item">
          <div class="gold__store-top">
            <div>
              <p class="gold__store-name">{{ store.name }}</p>
              <p class="text-caption text-muted">{{ store.city }} — {{ store.address }}</p>
            </div>
            <div class="gold__store-meta">
              <div class="gold__store-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="text-gold"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span class="text-small" style="font-weight: 600;">{{ store.rating }}</span>
              </div>
              <span v-if="store.distance !== undefined" class="gold__distance-badge">
                {{ store.distance.toFixed(1) }} {{ t('gold.distance') }}
              </span>
            </div>
          </div>
          <p class="text-caption text-muted gold__store-desc">{{ store.description }}</p>
          <div class="gold__store-links">
            <a :href="store.website" target="_blank" rel="noopener" class="gold__store-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {{ t('gold.web') }}
            </a>
            <a :href="`tel:${store.phone}`" class="gold__store-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.62a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6.09 6.09l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
              {{ store.phone }}
            </a>
            <a
              :href="`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`"
              target="_blank" rel="noopener"
              class="gold__store-link"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ t('gold.map') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchGoldPrice } from '@/services/goldApi'
import { GERMANY_GOLD_STORES, getUniqueCities } from '@/services/goldStores'
import { useGoldStore } from '@/stores/gold'
import { useTransactionStore } from '@/stores/transactions'
import { useSettingsStore } from '@/stores/settings'
import type { GoldPrice } from '@/services/goldApi'

const { t } = useI18n()
const goldStore = useGoldStore()
const txStore = useTransactionStore()
const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const goldPrice = ref<GoldPrice | null>(null)
const loadingPrice = ref(true)
const cityFilter = ref('all')
const showAddForm = ref(false)
const calcBudget = ref(500)
const calcGrams = ref(1)

// Location state
const postcodeInput = ref('')
const locationLoading = ref(false)
const locationError = ref('')
const locationLabel = ref('')
const userLocation = ref<{ lat: number; lng: number } | null>(null)
const sortBy = ref<'distance' | 'rating'>('distance')

const addForm = reactive({
  gramsAmount: 1,
  pricePerGram: 0,
  store: '',
  date: new Date().toISOString().slice(0, 10),
  note: '',
})

onMounted(async () => {
  goldPrice.value = await fetchGoldPrice()
  if (goldPrice.value) {
    addForm.pricePerGram = parseFloat(goldPrice.value.pricePerGram.toFixed(2))
  }
  loadingPrice.value = false
})

const investmentBudget = computed(() => txStore.investmentBudget)
const uniqueCities = getUniqueCities()

// Haversine distance in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

type StoreWithDistance = (typeof GERMANY_GOLD_STORES)[0] & { distance?: number }

const storesWithDistance = computed<StoreWithDistance[]>(() => {
  return GERMANY_GOLD_STORES.map(s => ({
    ...s,
    distance: userLocation.value
      ? haversine(userLocation.value.lat, userLocation.value.lng, s.lat, s.lng)
      : undefined,
  }))
})

const displayedStores = computed<StoreWithDistance[]>(() => {
  let list = storesWithDistance.value
  if (cityFilter.value !== 'all') {
    list = list.filter(s => s.city === cityFilter.value)
  }
  if (userLocation.value && sortBy.value === 'distance') {
    return [...list].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
  }
  return [...list].sort((a, b) => b.rating - a.rating)
})

// Geocode postcode via Nominatim (free, no key needed)
async function searchByPostcode(): Promise<void> {
  const plz = postcodeInput.value.trim()
  if (!plz) return
  locationLoading.value = true
  locationError.value = ''
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(plz)}&country=de&format=json&limit=1`
    const res = await fetch(url, { headers: { 'Accept-Language': 'de' } })
    const data = await res.json()
    if (!data.length) {
      locationError.value = t('gold.postcodeError')
      userLocation.value = null
    } else {
      userLocation.value = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      locationLabel.value = `PLZ ${plz} — ${data[0].display_name.split(',')[0]}`
      sortBy.value = 'distance'
    }
  } catch {
    locationError.value = t('gold.locationError')
  } finally {
    locationLoading.value = false
  }
}

function useGeolocation(): void {
  if (!navigator.geolocation) {
    locationError.value = t('gold.locationError')
    return
  }
  locationLoading.value = true
  locationError.value = ''
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      locationLabel.value = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
      sortBy.value = 'distance'
      locationLoading.value = false
    },
    () => {
      locationError.value = t('gold.locationError')
      locationLoading.value = false
    },
    { timeout: 8000 }
  )
}

const calcGramsFromBudget = computed(() =>
  goldPrice.value ? calcBudget.value / goldPrice.value.pricePerGram : 0
)

const calcCostFromGrams = computed(() =>
  goldPrice.value ? calcGrams.value * goldPrice.value.pricePerGram : 0
)

const handleAddInvestment = (): void => {
  goldStore.addInvestment({
    gramsAmount: addForm.gramsAmount,
    pricePerGram: addForm.pricePerGram,
    totalPaid: addForm.gramsAmount * addForm.pricePerGram,
    store: addForm.store,
    date: addForm.date,
    note: addForm.note,
  })
  showAddForm.value = false
  addForm.gramsAmount = 1
  addForm.store = ''
  addForm.note = ''
  addForm.date = new Date().toISOString().slice(0, 10)
}

const fmt = (val: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: settings.currency }).format(val)

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.gold {
  padding: var(--spacing-xl);
  max-width: 1000px;

  @media (max-width: 768px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  &__header {
    @include flex-between;
    margin-bottom: var(--spacing-xl);
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: flex-end;
  }

  &__top-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg) 0;
  }

  &__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;

    &--sm {
      width: 14px;
      height: 14px;
      border-top-color: var(--color-primary-light);
    }
  }

  &__price-values {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__price-main {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
  }

  &__price-gram {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  &__price-secondary {
    display: flex;
    gap: var(--spacing-xl);
  }

  &__price-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__api-note {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: var(--spacing-md);
    font-size: 0.75rem;
    color: var(--color-warning);

    code {
      background-color: var(--color-surface-2);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-family: var(--font-mono);
    }
  }

  &__budget-value {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    margin-bottom: var(--spacing-xs);
  }

  &__budget-grams {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
  }

  &__portfolio-divider {
    height: 1px;
    background-color: var(--color-border);
    margin: var(--spacing-md) 0;
  }

  &__portfolio-stats {
    display: flex;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }

  &__calc-card { margin-bottom: var(--spacing-lg); }

  &__calc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    @media (max-width: 480px) { grid-template-columns: 1fr; }
  }

  &__calc-results {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-surface-2);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  &__calc-result-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  &__calc-divider {
    width: 1px;
    height: 24px;
    background-color: var(--color-border);
  }

  &__history-card {
    margin-bottom: var(--spacing-lg);
    padding: 0;
    overflow: hidden;
  }

  &__history-header {
    @include flex-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  &__form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--color-surface-2);
    border-bottom: 1px solid var(--color-border);
  }

  &__form-submit {
    grid-column: 1 / -1;
    align-self: end;
    justify-self: start;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-2xl) 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    text-align: center;
  }

  &__history-list { display: flex; flex-direction: column; }

  &__history-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border-subtle);
    transition: background-color 0.15s;
    &:last-child { border-bottom: none; }
    &:hover { background-color: var(--color-surface-2); }
  }

  &__history-gram {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-md);
    background-color: var(--color-gold-dim);
    border: 1px solid rgba(245, 158, 11, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__history-info { flex: 1; min-width: 0; }

  &__history-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex-shrink: 0;
  }

  // Stores section
  &__stores-card { margin-bottom: var(--spacing-lg); }

  &__stores-header {
    margin-bottom: var(--spacing-lg);
  }

  &__location-box {
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  &__location-row {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    align-items: flex-end;
  }

  &__location-input {
    flex: 1;
    min-width: 130px;
    max-width: 200px;
  }

  &__location-btn {
    align-self: flex-end;
    white-space: nowrap;
  }

  &__location-error {
    margin-top: var(--spacing-sm);
    font-size: 0.8125rem;
    color: var(--color-error);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__location-success {
    margin-top: var(--spacing-sm);
    font-size: 0.8125rem;
    color: var(--color-success);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__stores-toolbar {
    @include flex-between;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  &__stores-filters {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }

  &__sort-toggle {
    display: flex;
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 3px;
    gap: 2px;
  }

  &__sort-btn {
    padding: 5px 12px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;

    &--active {
      background-color: var(--color-surface);
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
    }
  }

  &__stores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--spacing-md);
  }

  &__store-item {
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover {
      border-color: rgba(245, 158, 11, 0.3);
      box-shadow: var(--shadow-glow-gold);
    }
  }

  &__store-top {
    @include flex-between;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  &__store-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  &__store-name {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-text);
  }

  &__store-rating {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__store-desc { margin-bottom: var(--spacing-sm); line-height: 1.5; }

  &__store-links {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  &__store-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--color-gold);
    padding: 4px 10px;
    background-color: var(--color-gold-dim);
    border-radius: var(--radius-full);
    border: 1px solid rgba(245, 158, 11, 0.2);
    transition: all 0.15s;
    text-decoration: none;

    &:hover { background-color: rgba(245, 158, 11, 0.25); }
  }
}

.gold__distance-badge {
  font-size: 0.7rem;
  font-weight: 600;
  background-color: var(--color-primary-dim);
  color: var(--color-primary-light);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(99, 102, 241, 0.2);
  white-space: nowrap;
}

.filter-pill {
  &--sm { padding: 4px 12px; font-size: 0.75rem; }
  &--gold { background-color: var(--color-gold-dim); color: var(--color-gold); border-color: rgba(245, 158, 11, 0.3); }
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
  &--danger:hover { background-color: var(--color-error-dim); color: var(--color-error); }
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 400px; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
