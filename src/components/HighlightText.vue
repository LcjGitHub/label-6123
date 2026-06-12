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

interface Props {
  /** 需要展示并高亮的原始文本 */
  text?: string
  /** 搜索关键词，空字符串时不做任何高亮 */
  keyword?: string
  /**
   * 匹配模式：
   * - 'full'  完整词匹配（默认），摘要类内容使用
   * - 'prefix' 前缀重叠字匹配，色名等短词使用，会把关键词与文本共有的前缀单字逐个标亮
   */
  matchMode?: 'full' | 'prefix'
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  keyword: '',
  matchMode: 'full',
})

interface TextPart {
  text: string
  highlight: boolean
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 使用 split + 捕获组切分文本，捕获组（即匹配到的片段）在结果数组中位于奇数索引
 */
function splitByFullMatch(text: string, keyword: string): TextPart[] {
  const escaped = escapeRegExp(keyword)
  const regex = new RegExp(`(${escaped})`, 'i')
  const result: TextPart[] = []
  let remaining = text

  while (remaining.length > 0) {
    const match = remaining.match(regex)
    if (!match || match.index === undefined) {
      result.push({ text: remaining, highlight: false })
      break
    }
    const idx = match.index
    if (idx > 0) {
      result.push({ text: remaining.slice(0, idx), highlight: false })
    }
    result.push({ text: match[1], highlight: true })
    remaining = remaining.slice(idx + match[1].length)
  }

  return result.filter((p) => p.text.length > 0)
}

/**
 * 前缀重叠字匹配：找出关键词与文本从头开始共有的连续字符并逐个标亮
 * 例如 keyword='桃花' text='桃色' → '桃' 高亮，'色' 不亮
 */
function splitByPrefixMatch(text: string, keyword: string): TextPart[] {
  let overlapEnd = 0
  const maxLen = Math.min(text.length, keyword.length)
  while (overlapEnd < maxLen && text[overlapEnd] === keyword[overlapEnd]) {
    overlapEnd++
  }

  if (overlapEnd === 0) {
    return [{ text, highlight: false }]
  }

  const result: TextPart[] = []
  for (let i = 0; i < overlapEnd; i++) {
    result.push({ text: text[i], highlight: true })
  }
  if (overlapEnd < text.length) {
    result.push({ text: text.slice(overlapEnd), highlight: false })
  }
  return result
}

const parts = computed<TextPart[]>(() => {
  const trimmedKeyword = props.keyword.trim()
  if (!trimmedKeyword) {
    return [{ text: props.text, highlight: false }]
  }

  if (props.matchMode === 'prefix') {
    return splitByPrefixMatch(props.text, trimmedKeyword)
  }

  return splitByFullMatch(props.text, trimmedKeyword)
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
