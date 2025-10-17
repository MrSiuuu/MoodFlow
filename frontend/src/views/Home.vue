<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero min-h-screen bg-gradient-to-br from-sky-100/50 to-orange-100/50 dark:bg-gradient-to-br dark:from-base-300 dark:to-base-200">
      <div class="hero-content text-center max-w-5xl px-4">
        <div class="w-full">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-orange-600 bg-clip-text text-transparent">
            MoodFlow
          </h1>
          <p class="text-xl sm:text-2xl lg:text-3xl mb-4 text-base-content/90">
            Ton journal d'humeur intelligent, sécurisé et connecté
          </p>
          <p class="text-base sm:text-lg mb-8 text-base-content/70 max-w-3xl mx-auto">
            Suis ton humeur quotidienne, analyse tes tendances émotionnelles et découvre des insights personnalisés grâce à l'intelligence artificielle. Simple, privé et efficace.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <RouterLink 
              v-if="!isAuthenticated"
              to="/register" 
              class="btn btn-lg bg-sky-600 hover:bg-sky-700 text-white border-0 px-8"
            >
              Commencer gratuitement
            </RouterLink>
            <RouterLink 
              v-if="!isAuthenticated"
              to="/login" 
              class="btn btn-lg btn-outline border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white px-8"
            >
              Se connecter
            </RouterLink>
            <RouterLink 
              v-else
              :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
              class="btn btn-lg bg-sky-600 hover:bg-sky-700 text-white border-0 px-8"
            >
              Accéder à mon dashboard
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 sm:py-24 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-base-content">
            Une solution complète pour ton bien-être
          </h2>
          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
            Conçu pour t'aider à mieux comprendre tes émotions et améliorer ton quotidien
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <!-- Feature 1 -->
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
            <div class="card-body p-6 sm:p-8">
              <div class="w-14 h-14 bg-sky-600/10 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-base-content">Suivi Simple et Rapide</h3>
              <p class="text-base-content/70">
                Enregistre ton humeur en quelques secondes avec une interface intuitive. Ajoute des notes, tags et contexte selon tes besoins.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
            <div class="card-body p-6 sm:p-8">
              <div class="w-14 h-14 bg-orange-600/10 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-base-content">Analyses Visuelles</h3>
              <p class="text-base-content/70">
                Visualise tes tendances avec des graphiques interactifs. Identifie les patterns et comprends ce qui influence ton humeur.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
            <div class="card-body p-6 sm:p-8">
              <div class="w-14 h-14 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-base-content">Assistant IA Personnalisé</h3>
              <p class="text-base-content/70">
                Dialogue avec une IA qui analyse tes données pour te donner des conseils adaptés et bienveillants.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
            <div class="card-body p-6 sm:p-8">
              <div class="w-14 h-14 bg-base-content/10 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-base-content">Confidentialité Garantie</h3>
              <p class="text-base-content/70">
                Tes données sont chiffrées et protégées. Seul toi as accès à ton journal. Conforme RGPD.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
            <div class="card-body p-6 sm:p-8">
              <div class="w-14 h-14 bg-sky-600/10 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-base-content">Vue Calendrier</h3>
              <p class="text-base-content/70">
                Consulte ton historique sur une vue mensuelle. Repère facilement tes meilleures et pires périodes.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-base-300">
            <div class="card-body p-6 sm:p-8">
              <div class="w-14 h-14 bg-orange-600/10 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-base-content">Mobile-First</h3>
              <p class="text-base-content/70">
                Optimisé pour smartphone. Enregistre ton humeur n'importe où, n'importe quand, en quelques taps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 sm:py-24 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-base-content">
            Ce que disent nos utilisateurs
          </h2>
          <p class="text-lg text-base-content/70">
            Retours d'expérience de la communauté MoodFlow
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <!-- Testimonial 1 -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="mb-4">
                <div class="font-semibold text-base-content text-lg">Marie L.</div>
                <div class="text-sm text-base-content/60">Utilisatrice depuis 4 mois</div>
              </div>
              <p class="text-base-content/80 text-sm leading-relaxed mb-4">
                "MoodFlow m'a vraiment aidée à identifier les patterns dans mes humeurs. J'ai découvert que le manque de sommeil impactait beaucoup mon moral. Maintenant je gère mieux."
              </p>
              <div class="rating rating-sm">
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="mb-4">
                <div class="font-semibold text-base-content text-lg">Thomas B.</div>
                <div class="text-sm text-base-content/60">Utilisateur depuis 6 mois</div>
              </div>
              <p class="text-base-content/80 text-sm leading-relaxed mb-4">
                "Interface claire et rapide. J'enregistre mon humeur tous les matins en 30 secondes. Les graphiques m'aident à voir ma progression sur le long terme."
              </p>
              <div class="rating rating-sm">
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body p-6">
              <div class="mb-4">
                <div class="font-semibold text-base-content text-lg">Sarah K.</div>
                <div class="text-sm text-base-content/60">Utilisatrice depuis 2 mois</div>
              </div>
              <p class="text-base-content/80 text-sm leading-relaxed mb-4">
                "L'assistant IA est bluffant. Il me donne des conseils vraiment personnalisés basés sur mes données. Et surtout, mes infos restent privées."
              </p>
              <div class="rating rating-sm">
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="py-16 sm:py-24 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-base-content">
            Comment ça marche ?
          </h2>
          <p class="text-lg text-base-content/70">
            Trois étapes simples pour commencer
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="text-center">
              <div class="w-16 h-16 bg-sky-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 class="text-xl font-semibold mb-2 text-base-content">Inscris-toi</h3>
              <p class="text-base-content/70">
                Crée ton compte en 30 secondes. Email et mot de passe suffisent.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center">
              <div class="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 class="text-xl font-semibold mb-2 text-base-content">Enregistre</h3>
              <p class="text-base-content/70">
                Note ton humeur chaque jour. Ajoute du contexte si tu le souhaites.
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 class="text-xl font-semibold mb-2 text-base-content">Analyse</h3>
              <p class="text-base-content/70">
                Découvre tes tendances, reçois des insights et améliore ton bien-être.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why MoodFlow -->
    <section class="py-16 sm:py-24 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-base-content">
              Pourquoi MoodFlow ?
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-semibold mb-1 text-base-content">100% Gratuit</h4>
                <p class="text-sm text-base-content/70">
                  Aucun frais caché. Toutes les fonctionnalités accessibles gratuitement.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-semibold mb-1 text-base-content">Open Source</h4>
                <p class="text-sm text-base-content/70">
                  Code transparent et auditable. Contribue sur GitHub si tu le souhaites.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-semibold mb-1 text-base-content">Sans Publicité</h4>
                <p class="text-sm text-base-content/70">
                  Aucune publicité. Ton expérience n'est jamais interrompue.
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-semibold mb-1 text-base-content">Données Exportables</h4>
                <p class="text-sm text-base-content/70">
                  Tes données t'appartiennent. Exporte-les quand tu veux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Final -->
    <section class="py-16 sm:py-24 bg-gradient-to-r from-sky-600 to-blue-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-white">
          Prêt à prendre soin de ton bien-être ?
        </h2>
        <p class="text-lg sm:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Rejoins la communauté MoodFlow et commence à mieux comprendre tes émotions dès aujourd'hui
        </p>
        <RouterLink 
          v-if="!isAuthenticated"
          to="/register" 
          class="btn btn-lg bg-white text-sky-700 hover:bg-gray-100 border-0 px-8 shadow-lg"
        >
          Créer mon compte gratuitement
        </RouterLink>
        <RouterLink 
          v-else
          :to="authStore.isAdmin ? '/admin' : '/dashboard'" 
          class="btn btn-lg bg-white text-sky-700 hover:bg-gray-100 border-0 px-8 shadow-lg"
        >
          Accéder à mon dashboard
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

<style scoped>
/* Animations smooth */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}
</style>
