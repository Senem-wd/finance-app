import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/transactions', name: 'transactions', component: () => import('@/views/TransactionsView.vue') },
    { path: '/charts', name: 'charts', component: () => import('@/views/ChartsView.vue') },
    { path: '/gold', name: 'gold', component: () => import('@/views/GoldView.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
  ],
})

export default router
