<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            À propos de MoodFlow
          </h1>
          <p class="text-xl sm:text-2xl opacity-90">
            Ton journal d'humeur intelligent, sécurisé et connecté
          </p>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-6">Notre Mission</h2>
          <p class="text-lg text-base-content/70 leading-relaxed">
            MoodFlow a été créé dans le cadre d'un hackathon d'une journée pour révolutionner 
            la façon dont nous suivons et comprenons notre bien-être mental. Notre objectif 
            est de rendre le suivi de l'humeur simple, intuitif et enrichissant grâce à 
            l'intelligence artificielle et à des analyses personnalisées.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">🎯</div>
              <h3 class="card-title justify-center">Simplicité</h3>
              <p>Interface intuitive pour enregistrer ton humeur en quelques clics</p>
            </div>
          </div>
          
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">🤖</div>
              <h3 class="card-title justify-center">Intelligence</h3>
              <p>IA personnalisée qui analyse tes données et te donne des conseils</p>
            </div>
          </div>
          
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">🔒</div>
              <h3 class="card-title justify-center">Sécurité</h3>
              <p>Données protégées avec chiffrement de niveau bancaire</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-6">Notre Équipe</h2>
          <p class="text-lg text-base-content/70">
            Une équipe passionnée dédiée à ton bien-être mental
          </p>
        </div>

        <!-- Team Members -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <!-- Développeur -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4">
                <div class="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <span class="text-xl font-bold">DV</span>
                </div>
              </div>
              <h3 class="card-title justify-center text-lg">Alex Martin</h3>
              <p class="text-primary font-semibold text-sm">Développeur Full-Stack</p>
              <p class="text-xs text-base-content/70">
                Expert en développement web moderne avec Vue.js, Node.js et architectures microservices.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">Vue.js</div>
                <div class="badge badge-outline badge-sm">Node.js</div>
                <div class="badge badge-outline badge-sm">TypeScript</div>
              </div>
            </div>
          </div>

          <!-- Data Scientist -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4">
                <div class="w-20 h-20 rounded-full bg-secondary text-secondary-content flex items-center justify-center">
                  <span class="text-xl font-bold">DS</span>
                </div>
              </div>
              <h3 class="card-title justify-center text-lg">Sarah Chen</h3>
              <p class="text-secondary font-semibold text-sm">Data Scientist</p>
              <p class="text-xs text-base-content/70">
                Spécialisée en analyse de données, machine learning et visualisation pour l'IA personnalisée.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">Python</div>
                <div class="badge badge-outline badge-sm">ML</div>
                <div class="badge badge-outline badge-sm">Analytics</div>
              </div>
            </div>
          </div>

          <!-- IA Engineer -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4">
                <div class="w-20 h-20 rounded-full bg-accent text-accent-content flex items-center justify-center">
                  <span class="text-xl font-bold">AI</span>
                </div>
              </div>
              <h3 class="card-title justify-center text-lg">Marcus Johnson</h3>
              <p class="text-accent font-semibold text-sm">IA Engineer</p>
              <p class="text-xs text-base-content/70">
                Expert en intelligence artificielle, NLP et intégration d'APIs pour des conseils personnalisés.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">OpenAI</div>
                <div class="badge badge-outline badge-sm">NLP</div>
                <div class="badge badge-outline badge-sm">APIs</div>
              </div>
            </div>
          </div>

          <!-- DevOps/Infra -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4">
                <div class="w-20 h-20 rounded-full bg-info text-info-content flex items-center justify-center">
                  <span class="text-xl font-bold">DO</span>
                </div>
              </div>
              <h3 class="card-title justify-center text-lg">Emma Rodriguez</h3>
              <p class="text-info font-semibold text-sm">DevOps & Cloud</p>
              <p class="text-xs text-base-content/70">
                Spécialiste en déploiement, infrastructure cloud et sécurité pour une application scalable.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">Docker</div>
                <div class="badge badge-outline badge-sm">AWS</div>
                <div class="badge badge-outline badge-sm">CI/CD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Stack -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-6">Technologies Utilisées</h2>
          <p class="text-lg text-base-content/70">
            Stack moderne et performante pour une expérience utilisateur optimale
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <!-- Frontend -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">⚡</div>
              <h3 class="card-title justify-center">Frontend</h3>
              <div class="space-y-2">
                <div class="badge badge-primary">Vue 3</div>
                <div class="badge badge-secondary">Vite</div>
                <div class="badge badge-accent">Tailwind CSS</div>
                <div class="badge badge-info">daisyUI</div>
                <div class="badge badge-success">Chart.js</div>
              </div>
            </div>
          </div>

          <!-- Backend -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">🔧</div>
              <h3 class="card-title justify-center">Backend</h3>
              <div class="space-y-2">
                <div class="badge badge-primary">Node.js</div>
                <div class="badge badge-secondary">Express</div>
                <div class="badge badge-accent">Zod</div>
                <div class="badge badge-info">Pino</div>
                <div class="badge badge-success">Helmet</div>
              </div>
            </div>
          </div>

          <!-- Database -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">🗄️</div>
              <h3 class="card-title justify-center">Base de Données</h3>
              <div class="space-y-2">
                <div class="badge badge-primary">Supabase</div>
                <div class="badge badge-secondary">PostgreSQL</div>
                <div class="badge badge-accent">RLS</div>
                <div class="badge badge-info">Auth</div>
                <div class="badge badge-success">Real-time</div>
              </div>
            </div>
          </div>

          <!-- AI & Deploy -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="text-4xl mb-4">🚀</div>
              <h3 class="card-title justify-center">IA & Déploiement</h3>
              <div class="space-y-2">
                <div class="badge badge-primary">OpenAI</div>
                <div class="badge badge-secondary">Docker</div>
                <div class="badge badge-accent">Coolify</div>
                <div class="badge badge-info">VPS</div>
                <div class="badge badge-success">CI/CD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Stats -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-6">Le Projet en Chiffres</h2>
          <p class="text-lg text-base-content/70">
            Un projet ambitieux réalisé en un temps record
          </p>
        </div>

        <div class="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="stat bg-base-100 rounded-lg shadow">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <div class="stat-title">Temps de développement</div>
            <div class="stat-value text-primary">24h</div>
            <div class="stat-desc">Hackathon intensif</div>
          </div>

          <div class="stat bg-base-100 rounded-lg shadow">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Fonctionnalités</div>
            <div class="stat-value text-secondary">15+</div>
            <div class="stat-desc">MVP + Bonus</div>
          </div>

          <div class="stat bg-base-100 rounded-lg shadow">
            <div class="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="stat-title">Technologies</div>
            <div class="stat-value text-accent">20+</div>
            <div class="stat-desc">Stack moderne</div>
          </div>

          <div class="stat bg-base-100 rounded-lg shadow">
            <div class="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="stat-title">Sécurité</div>
            <div class="stat-value text-info">100%</div>
            <div class="stat-desc">RLS + Chiffrement</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-6">Prêt à rejoindre l'aventure ?</h2>
        <p class="text-xl mb-8 opacity-90">
          Commence ton voyage vers un meilleur bien-être mental dès aujourd'hui
        </p>
        <RouterLink 
          v-if="!isAuthenticated"
          to="/register" 
          class="btn btn-accent btn-lg px-8 text-lg"
        >
          Créer mon compte gratuit
        </RouterLink>
        <RouterLink 
          v-else
          to="/dashboard" 
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
