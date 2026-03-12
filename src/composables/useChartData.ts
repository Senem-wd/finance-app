import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionStore } from '@/stores/transactions'
import type { Transaction } from '@/types'

type Period = 'week' | 'month' | 'year' | 'all'

const filterByPeriod = (transactions: Transaction[], period: Period): Transaction[] => {
  if (period === 'all') return transactions
  const now = new Date()
  const cutoff = new Date()
  if (period === 'week') cutoff.setDate(now.getDate() - 7)
  else if (period === 'month') cutoff.setMonth(now.getMonth() - 1)
  else if (period === 'year') cutoff.setFullYear(now.getFullYear() - 1)
  return transactions.filter(t => new Date(t.date) >= cutoff)
}

export const useChartData = (period: () => Period) => {
  const { t, locale } = useI18n()
  const store = useTransactionStore()

  const monthAbbr = (monthIndex: number) =>
    new Intl.DateTimeFormat(locale.value, { month: 'short' }).format(new Date(2000, monthIndex, 1))

  const filtered = computed(() => filterByPeriod(store.transactions, period()))

  // --- Pasta grafiği: harcama kategorileri ---
  const pieChartData = computed(() => {
    const map: Record<string, number> = {}
    filtered.value
      .filter(t => t.type === 'expense')
      .forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount })
    return {
      labels: Object.keys(map),
      series: Object.values(map),
    }
  })

  // --- Çubuk grafik: son 6 ay gelir vs gider ---
  const barChartData = computed(() => {
    const now = new Date()
    const months: { year: number; month: number; label: string }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ year: d.getFullYear(), month: d.getMonth(), label: monthAbbr(d.getMonth()) })
    }

    const income = months.map(m =>
      store.transactions
        .filter(t => t.type === 'income' && new Date(t.date).getFullYear() === m.year && new Date(t.date).getMonth() === m.month)
        .reduce((s, t) => s + t.amount, 0)
    )
    const expense = months.map(m =>
      store.transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === m.year && new Date(t.date).getMonth() === m.month)
        .reduce((s, t) => s + t.amount, 0)
    )

    return {
      categories: months.map(m => m.label),
      series: [
        { name: t('dashboard.income'), data: income },
        { name: t('dashboard.expense'), data: expense },
      ],
    }
  })

  // --- Çizgi grafik: son 6 ay bakiye trendi ---
  const lineChartData = computed(() => {
    const now = new Date()
    const points: { label: string; balance: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i + 1, 0) // ayın son günü
      const balance = store.transactions
        .filter(t => new Date(t.date) <= d)
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
      points.push({ label: monthAbbr(d.getMonth()), balance })
    }
    return {
      categories: points.map(p => p.label),
      series: [{ name: t('dashboard.balance'), data: points.map(p => p.balance) }],
    }
  })

  // --- En çok harcanan kategori ---
  const topExpenseCategory = computed(() => {
    const map: Record<string, number> = {}
    filtered.value
      .filter(t => t.type === 'expense')
      .forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount })
    const entries = Object.entries(map)
    if (entries.length === 0) return null
    return entries.reduce((a, b) => (b[1] > a[1] ? b : a))
  })

  const totalInPeriod = computed(() => ({
    income: filtered.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expense: filtered.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
  }))

  return { pieChartData, barChartData, lineChartData, topExpenseCategory, totalInPeriod }
}
