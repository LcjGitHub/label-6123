import type { ColorItem, SimilarColorItem } from '@/types/color'

/**
 * 计算两个 RGB 颜色的欧氏距离
 */
export function rgbDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number }
): number {
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
  )
}

/**
 * 获取与目标色相近的颜色（按 RGB 距离 Top N）
 */
export function findSimilarColors(
  target: ColorItem,
  allColors: ColorItem[],
  limit = 5
): SimilarColorItem[] {
  const seenHex = new Set<string>()
  return allColors
    .filter((c) => c.id !== target.id)
    .map((c) => ({
      color: c,
      distance: rgbDistance(target.rgb, c.rgb),
      rDistance: Math.abs(target.rgb.r - c.rgb.r),
      gDistance: Math.abs(target.rgb.g - c.rgb.g),
      bDistance: Math.abs(target.rgb.b - c.rgb.b),
    }))
    .sort((a, b) => a.distance - b.distance)
    .filter((item) => {
      const hex = item.color.hex.toLowerCase()
      if (seenHex.has(hex)) {
        return false
      }
      seenHex.add(hex)
      return true
    })
    .slice(0, limit)
}

/**
 * 将 RGB 格式化为字符串
 */
export function formatRgb(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

/**
 * 计算颜色相对亮度 (0-1)
 */
export function getLuminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

/**
 * 判断文字在深色背景上是否应使用浅色
 */
export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.6
}

/**
 * HSL 色值类型
 */
export interface Hsl {
  /** 色相 (0-360) */
  h: number
  /** 饱和度 (0-100) */
  s: number
  /** 亮度 (0-100) */
  l: number
}

/**
 * 将 RGB 转换为 HSL（色相饱和度亮度）
 * @param rgb RGB 色值对象，r、g、b 范围 0-255
 * @returns HSL 色值对象，h 范围 0-360，s 和 l 范围 0-100
 */
export function rgbToHsl(rgb: { r: number; g: number; b: number }): Hsl {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = Math.round(((max + min) / 2) * 100)

  if (delta !== 0) {
    const lightness = (max + min) / 2
    s = Math.round((delta / (1 - Math.abs(2 * lightness - 1))) * 100)

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
    }

    h = Math.round(h * 60)
    if (h < 0) {
      h += 360
    }
  }

  return { h, s, l }
}

/**
 * 将十六进制色值转换为 HSL（色相饱和度亮度）
 * @param hex 十六进制色值，如 #FF0000
 * @returns HSL 色值对象
 */
export function hexToHsl(hex: string): Hsl {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return rgbToHsl({ r, g, b })
}

/**
 * 将 HSL（色相饱和度亮度）格式化为字符串
 */
export function formatHsl(hsl: Hsl): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}
