<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-layout class="app-layout">
        <AppHeader />
        <n-layout-content class="app-content">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NConfigProvider, NMessageProvider, NLayout, NLayoutContent, darkTheme } from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const themeOverrides = computed(() => {
  if (isDark.value) {
    return {
      common: {
        primaryColor: '#D2691E',
        primaryColorHover: '#CD853F',
        primaryColorPressed: '#8B4513',
        bodyColor: '#1a1a2e',
        cardColor: '#16213e',
        modalColor: '#16213e',
        popoverColor: '#16213e',
        dividerColor: '#2a2a4a',
        borderColor: '#2a2a4a',
      },
    }
  }
  return {
    common: {
      primaryColor: '#8B4513',
      primaryColorHover: '#A0522D',
      primaryColorPressed: '#6B3410',
    },
  }
})
</script>

<style>
:root {
  --bg-body: #f5f5f5;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --bg-hover: #f5f5f5;
  --bg-info-block: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #e5e5e5;
  --border-light: #f0f0f0;
  --shadow-card: 0 1px 4px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.12);
  --divider-color: #ccc;
  --accent-primary: #8B4513;
  --accent-secondary: #A0522D;
}

.theme-dark {
  --bg-body: #0f0f1e;
  --bg-card: #1a1a2e;
  --bg-header: #16213e;
  --bg-hover: #2a2a4a;
  --bg-info-block: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --text-tertiary: #707080;
  --border-color: #2a2a4a;
  --border-light: #2a2a4a;
  --shadow-card: 0 1px 4px rgba(0, 0, 0, 0.3);
  --shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.4);
  --divider-color: #444466;
  --accent-primary: #D2691E;
  --accent-secondary: #CD853F;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  background: var(--bg-body);
  color: var(--text-primary);
  transition: background 0.3s, color 0.3s;
}

.app-layout {
  min-height: 100vh;
  background: var(--bg-body);
  transition: background 0.3s;
}

.app-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 480px) {
  .app-content {
    padding: 16px;
  }
}
</style>
