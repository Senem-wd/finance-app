<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard__header">
      <div>
        <p class="text-label">{{ t('dashboard.subtitle') }}</p>
        <h1 class="text-h2">{{ t('nav.dashboard') }}</h1>
      </div>
      <div class="dashboard__date">{{ today }}</div>
    </div>

    <!-- Stat Cards -->
    <div class="dashboard__stats">
      <div class="stat-card stat-card--income">
        <div class="stat-card__icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
        <p class="stat-card__label">{{ t('dashboard.totalIncome') }}</p>
        <p class="stat-card__value amount--positive">{{ formatAmount(totalIncome) }}</p>
      </div>

      <div class="stat-card stat-card--expense">
        <div class="stat-card__icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
        </div>
        <p class="stat-card__label">{{ t('dashboard.totalExpense') }}</p>
        <p class="stat-card__value amount--negative">{{ formatAmount(totalExpense) }}</p>
      </div>

      <div class="stat-card stat-card--balance">
        <div class="stat-card__icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <p class="stat-card__label">{{ t('dashboard.netBalance') }}</p>
        <p class="stat-card__value" :class="netBalance >= 0 ? 'amount--positive' : 'amount--negative'">
          {{ formatAmount(netBalance) }}
        </p>
      </div>

      <div class="stat-card stat-card--investment">
        <div class="stat-card__icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <p class="stat-card__label">{{ t('dashboard.investmentBudget') }} <span class="stat-card__percent">%10</span></p>
        <p class="stat-card__value text-gold">{{ formatAmount(investmentBudget) }}</p>
      </div>
    </div>

    <!-- Balance Breakdown + Chart Row -->
    <div class="dashboard__main-row">

      <!-- Kalan / Harcanan -->
      <div class="card balance-card">
        <p class="text-label" style="margin-bottom: var(--spacing-lg);">{{ t('dashboard.balanceSummary') }}</p>

        <div class="balance-card__row">
          <div class="balance-card__block balance-card__block--spent">
            <div class="balance-card__icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M15 9H9M15 12H9M12 15H9"/></svg>
            </div>
            <p class="balance-card__label">{{ t('dashboard.spent') }}</p>
            <p class="balance-card__amount amount--negative">{{ formatAmount(totalExpense) }}</p>
            <p class="balance-card__sub" v-if="totalIncome > 0">
              {{ t('dashboard.ofIncome', { ratio: expenseRatio }) }}
            </p>
          </div>

          <div class="balance-card__divider"></div>

          <div class="balance-card__block balance-card__block--remaining">
            <div class="balance-card__icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
            </div>
            <p class="balance-card__label">{{ t('dashboard.remaining') }}</p>
            <p class="balance-card__amount" :class="netBalance >= 0 ? 'amount--positive' : 'amount--negative'">
              {{ formatAmount(netBalance) }}
            </p>
            <p class="balance-card__sub" v-if="totalIncome > 0">
              {{ t('dashboard.ofIncome', { ratio: remainingRatio }) }}
            </p>
          </div>
        </div>

        <!-- Mini bar -->
        <div class="balance-card__bar-wrap">
          <div class="balance-card__bar">
            <div
              class="balance-card__bar-fill balance-card__bar-fill--spent"
              :style="{ width: Math.min(expenseRatio, 100) + '%' }"
            ></div>
          </div>
          <div class="balance-card__bar-labels">
            <span class="text-caption">{{ t('dashboard.spent') }}</span>
            <span class="text-caption">{{ t('dashboard.remaining') }}</span>
          </div>
        </div>
      </div>

      <!-- Harcama Kategorileri Pasta Grafiği -->
      <div class="card chart-card">
        <p class="text-label" style="margin-bottom: var(--spacing-sm);">{{ t('dashboard.expenseCategories') }}</p>

        <div v-if="hasExpenses">
          <VueApexCharts
            type="donut"
            height="280"
            :options="donutOptions"
            :series="donutSeries"
          />
          <!-- Legend -->
          <div class="chart-card__legend">
            <div
              v-for="(item, i) in legendItems"
              :key="item.label"
              class="chart-card__legend-item"
            >
              <span class="chart-card__legend-dot" :style="{ background: pastelColors[i % pastelColors.length] }"></span>
              <span class="chart-card__legend-label">{{ item.label }}</span>
              <span class="chart-card__legend-value">{{ formatAmount(item.value) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="chart-card__empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          <p class="text-caption text-muted">{{ t('dashboard.noExpenses') }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'
import { useTransactionStore } from '@/stores/transactions'
import { useSettingsStore } from '@/stores/settings'

const { t, locale } = useI18n()
const txStore = useTransactionStore()
const settingsStore = useSettingsStore()

const { totalIncome, totalExpense, netBalance, investmentBudget, expenseByCategory } = txStore
const settings = settingsStore.settings

const today = computed(() =>
  new Date().toLocaleDateString(locale.value, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
)

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: settings.currency }).format(amount)

const expenseRatio = computed(() =>
  totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0
)
const remainingRatio = computed(() =>
  totalIncome > 0 ? Math.max(0, 100 - expenseRatio.value) : 0
)

// Distinct color palette for each category
const pastelColors = [
  '#6366F1', // indigo
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#3B82F6', // blue
  '#A855F7', // purple
  '#06B6D4', // cyan
  '#EC4899', // pink
  '#F97316', // orange
  '#14B8A6', // teal
]

const legendItems = computed(() =>
  Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))
)

