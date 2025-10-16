<template>
  <div class="min-h-screen bg-base-100">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-primary to-secondary text-primary-content py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">
              Bonjour {{ user?.display_name || 'Utilisateur' }} ! 👋
            </h1>
            <p class="text-lg opacity-90">
              Comment te sens-tu aujourd'hui ?
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <div class="text-right">
              <div class="text-sm opacity-75">{{ currentDate }}</div>
              <div class="text-sm opacity-75">{{ currentTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <section class="py-6 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/mood-entry" class="btn btn-primary btn-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Ajouter mon humeur
          </RouterLink>
          <RouterLink to="/analytics" class="btn btn-outline btn-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Voir mes analyses
          </RouterLink>
          
        </div>
      </div>
    </section>

    <!-- Today's Mood -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6">Mon humeur d'aujourd'hui</h2>
        
        <div v-if="todayMood" class="card bg-base-100 shadow-xl mb-6">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="text-4xl">{{ getMoodEmoji(todayMood.score) }}</div>
                <div>
                  <h3 class="text-xl font-bold">{{ todayMood.label || 'Humeur du jour' }}</h3>
                  <p class="text-base-content/70">Score: {{ todayMood.score }}/5</p>
                  <p v-if="todayMood.note" class="text-sm mt-2">{{ todayMood.note }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-base-content/70">Enregistré à</div>
                <div class="font-semibold">{{ formatTime(todayMood.created_at) }}</div>
                <button class="btn btn-ghost btn-sm mt-2">Modifier</button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card bg-base-100 shadow-xl border-dashed border-2 border-base-300">
          <div class="card-body text-center py-12">
            <div class="text-6xl mb-4">😊</div>
            <h3 class="text-xl font-bold mb-2">Pas d'humeur enregistrée aujourd'hui</h3>
            <p class="text-base-content/70 mb-4">Prends 2 minutes pour enregistrer ton humeur</p>
            <RouterLink to="/mood-entry" class="btn btn-primary">Enregistrer mon humeur</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Weekly Overview -->
    <section class="py-8 bg-base-200">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6">Aperçu de la semaine</h2>
        
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Mood Chart -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Évolution de ton humeur</h3>
              <div class="h-64 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">📊</div>
                  <p class="text-base-content/70">Graphique en cours de développement</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Stats -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Statistiques de la semaine</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span>Humeur moyenne</span>
                  <div class="flex items-center gap-2">
                    <div class="text-2xl">{{ getMoodEmoji(Math.round(weeklyStats.averageMood)) }}</div>
                    <span class="font-bold">{{ weeklyStats.averageMood }}/5</span>
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span>Jours enregistrés</span>
                  <span class="font-bold">{{ weeklyStats.daysRecorded }}/7</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span>Meilleur jour</span>
                  <span class="font-bold">{{ weeklyStats.bestDay }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span>Streak actuel</span>
                  <span class="font-bold">{{ weeklyStats.currentStreak }} jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Entries -->
    <section class="py-8">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Dernières entrées</h2>
          <RouterLink to="/calendar" class="btn btn-ghost">Voir tout</RouterLink>
        </div>

        <div class="grid gap-4">
          <div v-for="entry in recentEntries" :key="entry.id" class="card bg-base-100 shadow">
            <div class="card-body py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="text-3xl">{{ getMoodEmoji(entry.score) }}</div>
                  <div>
                    <h4 class="font-semibold">{{ entry.label || 'Humeur' }}</h4>
                    <p class="text-sm text-base-content/70">{{ formatDate(entry.mood_date) }}</p>
                    <p v-if="entry.note" class="text-sm mt-1">{{ entry.note }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="badge badge-outline">{{ entry.score }}/5</div>
                  <div class="text-sm text-base-content/70 mt-1">{{ formatTime(entry.created_at) }}</div>
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
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Données réactives
const todayMood = ref(null)
const recentEntries = ref([])
const weeklyStats = ref({
  averageMood: 3.2,
  daysRecorded: 5,
  bestDay: 'Mardi',
  currentStreak: 3
})

// Computed
const user = computed(() => authStore.userProfile || authStore.user)
const currentDate = computed(() => new Date().toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))
const currentTime = computed(() => new Date().toLocaleTimeString('fr-FR', { 
  hour: '2-digit', 
  minute: '2-digit' 
}))

// Méthodes
const getMoodEmoji = (score) => {
  const emojis = ['😢', '😔', '😐', '😊', '😄']
  return emojis[score - 1] || '😐'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTodayMood = async () => {
  try {
    // Simulation de données - à remplacer par un vrai appel API
    const today = new Date().toISOString().split('T')[0]
    todayMood.value = {
      id: 1,
      score: 4,
      label: 'Content',
      note: 'Belle journée de travail, projet qui avance bien !',
      mood_date: today,
      created_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'humeur du jour:', error)
  }
}

const loadRecentEntries = async () => {
  try {
    // Simulation de données - à remplacer par un vrai appel API
    recentEntries.value = [
      {
        id: 1,
        score: 4,
        label: 'Content',
        note: 'Belle journée de travail',
        mood_date: '2024-01-15',
        created_at: '2024-01-15T18:30:00Z'
      },
      {
        id: 2,
        score: 3,
        label: 'Neutre',
        note: 'Journée normale',
        mood_date: '2024-01-14',
        created_at: '2024-01-14T19:15:00Z'
      },
      {
        id: 3,
        score: 5,
        label: 'Excellent',
        note: 'Week-end parfait !',
        mood_date: '2024-01-13',
        created_at: '2024-01-13T20:00:00Z'
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des entrées récentes:', error)
  }
}


// Lifecycle
onMounted(() => {
  loadTodayMood()
  loadRecentEntries()
})
</script>
