export interface Hsl {
  h: number
  s: number
  l: number
}

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

export function hexToHsl(hex: string): Hsl {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return rgbToHsl({ r, g, b })
}

export function formatHsl(hsl: Hsl): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}
