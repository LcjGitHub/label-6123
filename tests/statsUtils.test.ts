import { describe, it, expect } from 'vitest'
import {
  computeColorStats,
  getCategoryRepresentativeColors,
} from '@/utils/statsUtils'
import type { ColorItem } from '@/types/color'
import { COLOR_CATEGORIES } from '@/types/color'

function makeItem(
  id: string,
  category: string,
  origin: 'china' | 'japan',
  hex = '#FFFFFF'
): ColorItem {
  return {
    id,
    name: `色${id}`,
    origin,
    category,
    hex,
    rgb: { r: 255, g: 255, b: 255 },
    story: '',
  }
}

const VALID_CATEGORIES = COLOR_CATEGORIES.filter((c) => c !== '全部')

describe('computeColorStats - 总数统计', () => {
  it('空数组返回全 0 统计', () => {
    const result = computeColorStats([])
    expect(result.total).toBe(0)
    expect(result.chinaCount).toBe(0)
    expect(result.japanCount).toBe(0)
    expect(result.chinaPercent).toBe(0)
    expect(result.japanPercent).toBe(0)
  })

  it('单条中国色数据：总数为 1，中国色 1，日本色 0', () => {
    const data = [makeItem('1', '红系', 'china')]
    const result = computeColorStats(data)
    expect(result.total).toBe(1)
    expect(result.chinaCount).toBe(1)
    expect(result.japanCount).toBe(0)
  })

  it('单条日本色数据：总数为 1，日本色 1，中国色 0', () => {
    const data = [makeItem('1', '红系', 'japan')]
    const result = computeColorStats(data)
    expect(result.total).toBe(1)
    expect(result.chinaCount).toBe(0)
    expect(result.japanCount).toBe(1)
  })

  it('多条混合数据：总数应为数组长度', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'japan'),
      makeItem('3', '绿系', 'china'),
      makeItem('4', '蓝系', 'japan'),
      makeItem('5', '黄系', 'china'),
    ]
    const result = computeColorStats(data)
    expect(result.total).toBe(5)
    expect(result.chinaCount).toBe(3)
    expect(result.japanCount).toBe(2)
  })

  it('chinaCount + japanCount 应等于 total', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '橙系', 'japan'),
      makeItem('3', '黄系', 'china'),
      makeItem('4', '绿系', 'japan'),
      makeItem('5', '蓝系', 'china'),
      makeItem('6', '紫系', 'japan'),
      makeItem('7', '白系', 'china'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaCount + result.japanCount).toBe(result.total)
  })
})

describe('computeColorStats - 占比计算', () => {
  it('全为中国色时占比应为 100% / 0%', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'china'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaPercent).toBe(100)
    expect(result.japanPercent).toBe(0)
  })

  it('全为日本色时占比应为 0% / 100%', () => {
    const data = [
      makeItem('1', '红系', 'japan'),
      makeItem('2', '红系', 'japan'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaPercent).toBe(0)
    expect(result.japanPercent).toBe(100)
  })

  it('各占一半时占比应为 50%', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'japan'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaPercent).toBe(50)
    expect(result.japanPercent).toBe(50)
  })

  it('中国色 3，日本色 1：占比应为 75 / 25', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'china'),
      makeItem('3', '红系', 'china'),
      makeItem('4', '红系', 'japan'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaPercent).toBe(75)
    expect(result.japanPercent).toBe(25)
  })

  it('中国色 1，日本色 3：占比应为 25 / 75', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'japan'),
      makeItem('3', '红系', 'japan'),
      makeItem('4', '红系', 'japan'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaPercent).toBe(25)
    expect(result.japanPercent).toBe(75)
  })

  it('占比保留一位小数（如 1/3 ≈ 33.3%）', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'japan'),
      makeItem('3', '红系', 'japan'),
    ]
    const result = computeColorStats(data)
    expect(result.chinaPercent).toBeCloseTo(33.3, 1)
    expect(result.japanPercent).toBeCloseTo(66.7, 1)
  })

  it('占比之和应约等于 100（考虑四舍五入）', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '橙系', 'japan'),
      makeItem('3', '黄系', 'china'),
      makeItem('4', '绿系', 'japan'),
      makeItem('5', '蓝系', 'china'),
      makeItem('6', '紫系', 'japan'),
      makeItem('7', '白系', 'china'),
      makeItem('8', '褐系', 'japan'),
      makeItem('9', '黑灰系', 'china'),
    ]
    const result = computeColorStats(data)
    const sum = result.chinaPercent + result.japanPercent
    expect(sum).toBeGreaterThanOrEqual(99.9)
    expect(sum).toBeLessThanOrEqual(100.1)
  })

  it('空数组时占比为 0（不抛除零异常）', () => {
    const result = computeColorStats([])
    expect(result.chinaPercent).toBe(0)
    expect(result.japanPercent).toBe(0)
  })
})

