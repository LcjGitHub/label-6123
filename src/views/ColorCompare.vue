<template>
  <div class="color-compare">
    <div class="color-compare__header">
      <h1 class="color-compare__title">双色调对比</h1>
      <p class="color-compare__subtitle">选择两种传统色，对比它们的色彩差异与文字可读性</p>
    </div>

    <div class="color-compare__selectors">
      <div
        class="color-compare__selector"
        @click="openPicker(1)"
      >
        <div
          v-if="color1"
          class="color-compare__selector-preview"
          :style="{ backgroundColor: color1.hex }"
        >
          <span
            class="color-compare__selector-name"
            :class="{ 'color-compare__selector-name--light': isLight1 }"
          >
            {{ color1.name }}
          </span>
        </div>
        <div v-else class="color-compare__selector-empty">
          <n-icon :component="AddOutline" size="32" />
          <span>选择颜色 1</span>
        </div>
        <div class="color-compare__selector-label">
          <n-tag size="small" type="primary">色号 1</n-tag>
        </div>
      </div>

      <div class="color-compare__actions">
        <n-button
          circle
          type="default"
          @click="swapColors"
          :disabled="!color1 || !color2"
          title="交换颜色"
        >
          <template #icon>
            <n-icon :component="SwapHorizontalOutline" size="18" />
          </template>
        </n-button>
        <n-button
          type="default"
          @click="pickRandomPair"
          title="随机选择两种颜色"
        >
          <template #icon>
            <n-icon :component="ShuffleOutline" size="16" />
          </template>
          随机配对
        </n-button>
      </div>

      <div
        class="color-compare__selector"
        @click="openPicker(2)"
      >
        <div
          v-if="color2"
          class="color-compare__selector-preview"
          :style="{ backgroundColor: color2.hex }"
        >
          <span
            class="color-compare__selector-name"
            :class="{ 'color-compare__selector-name--light': isLight2 }"
          >
            {{ color2.name }}
          </span>
        </div>
        <div v-else class="color-compare__selector-empty">
          <n-icon :component="AddOutline" size="32" />
          <span>选择颜色 2</span>
        </div>
        <div class="color-compare__selector-label">
          <n-tag size="small" type="success">色号 2</n-tag>
        </div>
      </div>
    </div>

    <n-divider />

    <div v-if="color1 && color2" class="color-compare__result">
      <ColorCompareResult :color1="color1" :color2="color2" />
    </div>
    <n-empty
      v-else
      description="请选择两种颜色开始对比"
      class="color-compare__empty"
    >
      <template #icon>
        <n-icon :component="ColorPaletteOutline" size="48" />
      </template>
      <template #extra>
        <n-button type="primary" @click="pickRandomPair">
          随机配对两种颜色
        </n-button>
      </template>
    </n-empty>

    <ColorPicker
      v-model:show="showPicker1"
      :selected-id="color1?.id"
      @select="handleSelect1"
    />
    <ColorPicker
      v-model:show="showPicker2"
      :selected-id="color2?.id"
      @select="handleSelect2"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NButton, NIcon, NTag, NDivider, NEmpty } from 'naive-ui'
import {
  AddOutline,
  SwapHorizontalOutline,
  ShuffleOutline,
  ColorPaletteOutline,
} from '@vicons/ionicons5'
import ColorPicker from '@/components/ColorPicker.vue'
import ColorCompareResult from '@/components/ColorCompareResult.vue'
import { useColors } from '@/composables/useColors'
import { isLightColor } from '@/utils/colorUtils'
import type { ColorItem } from '@/types/color'

const { allColors } = useColors()

const color1 = ref<ColorItem | null>(null)
const color2 = ref<ColorItem | null>(null)

const showPicker1 = ref(false)
const showPicker2 = ref(false)

const isLight1 = computed(() => (color1.value ? isLightColor(color1.value.hex) : false))
const isLight2 = computed(() => (color2.value ? isLightColor(color2.value.hex) : false))

function openPicker(index: number) {
  if (index === 1) {
    showPicker1.value = true
  } else {
    showPicker2.value = true
  }
}

function handleSelect1(color: ColorItem) {
  color1.value = color
}

function handleSelect2(color: ColorItem) {
  color2.value = color
}

function swapColors() {
  const temp = color1.value
  color1.value = color2.value
  color2.value = temp
}

function pickRandomPair() {
  const colors = allColors.value
  if (colors.length < 2) return

  const idx1 = Math.floor(Math.random() * colors.length)
  let idx2: number
  do {
    idx2 = Math.floor(Math.random() * colors.length)
  } while (idx2 === idx1)

  color1.value = colors[idx1]
  color2.value = colors[idx2]
}

onMounted(() => {
  pickRandomPair()
})
</script>

<style scoped>
.color-compare {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.color-compare__header {
  text-align: center;
  margin-bottom: 32px;
}

.color-compare__title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.color-compare__subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.color-compare__selectors {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.color-compare__selector {
  flex: 1;
  max-width: 300px;
  cursor: pointer;
  position: relative;
}

.color-compare__selector-preview {
  height: 140px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-compare__selector:hover .color-compare__selector-preview {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.color-compare__selector-empty {
  height: 140px;
  border-radius: 12px;
  border: 2px dashed #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
  transition: border-color 0.2s, color 0.2s;
  background: #fafafa;
}

.color-compare__selector:hover .color-compare__selector-empty {
  border-color: #8B4513;
  color: #8B4513;
}

.color-compare__selector-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.color-compare__selector-name--light {
  color: #333;
  text-shadow: none;
}

.color-compare__selector-label {
  position: absolute;
  top: 12px;
  left: 12px;
}

.color-compare__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.color-compare__result {
  margin-top: 32px;
}

.color-compare__empty {
  padding: 64px 0;
}

@media (max-width: 640px) {
  .color-compare {
    padding: 16px;
  }

  .color-compare__title {
    font-size: 22px;
  }

  .color-compare__selectors {
    flex-direction: column;
    gap: 16px;
  }

  .color-compare__selector {
    max-width: none;
    width: 100%;
  }

  .color-compare__actions {
    flex-direction: row;
  }
}
</style>
