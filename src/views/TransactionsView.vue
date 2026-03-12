<template>
  <div class="transactions">
    <div class="transactions__header">
      <div>
        <p class="text-label">{{ t('transactions.subtitle') }}</p>
        <h1 class="text-h2">{{ t('transactions.title') }}</h1>
      </div>
      <button class="btn btn--primary" @click="showForm = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        {{ t('transactions.addNew') }}
      </button>
    </div>

    <div class="transactions__filters">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        class="filter-pill"
        :class="{ 'filter-pill--active': filterType === opt.value }"
        @click="filterType = opt.value"
      >
        {{ opt.label }}
        <span class="filter-pill__count">{{ getCount(opt.value) }}</span>
      </button>
    </div>

    <Transition name="modal">
      <div v-if="showForm" class="modal-overlay" @click.self="cancelForm">
        <div class="modal">
          <div class="modal__header">
            <h2 class="text-h3">{{ editingId ? t('transactions.editTitle') : t('transactions.newTitle') }}</h2>
            <button class="modal__close" @click="cancelForm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="type-toggle">
            <button
              class="type-toggle__btn"
              :class="{ 'type-toggle__btn--income': form.type === 'income' }"
              @click="form.type = 'income'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              {{ t('transactions.income') }}
            </button>
            <button
              class="type-toggle__btn"
              :class="{ 'type-toggle__btn--expense': form.type === 'expense' }"
              @click="form.type = 'expense'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg>
              {{ t('transactions.expense') }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal__form">
            <div class="field-group">
              <label>{{ t('transactions.amount') }}</label>
              <input v-model.number="form.amount" type="number" min="0" step="0.01" class="input" placeholder="0.00" required />
            </div>
            <div class="field-group">
              <label>{{ t('transactions.category') }}</label>
              <select v-model="form.category" class="select">
                <option v-for="cat in currentCategories" :key="cat" :value="cat">{{ tCat(cat) }}</option>
              </select>
            </div>
            <div class="field-group">
              <label>{{ t('transactions.date') }}</label>
              <input v-model="form.date" type="date" class="input" required />
            </div>
            <div class="field-group">
              <label>{{ t('transactions.note') }}</label>
              <input v-model="form.note" type="text" class="input" :placeholder="t('transactions.notePlaceholder')" />
            </div>
            <div class="modal__actions">
              <button type="button" class="btn btn--ghost" @click="cancelForm">{{ t('transactions.cancel') }}</button>
              <button type="submit" class="btn btn--primary">
                {{ editingId ? t('transactions.update') : t('transactions.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <div class="card transactions__list-card">
      <p v-if="filtered.length === 0" class="transactions__empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        {{ t('transactions.empty') }}
      </p>

      <ul v-else class="transactions__list">
        <li v-for="tx in filtered" :key="tx.id" class="transactions__item">
          <div class="transactions__item-indicator" :class="tx.type === 'income' ? 'transactions__item-indicator--income' : 'transactions__item-indicator--expense'"></div>
          <div class="transactions__item-body">
            <div class="transactions__item-info">
              <p class="text-small" style="font-weight: 600; color: var(--color-text);">{{ tCat(tx.category) }}</p>
              <p class="text-caption">{{ formatDate(tx.date) }}<span v-if="tx.note" class="text-muted"> · {{ tx.note }}</span></p>
            </div>
            <div class="transactions__item-right">
              <span class="transactions__item-amount" :class="tx.type === 'income' ? 'amount--positive' : 'amount--negative'">
                {{ tx.type === 'income' ? '+' : '−' }}{{ formatAmount(tx.amount) }}
              </span>
              <div class="transactions__item-actions">
                <button class="icon-btn" @click="startEdit(tx)" :title="t('transactions.edit')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="icon-btn icon-btn--danger" @click="txStore.deleteTransaction(tx.id)" :title="t('transactions.delete')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransactionStore } from '@/stores/transactions'
import { useSettingsStore } from '@/stores/settings'
import type { Transaction, IncomeCategory, ExpenseCategory } from '@/types'

const { t } = useI18n()
const txStore = useTransactionStore()
const settingsStore = useSettingsStore()

const INCOME_CATEGORIES: IncomeCategory[] = ['Maaş', 'Serbest Çalışma', 'Yatırım Getirisi', 'Diğer']
const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Kira', 'Market', 'Ulaşım', 'Sağlık', 'Eğlence', 'Yatırım', 'Diğer']

const CATEGORY_KEYS: Record<string, string> = {
  'Maaş': 'transactions.categories.income.salary',
  'Serbest Çalışma': 'transactions.categories.income.freelance',
  'Yatırım Getirisi': 'transactions.categories.income.investment',
  'Kira': 'transactions.categories.expense.rent',
  'Market': 'transactions.categories.expense.grocery',
  'Ulaşım': 'transactions.categories.expense.transport',
  'Sağlık': 'transactions.categories.expense.health',
  'Eğlence': 'transactions.categories.expense.entertainment',
  'Yatırım': 'transactions.categories.expense.investment',
  'Diğer': 'transactions.categories.income.other',
}

const tCat = (cat: string): string => CATEGORY_KEYS[cat] ? t(CATEGORY_KEYS[cat]) : cat

const filterOptions = computed(() => [
  { label: t('transactions.all'), value: 'all' as const },
  { label: t('transactions.income'), value: 'income' as const },
  { label: t('transactions.expense'), value: 'expense' as const },
])

const filterType = ref<'all' | 'income' | 'expense'>('all')
const showForm = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  type: 'expense' as 'income' | 'expense',
  amount: 0,
  category: 'Diğer' as IncomeCategory | ExpenseCategory,
  date: new Date().toISOString().slice(0, 10),
  note: '',
})

const currentCategories = computed(() =>
  form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
)

const sorted = computed(() =>
  [...txStore.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

const filtered = computed(() => {
  if (filterType.value === 'all') return sorted.value
  return sorted.value.filter(t => t.type === filterType.value)
})

const getCount = (type: 'all' | 'income' | 'expense'): number => {
  if (type === 'all') return txStore.transactions.length
  return txStore.transactions.filter(t => t.type === type).length
}

const handleSubmit = (): void => {
  const payload = {
    type: form.type,
    amount: form.amount,
    category: form.category,
    date: form.date,
    note: form.note,
    currency: settingsStore.settings.currency,
  }
  if (editingId.value) {
    txStore.updateTransaction(editingId.value, payload)
  } else {
    txStore.addTransaction(payload)
  }
  cancelForm()
}

const startEdit = (tx: Transaction): void => {
  editingId.value = tx.id
  form.type = tx.type
  form.amount = tx.amount
  form.category = tx.category
  form.date = tx.date
  form.note = tx.note
  showForm.value = true
}

const cancelForm = (): void => {
  showForm.value = false
  editingId.value = null
  form.type = 'expense'
  form.amount = 0
  form.category = 'Diğer'
  form.date = new Date().toISOString().slice(0, 10)
  form.note = ''
}

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: settingsStore.settings.currency }).format(amount)

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.transactions {
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
  }

  &__filters {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    flex-wrap: wrap;
  }

  &__list-card {
    padding: 0;
    overflow: hidden;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-2xl) 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    text-align: center;
  }

  &__list { display: flex; flex-direction: column; }

  &__item {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--color-border-subtle);
    transition: background-color 0.15s;
    &:last-child { border-bottom: none; }
    &:hover { background-color: var(--color-surface-2); }
  }

  &__item-indicator {
    width: 3px;
    flex-shrink: 0;
    &--income { background-color: var(--color-success); }
    &--expense { background-color: var(--color-error); }
  }

  &__item-body {
    @include flex-between;
    flex: 1;
    padding: 14px var(--spacing-lg);
    gap: var(--spacing-md);
  }

  &__item-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  &__item-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-shrink: 0;
  }

  &__item-amount {
    font-size: 0.9375rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__item-actions { display: flex; gap: var(--spacing-xs); }
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
  background-color: var(--color-surface-2);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.15s;

  &:hover { color: var(--color-text); border-color: var(--color-text-muted); }

  &--active {
    background-color: var(--color-primary-dim);
    color: var(--color-primary-light);
    border-color: rgba(99, 102, 241, 0.3);
  }

  &__count {
    font-size: 0.7rem;
    background-color: var(--color-surface-3);
    color: var(--color-text-muted);
    padding: 1px 6px;
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  &--active &__count {
    background-color: var(--color-primary-dim);
    color: var(--color-primary-light);
  }
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition: all 0.15s;
  cursor: pointer;

  &:hover { background-color: var(--color-surface-3); color: var(--color-text); }
  &--danger:hover { background-color: var(--color-error-dim); color: var(--color-error); }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.modal {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);

  &__header {
    @include flex-between;
    margin-bottom: var(--spacing-lg);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
    &:hover { background-color: var(--color-surface-2); color: var(--color-text); }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
    margin-top: var(--spacing-sm);
  }
}

.type-toggle {
  display: flex;
  background-color: var(--color-surface-2);
  border-radius: var(--radius-md);
  padding: 4px;
  gap: 4px;
  margin-bottom: var(--spacing-sm);

  &__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s;
    &--income { background-color: var(--color-success-dim); color: var(--color-success); }
    &--expense { background-color: var(--color-error-dim); color: var(--color-error); }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
  .modal { transition: transform 0.2s ease; }
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  .modal { transform: scale(0.95) translateY(8px); }
}
</style>
