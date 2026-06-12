<template>
  <div class="color-scheme">
    <n-button quaternary class="color-scheme__back" @click="goBack">
      <template #icon>
        <n-icon :component="ArrowBackOutline" />
      </template>
      返回详情
    </n-button>

    <n-card v-if="baseColor" class="color-scheme__card">
      <template #header>
        <div class="color-scheme__header">
        <div>
          <h2 class="color-scheme__title">配色方案</h2>
          <div class="color-scheme__subtitle">
            基于「{{ baseColor.name }}」的衍生配色
          </div>
        </div>
        <div
          class="color-scheme__base-swatch"
          :style="{ backgroundColor: baseColor.hex }"
        />
      </div>
      </template>

      <div class="color-scheme__palette">
        <div
          v-for="(item, index) in colorScheme"
          :key="index"
          class="color-scheme__item"
        >
          <div
            class="color-scheme__swatch"
            :style="{ backgroundColor: item.hex }"
          >
            <span
              class="color-scheme__hex"
              :class="{ 'color-scheme__hex--light': isLightColor(item.hex) }"
            >
              {{ item.hex }}
            </span>
          </div>
          <div class="color-scheme__info">
            <div class="color-scheme__label">{{ item.label }}</div>
            <div class="color-scheme__name-placeholder">—</div>
            <div class="color-scheme__actions">
              <n-text code class="color-scheme__hex-value">{{ item.hex }}</n-text>
              <n-button size="small" text @click="handleCopy(item.hex)">
                <template #icon>
                  <n-icon :component="CopyOutline" />
                </template>
                复制
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </n-card>

    <n-empty
      v-else
      description="未找到该颜色"
      class="color-scheme__not-found"
    >
      <template #icon>
        <n-icon :component="AlertCircleOutline" size="48" />
      </template>
      <template #extra>
        <n-button type="primary" @click="goBack">返回详情</n-button>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NCard,
  NEmpty,
  NIcon,
  NText,
  useMessage,
} from 'naive-ui'
import { ArrowBackOutline, AlertCircleOutline, CopyOutline } from '@vicons/ionicons5'
import { useColors } from '@/composables/useColors'
import { generateColorScheme, type SchemeColor } from '@/utils/colorScheme'
import { isLightColor } from '@/utils/colorUtils'
import { copyText } from '@/utils/copyUtils'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const { getColorById } = useColors()

const colorId = computed(() => route.params.id as string)
const baseColor = computed(() => getColorById(colorId.value))

const colorScheme = computed<SchemeColor[]>(() => {
  if (!baseColor.value) return []
  return generateColorScheme(baseColor.value.rgb)
})

function goBack() {
  if (window.history.state?.fromDetail === true) {
    router.back()
  } else {
    router.push(`/color/${colorId.value}`)
  }
}

function handleCopy(hex: string) {
  copyText(hex, '色值', message)
}
</script>

<style scoped>
.color-scheme__back {
  margin-bottom: 16px;
}

.color-scheme__card {
  margin-bottom: 16px;
}

.color-scheme__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-scheme__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.color-scheme__subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
}

.color-scheme__base-swatch {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

:deep(.theme-dark) .color-scheme__base-swatch {
  border-color: rgba(255, 255, 255, 0.1);
}

.color-scheme__palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.color-scheme__item {
  background: var(--bg-card);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
}

.color-scheme__item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.color-scheme__swatch {
  height: 120px;
  display: flex;
  align-items: flex-end;
  padding: 10px 12px;
}

.color-scheme__hex {
  font-size: 13px;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.color-scheme__hex--light {
  color: var(--text-primary);
  text-shadow: none;
}

.color-scheme__info {
  padding: 12px;
}

.color-scheme__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.color-scheme__name-placeholder {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-bottom: 10px;
  font-style: italic;
}

.color-scheme__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.color-scheme__hex-value {
  flex: 1;
  min-width: 0;
}

.color-scheme__not-found {
  padding: 80px 0;
}
</style>
