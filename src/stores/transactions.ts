import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { Transaction, TransactionType } from '@/types'

const STORAGE_KEY = 'finans_transactions'

const loadFromStorage = (): Transaction[] => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

const saveToStorage = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>(loadFromStorage())

  const totalIncome = computed(() =>
    transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const totalExpense = computed(() =>
    transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  )

  const netBalance = computed(() => totalIncome.value - totalExpense.value)

  const investmentBudget = computed(() => totalIncome.value * 0.10)

  const recentTransactions = computed(() =>
    [...transactions.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  )

  const expenseByCategory = computed(() => {
    const map: Record<string, number> = {}
    transactions.value
      .filter(t => t.type === 'expense')
      .forEach(t => {
        map[t.category] = (map[t.category] ?? 0) + t.amount
      })
    return map
  })

  const addTransaction = (payload: Omit<Transaction, 'id' | 'createdAt'>): void => {
    const newTransaction: Transaction = {
      ...payload,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    transactions.value.push(newTransaction)
    saveToStorage(transactions.value)
  }

  const updateTransaction = (id: string, payload: Partial<Omit<Transaction, 'id' | 'createdAt'>>): void => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value[index] = { ...transactions.value[index], ...payload } as Transaction
      saveToStorage(transactions.value)
    }
  }

  const deleteTransaction = (id: string): void => {
    transactions.value = transactions.value.filter(t => t.id !== id)
    saveToStorage(transactions.value)
  }

  const filterByType = (type: TransactionType): Transaction[] =>
    transactions.value.filter(t => t.type === type)

  const filterByMonth = (year: number, month: number): Transaction[] =>
    transactions.value.filter(t => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

  return {
    transactions,
    totalIncome,
    totalExpense,
    netBalance,
    investmentBudget,
    recentTransactions,
    expenseByCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterByType,
    filterByMonth,
  }
})
