<template>
  <div class="stats-overview">
    <div class="stats-overview__header">
      <h2 class="stats-overview__title">传统色数据统计概览</h2>
      <n-text depth="3" class="stats-overview__subtitle">
        中国色与日本色的色系分布统计
      </n-text>
    </div>

    <div class="stats-overview__summary">
      <n-card class="stats-card stats-card--total" hoverable>
        <div class="stats-card__content">
          <div class="stats-card__label">总色数</div>
          <div class="stats-card__value">{{ stats.total }}</div>
          <div class="stats-card__desc">种传统颜色</div>
        </div>
      </n-card>

      <n-card class="stats-card stats-card--china" hoverable>
        <div class="stats-card__content">
          <div class="stats-card__label">中国色</div>
          <div class="stats-card__value">{{ stats.chinaCount }}</div>
          <div class="stats-card__desc">占比 {{ stats.chinaPercent }}%</div>
        </div>
      </n-card>

      <n-card class="stats-card stats-card--japan" hoverable>
        <div class="stats-card__content">
          <div class="stats-card__label">日本色</div>
          <div class="stats-card__value">{{ stats.japanCount }}</div>
          <div class="stats-card__desc">占比 {{ stats.japanPercent }}%</div>
        </div>
      </n-card>
    </div>

    <div class="stats-overview__section">
      <h3 class="stats-overview__section-title">各色系分布</h3>
      <div class="stats-overview__grid">
        <n-card
          v-for="item in stats.categories"
          :key="item.category"
          class="category-card"
          hoverable
        >
          <div class="category-card__header">
            <div
              class="category-card__color-dot"
              :style="{ background: categoryColors[item.category] || '#999' }"
            />
            <span class="category-card__name">{{ item.category }}</span>
          </div>
          <div class="category-card__total">{{ item.totalCount }} 种</div>
          <div class="category-card__detail">
            <div class="category-card__detail-item">
              <span class="category-card__detail-label">中国色</span>
              <span class="category-card__detail-value">{{ item.chinaCount }}</span>
            </div>
            <div class="category-card__detail-item">
              <span class="category-card__detail-label">日本色</span>
              <span class="category-card__detail-value">{{ item.japanCount }}</span>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NText } from 'naive-ui'
import { useColors } from '@/composables/useColors'
import { computeColorStats, getCategoryRepresentativeColors } from '@/utils/statsUtils'

const { allColors } = useColors()

const stats = computed(() => computeColorStats(allColors.value))
const categoryColors = computed(() => getCategoryRepresentativeColors(allColors.value))
</script>

<style scoped>
.stats-overview {
  padding: 8px 0;
}

.stats-overview__header {
  margin-bottom: 24px;
  text-align: center;
}

.stats-overview__title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.stats-overview__subtitle {
  font-size: 14px;
}

.stats-overview__summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stats-card {
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.stats-card__content {
  padding: 8px 0;
}

.stats-card__label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.stats-card__value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}

.stats-card__desc {
  font-size: 13px;
  color: var(--text-tertiary);
}

.stats-card--total .stats-card__value {
  color: var(--text-primary);
}

.stats-card--china .stats-card__value {
  color: #C91F37;
}

:deep(.theme-dark) .stats-card--china .stats-card__value {
  color: #ff6b6b;
}

.stats-card--japan .stats-card__value {
  color: #2B66A4;
}

:deep(.theme-dark) .stats-card--japan .stats-card__value {
  color: #74c0fc;
}

.stats-overview__section {
  margin-top: 32px;
}

.stats-overview__section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #8B4513;
}

:deep(.theme-dark) .stats-overview__section-title {
  border-left-color: #D2691E;
}

.stats-overview__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.category-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
}

.category-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.category-card__color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1.5px solid #ddd;
  box-shadow: 0 0 0 2px #fff;
}

:deep(.theme-dark) .category-card__color-dot {
  border-color: #2a2a4a;
  box-shadow: 0 0 0 2px #1a1a2e;
}

.category-card__name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.category-card__total {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.category-card__detail {
  display: flex;
  gap: 16px;
}

.category-card__detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-card__detail-label {
  font-size: 12px;
  color: var(--text-tertiary);
}

.category-card__detail-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .stats-overview__summary {
    grid-template-columns: 1fr;
  }

  .stats-card__value {
    font-size: 28px;
  }

  .stats-overview__title {
    font-size: 20px;
  }
}
</style>
