<template>
  <div id="app" :data-theme="themeStore.currentTheme" class="min-h-screen bg-base-100 transition-colors duration-200">
    <!-- Navbar sticky (visible partout) -->
    <Navbar v-if="!isFullscreenRoute" />
    
    <!-- Contenu principal - Mobile first avec padding responsive -->
    <main class="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    
    <!-- Footer (visible partout sauf sur certaines pages) -->
    <Footer v-if="!isFullscreenRoute && !isAuthRoute" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Routes en plein écran (pas de navbar/footer)
const isFullscreenRoute = computed(() => {
  return false // Pour l'instant aucune route en fullscreen
})

// Routes d'authentification (pas de footer)
const isAuthRoute = computed(() => {
  return ['login', 'register', 'admin-login'].includes(route.name)
})

// Initialisation au montage
onMounted(() => {
  // Initialiser le thème (synchrone et rapide)
  themeStore.initTheme()
  
  // Note: L'auth est initialisé dans le router guard avant chaque navigation
})
</script>

<style scoped>
/* Transitions entre les pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animations personnalisées */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Classes utilitaires pour animations */
:global(.animate-fade-in) {
  animation: fade-in 0.6s ease-out;
}

:global(.animate-slide-up) {
  animation: slide-up 0.8s ease-out;
}

:global(.animate-bounce-gentle) {
  animation: bounce-gentle 2s ease-in-out infinite;
}

/* Gradient de texte */
:global(.text-gradient) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

