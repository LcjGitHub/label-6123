<template>
  <router-link
    :to="`/color/${color.id}`"
    class="color-card"
    aria-label="查看颜色详情"
  >
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
      <FavoriteButton
        class="color-card__favorite"
        :color-id="color.id"
      />
      <div class="color-card__name">{{ color.name }}</div>
      <div class="color-card__tags">
        <n-tag size="small" :bordered="false" type="default">
          {{ color.category }}
        </n-tag>
        <n-tag size="small" :bordered="false" :type="originTagType">
          {{ originLabel }}
        </n-tag>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTag } from 'naive-ui'
import type { ColorItem } from '@/types/color'
import { isLightColor } from '@/utils/colorUtils'
import FavoriteButton from './FavoriteButton.vue'

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
  position: relative;
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
  position: relative;
  padding: 12px;
  padding-right: 40px;
}

.color-card__favorite {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1;
}

.color-card__name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
  margin-bottom: 6px;
}

.color-card__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
