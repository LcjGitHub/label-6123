import type { ColorItem } from '@/types/color'

const CATEGORIES = [
  '红系',
  '橙系',
  '黄系',
  '绿系',
  '蓝系',
  '紫系',
  '白系',
  '黑灰系',
  '褐系',
] as const

export interface CategoryStats {
  category: string
  chinaCount: number
  japanCount: number
  totalCount: number
}

export interface ColorStats {
  total: number
  chinaCount: number
  japanCount: number
  chinaPercent: number
  japanPercent: number
  categories: CategoryStats[]
}

export function computeColorStats(colors: ColorItem[]): ColorStats {
  const total = colors.length
  const chinaCount = colors.filter((c) => c.origin === 'china').length
  const japanCount = colors.filter((c) => c.origin === 'japan').length

  const categories: CategoryStats[] = CATEGORIES.map((category) => {
    const categoryColors = colors.filter((c) => c.category === category)
    return {
      category,
      chinaCount: categoryColors.filter((c) => c.origin === 'china').length,
      japanCount: categoryColors.filter((c) => c.origin === 'japan').length,
      totalCount: categoryColors.length,
    }
  })

  return {
    total,
    chinaCount,
    japanCount,
    chinaPercent: total > 0 ? +((chinaCount / total) * 100).toFixed(1) : 0,
    japanPercent: total > 0 ? +((japanCount / total) * 100).toFixed(1) : 0,
    categories,
  }
}
