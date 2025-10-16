<template>
  <div class="navbar bg-base-100 shadow-sm">
    <!-- Mobile menu button -->
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <template v-if="isAuthenticated">
            <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
            <li><RouterLink to="/analytics">Analytics</RouterLink></li>
            
            <li><RouterLink to="/calendar">Calendrier</RouterLink></li>
            <li><RouterLink to="/about">À propos</RouterLink></li>
            <li class="divider"></li>
            <li><RouterLink to="/profile">Profil</RouterLink></li>
            <li><button @click="handleSignOut" class="text-error">Déconnexion</button></li>
          </template>
          <template v-else>
            <li><RouterLink to="/about">À propos</RouterLink></li>
            <li class="divider"></li>
            <li><RouterLink to="/login">Connexion</RouterLink></li>
            <li><RouterLink to="/register">S'inscrire</RouterLink></li>
          </template>
        </ul>
      </div>
      <RouterLink to="/" class="btn btn-ghost text-xl font-bold text-gradient">
        🌈 MoodFlow
      </RouterLink>
    </div>
    
    <!-- Desktop menu -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <RouterLink to="/dashboard" class="btn btn-ghost">
            Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/analytics" class="btn btn-ghost">
            Analytics
          </RouterLink>
        </li>
        
        <li>
          <RouterLink to="/calendar" class="btn btn-ghost">
            Calendrier
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/about" class="btn btn-ghost">
            À propos
          </RouterLink>
        </li>
      </ul>
    </div>
    
    <!-- User menu -->
    <div class="navbar-end">
      <!-- Si connecté -->
      <div v-if="isAuthenticated" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
            <span class="text-sm sm:text-lg font-bold">
              {{ userInitials }}
            </span>
          </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <RouterLink to="/profile" class="justify-between">
              <span>Profil</span>
            </RouterLink>
          </li>
          <li>
            <button @click="handleSignOut" class="text-error">
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- Si pas connecté -->
      <div v-else class="hidden sm:flex gap-2">
        <RouterLink to="/login" class="btn btn-ghost btn-sm">
          Connexion
        </RouterLink>
        <RouterLink to="/register" class="btn btn-primary btn-sm">
          S'inscrire
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const userInitials = computed(() => {
  const user = authStore.userProfile || authStore.user
  if (!user?.email) return '?'
  return user.email.charAt(0).toUpperCase()
})

const handleSignOut = async () => {
  await authStore.signOut()
}
</script>
