<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-layout class="app-layout">
        <n-layout-header bordered class="app-header">
          <router-link to="/" class="app-title">
            <n-icon :component="ColorPaletteOutline" size="24" />
            <span>传统色名浏览器</span>
          </router-link>
          <n-text depth="3" class="app-subtitle">中国色 · 日本色</n-text>
        </n-layout-header>
        <n-layout-content class="app-content">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NLayout, NLayoutHeader, NLayoutContent, NIcon, NText } from 'naive-ui'
import { ColorPaletteOutline } from '@vicons/ionicons5'

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

.app-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 56px;
  background: #fff;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-decoration: none;
}

.app-title:hover {
  color: #8B4513;
}

.app-subtitle {
  font-size: 13px;
}

.app-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
