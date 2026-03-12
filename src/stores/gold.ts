import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { GoldInvestment } from '@/types'

const STORAGE_KEY = 'finans_gold'

const loadFromStorage = (): GoldInvestment[] => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

const saveToStorage = (investments: GoldInvestment[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
}

export const useGoldStore = defineStore('gold', () => {
  const investments = ref<GoldInvestment[]>(loadFromStorage())

  const totalGrams = computed(() =>
    investments.value.reduce((sum, i) => sum + i.gramsAmount, 0)
  )

  const totalSpent = computed(() =>
    investments.value.reduce((sum, i) => sum + i.totalPaid, 0)
  )

  const addInvestment = (payload: Omit<GoldInvestment, 'id'>): void => {
    investments.value.push({ ...payload, id: uuidv4() })
    saveToStorage(investments.value)
  }

  const deleteInvestment = (id: string): void => {
    investments.value = investments.value.filter(i => i.id !== id)
    saveToStorage(investments.value)
  }

  return { investments, totalGrams, totalSpent, addInvestment, deleteInvestment }
})
