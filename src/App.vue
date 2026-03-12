<template>
  <div class="app">
    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="sidebar__brand">
        <div class="sidebar__logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="sidebar__brand-name">FinansApp</span>
      </div>

      <ul class="sidebar__links">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink :to="link.to" class="sidebar__link" active-class="sidebar__link--active">
            <span class="sidebar__link-icon" v-html="link.icon"></span>
            <span class="sidebar__link-label">{{ link.label }}</span>
          </RouterLink>
        </li>
      </ul>

      <div class="sidebar__footer">
        <div class="sidebar__footer-dot"></div>
        <span class="sidebar__footer-text">v1.0</span>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="app__content">
      <RouterView />
    </main>

    <!-- Mobile Bottom Nav -->
    <nav class="bottom-nav">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="bottom-nav__item"
        active-class="bottom-nav__item--active"
      >
        <span class="bottom-nav__icon" v-html="link.icon"></span>
        <span class="bottom-nav__label">{{ link.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const icons = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  transactions: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
  charts: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  gold: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
}

const navLinks = computed(() => [
  { to: '/', label: t('nav.dashboard'), icon: icons.dashboard },
  { to: '/transactions', label: t('nav.transactions'), icon: icons.transactions },
  { to: '/charts', label: t('nav.charts'), icon: icons.charts },
  { to: '/gold', label: t('nav.gold'), icon: icons.gold },
  { to: '/settings', label: t('nav.settings'), icon: icons.settings },
])
</script>

<style lang="scss">
@use '@/styles/main.scss';

.app {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* ===== Sidebar ===== */
.sidebar {
  width: 220px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg) var(--spacing-md);
  z-index: 100;

  &__brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  &__logo {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    box-shadow: var(--shadow-glow-primary);
  }

  &__brand-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.01em;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px var(--spacing-md);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.15s ease;
    text-decoration: none;

    &:hover {
      background-color: var(--color-surface-2);
      color: var(--color-text);
    }

    &--active {
      background-color: var(--color-primary-dim);
      color: var(--color-primary-light);

      .sidebar__link-icon svg {
        stroke: var(--color-primary-light);
      }
    }
  }

  &__link-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    flex-shrink: 0;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    margin-top: var(--spacing-md);
  }

  &__footer-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-success);
    box-shadow: 0 0 6px var(--color-success);
  }

  &__footer-text {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
}

/* ===== Main Content ===== */
.app__content {
  margin-left: 220px;
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
}

/* ===== Bottom Nav (Mobile) ===== */
.bottom-nav {
  display: none;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .app__content {
    margin-left: 0;
    padding-bottom: 80px;
  }

  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-border);
    z-index: 100;
    padding: var(--spacing-sm) 0;
    padding-bottom: max(var(--spacing-sm), env(safe-area-inset-bottom));

    &__item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: var(--spacing-xs) 0;
      color: var(--color-text-muted);
      text-decoration: none;
      transition: color 0.15s;

      &--active {
        color: var(--color-primary-light);
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__label {
      font-size: 0.625rem;
      font-weight: 500;
    }
  }
}
</style>
