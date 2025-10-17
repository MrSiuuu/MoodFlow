import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('light')
  const isChanging = ref(false)

  // Initialiser le thème
  const initTheme = () => {
    if (typeof window === 'undefined') return

    // Lire le thème sauvegardé
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      currentTheme.value = savedTheme
    } else {
      // Détecter le thème système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
    }

    // Appliquer immédiatement
    applyTheme(currentTheme.value)
  }

  // Appliquer le thème au DOM
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Changer le thème
  const setTheme = (theme) => {
    isChanging.value = true
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    applyTheme(theme)
    
    setTimeout(() => {
      isChanging.value = false
    }, 300)
  }

  // Toggle entre dark et light
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Watcher pour appliquer automatiquement
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    currentTheme,
    isChanging,
    initTheme,
    setTheme,
    toggleTheme,
  }
})

