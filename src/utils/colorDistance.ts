import type { ColorItem, SimilarColorItem } from '@/types/color'

export function rgbDistance(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number }
): number {
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2
  )
}

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

export function formatRgb(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}
