import { ref } from 'vue'
import type { ColorItem } from '@/types/color'
import { useColors } from './useColors'

/**
 * 随机传统色选择 composable
 *
 * 提供随机抽取传统色的能力，支持避免连续两次抽到同一种颜色，
 * 用于「随机发现」页面的颜色浏览体验。
 *
 * @example
 * ```ts
 * const { currentColor, pickRandomColor } = useRandomColor()
 * // 页面挂载时首次抽取
 * onMounted(() => pickRandomColor())
 * // 点击按钮再次抽取
 * function handleRefresh() {
 *   pickRandomColor()
 * }
 * ```
 */
export function useRandomColor() {
  const { allColors } = useColors()

  /** 当前选中的随机颜色 */
  const currentColor = ref<ColorItem | null>(null)

  /** 上一次抽到的颜色 ID，用于避免连续重复 */
  const lastColorId = ref<string | null>(null)

  /**
   * 从全部颜色中随机选取一种
   *
   * 当颜色总数大于 1 时，确保返回的颜色与上一次不同，
   * 避免用户点击「再来一次」时连续看到同一种颜色。
   *
   * @returns 随机选中的颜色项；若颜色列表为空则返回 null
   */
  function getRandomColor(): ColorItem | null {
    const colors = allColors.value
    if (colors.length === 0) {
      return null
    }

    if (colors.length === 1) {
      return colors[0]
    }

    let randomIndex: number
    let selectedColor: ColorItem

    do {
      randomIndex = Math.floor(Math.random() * colors.length)
      selectedColor = colors[randomIndex]
    } while (selectedColor.id === lastColorId.value)

    lastColorId.value = selectedColor.id
    return selectedColor
  }

  /**
   * 执行一次随机抽取并更新当前颜色
   *
   * 调用后会更新响应式的 `currentColor`，视图会自动刷新。
   * 若颜色列表为空，`currentColor` 将保持为 null，视图可据此展示空状态。
   *
   * @returns 本次抽到的颜色项；若颜色列表为空则返回 null
   */
  function pickRandomColor(): ColorItem | null {
    const color = getRandomColor()
    currentColor.value = color
    return color
  }

  return {
    currentColor,
    pickRandomColor,
  }
}
