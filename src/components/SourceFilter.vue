<template>
  <n-space :size="8" wrap>
    <n-tag
      v-for="item in origins"
      :key="item.value"
      :type="item.value === modelValue ? 'primary' : 'default'"
      :bordered="item.value !== modelValue"
      checkable
      :checked="item.value === modelValue"
      @click="onSelect(item.value)"
    >
      {{ item.label }}
    </n-tag>
  </n-space>
</template>

<script setup lang="ts">
import { NSpace, NTag } from 'naive-ui'
import { COLOR_ORIGINS } from '@/types/color'
import type { ColorOrigin } from '@/types/color'

withDefaults(
  defineProps<{
    modelValue?: ColorOrigin
  }>(),
  {
    modelValue: 'all',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: ColorOrigin]
}>()

const origins = COLOR_ORIGINS

function onSelect(value: ColorOrigin) {
  emit('update:modelValue', value)
}
</script>
