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
      <n-descriptions :column="3" label-placement="left" bordered>
        <n-descriptions-item label="十六进制">
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
        <n-descriptions-item label="红绿蓝" :span="2">
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
        <n-descriptions-item label="色相饱和度亮度" :span="3">
          <div class="color-detail__copy-item">
            <n-text code>{{ formatHsl(colorHsl) }}</n-text>
            <n-button size="small" text @click="handleCopyHsl">
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
        <n-descriptions-item label="色相">{{ colorHsl.h }}°</n-descriptions-item>
        <n-descriptions-item label="饱和度">{{ colorHsl.s }}%</n-descriptions-item>
        <n-descriptions-item label="亮度">{{ colorHsl.l }}%</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-card title="典故" class="color-detail__card">
      <n-text>{{ color.story }}</n-text>
    </n-card>

    <n-card class="color-detail__card">
      <template #header>
        <div class="color-detail__scheme-header">
          <span>配色方案</span>
          <n-button type="primary" size="small" @click="goToColorScheme">
            <template #icon>
              <n-icon :component="ColorPaletteOutline" />
            </template>
            生成配色方案
          </n-button>
        </div>
      </template>
      <n-text class="color-detail__scheme-desc">
        根据当前颜色的红绿蓝值，自动计算互补色、类似色和三等分配色等衍生配色
      </n-text>
    </n-card>

    <n-card class="color-detail__card">
      <template #header>
        <div class="color-detail__similar-header">
          <span>相近色（红绿蓝距离前 {{ similarCount }} 个）</span>
          <div class="color-detail__similar-count-control">
            <span class="color-detail__similar-count-label">显示数量</span>
            <n-input-number
              v-model:value="similarCount"
              :min="3"
              :max="10"
              size="small"
              placeholder=""
              style="width: 100px"
            />
          </div>
        </div>
      </template>
      <div class="color-detail__similar">
        <router-link
          v-for="item in similarColors"
          :key="item.color.id"
          :to="{ path: `/color/${item.color.id}`, state: { fromList: hasFromList } }"
          class="color-detail__similar-item"
        >
          <div
            class="color-detail__similar-swatch"
            :style="{ backgroundColor: item.color.hex }"
          />
          <div class="color-detail__similar-info">
            <div class="color-detail__similar-main">
              <span class="color-detail__similar-name">{{ item.color.name }}</span>
              <span class="color-detail__similar-hex">{{ item.color.hex }}</span>
            </div>
            <div class="color-detail__similar-distances">
              <span class="color-detail__distance color-detail__distance--r">
                红距离 {{ item.rDistance.toFixed(2) }}
              </span>
              <span class="color-detail__distance color-detail__distance--g">
                绿距离 {{ item.gDistance.toFixed(2) }}
              </span>
              <span class="color-detail__distance color-detail__distance--b">
                蓝距离 {{ item.bDistance.toFixed(2) }}
              </span>
            </div>
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
import { ref, computed, watch } from 'vue'
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
  NInputNumber,
  useMessage,
} from 'naive-ui'
import { ArrowBackOutline, AlertCircleOutline, CopyOutline, ColorPaletteOutline } from '@vicons/ionicons5'
import { useColors } from '@/composables/useColors'
import { findSimilarColors, formatRgb, formatHsl, rgbToHsl, isLightColor, type Hsl } from '@/utils/colorUtils'
import { copyText } from '@/utils/copyUtils'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useBrowseHistory } from '@/composables/useBrowseHistory'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const { getColorById, allColors } = useColors()
const { addHistory } = useBrowseHistory()

const colorId = computed(() => route.params.id as string)
const color = computed(() => getColorById(colorId.value))
const hasFromList = computed(() => window.history.state?.fromList === true)

const similarCount = ref(5)

watch(
  colorId,
  (id) => {
    if (id) {
      addHistory(id)
    }
  },
  { immediate: true }
)

const isLight = computed(() =>
  color.value ? isLightColor(color.value.hex) : false
)

const colorHsl = computed<Hsl>(() =>
  color.value ? rgbToHsl(color.value.rgb) : { h: 0, s: 0, l: 0 }
)

const similarColors = computed(() => {
  if (!color.value) return []
  return findSimilarColors(color.value, allColors.value, similarCount.value)
})

/**
 * 返回列表页
 * 优先使用历史后退回到带筛选的列表；若无可用历史则跳转到无筛选的首页
 */
function goBack() {
  if (window.history.state?.fromList === true) {
    router.back()
  } else {
    router.push('/')
  }
}

/**
 * 复制十六进制色值到剪贴板
 *
 * 将当前颜色的 HEX 色值（如 #FF0000）写入剪贴板，
 * 成功后弹出「十六进制色值已复制到剪贴板」提示。
 */
function handleCopyHex() {
  if (color.value) {
    copyText(color.value.hex, '十六进制色值', message)
  }
}

/**
 * 复制红绿蓝色值到剪贴板
 *
 * 将当前颜色的 RGB 色值（如 rgb(255, 0, 0)）写入剪贴板，
 * 成功后弹出「红绿蓝色值已复制到剪贴板」提示。
 */
function handleCopyRgb() {
  if (color.value) {
    copyText(formatRgb(color.value.rgb), '红绿蓝色值', message)
  }
}

/**
 * 复制色相饱和度亮度值到剪贴板
 *
 * 将当前颜色的 HSL 色值（如 hsl(0, 100%, 50%)）写入剪贴板，
 * 成功后弹出「色相饱和度亮度值已复制到剪贴板」提示。
 */
function handleCopyHsl() {
  if (color.value) {
    copyText(formatHsl(colorHsl.value), '色相饱和度亮度值', message)
  }
}

/**
 * 跳转到配色方案页面
 *
 * 携带当前颜色ID作为路由参数，通过 state 标记来源为详情页，
 * 以便配色方案页面的返回按钮能正确回到当前详情页。
 */
function goToColorScheme() {
  router.push({
    path: `/color/${colorId.value}/scheme`,
    state: { fromDetail: true },
  })
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
  color: var(--text-primary);
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

.color-detail__similar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.color-detail__similar-count-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-detail__similar-count-label {
  font-size: 13px;
  color: var(--text-secondary);
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
  background: var(--bg-hover);
}

.color-detail__similar-swatch {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

:deep(.theme-dark) .color-detail__similar-swatch {
  border-color: rgba(255, 255, 255, 0.1);
}

.color-detail__similar-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.color-detail__similar-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.color-detail__similar-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.color-detail__similar-hex {
  font-size: 12px;
  font-family: monospace;
  color: var(--text-tertiary);
}

.color-detail__similar-distances {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-detail__distance {
  font-size: 11px;
  font-family: monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f0f0f0;
  color: #666;
}

:deep(.theme-dark) .color-detail__distance {
  background: #2a2a4a;
  color: #a0a0b0;
}

.color-detail__distance--r {
  background: #fef0f0;
  color: #e74c3c;
}

:deep(.theme-dark) .color-detail__distance--r {
  background: rgba(231, 76, 60, 0.15);
  color: #ff6b6b;
}

.color-detail__distance--g {
  background: #f0f9f0;
  color: #27ae60;
}

:deep(.theme-dark) .color-detail__distance--g {
  background: rgba(39, 174, 96, 0.15);
  color: #51cf66;
}

.color-detail__distance--b {
  background: #f0f4fe;
  color: #3498db;
}

:deep(.theme-dark) .color-detail__distance--b {
  background: rgba(52, 152, 219, 0.15);
  color: #74c0fc;
}

.color-detail__not-found {
  padding: 80px 0;
}

.color-detail__scheme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.color-detail__scheme-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
