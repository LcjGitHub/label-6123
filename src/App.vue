<template>
  <n-config-provider :theme-overrides="themeOverrides">
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
import { NConfigProvider, NMessageProvider, NLayout, NLayoutContent } from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'

const themeOverrides = {
  common: {
    primaryColor: '#8B4513',
    primaryColorHover: '#A0522D',
    primaryColorPressed: '#6B3410',
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  background: #f5f5f5;
}

.app-layout {
  min-height: 100vh;
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
