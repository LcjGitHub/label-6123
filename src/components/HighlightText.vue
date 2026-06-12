<template>
  <span class="highlight-text">
    <template v-for="(part, index) in parts" :key="index">
      <span v-if="part.highlight" class="highlight-text__match">{{ part.text }}</span>
      <span v-else>{{ part.text }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    keyword: string
  }>(),
  {
    text: '',
    keyword: '',
  }
)

interface TextPart {
  text: string
  highlight: boolean
}

const parts = computed<TextPart[]>(() => {
  const trimmedKeyword = props.keyword.trim()
  if (!trimmedKeyword) {
    return [{ text: props.text, highlight: false }]
  }

  const escaped = trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const segments = props.text.split(regex)

  return segments
    .filter((seg) => seg.length > 0)
    .map((seg) => ({
      text: seg,
      highlight: regex.test(seg),
    }))
})
</script>

<style scoped>
.highlight-text__match {
  background-color: #ffe58f;
  color: #d46b08;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}
</style>
