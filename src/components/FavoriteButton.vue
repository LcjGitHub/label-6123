<template>
  <n-button
    class="favorite-btn"
    :type="isFavorited ? 'warning' : 'default'"
    :quaternary="!isFavorited"
    size="small"
    @click.stop="handleToggle"
  >
    <template #icon>
      <n-icon :component="isFavorited ? Heart : HeartOutline" :size="size" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { Heart, HeartOutline } from '@vicons/ionicons5'
import { useFavorites } from '@/composables/useFavorites'

const props = withDefaults(
  defineProps<{
    colorId: string
    size?: number
  }>(),
  {
    size: 18,
  }
)

const { isFavorite, toggleFavorite } = useFavorites()

const isFavorited = computed(() => isFavorite(props.colorId))

function handleToggle() {
  toggleFavorite(props.colorId)
}
</script>

<style scoped>
.favorite-btn {
  flex-shrink: 0;
}
</style>
