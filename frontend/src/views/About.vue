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
              </div>
              <h3 class="card-title justify-center text-lg">Issa </h3>
              <p class="text-primary font-semibold text-sm">Développeur Full-Stack</p>
              <p class="text-xs text-base-content/70">
                Expert en développement web moderne avec Vue.js, Node.js et architectures microservices.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">Vue.js</div>
                <div class="badge badge-outline badge-sm">Node.js</div>
              </div>
            </div>
          </div>

           <!-- Data Scientist -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4 mx-auto">
              </div>
              <h3 class="card-title justify-center text-lg">Frédéric </h3>
              <p class="text-secondary font-semibold text-sm">Développeur Full-Stack</p>
              <p class="text-xs text-base-content/70">
                Expert en développement web moderne avec Vue.js, Node.js et architectures microservices.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">Vue.js</div>
                <div class="badge badge-outline badge-sm">Node.js</div>
              </div>
            </div>
          </div>

          <!-- IA Engineer -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4">
              </div>
              <h3 class="card-title justify-center text-lg">Jean</h3>
              <p class="text-accent font-semibold text-sm">Développeur Full-Stack</p>
              <p class="text-xs text-base-content/70">
                Expert en développement web moderne avec Vue.js, Node.js et architectures microservices.
              </p>
              <div class="card-actions justify-center mt-3">
                <div class="badge badge-outline badge-sm">Vue.js</div>
                <div class="badge badge-outline badge-sm">Node.js</div>
              </div>
            </div>
          </div>

          <!-- DevOps/Infra -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="avatar mb-4">
              </div>
              <h3 class="card-title justify-center text-lg">Florent </h3>
              <p class="text-info font-semibold text-sm">infrastructure & Cloud</p>
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>
