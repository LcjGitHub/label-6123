import type { Hsl } from './colorHsl'
import { rgbToHsl, hslToHex, hslToRgb } from './colorHsl'

export interface SchemeColor {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: Hsl
  type: 'base' | 'complementary' | 'analogous' | 'triadic'
  label: string
}

function normalizeHue(hue: number): number {
  let h = hue % 360
  if (h < 0) h += 360
  return h
}

function createColorFromHsl(hsl: Hsl, type: SchemeColor['type'], label: string): SchemeColor {
  const rgb = hslToRgb(hsl)
  const hex = hslToHex(hsl)
  return { hex, rgb, hsl, type, label }
}

export function generateColorScheme(rgb: { r: number; g: number; b: number }): SchemeColor[] {
  const baseHsl = rgbToHsl(rgb)
  const scheme: SchemeColor[] = []

  scheme.push(createColorFromHsl(baseHsl, 'base', '原色'))

  const complementaryHsl: Hsl = {
    h: normalizeHue(baseHsl.h + 180),
    s: baseHsl.s,
    l: baseHsl.l,
  }
  scheme.push(createColorFromHsl(complementaryHsl, 'complementary', '互补色'))

  const analogousLeftHsl: Hsl = {
    h: normalizeHue(baseHsl.h - 30),
    s: baseHsl.s,
    l: baseHsl.l,
  }
  scheme.push(createColorFromHsl(analogousLeftHsl, 'analogous', '类似色（左）'))

  const analogousRightHsl: Hsl = {
    h: normalizeHue(baseHsl.h + 30),
    s: baseHsl.s,
    l: baseHsl.l,
  }
  scheme.push(createColorFromHsl(analogousRightHsl, 'analogous', '类似色（右）'))

  const triadic1Hsl: Hsl = {
    h: normalizeHue(baseHsl.h + 120),
    s: baseHsl.s,
    l: baseHsl.l,
  }
  scheme.push(createColorFromHsl(triadic1Hsl, 'triadic', '三等分配色 1'))

  const triadic2Hsl: Hsl = {
    h: normalizeHue(baseHsl.h + 240),
    s: baseHsl.s,
    l: baseHsl.l,
  }
  scheme.push(createColorFromHsl(triadic2Hsl, 'triadic', '三等分配色 2'))

  return scheme
}
