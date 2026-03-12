<template>
  <div class="charts">
    <!-- Header -->
    <div class="charts__header">
      <div>
        <p class="text-label">{{ t('charts.subtitle') }}</p>
        <h1 class="text-h2">{{ t('charts.title') }}</h1>
      </div>

      <!-- Period Filter -->
      <div class="period-filter">
        <button
          v-for="opt in periodOptions"
          :key="opt.value"
          class="period-filter__btn"
          :class="{ 'period-filter__btn--active': period === opt.value }"
          @click="period = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="charts__summary">
      <div class="summary-card summary-card--income">
        <p class="summary-card__label">{{ t('charts.periodIncome') }}</p>
        <p class="summary-card__value amount--positive">{{ fmt(totalInPeriod.income) }}</p>
      </div>
      <div class="summary-card summary-card--expense">
        <p class="summary-card__label">{{ t('charts.periodExpense') }}</p>
        <p class="summary-card__value amount--negative">{{ fmt(totalInPeriod.expense) }}</p>
      </div>
      <div class="summary-card summary-card--net">
        <p class="summary-card__label">{{ t('charts.net') }}</p>
        <p
          class="summary-card__value"
          :class="(totalInPeriod.income - totalInPeriod.expense) >= 0 ? 'amount--positive' : 'amount--negative'"
        >
          {{ fmt(totalInPeriod.income - totalInPeriod.expense) }}
        </p>
      </div>
      <div class="summary-card summary-card--top">
        <p class="summary-card__label">{{ t('charts.topExpense') }}</p>
        <p class="summary-card__value text-gold" v-if="topExpenseCategory">{{ topExpenseCategory[0] }}</p>
        <p class="summary-card__value text-muted" v-else>—</p>
        <p class="text-caption" v-if="topExpenseCategory">{{ fmt(topExpenseCategory[1]) }}</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts__grid">
      <!-- Donut Chart -->
      <div class="card charts__chart-card">
        <h2 class="text-h3 charts__chart-title">{{ t('charts.spendingDist') }}</h2>
        <div v-if="pieChartData.series.length > 0">
          <VueApexCharts type="donut" height="300" :options="pieOptions" :series="pieChartData.series" />
        </div>
        <div v-else class="charts__no-data">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
          {{ t('charts.noExpense') }}
        </div>
      </div>

      <!-- Bar Chart -->
      <div class="card charts__chart-card charts__chart-card--wide">
        <h2 class="text-h3 charts__chart-title">{{ t('charts.sixMonthBar') }}</h2>
        <VueApexCharts type="bar" height="280" :options="barOptions" :series="barChartData.series" />
      </div>

      <!-- Line Chart -->
      <div class="card charts__chart-card charts__chart-card--wide">
        <h2 class="text-h3 charts__chart-title">{{ t('charts.sixMonthLine') }}</h2>
        <VueApexCharts type="area" height="260" :options="lineOptions" :series="lineChartData.series" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'
import { useChartData } from '@/composables/useChartData'
import { useSettingsStore } from '@/stores/settings'

const { t } = useI18n()

type Period = 'week' | 'month' | 'year' | 'all'

const periodOptions = computed<{ label: string; value: Period }[]>(() => [
  { label: t('charts.week'), value: 'week' },
  { label: t('charts.month'), value: 'month' },
  { label: t('charts.year'), value: 'year' },
  { label: t('charts.all'), value: 'all' },
])

const period = ref<Period>('month')
const settingsStore = useSettingsStore()

const { pieChartData, barChartData, lineChartData, topExpenseCategory, totalInPeriod } =
  useChartData(() => period.value)

const fmt = (val: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: settingsStore.settings.currency }).format(val)

const baseChart = {
  background: 'transparent',
  foreColor: '#94A3B8',
  fontFamily: 'Inter, sans-serif',
  toolbar: { show: false },
  animations: { enabled: true, easing: 'easeinout', speed: 400 },
}

const gridStyle = {
  borderColor: '#1E2130',
  strokeDashArray: 4,
}

const axisLabelStyle = { colors: '#94A3B8', fontSize: '12px', fontFamily: 'Inter, sans-serif' }

const pieOptions = computed(() => ({
  chart: { ...baseChart },
  labels: pieChartData.value.labels,
  colors: ['#6366F1', '#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#A855F7', '#06B6D4'],
  legend: { position: 'bottom' as const, labels: { colors: '#94A3B8' }, fontFamily: 'Inter, sans-serif' },
  dataLabels: { style: { fontSize: '11px', fontFamily: 'Inter, sans-serif' } },
  stroke: { width: 0 },
  plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: t('charts.total'), color: '#94A3B8', fontSize: '13px', formatter: (w: any) => fmt(w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)) } } } } },
  tooltip: { y: { formatter: (val: number) => fmt(val) } },
}))

const barOptions = computed(() => ({
  chart: { ...baseChart, stacked: false },
  colors: ['#10B981', '#EF4444'],
  xaxis: { categories: barChartData.value.categories, labels: { style: axisLabelStyle } },
  yaxis: { labels: { style: axisLabelStyle, formatter: (val: number) => fmt(val) } },
  grid: gridStyle,
  tooltip: { y: { formatter: (val: number) => fmt(val) } },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
  legend: { labels: { colors: '#94A3B8' } },
}))

const lineOptions = computed(() => ({
  chart: { ...baseChart },
  colors: ['#6366F1'],
  stroke: { curve: 'smooth' as const, width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.01,
      stops: [0, 100],
    },
  },
  xaxis: { categories: lineChartData.value.categories, labels: { style: axisLabelStyle } },
  yaxis: { labels: { style: axisLabelStyle, formatter: (val: number) => fmt(val) } },
  grid: gridStyle,
  markers: { size: 5, colors: ['#6366F1'], strokeColors: '#111318', strokeWidth: 2 },
  tooltip: { y: { formatter: (val: number) => fmt(val) } },
}))
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.charts {
  padding: var(--spacing-xl);
  max-width: 1000px;

  @media (max-width: 768px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  &__header {
    @include flex-between;
    margin-bottom: var(--spacing-xl);
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: flex-end;
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__chart-card {
    &--wide {
      grid-column: 1 / -1;
    }
  }

  &__chart-title {
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
  }

  &__no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    min-height: 200px;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
}

/* Summary Cards */
.summary-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
  }

  &--income::after { background: var(--color-success); opacity: 0.6; }
  &--expense::after { background: var(--color-error); opacity: 0.6; }
  &--net::after { background: var(--color-primary-light); opacity: 0.6; }
  &--top::after { background: var(--color-gold); opacity: 0.6; }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__value {
    font-size: 1.25rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }
}

/* Period Filter */
.period-filter {
  display: flex;
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;

  &__btn {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;

    &--active {
      background-color: var(--color-surface);
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
    }

    &:hover:not(&--active) {
      color: var(--color-text);
    }
  }
}
</style>
