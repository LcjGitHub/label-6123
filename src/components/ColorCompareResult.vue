<template>
  <div class="compare-result">
    <div class="compare-result__main">
      <div class="compare-result__color-block">
        <div
          class="compare-result__preview"
          :style="{ backgroundColor: color1.hex }"
        >
          <span
            class="compare-result__name"
            :class="{ 'compare-result__name--light': isLight1 }"
          >
            {{ color1.name }}
          </span>
        </div>
        <div class="compare-result__info">
          <div class="compare-result__info-item">
            <span class="compare-result__info-label">HEX</span>
            <span class="compare-result__info-value">{{ color1.hex }}</span>
          </div>
          <div class="compare-result__info-item">
            <span class="compare-result__info-label">RGB</span>
            <span class="compare-result__info-value">{{ formatRgb(color1.rgb) }}</span>
          </div>
          <div class="compare-result__info-item">
            <span class="compare-result__info-label">HSL</span>
            <span class="compare-result__info-value">{{ formatHsl(hsl1) }}</span>
          </div>
        </div>
      </div>

      <div class="compare-result__middle">
        <div class="compare-result__divider">
          <n-icon :component="ArrowForwardOutline" size="24" />
        </div>
        <div class="compare-result__distance-card">
          <div class="compare-result__distance-title">对比数据</div>
          <div class="compare-result__distance-item">
            <span class="compare-result__distance-label">RGB 欧氏距离</span>
            <span class="compare-result__distance-value">{{ rgbDistanceValue.toFixed(2) }}</span>
          </div>
          <div class="compare-result__distance-item">
            <span class="compare-result__distance-label">亮度差值</span>
            <span class="compare-result__distance-value">{{ luminanceDiff.toFixed(4) }}</span>
          </div>
          <div class="compare-result__distance-item">
            <span class="compare-result__distance-label">对比度</span>
            <span class="compare-result__distance-value">{{ contrastRatio.toFixed(2) }} : 1</span>
          </div>
        </div>
      </div>

      <div class="compare-result__color-block">
        <div
          class="compare-result__preview"
          :style="{ backgroundColor: color2.hex }"
        >
          <span
            class="compare-result__name"
            :class="{ 'compare-result__name--light': isLight2 }"
          >
            {{ color2.name }}
          </span>
        </div>
        <div class="compare-result__info">
          <div class="compare-result__info-item">
            <span class="compare-result__info-label">HEX</span>
            <span class="compare-result__info-value">{{ color2.hex }}</span>
          </div>
          <div class="compare-result__info-item">
            <span class="compare-result__info-label">RGB</span>
            <span class="compare-result__info-value">{{ formatRgb(color2.rgb) }}</span>
          </div>
          <div class="compare-result__info-item">
            <span class="compare-result__info-label">HSL</span>
            <span class="compare-result__info-value">{{ formatHsl(hsl2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="compare-result__tips">
      <n-alert type="info" :show-icon="true">
        <template #header>
          <span>文字可读性提示</span>
        </template>
        <div class="compare-result__tip-content">
          <div class="compare-result__tip-section">
            <div class="compare-result__tip-title">浅色背景 (白色)</div>
            <div class="compare-result__tip-preview">
              <div
                class="compare-result__tip-swatch"
                style="background: #ffffff;"
              >
                <span :style="{ color: color1.hex }" class="compare-result__tip-text">
                  示例文字 {{ color1.name }}
                </span>
              </div>
              <div
                class="compare-result__tip-swatch"
                style="background: #ffffff;"
              >
                <span :style="{ color: color2.hex }" class="compare-result__tip-text">
                  示例文字 {{ color2.name }}
                </span>
              </div>
            </div>
            <div class="compare-result__tip-suggestion">
              <n-tag :type="lightBgBetter === 1 ? 'success' : 'default'" size="small">
                {{ color1.name }}：{{ contrastOnWhite1.toFixed(2) }}:1
              </n-tag>
              <n-tag :type="lightBgBetter === 2 ? 'success' : 'default'" size="small">
                {{ color2.name }}：{{ contrastOnWhite2.toFixed(2) }}:1
              </n-tag>
              <span class="compare-result__tip-text-suggestion">
                {{ lightBgSuggestion }}
              </span>
            </div>
          </div>

          <div class="compare-result__tip-section">
            <div class="compare-result__tip-title">深色背景 (黑色)</div>
            <div class="compare-result__tip-preview">
              <div
                class="compare-result__tip-swatch"
                style="background: #1a1a1a;"
              >
                <span :style="{ color: color1.hex }" class="compare-result__tip-text">
                  示例文字 {{ color1.name }}
                </span>
              </div>
              <div
                class="compare-result__tip-swatch"
                style="background: #1a1a1a;"
              >
                <span :style="{ color: color2.hex }" class="compare-result__tip-text">
                  示例文字 {{ color2.name }}
                </span>
              </div>
            </div>
            <div class="compare-result__tip-suggestion">
              <n-tag :type="darkBgBetter === 1 ? 'success' : 'default'" size="small">
                {{ color1.name }}：{{ contrastOnDark1.toFixed(2) }}:1
              </n-tag>
              <n-tag :type="darkBgBetter === 2 ? 'success' : 'default'" size="small">
                {{ color2.name }}：{{ contrastOnDark2.toFixed(2) }}:1
              </n-tag>
              <span class="compare-result__tip-text-suggestion">
                {{ darkBgSuggestion }}
              </span>
            </div>
          </div>
        </div>
      </n-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NIcon, NAlert, NTag } from 'naive-ui'
import { ArrowForwardOutline } from '@vicons/ionicons5'
import type { ColorItem } from '@/types/color'
import { rgbDistance, formatRgb } from '@/utils/colorDistance'
import { rgbToHsl, formatHsl } from '@/utils/colorHsl'
import { getLuminance, isLightColor } from '@/utils/colorLuminance'

const props = defineProps<{
  color1: ColorItem
  color2: ColorItem
}>()

const isLight1 = computed(() => isLightColor(props.color1.hex))
const isLight2 = computed(() => isLightColor(props.color2.hex))

const hsl1 = computed(() => rgbToHsl(props.color1.rgb))
const hsl2 = computed(() => rgbToHsl(props.color2.rgb))

const rgbDistanceValue = computed(() =>
  rgbDistance(props.color1.rgb, props.color2.rgb)
)

const luminance1 = computed(() => getLuminance(props.color1.hex))
const luminance2 = computed(() => getLuminance(props.color2.hex))
const luminanceDiff = computed(() => Math.abs(luminance1.value - luminance2.value))

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const contrastRatio = computed(() =>
  getContrastRatio(props.color1.hex, props.color2.hex)
)

const contrastOnWhite1 = computed(() => getContrastRatio(props.color1.hex, '#FFFFFF'))
const contrastOnWhite2 = computed(() => getContrastRatio(props.color2.hex, '#FFFFFF'))
const contrastOnDark1 = computed(() => getContrastRatio(props.color1.hex, '#1A1A1A'))
const contrastOnDark2 = computed(() => getContrastRatio(props.color2.hex, '#1A1A1A'))

const lightBgBetter = computed(() =>
  contrastOnWhite1.value >= contrastOnWhite2.value ? 1 : 2
)

const darkBgBetter = computed(() =>
  contrastOnDark1.value >= contrastOnDark2.value ? 1 : 2
)

function getSuggestion(contrast: number, colorName: string, isBetter: boolean): string {
  if (contrast >= 7) {
    return `${colorName} 对比度极佳${isBetter ? '，更推荐' : ''}`
  } else if (contrast >= 4.5) {
    return `${colorName} 符合 WCAG AA 标准${isBetter ? '，更推荐' : ''}`
  } else if (contrast >= 3) {
    return `${colorName} 适合大字号文字${isBetter ? '，更推荐' : ''}`
  } else {
    return `${colorName} 对比度不足，不建议用作正文`
  }
}

const lightBgSuggestion = computed(() => {
  const betterColor = lightBgBetter.value === 1 ? props.color1.name : props.color2.name
  const betterContrast = lightBgBetter.value === 1 ? contrastOnWhite1.value : contrastOnWhite2.value
  return getSuggestion(betterContrast, betterColor, true)
})

const darkBgSuggestion = computed(() => {
  const betterColor = darkBgBetter.value === 1 ? props.color1.name : props.color2.name
  const betterContrast = darkBgBetter.value === 1 ? contrastOnDark1.value : contrastOnDark2.value
  return getSuggestion(betterContrast, betterColor, true)
})
</script>

<style scoped>
.compare-result {
  width: 100%;
}

.compare-result__main {
  display: flex;
  align-items: stretch;
  gap: 24px;
  margin-bottom: 32px;
}

.compare-result__color-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.compare-result__preview {
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.compare-result__name {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.compare-result__name--light {
  color: #333;
  text-shadow: none;
}

.compare-result__info {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.compare-result__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.compare-result__info-item:last-child {
  border-bottom: none;
}

.compare-result__info-label {
  font-size: 13px;
  color: #999;
}

.compare-result__info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  font-family: monospace;
}

.compare-result__middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 160px;
}

.compare-result__divider {
  color: #ccc;
  margin-bottom: 16px;
}

.compare-result__distance-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  width: 100%;
}

.compare-result__distance-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
}

.compare-result__distance-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.compare-result__distance-item:last-child {
  border-bottom: none;
}

.compare-result__distance-label {
  font-size: 12px;
  color: #999;
}

.compare-result__distance-value {
  font-size: 16px;
  font-weight: 600;
  color: #8B4513;
  font-family: monospace;
}

.compare-result__tips {
  width: 100%;
}

.compare-result__tip-content {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.compare-result__tip-section {
  flex: 1;
  min-width: 280px;
}

.compare-result__tip-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.compare-result__tip-preview {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.compare-result__tip-swatch {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.compare-result__tip-text {
  font-size: 13px;
  font-weight: 500;
}

.compare-result__tip-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.compare-result__tip-text-suggestion {
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .compare-result__main {
    flex-direction: column;
  }

  .compare-result__middle {
    width: 100%;
    flex-direction: row;
    gap: 16px;
  }

  .compare-result__divider {
    transform: rotate(90deg);
    margin-bottom: 0;
  }

  .compare-result__distance-card {
    flex: 1;
  }

  .compare-result__distance-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
