import { ref, watch, computed } from 'vue'
import type { ColorItem } from '@/types/color'
import { useColors } from './useColors'

const STORAGE_KEY = 'traditional-color-favorites'

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter((id) => typeof id === 'string')
      }
    }
  } catch (e) {
    console.warn('Failed to parse favorites from localStorage', e)
  }
  return []
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch (e) {
    console.warn('Failed to save favorites to localStorage', e)
  }
}

const favoriteIds = ref<string[]>(loadFromStorage())

watch(
  favoriteIds,
  (newIds) => {
    saveToStorage(newIds)
  },
  { deep: true }
)

export function useFavorites() {
  const { allColors } = useColors()

  const favoriteColors = computed<ColorItem[]>(() => {
    return favoriteIds.value
      .map((id) => allColors.value.find((c) => c.id === id))
      .filter((c): c is ColorItem => !!c)
  })

  const favoriteCount = computed(() => favoriteIds.value.length)

  function isFavorite(id: string): boolean {
    return favoriteIds.value.includes(id)
  }

  function addFavorite(id: string) {
    if (!isFavorite(id)) {
      favoriteIds.value.push(id)
    }
  }

  function removeFavorite(id: string) {
    const idx = favoriteIds.value.indexOf(id)
    if (idx !== -1) {
      favoriteIds.value.splice(idx, 1)
    }
  }

  function toggleFavorite(id: string) {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  function clearFavorites() {
    favoriteIds.value = []
  }

  return {
    favoriteIds,
    favoriteColors,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }
}
