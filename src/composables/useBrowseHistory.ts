import { ref, watch, computed } from 'vue'
import type { BrowseHistoryItem, ColorItem } from '@/types/color'
import { useColors } from './useColors'

const STORAGE_KEY = 'traditional-color-browse-history'
const UNREAD_KEY = 'traditional-color-browse-unread-count'
const MAX_HISTORY = 20

function loadFromStorage(): BrowseHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => typeof item === 'object' && item !== null)
          .filter((item) => typeof item.colorId === 'string' && typeof item.viewedAt === 'number')
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, MAX_HISTORY)
      }
    }
  } catch (e) {
    console.warn('Failed to parse browse history from localStorage', e)
  }
  return []
}

function saveToStorage(history: BrowseHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Failed to save browse history to localStorage', e)
  }
}

function loadUnreadCount(): number {
  try {
    const raw = localStorage.getItem(UNREAD_KEY)
    if (raw) {
      const parsed = parseInt(raw, 10)
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to parse unread count from localStorage', e)
  }
  return 0
}

function saveUnreadCount(count: number) {
  try {
    localStorage.setItem(UNREAD_KEY, String(count))
  } catch (e) {
    console.warn('Failed to save unread count to localStorage', e)
  }
}

const historyList = ref<BrowseHistoryItem[]>(loadFromStorage())
const unreadCount = ref<number>(loadUnreadCount())

watch(
  historyList,
  (newList) => {
    saveToStorage(newList)
  },
  { deep: true }
)

watch(
  unreadCount,
  (newCount) => {
    saveUnreadCount(newCount)
  }
)

export function useBrowseHistory() {
  const { allColors, getColorById } = useColors()

  const historyWithColors = computed<Array<{ item: BrowseHistoryItem; color: ColorItem }>>(() => {
    return historyList.value
      .map((item) => ({
        item,
        color: getColorById(item.colorId),
      }))
      .filter((entry): entry is { item: BrowseHistoryItem; color: ColorItem } => !!entry.color)
  })

  const historyCount = computed(() => historyList.value.length)

  function addHistory(colorId: string) {
    const existingIndex = historyList.value.findIndex((h) => h.colorId === colorId)
    if (existingIndex !== -1) {
      historyList.value.splice(existingIndex, 1)
    }

    historyList.value.unshift({
      colorId,
      viewedAt: Date.now(),
    })

    if (historyList.value.length > MAX_HISTORY) {
      historyList.value.splice(MAX_HISTORY)
    }

    unreadCount.value = Math.min(unreadCount.value + 1, MAX_HISTORY)
  }

  function removeHistory(colorId: string) {
    const idx = historyList.value.findIndex((h) => h.colorId === colorId)
    if (idx !== -1) {
      historyList.value.splice(idx, 1)
    }
  }

  function clearHistory() {
    historyList.value = []
    unreadCount.value = 0
  }

  function markAllAsRead() {
    unreadCount.value = 0
  }

  return {
    historyList,
    historyWithColors,
    historyCount,
    unreadCount,
    addHistory,
    removeHistory,
    clearHistory,
    markAllAsRead,
  }
}
