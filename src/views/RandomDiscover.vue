<template>
  <div class="random-discover">
    <div
      v-if="currentColor"
      class="random-discover__hero"
      :style="{ backgroundColor: currentColor.hex }"
    >
      <div class="random-discover__hero-content">
        <router-link
          :to="`/color/${currentColor.id}`"
          class="random-discover__title-link"
        >
          <h1
            class="random-discover__title"
            :class="{ 'random-discover__title--light': isLight }"
          >
            {{ currentColor.name }}
          </h1>
        </router-link>
        <div class="random-discover__meta">
          <n-tag :bordered="false">{{ currentColor.category }}</n-tag>
          <n-tag
            :bordered="false"
            :type="currentColor.origin === 'china' ? 'error' : 'info'"
          >
            {{ currentColor.origin === 'china' ? '中国色' : '日本色' }}
          </n-tag>
        </div>
        <p
          class="random-discover__story"
          :class="{ 'random-discover__story--light': isLight }"
        >
          {{ currentColor.story }}
        </p>
      </div>
    </div>

    <div class="random-discover__actions">
      <n-button type="primary" size="large" @click="handleRandomize">
        <template #icon>
          <n-icon :component="ShuffleOutline" />
        </template>
        再来一次
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NButton, NIcon, NTag } from 'naive-ui'
import { ShuffleOutline } from '@vicons/ionicons5'
import { useRandomColor } from '@/composables/useRandomColor'
import { isLightColor } from '@/utils/colorUtils'

const { currentColor, pickRandomColor } = useRandomColor()

const isLight = computed(() =>
  currentColor.value ? isLightColor(currentColor.value.hex) : false
)

function handleRandomize() {
  pickRandomColor()
}

onMounted(() => {
  if (!currentColor.value) {
    pickRandomColor()
  }
})
</script>

<style scoped>
.random-discover {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.random-discover__hero {
  border-radius: 16px;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.random-discover__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
}

.random-discover__hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.random-discover__title-link {
  text-decoration: none;
  display: inline-block;
  transition: transform 0.2s;
}

.random-discover__title-link:hover {
  transform: translateY(-2px);
}

.random-discover__title {
  font-size: 72px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin: 0 0 16px 0;
  letter-spacing: 8px;
}

.random-discover__title--light {
  color: #333;
  text-shadow: none;
}

.random-discover__meta {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.random-discover__story {
  font-size: 18px;
  line-height: 1.8;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
}

.random-discover__story--light {
  color: #333;
  text-shadow: none;
}

.random-discover__actions {
  display: flex;
  justify-content: center;
}

.random-discover__actions .n-button {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
