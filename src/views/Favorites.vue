<template>
  <div class="favorites">
    <div class="favorites__header">
      <n-space align="center" :size="12">
        <n-icon :component="Heart" size="24" color="#8B4513" />
        <h2 class="favorites__title">我的收藏夹</h2>
        <n-tag v-if="favoriteCount > 0" size="small" type="warning">
          {{ favoriteCount }} 种颜色
        </n-tag>
      </n-space>
      <n-button
        v-if="favoriteCount > 0"
        quaternary
        size="small"
        @click="handleClear"
      >
        <template #icon>
          <n-icon :component="TrashOutline" />
        </template>
        清空收藏
      </n-button>
    </div>

    <n-spin :show="false">
      <div v-if="favoriteColors.length > 0" class="favorites__grid">
        <ColorCard
          v-for="color in favoriteColors"
          :key="color.id"
          :color="color"
        />
      </div>
      <n-empty
        v-else
        description="收藏夹是空的，快去收藏喜欢的颜色吧~"
        class="favorites__empty"
      >
        <template #icon>
          <n-icon :component="HeartOutline" size="48" />
        </template>
        <template #extra>
          <n-button type="primary" @click="goToList">去浏览颜色</n-button>
        </template>
      </n-empty>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NSpace, NTag, NButton, NSpin, NEmpty } from 'naive-ui'
import { Heart, HeartOutline, TrashOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import ColorCard from '@/components/ColorCard.vue'

const router = useRouter()
const { favoriteColors, favoriteCount, clearFavorites } = useFavorites()

function goToList() {
  router.push('/')
}

function handleClear() {
  if (window.confirm('确定要清空收藏夹吗？')) {
    clearFavorites()
  }
}
</script>

<style scoped>
.favorites__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.favorites__title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.favorites__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.favorites__empty {
  padding: 80px 0;
}
</style>
