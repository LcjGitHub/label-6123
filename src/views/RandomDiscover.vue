<template>
  <div class="random-discover">
    <div v-if="currentColor" class="random-discover__wrapper">
      <div
        class="random-discover__hero"
        :style="{ backgroundColor: currentColor.hex }"
      >
        <div class="random-discover__hero-content">
          <router-link
            :to="`/color/${currentColor.id}`"
            class="random-discover__title-link"
            :class="{ 'random-discover__title-link--light': isLight }"
          >
            <h1
              class="random-discover__title"
              :class="{ 'random-discover__title--light': isLight }"
            >
              {{ currentColor.name }}
            </h1>
            <n-icon
              class="random-discover__title-arrow"
              :component="ArrowForwardOutline"
              size="28"
            />
          </router-link>
        </div>
        <div class="random-discover__hero-action">
          <n-button
            type="primary"
            size="large"
            :ghost="!isLight"
            @click="handleRandomize"
          >
            <template #icon>
              <n-icon :component="ShuffleOutline" />
            </template>
            再来一次
          </n-button>
        </div>
      </div>

      <n-card class="random-discover__info-card" :bordered="false">
        <div class="random-discover__meta">
          <n-tag :bordered="false" round>{{ currentColor.category }}</n-tag>
          <n-tag
            :bordered="false"
            round
            :type="currentColor.origin === 'china' ? 'error' : 'info'"
          >
            {{ currentColor.origin === 'china' ? '中国色' : '日本色' }}
          </n-tag>
        </div>
        <n-text class="random-discover__story" depth="2">
          {{ currentColor.story }}
        </n-text>
      </n-card>
    </div>

    <n-empty
      v-else
      description="暂无颜色数据"
      class="random-discover__empty"
    >
      <template #icon>
        <n-icon :component="AlertCircleOutline" size="48" />
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NButton, NIcon, NTag, NCard, NText, NEmpty } from 'naive-ui'
import { ShuffleOutline, ArrowForwardOutline, AlertCircleOutline } from '@vicons/ionicons5'
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
  gap: 16px;
}

.random-discover__wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.random-discover__hero {
  border-radius: 16px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.random-discover__hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.2) 100%
  );
  pointer-events: none;
}

.random-discover__hero-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.random-discover__hero-action {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.random-discover__title-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.2s, gap 0.2s;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  padding-bottom: 4px;
}

.random-discover__title-link:hover {
  transform: translateY(-2px);
  gap: 20px;
  border-bottom-color: rgba(255, 255, 255, 0.9);
}

.random-discover__title-link--light {
  border-bottom-color: rgba(51, 51, 51, 0.4);
}

.random-discover__title-link--light:hover {
  border-bottom-color: rgba(51, 51, 51, 0.8);
}

.random-discover__title {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin: 0;
  letter-spacing: 6px;
}

.random-discover__title--light {
  color: var(--text-primary);
  text-shadow: none;
}

.random-discover__title-arrow {
  color: #fff;
  opacity: 0.8;
  transition: opacity 0.2s, transform 0.2s;
}

.random-discover__title-link:hover .random-discover__title-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.random-discover__title-link--light .random-discover__title-arrow {
  color: var(--text-primary);
}

.random-discover__info-card {
  border-radius: 12px;
  box-shadow: var(--shadow-card);
}

.random-discover__meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.random-discover__story {
  font-size: 16px;
  line-height: 1.8;
  margin: 0;
}

.random-discover__empty {
  padding: 80px 0;
}

@media (min-width: 768px) {
  .random-discover__hero {
    min-height: 380px;
    padding: 40px;
  }

  .random-discover__title {
    font-size: 72px;
    letter-spacing: 8px;
  }

  .random-discover__story {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .random-discover__hero {
    min-height: 260px;
    padding: 20px;
    border-radius: 12px;
  }

  .random-discover__title {
    font-size: 40px;
    letter-spacing: 4px;
  }
}
</style>
