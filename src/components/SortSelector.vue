<template>
  <n-select
    v-model:value="selected"
    :options="options"
    size="large"
    style="width: 180px"
    @update:value="onUpdate"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSelect } from 'naive-ui'
import { SORT_OPTIONS } from '@/types/color'
import type { SortOption } from '@/types/color'

const props = withDefaults(
  defineProps<{
    modelValue?: SortOption
  }>(),
  {
    modelValue: 'name',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: SortOption]
}>()

const options = SORT_OPTIONS.map((opt) => ({
  label: opt.label,
  value: opt.value,
}))

const selected = ref<SortOption>(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val
  }
)

function onUpdate(value: string | null) {
  if (value) {
    emit('update:modelValue', value as SortOption)
  }
}
</script>
