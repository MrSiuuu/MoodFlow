<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header Admin -->
    <div class="bg-gradient-to-r from-error to-warning text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <div>
              <h1 class="text-2xl font-bold">Administration MoodFlow</h1>
              <p class="text-sm opacity-90">{{ authStore.userEmail }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="refreshData" class="btn btn-sm btn-ghost text-white" :class="{ 'loading': loading }">
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !stats" class="flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Stats Overview -->
    <section v-else class="py-8">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 text-base-content">Vue d'ensemble</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <!-- Total Users -->
          <div class="stat bg-base-200 shadow-lg rounded-lg">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Utilisateurs totaux</div>
            <div class="stat-value text-primary">{{ stats?.totalUsers || 0 }}</div>
            <div class="stat-desc">+{{ stats?.newUsersToday || 0 }} aujourd'hui</div>
          </div>

          <!-- Total Mood Entries -->
          <div class="stat bg-base-200 shadow-lg rounded-lg">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="stat-title">Humeurs enregistrées</div>
            <div class="stat-value text-secondary">{{ stats?.totalMoodEntries || 0 }}</div>
            <div class="stat-desc">+{{ stats?.entriesToday || 0 }} aujourd'hui</div>
          </div>

          <!-- Average Mood -->
          <div class="stat bg-base-200 shadow-lg rounded-lg">
            <div class="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Humeur moyenne globale</div>
            <div class="stat-value text-accent">{{ stats?.averageMood || '0.0' }}</div>
            <div class="stat-desc">Sur 5.0</div>
          </div>

          <!-- Active Users -->
          <div class="stat bg-base-200 shadow-lg rounded-lg">
            <div class="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="stat-title">Utilisateurs actifs</div>
            <div class="stat-value text-info">{{ stats?.activeUsers7d || 0 }}</div>
            <div class="stat-desc">7 derniers jours</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts Section -->
    <section class="py-8 bg-base-200">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6 text-base-content">Graphiques</h2>
        
        <div class="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <!-- Mood Distribution Chart -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-lg">Distribution des humeurs</h3>
              <div class="h-64 relative">
                <canvas v-show="distribution" ref="distributionCanvas"></canvas>
                <div v-if="!distribution" class="absolute inset-0 flex items-center justify-center">
                  <span class="loading loading-spinner loading-lg"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Timeline Chart -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-lg">Activité (30 derniers jours)</h3>
              <div class="h-64 relative">
                <canvas v-show="timeline" ref="timelineCanvas"></canvas>
                <div v-if="!timeline" class="absolute inset-0 flex items-center justify-center">
                  <span class="loading loading-spinner loading-lg"></span>
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
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-2xl font-bold text-base-content">Utilisateurs récents</h2>
          <div class="text-sm text-base-content/60">
            Emails masqués (RGPD)
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-4 sm:p-6">
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email (masqué)</th>
                    <th>Inscription</th>
                    <th>Dernière activité</th>
                    <th>Humeurs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loadingUsers">
                    <td colspan="5" class="text-center py-8">
                      <span class="loading loading-spinner loading-md"></span>
                    </td>
                  </tr>
                  <tr v-else-if="users.length === 0">
                    <td colspan="5" class="text-center py-8 text-base-content/50">
                      Aucun utilisateur
                    </td>
                  </tr>
                  <tr v-else v-for="user in users" :key="user.id">
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar placeholder">
                          <div class="w-10 h-10 rounded-full bg-primary text-primary-content">
                            <span class="text-sm font-bold">{{ user.display_name?.charAt(0) || '?' }}</span>
                          </div>
                        </div>
                        <div>
                          <div class="font-bold text-sm">{{ user.display_name || 'Utilisateur' }}</div>
                          <div class="text-xs opacity-50">
                            <span class="badge badge-xs" :class="user.role === 'admin' ? 'badge-error' : 'badge-ghost'">
                              {{ user.role }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="text-sm">{{ user.email }}</td>
                    <td class="text-sm">{{ formatDate(user.created_at) }}</td>
                    <td class="text-sm">{{ formatDate(user.last_activity) }}</td>
                    <td>
                      <div class="badge badge-outline badge-sm">{{ user.mood_entries_count }}</div>
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
        <h2 class="text-2xl font-bold mb-6 text-base-content">État du système</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <!-- Database -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-base" :class="systemHealth?.database?.status === 'operational' ? 'text-success' : 'text-error'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Base de données
              </h3>
              <p class="text-sm" :class="systemHealth?.database?.status === 'operational' ? 'text-success' : 'text-error'">
                {{ systemHealth?.database?.status === 'operational' ? 'Opérationnelle' : 'Erreur' }}
              </p>
              <div class="text-xs text-base-content/70">
                {{ systemHealth?.database?.message || 'Vérification...' }}
              </div>
            </div>
          </div>

          <!-- API Backend -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-base text-success">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                API Backend
              </h3>
              <p class="text-sm text-success">Opérationnelle</p>
              <div class="text-xs text-base-content/70">
                Uptime: {{ formatUptime(systemHealth?.api?.uptime) }}
              </div>
            </div>
          </div>

          <!-- IA Service -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-base" :class="systemHealth?.ai?.status === 'operational' ? 'text-success' : 'text-warning'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Service IA
              </h3>
              <p class="text-sm" :class="systemHealth?.ai?.status === 'operational' ? 'text-success' : 'text-warning'">
                {{ systemHealth?.ai?.status === 'operational' ? 'Opérationnel' : 'Non configuré' }}
              </p>
              <div class="text-xs text-base-content/70">
                Provider: {{ systemHealth?.ai?.provider || 'OpenAI' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Info RGPD -->
    <section class="py-4">
      <div class="container mx-auto px-4">
        <div class="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-sm">
            <strong>Conformité RGPD :</strong> Les emails sont masqués (ex: j***@gmail.com). 
            Les données affichées sont anonymisées et agrégées. Aucune donnée personnelle sensible n'est exposée.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import { useToast } from 'vue-toastification'
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

Chart.register(...registerables)

const authStore = useAuthStore()
const toast = useToast()

// État
const loading = ref(false)
const loadingUsers = ref(false)
const stats = ref(null)
const distribution = ref(null)
const timeline = ref(null)
const users = ref([])
const systemHealth = ref(null)

// Refs canvas
const distributionCanvas = ref(null)
const timelineCanvas = ref(null)

// Instances charts
let distributionChart = null
let timelineChart = null

// Vérifier si admin
const isAdmin = computed(() => authStore.isAdmin)

// Charger les stats
const loadStats = async () => {
  try {
    const response = await api.get('/admin/stats')
    stats.value = response.data
    console.log('Stats admin chargées:', stats.value)
  } catch (error) {
    console.error('Erreur chargement stats:', error)
    if (error.response?.status === 403) {
      toast.error('Accès refusé : droits administrateur requis')
    } else {
      toast.error('Erreur lors du chargement des statistiques')
    }
  }
}

// Charger distribution
const loadDistribution = async () => {
  try {
    const response = await api.get('/admin/mood-distribution')
    distribution.value = response.data
    console.log('Distribution chargée:', distribution.value)
    await nextTick()
    createDistributionChart()
  } catch (error) {
    console.error('Erreur chargement distribution:', error)
  }
}

// Charger timeline
const loadTimeline = async () => {
  try {
    const response = await api.get('/admin/activity-timeline')
    timeline.value = response.data
    console.log('Timeline chargée:', timeline.value)
    await nextTick()
    createTimelineChart()
  } catch (error) {
    console.error('Erreur chargement timeline:', error)
  }
}

// Charger utilisateurs
const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const response = await api.get('/admin/users-overview')
    users.value = response.data
    console.log('Utilisateurs chargés:', users.value.length)
  } catch (error) {
    console.error('Erreur chargement users:', error)
    if (error.response?.status === 403) {
      toast.error('Accès refusé')
    }
  } finally {
    loadingUsers.value = false
  }
}

// Charger health check
const loadHealthCheck = async () => {
  try {
    const response = await api.get('/admin/health-check')
    systemHealth.value = response.data
  } catch (error) {
    console.error('Erreur health check:', error)
  }
}

// Créer graphique distribution
const createDistributionChart = () => {
  if (!distributionCanvas.value || !distribution.value) return

  if (distributionChart) {
    distributionChart.destroy()
  }

  const ctx = distributionCanvas.value.getContext('2d')

  distributionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Très triste', 'Triste', 'Neutre', 'Content', 'Très content'],
      datasets: [{
        data: [
          distribution.value.byScore[1] || 0,
          distribution.value.byScore[2] || 0,
          distribution.value.byScore[3] || 0,
          distribution.value.byScore[4] || 0,
          distribution.value.byScore[5] || 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

// Créer graphique timeline
const createTimelineChart = () => {
  if (!timelineCanvas.value || !timeline.value) return

  if (timelineChart) {
    timelineChart.destroy()
  }

  const ctx = timelineCanvas.value.getContext('2d')

  timelineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeline.value.map(t => format(new Date(t.date), 'd MMM', { locale: fr })),
      datasets: [{
        label: 'Humeurs enregistrées',
        data: timeline.value.map(t => t.count),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

// Formater date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr })
  } catch {
    return 'N/A'
  }
}

// Formater uptime
const formatUptime = (seconds) => {
  if (!seconds) return 'N/A'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}min`
}

// Rafraîchir toutes les données
const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadDistribution(),
      loadTimeline(),
      loadUsers(),
      loadHealthCheck()
    ])
    toast.success('Données actualisées')
  } catch (error) {
    console.error('Erreur refresh:', error)
    toast.error('Erreur lors de l\'actualisation')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  if (!isAdmin.value) {
    toast.error('Accès admin requis')
    return
  }
  
  await refreshData()
})

// Cleanup
onBeforeUnmount(() => {
  if (distributionChart) distributionChart.destroy()
  if (timelineChart) timelineChart.destroy()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
