<template>
  <n-drawer v-model:show="showDrawer" :width="420" placement="right">
    <n-drawer-content title="选择颜色" :native-scrollbar="false">
      <div class="color-picker">
        <n-input
          v-model:value="keyword"
          placeholder="搜索色名或典故关键词…"
          clearable
          class="color-picker__search"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>

        <n-scrollbar x-scrollable class="color-picker__filters">
          <div class="color-picker__filter-tags">
            <n-tag
              v-for="cat in categories"
              :key="cat"
              size="small"
              :type="cat === category ? 'primary' : 'default'"
              :bordered="cat !== category"
              checkable
              :checked="cat === category"
              @click="category = cat"
            >
              {{ cat }}
            </n-tag>
          </div>
        </n-scrollbar>

        <n-scrollbar class="color-picker__list">
          <div v-if="filteredColors.length > 0" class="color-picker__grid">
            <div
              v-for="color in filteredColors"
              :key="color.id"
              class="color-picker__item"
              :class="{ 'color-picker__item--selected': selectedId === color.id }"
              @click="handleSelect(color)"
            >
              <div
                class="color-picker__preview"
                :style="{ backgroundColor: color.hex }"
              >
                <n-icon
                  v-if="selectedId === color.id"
                  class="color-picker__check"
                  :component="CheckmarkOutline"
                  size="20"
                />
              </div>
              <div class="color-picker__info">
                <div class="color-picker__name">{{ color.name }}</div>
                <div class="color-picker__hex">{{ color.hex }}</div>
              </div>
            </div>
          </div>
          <n-empty v-else description="未找到匹配的颜色" />
        </n-scrollbar>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NDrawer, NDrawerContent, NInput, NIcon, NEmpty, NScrollbar, NTag } from 'naive-ui'
import { SearchOutline, CheckmarkOutline } from '@vicons/ionicons5'
import { useColors } from '@/composables/useColors'
import { COLOR_CATEGORIES, type ColorItem } from '@/types/color'

const props = defineProps<{
  show: boolean
  selectedId?: string
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  select: [color: ColorItem]
}>()

const { searchColors, filterByCategory } = useColors()

const showDrawer = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const keyword = ref('')
const category = ref<typeof COLOR_CATEGORIES[number]>('全部')
const categories = COLOR_CATEGORIES

const filteredColors = computed(() => {
  const searched = searchColors(keyword.value)
  return filterByCategory(searched, category.value)
})

const selectedId = computed(() => props.selectedId)

function handleSelect(color: ColorItem) {
  emit('select', color)
  emit('update:show', false)
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      keyword.value = ''
      category.value = '全部'
    }
  }
)
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.color-picker__search {
  margin-bottom: 12px;
}

.color-picker__filters {
  margin-bottom: 12px;
  max-height: 40px;
}

.color-picker__filter-tags {
  display: flex;
  gap: 8px;
  white-space: nowrap;
  padding-bottom: 4px;
}

.color-picker__list {
  flex: 1;
  min-height: 0;
}

.color-picker__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding-right: 8px;
}

.color-picker__item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.color-picker__item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.color-picker__item--selected {
  border-color: #8B4513;
}

.color-picker__preview {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-picker__check {
  color: #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

.color-picker__info {
  padding: 8px 10px;
}

.color-picker__name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-picker__hex {
  font-size: 11px;
  font-family: monospace;
  color: #999;
}
</style>
