<template>
  <div class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
    <!-- Mobile: Menu hamburger + Logo -->
    <div class="navbar-start">
      <!-- Menu mobile hamburger -->
      <div v-if="isAuthenticated" class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-sm lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow bg-base-100 rounded-box z-[1]">
          <!-- Menu pour utilisateurs -->
          <template v-if="!authStore.isAdmin">
            <li><RouterLink to="/dashboard">📊 Dashboard</RouterLink></li>
            <li><RouterLink to="/analytics">📈 Analytics</RouterLink></li>
            <li><RouterLink to="/calendar">📅 Calendrier</RouterLink></li>
            <li><RouterLink to="/chat">💬 Chat IA</RouterLink></li>
            <li class="divider"></li>
          </template>
          
          <!-- Menu pour admins -->
          <template v-else>
            <li><RouterLink to="/admin">🔐 Administration</RouterLink></li>
            <li class="divider"></li>
          </template>
          
          <!-- Menu commun -->
          <li><RouterLink to="/about">ℹ️ À propos</RouterLink></li>
          <li><RouterLink to="/help">❓ Aide</RouterLink></li>
          <li><RouterLink to="/contact">📧 Contact</RouterLink></li>
        </ul>
      </div>
      
      <!-- Logo -->
      <RouterLink to="/" class="btn btn-ghost text-lg sm:text-xl font-bold text-gradient px-2 sm:px-4">
        <span class="hidden sm:inline">🌈 MoodFlow</span>
        <span class="sm:hidden">🌈 MF</span>
      </RouterLink>
    </div>
    
    <!-- Desktop: Menu central (uniquement desktop) -->
    <div class="navbar-center hidden lg:flex" v-if="isAuthenticated">
      <ul class="menu menu-horizontal px-1 gap-1">
        <!-- Menu utilisateur -->
        <template v-if="!authStore.isAdmin">
          <li>
            <RouterLink to="/dashboard" class="btn btn-ghost btn-sm">
              📊 Dashboard
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/analytics" class="btn btn-ghost btn-sm">
              📈 Analytics
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/calendar" class="btn btn-ghost btn-sm">
              📅 Calendrier
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/chat" class="btn btn-ghost btn-sm">
              💬 Chat
            </RouterLink>
          </li>
        </template>
        
        <!-- Menu admin -->
        <template v-else>
          <li>
            <RouterLink to="/admin" class="btn btn-ghost btn-sm">
              🔐 Administration
            </RouterLink>
          </li>
        </template>
        
        <!-- Menu commun -->
        <li>
          <RouterLink to="/about" class="btn btn-ghost btn-sm">
            À propos
          </RouterLink>
        </li>
      </ul>
    </div>
    
    <!-- Droite: Theme Toggle + User Menu ou Connexion -->
    <div class="navbar-end gap-1 sm:gap-2">
      <!-- Theme Toggle (toujours visible) -->
      <ThemeToggle />
      
      <!-- Si connecté: Avatar + Menu -->
      <div v-if="isAuthenticated" class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
            <span class="text-sm sm:text-base font-bold">
              {{ userInitials }}
            </span>
          </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-[1]">
          <li class="menu-title">
            <span class="text-xs opacity-60">{{ authStore.userEmail }}</span>
          </li>
          <li>
            <RouterLink to="/profile" class="gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Mon Profil
            </RouterLink>
          </li>
          <li v-if="authStore.isAdmin">
            <span class="badge badge-error badge-sm">Admin</span>
          </li>
          <li class="divider"></li>
          <li>
            <button 
              @click="handleSignOut" 
              class="text-error gap-2"
              :disabled="authStore.isSigningOut"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span v-if="!authStore.isSigningOut">Déconnexion</span>
              <span v-else class="loading loading-spinner loading-xs"></span>
            </button>
          </li>
        </ul>
      </div>
      
      <!-- Si non connecté: Boutons Connexion/Inscription -->
      <div v-else class="flex gap-1 sm:gap-2">
        <RouterLink to="/login" class="btn btn-ghost btn-sm">
          <span class="hidden sm:inline">Connexion</span>
          <span class="sm:hidden text-xs">Login</span>
        </RouterLink>
        <RouterLink to="/register" class="btn btn-primary btn-sm">
          <span class="hidden sm:inline">S'inscrire</span>
          <span class="sm:hidden text-xs">Sign up</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'

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

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Assurer que la navbar reste en haut sur mobile */
.navbar {
  min-height: 3.5rem;
}

@media (max-width: 640px) {
  .navbar {
    padding: 0.5rem 0.75rem;
  }
}
</style>
