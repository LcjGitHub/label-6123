/**
 * 传统色数据类型
 */
export interface ColorItem {
  /** 唯一标识 */
  id: string
  /** 色名 */
  name: string
  /** 来源：中国色 / 日本色 */
  origin: 'china' | 'japan'
  /** 色系分类 */
  category: string
  /** HEX 色值 */
  hex: string
  /** RGB 色值 */
  rgb: { r: number; g: number; b: number }
  /** 典故 / 说明 */
  story: string
}

/** 色系选项 */
export const COLOR_CATEGORIES = [
  '全部',
  '红系',
  '橙系',
  '黄系',
  '绿系',
  '蓝系',
  '紫系',
  '白系',
  '黑灰系',
  '褐系',
] as const

/** 来源选项 */
export const COLOR_ORIGINS = [
  { label: '全部', value: 'all' },
  { label: '中国色', value: 'china' },
  { label: '日本色', value: 'japan' },
] as const

export type ColorOrigin = (typeof COLOR_ORIGINS)[number]['value']

export type ColorCategory = (typeof COLOR_CATEGORIES)[number]
