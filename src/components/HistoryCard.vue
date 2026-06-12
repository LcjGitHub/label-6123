<template>
  <div class="history-card">
    <div class="history-card__swatch" :style="{ backgroundColor: color.hex }">
      <span class="history-card__hex" :class="{ 'history-card__hex--light': isLight }">
        {{ color.hex }}
      </span>
    </div>
    <div class="history-card__body">
      <div class="history-card__main">
        <router-link
          :to="{ path: `/color/${color.id}` }"
          class="history-card__name"
        >
          {{ color.name }}
        </router-link>
        <n-tag size="small" :bordered="false" :type="color.origin === 'china' ? 'error' : 'info'">
          {{ color.origin === 'china' ? '中国色' : '日本色' }}
        </n-tag>
        <n-tag size="small" :bordered="false">{{ color.category }}</n-tag>
      </div>
      <div class="history-card__meta">
        <span class="history-card__time">{{ formattedTime }}</span>
      </div>
    </div>
    <n-button
      quaternary
      circle
      size="small"
      class="history-card__delete"
      @click.stop="$emit('remove', color.id)"
    >
      <template #icon>
        <n-icon :component="CloseOutline" size="16" />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag, NButton, NIcon } from 'naive-ui'
import { CloseOutline } from '@vicons/ionicons5'
import type { ColorItem } from '@/types/color'
import { isLightColor } from '@/utils/colorUtils'

const props = defineProps<{
  color: ColorItem
  viewedAt: number
}>()

defineEmits<{
  remove: [colorId: string]
}>()

const isLight = computed(() => isLightColor(props.color.hex))

const formattedTime = computed(() => {
  const date = new Date(props.viewedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHour < 24) return `${diffHour} 小时前`
  if (diffDay < 7) return `${diffDay} 天前`
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})
</script>

<style scoped>
.history-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.2s, background 0.3s;
  position: relative;
}

.history-card:hover {
  box-shadow: var(--shadow-card-hover);
}

.history-card__swatch {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  padding: 4px 6px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.theme-dark) .history-card__swatch {
  border-color: rgba(255, 255, 255, 0.1);
}

.history-card__hex {
  font-size: 10px;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.history-card__hex--light {
  color: var(--text-primary);
  text-shadow: none;
}

.history-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-card__main {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.history-card__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.history-card__name:hover {
  color: #8B4513;
}

:deep(.theme-dark) .history-card__name:hover {
  color: #D2691E;
}

.history-card__meta {
  display: flex;
  align-items: center;
}

.history-card__time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.history-card__delete {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: color 0.2s;
}

.history-card__delete:hover {
  color: #e74c3c;
}
</style>
