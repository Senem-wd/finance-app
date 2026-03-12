import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Settings, Currency, Language, Theme } from '@/types'

const STORAGE_KEY = 'finans_settings'

const defaultSettings: Settings = {
  currency: 'EUR',
  language: 'tr',
  monthlyBudgetLimit: 0,
  theme: 'dark',
}

const loadFromStorage = (): Settings => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings }
}

const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>(loadFromStorage())

  // Apply saved theme immediately on load
  applyTheme(settings.value.theme)

  watch(settings, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    applyTheme(val.theme)
  }, { deep: true })

  const setCurrency = (currency: Currency): void => {
    settings.value.currency = currency
  }

  const setLanguage = (language: Language): void => {
    settings.value.language = language
  }

  const setTheme = (theme: Theme): void => {
    settings.value.theme = theme
  }

  const setBudgetLimit = (limit: number): void => {
    settings.value.monthlyBudgetLimit = limit
  }

  return { settings, setCurrency, setLanguage, setTheme, setBudgetLimit }
})
