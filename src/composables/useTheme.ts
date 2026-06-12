import { ref, watch, onMounted, onUnmounted } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'traditional-color-browser-theme'
const themeMode = ref<ThemeMode>('light')
const isDark = ref(false)
let mediaQuery: MediaQueryList | null = null

function resolveDarkMode(mode: ThemeMode): boolean {
  if (mode === 'system') {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return mode === 'dark'
}

function applyTheme(dark: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (dark) {
    root.classList.add('theme-dark')
    root.classList.remove('theme-light')
  } else {
    root.classList.add('theme-light')
    root.classList.remove('theme-dark')
  }
}

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function initTheme() {
  const stored = getStoredTheme()
  themeMode.value = stored
  const dark = resolveDarkMode(stored)
  isDark.value = dark
  applyTheme(dark)
}

initTheme()

function handleSystemThemeChange(e: MediaQueryListEvent) {
  if (themeMode.value === 'system') {
    const dark = e.matches
    isDark.value = dark
    applyTheme(dark)
  }
}

export function useTheme() {
  onMounted(() => {
    if (typeof window !== 'undefined' && !mediaQuery) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    }
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
      mediaQuery = null
    }
  })

  watch(
    () => themeMode.value,
    (mode) => {
      const dark = resolveDarkMode(mode)
      isDark.value = dark
      applyTheme(dark)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, mode)
      }
    },
    { immediate: false }
  )

  function toggleTheme() {
    if (themeMode.value === 'light') {
      themeMode.value = 'dark'
    } else if (themeMode.value === 'dark') {
      themeMode.value = 'system'
    } else {
      themeMode.value = 'light'
    }
  }

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
  }

  return {
    themeMode,
    isDark,
    toggleTheme,
    setTheme,
  }
}
