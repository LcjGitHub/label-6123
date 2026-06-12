<template>
  <n-input
    v-model:value="keyword"
    :placeholder="placeholder"
    clearable
    size="large"
    @update:value="onUpdate"
  >
    <template #prefix>
      <n-icon :component="SearchOutline" />
    </template>
  </n-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NInput, NIcon } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
  }>(),
  {
    modelValue: '',
    placeholder: '搜索色名或典故关键词…',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const keyword = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    keyword.value = val
  }
)

/**
 * 同步搜索关键词到父组件
 */
function onUpdate(value: string) {
  emit('update:modelValue', value)
}
</script>
