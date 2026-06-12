<template>
  <div v-if="color" class="color-detail">
    <n-button quaternary class="color-detail__back" @click="goBack">
      <template #icon>
        <n-icon :component="ArrowBackOutline" />
      </template>
      返回列表
    </n-button>

    <div class="color-detail__hero" :style="{ backgroundColor: color.hex }">
      <div class="color-detail__hero-content">
        <div class="color-detail__hero-header">
          <h1
            class="color-detail__title"
            :class="{ 'color-detail__title--light': isLight }"
          >
            {{ color.name }}
          </h1>
          <FavoriteButton :color-id="color.id" :size="24" />
        </div>
        <n-space>
          <n-tag :bordered="false">{{ color.category }}</n-tag>
          <n-tag :bordered="false" :type="color.origin === 'china' ? 'error' : 'info'">
            {{ color.origin === 'china' ? '中国色' : '日本色' }}
          </n-tag>
        </n-space>
      </div>
    </div>

    <n-card title="色值信息" class="color-detail__card">
      <n-descriptions :column="2" label-placement="left" bordered>
        <n-descriptions-item label="HEX">
          <div class="color-detail__copy-item">
            <n-text code>{{ color.hex }}</n-text>
            <n-button size="small" text @click="handleCopyHex">
              <template #icon>
                <n-icon :component="CopyOutline" />
              </template>
              复制
            </n-button>
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="RGB">
          <div class="color-detail__copy-item">
            <n-text code>{{ formatRgb(color.rgb) }}</n-text>
            <n-button size="small" text @click="handleCopyRgb">
              <template #icon>
                <n-icon :component="CopyOutline" />
              </template>
              复制
            </n-button>
          </div>
        </n-descriptions-item>
        <n-descriptions-item label="R">{{ color.rgb.r }}</n-descriptions-item>
        <n-descriptions-item label="G">{{ color.rgb.g }}</n-descriptions-item>
        <n-descriptions-item label="B">{{ color.rgb.b }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="典故" class="color-detail__card">
      <n-text>{{ color.story }}</n-text>
    </n-card>

    <n-card title="相近色（RGB 距离 Top 5）" class="color-detail__card">
      <div class="color-detail__similar">
        <router-link
          v-for="similar in similarColors"
          :key="similar.id"
          :to="`/color/${similar.id}`"
          class="color-detail__similar-item"
        >
          <div
            class="color-detail__similar-swatch"
            :style="{ backgroundColor: similar.hex }"
          />
          <div class="color-detail__similar-info">
            <span class="color-detail__similar-name">{{ similar.name }}</span>
            <span class="color-detail__similar-hex">{{ similar.hex }}</span>
          </div>
        </router-link>
      </div>
    </n-card>
  </div>

  <n-empty
    v-else
    description="未找到该颜色"
    class="color-detail__not-found"
  >
    <template #icon>
      <n-icon :component="AlertCircleOutline" size="48" />
    </template>
    <template #extra>
      <n-button type="primary" @click="goBack">返回列表</n-button>
    </template>
  </n-empty>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NButton,
  NIcon,
  NSpace,
  NTag,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NText,
  NEmpty,
} from 'naive-ui'
import { ArrowBackOutline, AlertCircleOutline, CopyOutline } from '@vicons/ionicons5'
import { useColors } from '@/composables/useColors'
import { findSimilarColors, formatRgb, isLightColor } from '@/utils/colorUtils'
import { copyText } from '@/utils/copyUtils'
import FavoriteButton from '@/components/FavoriteButton.vue'

const route = useRoute()
const router = useRouter()
const { getColorById, allColors } = useColors()

const colorId = computed(() => route.params.id as string)
const color = computed(() => getColorById(colorId.value))

const isLight = computed(() =>
  color.value ? isLightColor(color.value.hex) : false
)

const similarColors = computed(() => {
  if (!color.value) return []
  return findSimilarColors(color.value, allColors.value, 5)
})

/**
 * 返回列表页
 */
function goBack() {
  router.push('/')
}

function handleCopyHex() {
  if (color.value) {
    copyText(color.value.hex, 'HEX色值')
  }
}

function handleCopyRgb() {
  if (color.value) {
    copyText(formatRgb(color.value.rgb), 'RGB色值')
  }
}
</script>

<style scoped>
.color-detail__back {
  margin-bottom: 16px;
}

.color-detail__hero {
  border-radius: 12px;
  padding: 48px 32px;
  margin-bottom: 24px;
  min-height: 160px;
  display: flex;
  align-items: flex-end;
}

.color-detail__hero-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.color-detail__title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
}

.color-detail__title--light {
  color: #333;
  text-shadow: none;
}

.color-detail__card {
  margin-bottom: 16px;
}

.color-detail__copy-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-detail__similar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-detail__similar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.color-detail__similar-item:hover {
  background: #f5f5f5;
}

.color-detail__similar-swatch {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.color-detail__similar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.color-detail__similar-name {
  font-weight: 600;
  font-size: 14px;
}

.color-detail__similar-hex {
  font-size: 12px;
  font-family: monospace;
  color: #999;
}

.color-detail__not-found {
  padding: 80px 0;
}
</style>
