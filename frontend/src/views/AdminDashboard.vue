<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header Admin -->
    <div class="bg-gradient-to-r from-error to-warning text-error-content py-4">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <h1 class="text-2xl font-bold">Administration</h1>
          </div>
          <div class="text-sm">
            Connecté en tant qu'administrateur
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6">Vue d'ensemble</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Users -->
          <div class="stat bg-base-100 shadow rounded-lg">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Utilisateurs</div>
            <div class="stat-value text-primary">{{ stats.totalUsers }}</div>
            <div class="stat-desc">{{ stats.newUsersToday }} nouveaux aujourd'hui</div>
          </div>

          <!-- Total Mood Entries -->
          <div class="stat bg-base-100 shadow rounded-lg">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="stat-title">Entrées d'humeur</div>
            <div class="stat-value text-secondary">{{ stats.totalMoodEntries }}</div>
            <div class="stat-desc">{{ stats.entriesToday }} aujourd'hui</div>
          </div>

          <!-- Average Mood -->
          <div class="stat bg-base-100 shadow rounded-lg">
            <div class="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Humeur moyenne</div>
            <div class="stat-value text-accent">{{ stats.averageMood }}</div>
            <div class="stat-desc">Sur 5.0</div>
          </div>

          <!-- Active Users -->
          <div class="stat bg-base-100 shadow rounded-lg">
            <div class="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="stat-title">Utilisateurs actifs</div>
            <div class="stat-value text-info">{{ stats.activeUsers7d }}</div>
            <div class="stat-desc">7 derniers jours</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts Section -->
    <section class="py-8 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Mood Distribution Chart -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Distribution des humeurs</h3>
              <div class="h-64 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">📊</div>
                  <p class="text-base-content/70">Graphique en cours de développement</p>
                </div>
              </div>
            </div>
          </div>

          <!-- User Activity Chart -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Activité des utilisateurs</h3>
              <div class="h-64 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">📈</div>
                  <p class="text-base-content/70">Graphique en cours de développement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Users Management -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Gestion des utilisateurs</h2>
          <button class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Exporter les données
          </button>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Inscription</th>
                    <th>Dernière activité</th>
                    <th>Entrées</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <span class="text-sm font-bold">{{ user.display_name?.charAt(0) || '?' }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">{{ user.display_name || 'Utilisateur' }}</div>
                          <div class="text-sm opacity-50">{{ user.role }}</div>
                        </div>
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>{{ formatDate(user.created_at) }}</td>
                    <td>{{ formatDate(user.last_activity) }}</td>
                    <td>
                      <div class="badge badge-outline">{{ user.mood_entries_count }}</div>
                    </td>
                    <td>
                      <div class="flex gap-2">
                        <button class="btn btn-ghost btn-xs">Voir</button>
                        <button class="btn btn-ghost btn-xs text-error">Suspendre</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- System Status -->
    <section class="py-8 bg-base-200">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6">État du système</h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-success">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Base de données
              </h3>
              <p class="text-success">Opérationnelle</p>
              <div class="text-sm text-base-content/70">Dernière vérification: {{ new Date().toLocaleTimeString() }}</div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-success">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                API Backend
              </h3>
              <p class="text-success">Opérationnelle</p>
              <div class="text-sm text-base-content/70">Temps de réponse: 45ms</div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-warning">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                IA Service
              </h3>
              <p class="text-warning">Limité</p>
              <div class="text-sm text-base-content/70">Quota: 85% utilisé</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Données réactives
const stats = ref({
  totalUsers: 0,
  newUsersToday: 0,
  totalMoodEntries: 0,
  entriesToday: 0,
  averageMood: 0,
  activeUsers7d: 0
})

const users = ref([])

// Computed
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Méthodes
const loadStats = async () => {
  try {
    // Simulation de données - à remplacer par un vrai appel API
    stats.value = {
      totalUsers: 1247,
      newUsersToday: 23,
      totalMoodEntries: 15689,
      entriesToday: 89,
      averageMood: 3.4,
      activeUsers7d: 892
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const loadUsers = async () => {
  try {
    // Simulation de données - à remplacer par un vrai appel API
    users.value = [
      {
        id: 1,
        display_name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        role: 'user',
        created_at: '2024-01-10T10:30:00Z',
        last_activity: '2024-01-16T14:22:00Z',
        mood_entries_count: 45
      },
      {
        id: 2,
        display_name: 'Marie Martin',
        email: 'marie.martin@email.com',
        role: 'user',
        created_at: '2024-01-12T09:15:00Z',
        last_activity: '2024-01-16T11:45:00Z',
        mood_entries_count: 32
      },
      {
        id: 3,
        display_name: 'Pierre Durand',
        email: 'pierre.durand@email.com',
        role: 'user',
        created_at: '2024-01-14T16:20:00Z',
        last_activity: '2024-01-16T08:30:00Z',
        mood_entries_count: 18
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  if (isAdmin.value) {
    loadStats()
    loadUsers()
  }
})
</script>
