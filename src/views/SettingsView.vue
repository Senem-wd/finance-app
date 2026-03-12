<template>
  <div class="settings">
    <div class="settings__header">
      <p class="text-label">{{ t('settings.subtitle') }}</p>
      <h1 class="text-h2">{{ t('settings.title') }}</h1>
    </div>

    <div class="settings__grid">
      <!-- Currency -->
      <div class="card settings__card">
        <div class="settings__card-icon settings__card-icon--primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="settings__card-content">
          <h2 class="text-small" style="font-weight: 600; margin-bottom: 2px;">{{ t('settings.currency') }}</h2>
          <p class="text-caption text-muted">{{ t('settings.currencyDesc') }}</p>
        </div>
        <select v-model="settings.currency" class="select settings__select">
          <option value="EUR">EUR (€)</option>
          <option value="TRY">TRY (₺)</option>
          <option value="USD">USD ($)</option>
        </select>
      </div>

      <!-- Language -->
      <div class="card settings__card">
        <div class="settings__card-icon settings__card-icon--indigo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div class="settings__card-content">
          <h2 class="text-small" style="font-weight: 600; margin-bottom: 2px;">{{ t('settings.language') }}</h2>
          <p class="text-caption text-muted">{{ t('settings.languageDesc') }}</p>
        </div>
        <select v-model="settings.language" @change="onLanguageChange" class="select settings__select">
          <option value="tr">Türkçe</option>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </div>

      <!-- Budget Limit -->
      <div class="card settings__card">
        <div class="settings__card-icon settings__card-icon--warning">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="settings__card-content">
          <h2 class="text-small" style="font-weight: 600; margin-bottom: 2px;">{{ t('settings.budgetLimit') }}</h2>
          <p class="text-caption text-muted">{{ t('settings.budgetDesc') }}</p>
        </div>
        <input
          v-model.number="settings.monthlyBudgetLimit"
          type="number"
          min="0"
          step="10"
          class="input settings__input"
          placeholder="0"
        />
      </div>

      <!-- Theme -->
      <div class="card settings__card">
        <div class="settings__card-icon settings__card-icon--neutral">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </div>
        <div class="settings__card-content">
          <h2 class="text-small" style="font-weight: 600; margin-bottom: 2px;">{{ t('settings.theme') }}</h2>
          <p class="text-caption text-muted">{{ t('settings.themeDesc') }}</p>
        </div>
        <div class="theme-toggle">
          <button
            class="theme-toggle__btn"
            :class="{ 'theme-toggle__btn--active': settings.theme === 'dark' }"
            @click="settings.theme = 'dark'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            {{ t('settings.dark') }}
          </button>
          <button
            class="theme-toggle__btn"
            :class="{ 'theme-toggle__btn--active': settings.theme === 'light' }"
            @click="settings.theme = 'light'"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            {{ t('settings.light') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Info Footer -->
    <div class="settings__footer">
      <div class="settings__footer-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>{{ t('settings.localStorageNote') }}</span>
      </div>
      <div class="settings__footer-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>{{ t('settings.privacyNote') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import type { Language } from '@/types'

const { t, locale } = useI18n()
const settingsStore = useSettingsStore()
const settings = settingsStore.settings

const onLanguageChange = () => {
  locale.value = settings.language as Language
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.settings {
  padding: var(--spacing-xl);
  max-width: 720px;

  @media (max-width: 768px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  &__header {
    margin-bottom: var(--spacing-xl);
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  &__card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  &__card-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--primary { background-color: var(--color-success-dim); color: var(--color-success); }
    &--indigo { background-color: var(--color-primary-dim); color: var(--color-primary-light); }
    &--warning { background-color: var(--color-gold-dim); color: var(--color-gold); }
    &--neutral { background-color: var(--color-surface-2); color: var(--color-text-secondary); border: 1px solid var(--color-border); }
  }

  &__card-content {
    flex: 1;
    min-width: 140px;
  }

  &__select,
  &__input {
    width: auto;
    min-width: 140px;
    max-width: 200px;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  &__footer-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
}

.theme-toggle {
  display: flex;
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 3px;
  gap: 2px;

  &__btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
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
