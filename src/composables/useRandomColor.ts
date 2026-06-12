import { ref } from 'vue'
import type { ColorItem } from '@/types/color'
import { useColors } from './useColors'

export function useRandomColor() {
  const { allColors } = useColors()
  const currentColor = ref<ColorItem | null>(null)
  const lastColorId = ref<string | null>(null)

  function getRandomColor(): ColorItem {
    const colors = allColors.value
    if (colors.length === 0) {
      throw new Error('No colors available')
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

  function pickRandomColor() {
    currentColor.value = getRandomColor()
    return currentColor.value
  }

  return {
    currentColor,
    pickRandomColor,
  }
}
