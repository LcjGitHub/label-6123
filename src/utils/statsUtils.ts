import type { ColorItem } from '@/types/color'
import { COLOR_CATEGORIES } from '@/types/color'

/**
 * 色系分类统计数据
 */
export interface CategoryStats {
  /** 色系名称 */
  category: string
  /** 该色系中国色数量 */
  chinaCount: number
  /** 该色系日本色数量 */
  japanCount: number
  /** 该色系总数量 */
  totalCount: number
}

/**
 * 传统色整体统计数据
 */
export interface ColorStats {
  /** 总色数 */
  total: number
  /** 中国色总数 */
  chinaCount: number
  /** 日本色总数 */
  japanCount: number
  /** 中国色占比（百分比） */
  chinaPercent: number
  /** 日本色占比（百分比） */
  japanPercent: number
  /** 各色系分类统计数据 */
  categories: CategoryStats[]
}

/**
 * 获取不含「全部」的色系列表
 */
const CATEGORIES = COLOR_CATEGORIES.filter((c) => c !== '全部')

/**
 * 计算传统色统计数据
 * @param colors 颜色数据数组
 * @returns 统计结果，包含总览和各色系分类统计
 */
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

/**
 * 获取各色系的代表色（取该色系第一个颜色的色值）
 * @param colors 颜色数据数组
 * @returns 以色系名为 key、代表色 HEX 为 value 的映射
 */
export function getCategoryRepresentativeColors(
  colors: ColorItem[]
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const category of CATEGORIES) {
    const first = colors.find((c) => c.category === category)
    if (first) {
      result[category] = first.hex
    }
  }
  return result
}
