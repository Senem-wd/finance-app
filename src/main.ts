import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import router from '@/router'
import App from './App.vue'
import { initNative } from '@/plugins/native'
import tr from '@/locales/tr'
import de from '@/locales/de'
import en from '@/locales/en'
import type { Language } from '@/types'

const savedSettings = localStorage.getItem('finans_settings')
const savedLang: Language = savedSettings ? JSON.parse(savedSettings).language ?? 'tr' : 'tr'

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'tr',
  messages: { tr, de, en },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')

initNative()
