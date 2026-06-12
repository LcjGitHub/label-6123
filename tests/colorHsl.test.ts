import { describe, it, expect } from 'vitest'
import { rgbToHsl, hexToHsl, formatHsl } from '@/utils/colorHsl'

describe('rgbToHsl', () => {
  it('纯红 rgb(255,0,0) 应为 hsl(0, 100%, 50%)', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('纯绿 rgb(0,255,0) 应为 hsl(120, 100%, 50%)', () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('纯蓝 rgb(0,0,255) 应为 hsl(240, 100%, 50%)', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 })
  })

  it('青色 rgb(0,255,255) 应为 hsl(180, 100%, 50%)', () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 255 })).toEqual({ h: 180, s: 100, l: 50 })
  })

  it('品红 rgb(255,0,255) 应为 hsl(300, 100%, 50%)', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 255 })).toEqual({ h: 300, s: 100, l: 50 })
  })

  it('黄色 rgb(255,255,0) 应为 hsl(60, 100%, 50%)', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 0 })).toEqual({ h: 60, s: 100, l: 50 })
  })

  it('白色应饱和为 0，亮度 100%', () => {
    const result = rgbToHsl({ r: 255, g: 255, b: 255 })
    expect(result.h).toBe(0)
    expect(result.s).toBe(0)
    expect(result.l).toBe(100)
  })

  it('黑色应饱和为 0，亮度 0%', () => {
    const result = rgbToHsl({ r: 0, g: 0, b: 0 })
    expect(result.h).toBe(0)
    expect(result.s).toBe(0)
    expect(result.l).toBe(0)
  })

  it('灰色应饱和为 0', () => {
    const result = rgbToHsl({ r: 128, g: 128, b: 128 })
    expect(result.s).toBe(0)
    expect(result.l).toBeCloseTo(50, 0)
  })

  it('边界值：r=g=b 时色相应为 0，饱和度为 0', () => {
    for (const v of [0, 32, 64, 128, 192, 255]) {
      const result = rgbToHsl({ r: v, g: v, b: v })
      expect(result.h).toBe(0)
      expect(result.s).toBe(0)
    }
  })

  it('色相在红色附近负值应加 360（如蓝紫色调）', () => {
    const result = rgbToHsl({ r: 255, g: 0, b: 1 })
    expect(result.h).toBeGreaterThanOrEqual(0)
    expect(result.h).toBeLessThan(360)
  })

  it('所有合法 RGB 返回的 HSL 各值应在合法范围内', () => {
    const samples = [
      { r: 100, g: 150, b: 200 },
      { r: 12, g: 34, b: 56 },
      { r: 200, g: 100, b: 50 },
      { r: 17, g: 200, b: 120 },
      { r: 255, g: 128, b: 64 },
    ]
    for (const rgb of samples) {
      const hsl = rgbToHsl(rgb)
      expect(hsl.h).toBeGreaterThanOrEqual(0)
      expect(hsl.h).toBeLessThanOrEqual(360)
      expect(hsl.s).toBeGreaterThanOrEqual(0)
      expect(hsl.s).toBeLessThanOrEqual(100)
      expect(hsl.l).toBeGreaterThanOrEqual(0)
      expect(hsl.l).toBeLessThanOrEqual(100)
    }
  })

  it('max 为 g 分支（绿主导）计算正确', () => {
    const result = rgbToHsl({ r: 50, g: 200, b: 100 })
    expect(result.h).toBeGreaterThan(60)
    expect(result.h).toBeLessThan(180)
  })

  it('max 为 b 分支（蓝主导）计算正确', () => {
    const result = rgbToHsl({ r: 50, g: 100, b: 200 })
    expect(result.h).toBeGreaterThan(180)
    expect(result.h).toBeLessThan(300)
  })
})

describe('hexToHsl', () => {
  it('带 # 号的 hex 转换正确', () => {
    expect(hexToHsl('#FF0000')).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('不带 # 号的 hex 也能转换', () => {
    expect(hexToHsl('FF0000')).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('大小写不敏感', () => {
    expect(hexToHsl('#00ff00')).toEqual({ h: 120, s: 100, l: 50 })
    expect(hexToHsl('#00FF00')).toEqual({ h: 120, s: 100, l: 50 })
  })

  it('白色与黑色', () => {
    expect(hexToHsl('#FFFFFF')).toEqual({ h: 0, s: 0, l: 100 })
    expect(hexToHsl('#000000')).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('混合色 #808080（灰色）', () => {
    const result = hexToHsl('#808080')
    expect(result.s).toBe(0)
  })
})

describe('formatHsl', () => {
  it('格式化字符串正确', () => {
    expect(formatHsl({ h: 0, s: 100, l: 50 })).toBe('hsl(0, 100%, 50%)')
  })

  it('各合法值格式化', () => {
    expect(formatHsl({ h: 180, s: 50, l: 75 })).toBe('hsl(180, 50%, 75%)')
  })

  it('边界值：0/0/0', () => {
    expect(formatHsl({ h: 0, s: 0, l: 0 })).toBe('hsl(0, 0%, 0%)')
  })

  it('边界值：360/100/100', () => {
    expect(formatHsl({ h: 360, s: 100, l: 100 })).toBe('hsl(360, 100%, 100%)')
  })
})
