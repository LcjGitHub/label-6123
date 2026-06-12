<template>
  <div class="color-list">
    <div class="color-list__toolbar">
      <div class="color-list__toolbar-top">
        <ColorSearch v-model="keyword" class="color-list__search" />
        <div class="color-list__filter-group">
          <span class="color-list__filter-label">排序</span>
          <SortSelector v-model="sortBy" />
        </div>
      </div>
      <div class="color-list__filters">
        <div class="color-list__filter-group">
          <span class="color-list__filter-label">色系</span>
          <CategoryFilter v-model="category" />
        </div>
        <div class="color-list__filter-group">
          <span class="color-list__filter-label">来源</span>
          <SourceFilter v-model="origin" />
        </div>
      </div>
    </div>

    <n-spin :show="false">
      <div v-if="filteredColors.length > 0" class="color-list__grid">
        <ColorCard
          v-for="color in filteredColors"
          :key="color.id"
          :color="color"
          :search-keyword="trimmedKeyword"
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSpin, NEmpty, NIcon, NButton, NText } from 'naive-ui'
import { ColorPaletteOutline } from '@vicons/ionicons5'
import ColorCard from '@/components/ColorCard.vue'
import ColorSearch from '@/components/ColorSearch.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import SourceFilter from '@/components/SourceFilter.vue'
import SortSelector from '@/components/SortSelector.vue'
import { useColors } from '@/composables/useColors'
import type { ColorOrigin, SortOption } from '@/types/color'

const { searchColors, filterByCategory, filterByOrigin, sortColors } = useColors()
const route = useRoute()
const router = useRouter()

const DEFAULT_KEYWORD = ''
const DEFAULT_CATEGORY = '全部'
const DEFAULT_ORIGIN: ColorOrigin = 'all'
const DEFAULT_SORT_BY: SortOption = 'name'

const keyword = ref(DEFAULT_KEYWORD)
const category = ref(DEFAULT_CATEGORY)
const origin = ref<ColorOrigin>(DEFAULT_ORIGIN)
const sortBy = ref<SortOption>(DEFAULT_SORT_BY)

let isSyncingFromQuery = false

function restoreFromQuery() {
  isSyncingFromQuery = true
  try {
    const q = route.query
    keyword.value = typeof q.keyword === 'string' ? q.keyword : DEFAULT_KEYWORD
    category.value = typeof q.category === 'string' && q.category ? q.category : DEFAULT_CATEGORY
    if (typeof q.origin === 'string' && (q.origin === 'all' || q.origin === 'china' || q.origin === 'japan')) {
      origin.value = q.origin as ColorOrigin
    } else {
      origin.value = DEFAULT_ORIGIN
    }
    if (typeof q.sortBy === 'string' && (q.sortBy === 'name' || q.sortBy === 'category' || q.sortBy === 'brightness')) {
      sortBy.value = q.sortBy as SortOption
    } else {
      sortBy.value = DEFAULT_SORT_BY
    }
  } finally {
    isSyncingFromQuery = false
  }
}

function syncToQuery() {
  if (isSyncingFromQuery) return
  const query: Record<string, string> = {}
  if (keyword.value !== DEFAULT_KEYWORD) {
    query.keyword = keyword.value
  }
  if (category.value !== DEFAULT_CATEGORY) {
    query.category = category.value
  }
  if (origin.value !== DEFAULT_ORIGIN) {
    query.origin = origin.value
  }
  if (sortBy.value !== DEFAULT_SORT_BY) {
    query.sortBy = sortBy.value
  }
  router.replace({
    path: route.path,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

restoreFromQuery()

watch(
  () => [keyword.value, category.value, origin.value, sortBy.value],
  () => {
    syncToQuery()
  }
)

watch(
  () => route.fullPath,
  () => {
    restoreFromQuery()
  }
)

const trimmedKeyword = computed(() => keyword.value.trim())

const filteredColors = computed(() => {
  const searched = searchColors(trimmedKeyword.value)
  const byCategory = filterByCategory(searched, category.value)
  const byOrigin = filterByOrigin(byCategory, origin.value)
  return sortColors(byOrigin, sortBy.value)
})

/**
 * 重置搜索与筛选（保留排序方式）
 */
function resetFilters() {
  keyword.value = DEFAULT_KEYWORD
  category.value = DEFAULT_CATEGORY
  origin.value = DEFAULT_ORIGIN
}
</script>

<style scoped>
.color-list__toolbar {
  margin-bottom: 24px;
}

.color-list__toolbar-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.color-list__search {
  flex: 1;
  min-width: 240px;
}

.color-list__filters {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 16px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.color-list__filters::-webkit-scrollbar {
  height: 4px;
}

.color-list__filters::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.color-list__filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.color-list__filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
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
