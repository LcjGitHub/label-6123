<template>
  <n-space :size="8" wrap>
    <n-tag
      v-for="cat in categories"
      :key="cat"
      :type="cat === modelValue ? 'primary' : 'default'"
      :bordered="cat !== modelValue"
      checkable
      :checked="cat === modelValue"
      @click="onSelect(cat)"
    >
      {{ cat }}
    </n-tag>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NTag } from 'naive-ui'
import { COLOR_CATEGORIES } from '@/types/color'

withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
    modelValue: '全部',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const categories = COLOR_CATEGORIES

/**
 * 选择色系
 */
function onSelect(cat: string) {
  emit('update:modelValue', cat)
}
</script>
