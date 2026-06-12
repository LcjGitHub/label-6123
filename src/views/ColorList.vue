<template>
  <div class="color-list">
    <div class="color-list__toolbar">
      <ColorSearch v-model="keyword" />
      <div class="color-list__filters">
        <CategoryFilter v-model="category" class="color-list__filter" />
        <SourceFilter v-model="origin" class="color-list__filter" />
      </div>
    </div>

    <n-spin :show="false">
      <div v-if="filteredColors.length > 0" class="color-list__grid">
        <ColorCard
          v-for="color in filteredColors"
          :key="color.id"
          :color="color"
        />
      </div>
      <n-empty
        v-else
        description="未找到匹配的传统色"
        class="color-list__empty"
      >
        <template #icon>
          <n-icon :component="ColorPaletteOutline" size="48" />
        </template>
        <template #extra>
          <n-button @click="resetFilters">清除筛选条件</n-button>
        </template>
      </n-empty>
    </n-spin>

    <n-text v-if="filteredColors.length > 0" depth="3" class="color-list__count">
      共 {{ filteredColors.length }} 种颜色
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NSpin, NEmpty, NIcon, NButton, NText } from 'naive-ui'
import { ColorPaletteOutline } from '@vicons/ionicons5'
import ColorCard from '@/components/ColorCard.vue'
import ColorSearch from '@/components/ColorSearch.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import SourceFilter from '@/components/SourceFilter.vue'
import { useColors } from '@/composables/useColors'
import type { ColorOrigin } from '@/types/color'

const { searchColors, filterByCategory, filterByOrigin } = useColors()

const keyword = ref('')
const category = ref('全部')
const origin = ref<ColorOrigin>('all')

const filteredColors = computed(() => {
  const searched = searchColors(keyword.value)
  const byCategory = filterByCategory(searched, category.value)
  return filterByOrigin(byCategory, origin.value)
})

/**
 * 重置搜索与筛选
 */
function resetFilters() {
  keyword.value = ''
  category.value = '全部'
  origin.value = 'all'
}
</script>

<style scoped>
.color-list__toolbar {
  margin-bottom: 24px;
}

.color-list__filters {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.color-list__filter {
  flex-shrink: 0;
}

.color-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.color-list__empty {
  padding: 48px 0;
}

.color-list__count {
  display: block;
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
}
</style>
