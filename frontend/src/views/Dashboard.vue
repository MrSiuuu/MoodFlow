<template>
  <div>
    <!-- Loading state -->
    <div v-if="authStore.loading" class="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div class="text-center">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="mt-4">Chargement de votre dashboard...</p>
      </div>
    </div>
    
    <!-- Redirection conditionnelle selon le rôle -->
    <AdminDashboard v-else-if="authStore.isAdmin" />
    <UserDashboard v-else-if="authStore.isAuthenticated" />
    
    <!-- Fallback si pas authentifié -->
    <div v-else class="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4">Accès non autorisé</h2>
        <p class="text-base-content/70 mb-4">Vous devez être connecté pour accéder au dashboard.</p>
        <RouterLink to="/login" class="btn btn-primary">Se connecter</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import AdminDashboard from './AdminDashboard.vue'
import UserDashboard from './UserDashboard.vue'

const authStore = useAuthStore()
</script>