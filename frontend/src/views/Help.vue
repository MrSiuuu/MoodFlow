<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-4xl sm:text-5xl font-bold mb-6">
            Centre d'aide
          </h1>
          <p class="text-xl opacity-90">
            Trouve les réponses à tes questions
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          
          <div class="space-y-4">
            <!-- FAQ Item 1 -->
            <div class="collapse collapse-arrow bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div class="collapse-title text-xl font-medium">
                Comment enregistrer mon humeur ?
              </div>
              <div class="collapse-content">
                <p>
                  C'est très simple ! Va sur ton Dashboard et clique sur le bouton "Ajouter une humeur" 
                  pour la journée. Tu peux choisir un score de 1 à 5, ajouter une note et des tags.
                </p>
              </div>
            </div>

            <!-- FAQ Item 2 -->
            <div class="collapse collapse-arrow bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div class="collapse-title text-xl font-medium">
                Mes données sont-elles sécurisées ?
              </div>
              <div class="collapse-content">
                <p>
                  Absolument ! Tes données sont protégées par un chiffrement de niveau bancaire 
                  et la Row Level Security (RLS) de Supabase. Seul toi peux voir tes données.
                </p>
              </div>
            </div>

            <!-- FAQ Item 3 -->
            <div class="collapse collapse-arrow bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div class="collapse-title text-xl font-medium">
                Comment fonctionne l'IA personnalisée ?
              </div>
              <div class="collapse-content">
                <p>
                  L'IA analyse tes données d'humeur des 7 derniers jours pour te donner des conseils 
                  personnalisés. Elle ne partage jamais tes données et respecte ta confidentialité.
                </p>
              </div>
            </div>

            <!-- FAQ Item 4 -->
            <div class="collapse collapse-arrow bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div class="collapse-title text-xl font-medium">
                Puis-je exporter mes données ?
              </div>
              <div class="collapse-content">
                <p>
                  Oui, tu peux exporter toutes tes données depuis la page Profil. 
                  Nous respectons le RGPD et ton droit à la portabilité des données.
                </p>
              </div>
            </div>

            <!-- FAQ Item 5 -->
            <div class="collapse collapse-arrow bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div class="collapse-title text-xl font-medium">
                L'application est-elle gratuite ?
              </div>
              <div class="collapse-content">
                <p>
                  Oui, MoodFlow est entièrement gratuit ! C'est un projet open-source 
                  développé dans le cadre d'un hackathon pour promouvoir le bien-être mental.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12">Besoin d'aide ?</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Contact Info -->
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Contactez-nous</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>contact@moodflow.app</span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Réponse sous 24h</span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Montpellier, France</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h3 class="card-title">Actions rapides</h3>
                <div class="space-y-3">
                  <RouterLink to="/tutorial" class="btn btn-outline w-full justify-start">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    Tutoriel complet
                  </RouterLink>
                  
                  <RouterLink to="/faq" class="btn btn-outline w-full justify-start">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    FAQ détaillée
                  </RouterLink>
                  
                  <RouterLink to="/about" class="btn btn-outline w-full justify-start">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    À propos du projet
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Pas de logique particulière pour cette page
</script>
