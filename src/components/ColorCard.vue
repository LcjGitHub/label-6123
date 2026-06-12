<template>
  <router-link :to="`/color/${color.id}`" class="color-card">
    <div
      class="color-card__preview"
      :style="{ backgroundColor: color.hex }"
    >
      <span
        class="color-card__hex"
        :class="{ 'color-card__hex--light': isLight }"
      >
        {{ color.hex }}
      </span>
    </div>
    <div class="color-card__info">
      <div class="color-card__name">{{ color.name }}</div>
      <n-tag size="small" :bordered="false" type="default">
        {{ color.category }}
      </n-tag>
      <n-tag size="small" :bordered="false" :type="originTagType">
        {{ originLabel }}
      </n-tag>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import type { ColorItem } from '@/types/color'
import { isLightColor } from '@/utils/colorUtils'

const props = defineProps<{
  color: ColorItem
}>()

const isLight = computed(() => isLightColor(props.color.hex))

const originLabel = computed(() =>
  props.color.origin === 'china' ? '中国色' : '日本色'
)

const originTagType = computed(() =>
  props.color.origin === 'china' ? 'error' : 'info'
)
</script>

<style scoped>
.color-card {
  display: block;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}

.color-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.color-card__preview {
  height: 100px;
  display: flex;
  align-items: flex-end;
  padding: 8px 12px;
}

.color-card__hex {
  font-size: 12px;
  font-family: monospace;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.color-card__hex--light {
  color: #333;
  text-shadow: none;
}

.color-card__info {
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.color-card__name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  flex: 1;
  min-width: 0;
}
</style>
