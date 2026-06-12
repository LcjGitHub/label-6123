<template>
  <div class="browse-history">
    <div class="browse-history__header">
      <n-space align="center" :size="12">
        <n-icon :component="TimeOutline" size="24" class="browse-history__icon" />
        <h2 class="browse-history__title">浏览历史</h2>
        <n-tag v-if="historyCount > 0" size="small" type="warning">
          {{ historyCount }} 条记录
        </n-tag>
      </n-space>
      <n-button
        v-if="historyCount > 0"
        quaternary
        size="small"
        @click="showClearDialog = true"
      >
        <template #icon>
          <n-icon :component="TrashOutline" />
        </template>
        一键清空
      </n-button>
    </div>

    <div v-if="historyWithColors.length > 0" class="browse-history__list">
      <HistoryCard
        v-for="entry in historyWithColors"
        :key="entry.item.colorId"
        :color="entry.color"
        :viewed-at="entry.item.viewedAt"
        @remove="handleRemove"
      />
    </div>

    <n-empty
      v-else
      description="暂无浏览记录，去看看喜欢的颜色吧~"
      class="browse-history__empty"
    >
      <template #icon>
        <n-icon :component="TimeOutline" size="48" />
      </template>
      <template #extra>
        <n-button type="primary" @click="goToList">去浏览颜色</n-button>
      </template>
    </n-empty>

    <n-modal
      v-model:show="showClearDialog"
      preset="dialog"
      title="清空浏览历史"
      positive-text="确定清空"
      negative-text="取消"
      :positive-button-props="{ type: 'error' }"
      @positive-click="confirmClear"
    >
      <n-text>确定要清空所有浏览记录吗？此操作不可恢复。</n-text>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NIcon,
  NSpace,
  NTag,
  NButton,
  NEmpty,
  NModal,
  NText,
} from 'naive-ui'
import { TimeOutline, TrashOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useBrowseHistory } from '@/composables/useBrowseHistory'
import HistoryCard from '@/components/HistoryCard.vue'

const router = useRouter()
const { historyWithColors, historyCount, removeHistory, clearHistory, markAllAsRead } = useBrowseHistory()

const showClearDialog = ref(false)

onMounted(() => {
  markAllAsRead()
})

function goToList() {
  router.push('/')
}

function handleRemove(colorId: string) {
  removeHistory(colorId)
}

function confirmClear() {
  clearHistory()
  showClearDialog.value = false
}
</script>

<style scoped>
.browse-history__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.browse-history__icon {
  color: #8B4513;
}

:deep(.theme-dark) .browse-history__icon {
  color: #D2691E;
}

.browse-history__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.browse-history__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.browse-history__empty {
  padding: 80px 0;
}
</style>
