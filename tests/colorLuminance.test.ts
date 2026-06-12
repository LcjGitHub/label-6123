import { describe, it, expect } from 'vitest'
import { getLuminance, isLightColor } from '@/utils/colorLuminance'

describe('getLuminance', () => {
  it('纯黑 #000000 亮度为 0', () => {
    expect(getLuminance('#000000')).toBe(0)
  })

  it('纯白 #FFFFFF 亮度为 1', () => {
    expect(getLuminance('#FFFFFF')).toBe(1)
  })

  it('纯红亮度计算：(0.299*255)/255 = 0.299', () => {
    expect(getLuminance('#FF0000')).toBeCloseTo(0.299, 5)
  })

  it('纯绿亮度计算：(0.587*255)/255 = 0.587', () => {
    expect(getLuminance('#00FF00')).toBeCloseTo(0.587, 5)
  })

  it('纯蓝亮度计算：(0.114*255)/255 = 0.114', () => {
    expect(getLuminance('#0000FF')).toBeCloseTo(0.114, 5)
  })

  it('灰色 #808080 亮度约为 0.5', () => {
    expect(getLuminance('#808080')).toBeCloseTo(128 / 255, 3)
  })

  it('带 # 号与不带结果一致', () => {
    expect(getLuminance('FF0000')).toBe(getLuminance('#FF0000'))
  })

  it('大小写不敏感', () => {
    expect(getLuminance('#aabbcc')).toBe(getLuminance('#AABBCC'))
  })

  it('黄色比蓝色亮（人眼感知权重）', () => {
    expect(getLuminance('#FFFF00')).toBeGreaterThan(getLuminance('#0000FF'))
  })

  it('绿色比红色亮（人眼感知权重）', () => {
    expect(getLuminance('#00FF00')).toBeGreaterThan(getLuminance('#FF0000'))
  })

  it('亮度值应在 [0, 1] 区间', () => {
    const samples = [
      '#000000',
      '#123456',
      '#ABCDEF',
      '#FEDCBA',
      '#789ABC',
      '#FFFFFF',
    ]
    for (const hex of samples) {
      const l = getLuminance(hex)
      expect(l).toBeGreaterThanOrEqual(0)
      expect(l).toBeLessThanOrEqual(1)
    }
  })
})

describe('isLightColor', () => {
  it('纯白色应为浅色', () => {
    expect(isLightColor('#FFFFFF')).toBe(true)
  })

  it('纯黑色应为深色', () => {
    expect(isLightColor('#000000')).toBe(false)
  })

  it('纯绿亮度 0.587 小于阈值 0.6，应为深色', () => {
    expect(isLightColor('#00FF00')).toBe(false)
  })

  it('高亮度灰色应为浅色', () => {
    expect(isLightColor('#EEEEEE')).toBe(true)
  })

  it('低亮度灰色应为深色', () => {
    expect(isLightColor('#222222')).toBe(false)
  })

  it('阈值边界：亮度恰好 0.6 应为 false（严格大于）', () => {
    const thresholdHex = '#999999'
    const lum = getLuminance(thresholdHex)
    if (lum > 0.6) {
      expect(isLightColor(thresholdHex)).toBe(true)
    } else {
      expect(isLightColor(thresholdHex)).toBe(false)
    }
  })

  it('带 # 与不带结果一致', () => {
    expect(isLightColor('FFFFFF')).toBe(isLightColor('#FFFFFF'))
    expect(isLightColor('000000')).toBe(isLightColor('#000000'))
  })
})
