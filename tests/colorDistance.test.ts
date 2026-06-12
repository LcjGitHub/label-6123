import { describe, it, expect } from 'vitest'
import { rgbDistance, findSimilarColors, formatRgb } from '@/utils/colorDistance'
import type { ColorItem } from '@/types/color'

function makeColorItem(
  id: string,
  hex: string,
  r: number,
  g: number,
  b: number,
  category = '红系',
  origin: 'china' | 'japan' = 'china'
): ColorItem {
  return {
    id,
    name: `色${id}`,
    origin,
    category,
    hex,
    rgb: { r, g, b },
    story: '',
  }
}

describe('rgbDistance', () => {
  it('相同颜色距离应为 0', () => {
    const a = { r: 128, g: 128, b: 128 }
    expect(rgbDistance(a, a)).toBe(0)
  })

  it('黑白两色距离应为 sqrt(255^2 * 3) ≈ 441.67', () => {
    const black = { r: 0, g: 0, b: 0 }
    const white = { r: 255, g: 255, b: 255 }
    const expected = Math.sqrt(255 ** 2 * 3)
    expect(rgbDistance(black, white)).toBeCloseTo(expected, 5)
  })

  it('纯红与纯绿的距离计算正确', () => {
    const red = { r: 255, g: 0, b: 0 }
    const green = { r: 0, g: 255, b: 0 }
    const expected = Math.sqrt(255 ** 2 + 255 ** 2)
    expect(rgbDistance(red, green)).toBeCloseTo(expected, 5)
  })

  it('参数顺序不影响结果（对称性）', () => {
    const a = { r: 10, g: 20, b: 30 }
    const b = { r: 40, g: 50, b: 60 }
    expect(rgbDistance(a, b)).toBe(rgbDistance(b, a))
  })

  it('边界值：全 0 与全 255', () => {
    expect(rgbDistance({ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 })).toBe(0)
    expect(
      rgbDistance({ r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 255 })
    ).toBe(0)
  })

  it('边界值：单通道极值差异', () => {
    const a = { r: 0, g: 128, b: 128 }
    const b = { r: 255, g: 128, b: 128 }
    expect(rgbDistance(a, b)).toBe(255)
  })

  it('非法输入：浮点通道值也应能计算', () => {
    const a = { r: 10.5, g: 20.3, b: 30.1 }
    const b = { r: 15.5, g: 25.3, b: 35.1 }
    const expected = Math.sqrt(5 ** 2 + 5 ** 2 + 5 ** 2)
    expect(rgbDistance(a, b)).toBeCloseTo(expected, 5)
  })
})

describe('findSimilarColors', () => {
  const colors: ColorItem[] = [
    makeColorItem('1', '#FF0000', 255, 0, 0, '红系', 'china'),
    makeColorItem('2', '#FE0101', 254, 1, 1, '红系', 'china'),
    makeColorItem('3', '#FD0202', 253, 2, 2, '红系', 'japan'),
    makeColorItem('4', '#00FF00', 0, 255, 0, '绿系', 'china'),
    makeColorItem('5', '#0000FF', 0, 0, 255, '蓝系', 'japan'),
  ]

  it('应按距离升序排列相似色', () => {
    const target = colors[0]
    const result = findSimilarColors(target, colors, 10)
    expect(result.length).toBe(4)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].distance).toBeGreaterThanOrEqual(result[i - 1].distance)
    }
  })

  it('应排除目标色自身', () => {
    const target = colors[0]
    const result = findSimilarColors(target, colors)
    expect(result.some((r) => r.color.id === target.id)).toBe(false)
  })

  it('limit 参数应限制返回数量', () => {
    const target = colors[0]
    const result = findSimilarColors(target, colors, 2)
    expect(result.length).toBe(2)
  })

  it('limit 默认为 5', () => {
    const manyColors: ColorItem[] = []
    for (let i = 0; i < 20; i++) {
      manyColors.push(
        makeColorItem(`c${i}`, `#${i.toString(16).padStart(2, '0')}0000`, i, 0, 0)
      )
    }
    const target = makeColorItem('target', '#800000', 128, 0, 0)
    const all = [target, ...manyColors]
    const result = findSimilarColors(target, all)
    expect(result.length).toBe(5)
  })

  it('应去除重复 hex（去重）', () => {
    const dupColors: ColorItem[] = [
      makeColorItem('a', '#FF0000', 255, 0, 0),
      makeColorItem('b', '#FF0000', 255, 0, 0),
      makeColorItem('c', '#ff0000', 255, 0, 0),
      makeColorItem('d', '#00FF00', 0, 255, 0),
    ]
    const target = makeColorItem('t', '#FE0000', 254, 0, 0)
    const result = findSimilarColors(target, [target, ...dupColors], 10)
    const hexes = result.map((r) => r.color.hex.toLowerCase())
    const uniqueHexes = new Set(hexes)
    expect(hexes.length).toBe(uniqueHexes.size)
  })

  it('返回结构应包含各通道距离信息', () => {
    const target = colors[0]
    const result = findSimilarColors(target, colors, 1)
    expect(result[0]).toHaveProperty('distance')
    expect(result[0]).toHaveProperty('rDistance')
    expect(result[0]).toHaveProperty('gDistance')
    expect(result[0]).toHaveProperty('bDistance')
    expect(result[0]).toHaveProperty('color')
    expect(typeof result[0].distance).toBe('number')
    expect(typeof result[0].rDistance).toBe('number')
    expect(typeof result[0].gDistance).toBe('number')
    expect(typeof result[0].bDistance).toBe('number')
  })

  it('空数组输入应返回空数组', () => {
    const target = colors[0]
    const result = findSimilarColors(target, [])
    expect(result).toEqual([])
  })

  it('仅包含目标色时应返回空数组', () => {
    const target = colors[0]
    const result = findSimilarColors(target, [target])
    expect(result).toEqual([])
  })

  it('相近的红系排在绿系蓝系之前', () => {
    const target = colors[0]
    const result = findSimilarColors(target, colors, 10)
    const firstIds = result.slice(0, 2).map((r) => r.color.id)
    expect(firstIds).toContain('2')
    expect(firstIds).toContain('3')
  })
})

describe('formatRgb', () => {
  it('正常输入格式化正确', () => {
    expect(formatRgb({ r: 255, g: 128, b: 0 })).toBe('rgb(255, 128, 0)')
  })

  it('边界值：全 0', () => {
    expect(formatRgb({ r: 0, g: 0, b: 0 })).toBe('rgb(0, 0, 0)')
  })

  it('边界值：全 255', () => {
    expect(formatRgb({ r: 255, g: 255, b: 255 })).toBe('rgb(255, 255, 255)')
  })

  it('浮点值保持原样输出', () => {
    expect(formatRgb({ r: 128.5, g: 64.25, b: 32.125 })).toBe(
      'rgb(128.5, 64.25, 32.125)'
    )
  })
})