describe('computeColorStats - 色系分布统计', () => {
  it('应返回固定数量的色系分类（不含「全部」）', () => {
    const result = computeColorStats([])
    expect(result.categories.length).toBe(VALID_CATEGORIES.length)
  })

  it('色系分类名称应与常量一致', () => {
    const result = computeColorStats([])
    const categoryNames = result.categories.map((c) => c.category)
    expect(categoryNames).toEqual(VALID_CATEGORIES)
  })

  it('空数据时各色系计数均为 0', () => {
    const result = computeColorStats([])
    for (const cat of result.categories) {
      expect(cat.chinaCount).toBe(0)
      expect(cat.japanCount).toBe(0)
      expect(cat.totalCount).toBe(0)
    }
  })

  it('单色系数据统计正确', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'china'),
      makeItem('3', '红系', 'japan'),
    ]
    const result = computeColorStats(data)
    const red = result.categories.find((c) => c.category === '红系')!
    expect(red.chinaCount).toBe(2)
    expect(red.japanCount).toBe(1)
    expect(red.totalCount).toBe(3)

    for (const cat of result.categories) {
      if (cat.category !== '红系') {
        expect(cat.totalCount).toBe(0)
      }
    }
  })

  it('多色系混合数据统计正确', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '红系', 'japan'),
      makeItem('3', '绿系', 'china'),
      makeItem('4', '绿系', 'china'),
      makeItem('5', '蓝系', 'japan'),
      makeItem('6', '黄系', 'china'),
      makeItem('7', '黄系', 'japan'),
      makeItem('8', '黄系', 'china'),
    ]
    const result = computeColorStats(data)

    const find = (name: string) =>
      result.categories.find((c) => c.category === name)!

    expect(find('红系').totalCount).toBe(2)
    expect(find('红系').chinaCount).toBe(1)
    expect(find('红系').japanCount).toBe(1)

    expect(find('绿系').totalCount).toBe(2)
    expect(find('绿系').chinaCount).toBe(2)
    expect(find('绿系').japanCount).toBe(0)

    expect(find('蓝系').totalCount).toBe(1)
    expect(find('蓝系').chinaCount).toBe(0)
    expect(find('蓝系').japanCount).toBe(1)

    expect(find('黄系').totalCount).toBe(3)
    expect(find('黄系').chinaCount).toBe(2)
    expect(find('黄系').japanCount).toBe(1)
  })

  it('每个色系的 chinaCount + japanCount 应等于 totalCount', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '橙系', 'japan'),
      makeItem('3', '黄系', 'china'),
      makeItem('4', '绿系', 'china'),
      makeItem('5', '绿系', 'japan'),
      makeItem('6', '蓝系', 'japan'),
      makeItem('7', '紫系', 'china'),
      makeItem('8', '白系', 'japan'),
      makeItem('9', '黑灰系', 'china'),
      makeItem('10', '褐系', 'japan'),
      makeItem('11', '褐系', 'china'),
    ]
    const result = computeColorStats(data)
    for (const cat of result.categories) {
      expect(cat.chinaCount + cat.japanCount).toBe(cat.totalCount)
    }
  })

  it('所有色系 totalCount 之和应等于整体 total', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      makeItem('2', '橙系', 'japan'),
      makeItem('3', '黄系', 'china'),
      makeItem('4', '绿系', 'china'),
      makeItem('5', '蓝系', 'japan'),
      makeItem('6', '紫系', 'china'),
      makeItem('7', '白系', 'japan'),
      makeItem('8', '黑灰系', 'china'),
      makeItem('9', '褐系', 'japan'),
    ]
    const result = computeColorStats(data)
    const sum = result.categories.reduce((acc, c) => acc + c.totalCount, 0)
    expect(sum).toBe(result.total)
  })
})

describe('computeColorStats - 非法输入场景', () => {
  it('undefined category 的数据不会出现在任何统计分类中', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      { ...makeItem('2', '未知系', 'china'), category: '未知系' as string },
    ]
    const result = computeColorStats(data)
    expect(result.total).toBe(2)
    const sum = result.categories.reduce((acc, c) => acc + c.totalCount, 0)
    expect(sum).toBe(1)
  })

  it('非法 origin 的数据不计入 china/japan 但计入 total', () => {
    const data = [
      makeItem('1', '红系', 'china'),
      { ...makeItem('2', '红系', 'china'), origin: 'unknown' as 'china' },
    ]
    const result = computeColorStats(data)
    expect(result.total).toBe(2)
    expect(result.chinaCount).toBe(1)
    expect(result.japanCount).toBe(0)
  })
})

describe('getCategoryRepresentativeColors', () => {
  it('空数组返回空对象', () => {
    expect(getCategoryRepresentativeColors([])).toEqual({})
  })

  it('仅返回有数据的色系', () => {
    const data = [
      makeItem('1', '红系', 'china', '#FF0000'),
      makeItem('2', '绿系', 'china', '#00FF00'),
    ]
    const result = getCategoryRepresentativeColors(data)
    expect(Object.keys(result).length).toBe(2)
    expect(result['红系']).toBe('#FF0000')
    expect(result['绿系']).toBe('#00FF00')
    expect(result['蓝系']).toBeUndefined()
  })

  it('同色系取第一个颜色的 hex', () => {
    const data = [
      makeItem('1', '红系', 'china', '#AA0000'),
      makeItem('2', '红系', 'china', '#BB0000'),
      makeItem('3', '红系', 'china', '#CC0000'),
    ]
    const result = getCategoryRepresentativeColors(data)
    expect(result['红系']).toBe('#AA0000')
  })

  it('多色系取各自第一个', () => {
    const data = [
      makeItem('1', '蓝系', 'japan', '#0000AA'),
      makeItem('2', '黄系', 'china', '#AAAA00'),
      makeItem('3', '蓝系', 'china', '#0000BB'),
      makeItem('4', '黄系', 'japan', '#BBBB00'),
    ]
    const result = getCategoryRepresentativeColors(data)
    expect(result['蓝系']).toBe('#0000AA')
    expect(result['黄系']).toBe('#AAAA00')
  })

  it('不包含「全部」伪色系', () => {
    const data = [makeItem('1', '红系', 'china', '#FF0000')]
    const result = getCategoryRepresentativeColors(data)
    expect(result['全部']).toBeUndefined()
  })
})
