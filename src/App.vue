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
          <div class="app-header__spacer" />
          <router-link to="/discover" class="app-nav-link" aria-label="随机发现">
            <n-icon :component="ShuffleOutline" size="20" />
            <span>随机发现</span>
          </router-link>
          <n-badge
            class="app-favorites-badge"
            :value="favoriteCount"
            :max="99"
            :hidden="favoriteCount === 0"
          >
            <router-link to="/favorites" class="app-favorites" aria-label="我的收藏夹">
              <n-icon :component="HeartOutline" size="20" />
              <span>收藏夹</span>
            </router-link>
          </n-badge>
        </n-layout-header>
        <n-layout-content class="app-content">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NLayout, NLayoutHeader, NLayoutContent, NIcon, NText, NBadge } from 'naive-ui'
import { ColorPaletteOutline, HeartOutline, ShuffleOutline } from '@vicons/ionicons5'
import { useFavorites } from '@/composables/useFavorites'

const { favoriteCount } = useFavorites()

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

.app-header__spacer {
  flex: 1;
}

.app-favorites {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.app-favorites:hover {
  background: #f5f5f5;
  color: #8B4513;
}

.app-nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  margin-right: 8px;
}

.app-nav-link:hover {
  background: #f5f5f5;
  color: #8B4513;
}

.app-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
