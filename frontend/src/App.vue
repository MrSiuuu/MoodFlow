<template>
  <div id="app" class="min-h-screen bg-base-100">
    <!-- Navigation -->
    <Navbar v-if="!isAuthPage" />
    
    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <Footer v-if="!isAuthPage" />
    
    <!-- Theme Toggle (Floating) -->
    <ThemeToggle />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const route = useRoute()

const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'register'
})
</script>

<style>
/* Animations globales */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
