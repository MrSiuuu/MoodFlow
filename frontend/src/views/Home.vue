<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero min-h-screen bg-base-100">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <!-- Logo et titre -->
          <div class="mb-8 px-4">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4 animate-fade-in">
              🌈 MoodFlow
            </h1>
            <p class="text-lg sm:text-xl lg:text-2xl text-base-content/80 mb-2 animate-slide-up">
              Ton journal d'humeur intelligent, sécurisé et connecté
            </p>
            <p class="text-sm sm:text-base lg:text-lg text-base-content/60 animate-slide-up" style="animation-delay: 0.2s">
              Suis ton humeur quotidienne, analyse tes tendances et découvre des insights personnalisés grâce à l'IA
            </p>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up px-4" style="animation-delay: 0.4s">
            <RouterLink 
              v-if="!isAuthenticated"
              to="/register" 
              class="btn btn-primary btn-lg px-4 sm:px-8 animate-bounce-gentle w-full sm:w-auto"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-sm sm:text-base">Commencer maintenant</span>
            </RouterLink>
            <RouterLink 
              v-if="!isAuthenticated"
              to="/login" 
              class="btn btn-outline btn-lg px-4 sm:px-8 w-full sm:w-auto"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              <span class="text-sm sm:text-base">Se connecter</span>
            </RouterLink>
            <RouterLink 
              v-else
              :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
              class="btn btn-primary btn-lg px-4 sm:px-8 animate-bounce-gentle w-full sm:w-auto"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
              </svg>
              <span class="text-sm sm:text-base">Aller au Dashboard</span>
            </RouterLink>
          </div>
          
          <!-- Features Preview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 animate-slide-up px-4" style="animation-delay: 0.6s">
            <div class="card bg-base-100/80 backdrop-blur-sm shadow-xl">
              <div class="card-body text-center p-4 sm:p-6">
                <div class="text-3xl sm:text-4xl mb-4">📊</div>
                <h3 class="card-title justify-center text-lg sm:text-xl">Analytics</h3>
                <p class="text-sm sm:text-base">Visualise tes tendances d'humeur avec des graphiques interactifs et des statistiques détaillées.</p>
              </div>
            </div>
            
            <div class="card bg-base-100/80 backdrop-blur-sm shadow-xl">
              <div class="card-body text-center p-4 sm:p-6">
                <div class="text-3xl sm:text-4xl mb-4">🤖</div>
                <h3 class="card-title justify-center text-lg sm:text-xl">IA Personnalisée</h3>
                <p class="text-sm sm:text-base">Chat avec une IA qui comprend tes données et te donne des conseils personnalisés.</p>
              </div>
            </div>
            
            <div class="card bg-base-100/80 backdrop-blur-sm shadow-xl sm:col-span-2 lg:col-span-1">
              <div class="card-body text-center p-4 sm:p-6">
                <div class="text-3xl sm:text-4xl mb-4">🔒</div>
                <h3 class="card-title justify-center text-lg sm:text-xl">Sécurisé</h3>
                <p class="text-sm sm:text-base">Tes données sont protégées avec un chiffrement de niveau bancaire et une authentification sécurisée.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Pourquoi choisir MoodFlow ?</h2>
          <p class="text-xl text-base-content/70">Une solution complète pour ton bien-être mental</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Suivi Simple</h3>
            <p class="text-base-content/70">Enregistre ton humeur en quelques clics avec des emojis intuitifs.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Insights IA</h3>
            <p class="text-base-content/70">Découvre des patterns et reçois des conseils personnalisés.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Privé & Sécurisé</h3>
            <p class="text-base-content/70">Tes données restent privées avec un chiffrement de bout en bout.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Bien-être</h3>
            <p class="text-base-content/70">Améliore ton bien-être mental en comprenant tes émotions.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Final -->
    <section class="py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-4">Prêt à commencer ton voyage ?</h2>
        <p class="text-xl mb-8 opacity-90">Rejoins des milliers d'utilisateurs qui prennent soin de leur bien-être mental</p>
        <RouterLink 
          v-if="!isAuthenticated"
          to="/register" 
          class="btn btn-accent btn-lg px-8 text-lg"
        >
          Créer mon compte gratuit
        </RouterLink>
        <RouterLink 
          v-else
          :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
          class="btn btn-accent btn-lg px-8 text-lg"
        >
          Aller au Dashboard
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>
