import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import colorsData from '@/mock/colors.json'
import type { ColorItem, ColorOrigin, SortOption } from '@/types/color'
import { getLuminance } from '@/utils/colorUtils'

const allColors = ref<ColorItem[]>(colorsData as ColorItem[])

const fuse = new Fuse(allColors.value, {
  keys: ['name', 'story'],
  threshold: 0.4,
  includeScore: true,
})

/**
 * 传统色数据与搜索 composable
 */
export function useColors() {
  /**
   * 根据 ID 获取颜色
   */
  function getColorById(id: string): ColorItem | undefined {
    return allColors.value.find((c) => c.id === id)
  }

  /**
   * 搜索色名与典故关键词
   */
  function searchColors(keyword: string): ColorItem[] {
    const trimmed = keyword.trim()
    if (!trimmed) return allColors.value
    fuse.setCollection(allColors.value)
    return fuse.search(trimmed).map((result) => result.item)
  }

  /**
   * 按色系筛选
   */
  function filterByCategory(colors: ColorItem[], category: string): ColorItem[] {
    if (category === '全部') return colors
    return colors.filter((c) => c.category === category)
  }

  function filterByOrigin(colors: ColorItem[], origin: ColorOrigin): ColorItem[] {
    if (origin === 'all') return colors
    return colors.filter((c) => c.origin === origin)
  }

  /**
   * 排序颜色
   * - name: 按色名字典序
   * - category: 按色系分组，组内按色名
   * - brightness: 按亮度从高到低
   */
  function sortColors(colors: ColorItem[], sortBy: SortOption): ColorItem[] {
    const sorted = [...colors]
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
      case 'category':
        return sorted.sort((a, b) => {
          if (a.category === b.category) {
            return a.name.localeCompare(b.name, 'zh-CN')
          }
          return a.category.localeCompare(b.category, 'zh-CN')
        })
      case 'brightness':
        return sorted.sort((a, b) => getLuminance(b.hex) - getLuminance(a.hex))
      default:
        return sorted
    }
  }

  return {
    allColors: computed(() => allColors.value),
    getColorById,
    searchColors,
    filterByCategory,
    filterByOrigin,
    sortColors,
  }
}
