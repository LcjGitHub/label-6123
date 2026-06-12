<template>
  <n-layout-header bordered class="app-header">
    <span class="app-title" role="link" tabindex="0" @click="handleTitleClick" @keydown.enter="handleTitleClick">
      <n-icon :component="ColorPaletteOutline" size="24" />
      <span>传统色名浏览器</span>
    </span>
    <n-text depth="3" class="app-subtitle">中国色 · 日本色</n-text>
    <div class="app-header__spacer" />
    <router-link to="/discover" class="app-nav-link" aria-label="随机发现">
      <n-icon :component="ShuffleOutline" size="20" />
      <span>随机发现</span>
    </router-link>
    <router-link to="/compare" class="app-nav-link" aria-label="双色调对比">
      <n-icon :component="ContrastOutline" size="20" />
      <span>双色对比</span>
    </router-link>
    <router-link to="/stats" class="app-nav-link" aria-label="统计概览">
      <n-icon :component="BarChartOutline" size="20" />
      <span>统计概览</span>
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
    <n-badge
      class="app-history-badge"
      :value="unreadCount"
      :max="99"
      :hidden="unreadCount === 0"
    >
      <router-link to="/history" class="app-favorites" aria-label="浏览历史">
        <n-icon :component="TimeOutline" size="20" />
        <span>历史</span>
      </router-link>
    </n-badge>
    <n-tooltip :content="themeTooltip" placement="bottom">
      <n-button
        quaternary
        circle
        size="medium"
        class="app-theme-toggle"
        @click="toggleTheme"
        :aria-label="themeTooltip"
      >
        <template #icon>
          <n-icon :component="themeIcon" size="20" />
        </template>
      </n-button>
    </n-tooltip>
  </n-layout-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NLayoutHeader, NIcon, NText, NBadge, NButton, NTooltip } from 'naive-ui'
import { ColorPaletteOutline, HeartOutline, ShuffleOutline, BarChartOutline, TimeOutline, ContrastOutline, MoonOutline, SunnyOutline, PhonePortraitOutline } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { useBrowseHistory } from '@/composables/useBrowseHistory'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { favoriteCount } = useFavorites()
const { unreadCount } = useBrowseHistory()
const { themeMode, isDark, toggleTheme } = useTheme()

const themeIcon = computed(() => {
  if (themeMode.value === 'light') return SunnyOutline
  if (themeMode.value === 'dark') return MoonOutline
  return PhonePortraitOutline
})

const themeTooltip = computed(() => {
  if (themeMode.value === 'light') return '浅色模式，点击切换到深色'
  if (themeMode.value === 'dark') return '深色模式，点击切换到跟随系统'
  return `跟随系统（${isDark.value ? '深色' : '浅色'}），点击切换到浅色`
})

function handleTitleClick() {
  if (route.name === 'detail' && window.history.state?.fromList === true) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 56px;
  background: var(--bg-header);
  min-width: 0;
  transition: background 0.3s;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  flex-shrink: 0;
  transition: color 0.2s;
}

.app-title:hover {
  color: #8B4513;
}

:deep(.theme-dark) .app-title:hover {
  color: #D2691E;
}

.app-subtitle {
  font-size: 13px;
  flex-shrink: 0;
}

.app-header__spacer {
  flex: 1;
  min-width: 8px;
}

.app-favorites {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-primary);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
  white-space: nowrap;
}

.app-favorites:hover {
  background: var(--bg-hover);
  color: #8B4513;
}

:deep(.theme-dark) .app-favorites:hover {
  color: #D2691E;
}

.app-nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-primary);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  margin-right: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}

.app-nav-link:hover {
  background: var(--bg-hover);
  color: #8B4513;
}

:deep(.theme-dark) .app-nav-link:hover {
  color: #D2691E;
}

.app-theme-toggle {
  flex-shrink: 0;
  margin-left: 4px;
}

@media (max-width: 640px) {
  .app-header {
    padding: 0 16px;
    gap: 12px;
  }

  .app-subtitle {
    display: none;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 0 12px;
    gap: 8px;
  }

  .app-title span {
    display: none;
  }

  .app-nav-link span {
    display: none;
  }

  .app-favorites span {
    display: none;
  }

  .app-nav-link {
    margin-right: 0;
  }
}
</style>
