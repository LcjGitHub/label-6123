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

/**
 * 带距离信息的相似颜色
 */
export interface SimilarColorItem {
  /** 颜色信息 */
  color: ColorItem
  /** RGB 欧氏距离 */
  distance: number
  /** 红色通道距离 */
  rDistance: number
  /** 绿色通道距离 */
  gDistance: number
  /** 蓝色通道距离 */
  bDistance: number
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

/** 排序方式 */
export const SORT_OPTIONS = [
  { label: '按色名顺序', value: 'name' },
  { label: '按色系分组', value: 'category' },
  { label: '按亮度从高到低', value: 'brightness' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']