const hasExpenses = computed(() => legendItems.value.length > 0)

const donutSeries = computed(() => legendItems.value.map(item => item.value))
const donutLabels = computed(() => legendItems.value.map(item => item.label))

const donutOptions = computed(() => ({
  chart: {
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 500 },
  },
  labels: donutLabels.value,
  colors: pastelColors,
  stroke: { width: 2, colors: ['transparent'] },
  legend: { show: false },
  dataLabels: {
    enabled: true,
    style: { fontSize: '11px', fontFamily: 'Inter, sans-serif', colors: ['#1e293b'] },
    formatter: (val: number) => val.toFixed(0) + '%',
    dropShadow: { enabled: false },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: {
          show: true,
          total: {
            show: true,
            label: t('charts.total'),
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            formatter: () => formatAmount(totalExpense),
          },
        },
      },
    },
  },
  tooltip: {
    y: { formatter: (val: number) => formatAmount(val) },
    style: { fontFamily: 'Inter, sans-serif' },
  },
}))
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.dashboard {
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
  }

  &__date {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border);
    padding: 6px 14px;
    border-radius: var(--radius-full);
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  &__main-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

/* Stat Cards */
.stat-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  &--income::before  { background: linear-gradient(90deg, #6EE7B7, rgba(16, 185, 129, 0.3)); }
  &--expense::before { background: linear-gradient(90deg, #FDA4AF, rgba(239, 68, 68, 0.3)); }
  &--balance::before { background: linear-gradient(90deg, #93C5FD, #C4B5FD); }
  &--investment::before { background: linear-gradient(90deg, #FCD34D, #F9A8D4); }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-xs);
  }

  &--income &__icon    { background-color: rgba(110, 231, 183, 0.15); color: #10B981; }
  &--expense &__icon   { background-color: rgba(253, 164, 175, 0.2); color: #EF4444; }
  &--balance &__icon   { background-color: rgba(147, 197, 253, 0.15); color: #6366F1; }
  &--investment &__icon { background-color: rgba(252, 211, 77, 0.15); color: #D97706; }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__percent {
    font-size: 0.65rem;
    background-color: rgba(252, 211, 77, 0.15);
    color: #D97706;
    padding: 1px 5px;
    border-radius: var(--radius-full);
    margin-left: 4px;
    font-weight: 600;
  }

  &__value {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
}

/* Balance Card */
.balance-card {
  display: flex;
  flex-direction: column;

  &__row {
    display: flex;
    gap: var(--spacing-md);
    flex: 1;
    margin-bottom: var(--spacing-lg);
  }

  &__divider {
    width: 1px;
    background-color: var(--color-border);
    flex-shrink: 0;
  }

  &__block {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-sm);

    .balance-card__block--spent & {
      background-color: rgba(253, 164, 175, 0.2);
      color: #EF4444;
    }
    .balance-card__block--remaining & {
      background-color: rgba(110, 231, 183, 0.15);
      color: #10B981;
    }
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__amount {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    margin: var(--spacing-xs) 0;
  }

  &__sub {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  &__bar-wrap {
    margin-top: auto;
  }

  &__bar {
    width: 100%;
    height: 8px;
    background-color: rgba(110, 231, 183, 0.2);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 6px;
  }

  &__bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.5s ease;

    &--spent {
      background: linear-gradient(90deg, #FDA4AF, #FCA5A5);
    }
  }

  &__bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--color-text-muted);
  }
}

/* Chart Card */
.chart-card {
  display: flex;
  flex-direction: column;

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    color: var(--color-text-muted);
    min-height: 240px;
  }

  &__legend {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: var(--spacing-sm);
    max-height: 160px;
    overflow-y: auto;
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.8125rem;
  }

  &__legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__legend-label {
    flex: 1;
    color: var(--color-text-secondary);
    @include truncate;
  }

  &__legend-value {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--color-text);
    font-size: 0.8125rem;
  }
}
</style>
