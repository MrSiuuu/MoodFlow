<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button 
      @click="toggleTheme"
      class="btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
      :class="{ 'animate-bounce-gentle': isAnimating }"
    >
      <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isDark = ref(false)
const isAnimating = ref(false)

// Détecter le thème initial
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  updateTheme()
})

const toggleTheme = () => {
  isAnimating.value = true
  isDark.value = !isDark.value
  updateTheme()
  
  // Arrêter l'animation après un délai
  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

const updateTheme = () => {
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>
