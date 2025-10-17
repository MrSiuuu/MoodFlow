<template>
  <div class="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
    <!-- En-tête -->
    <div class="text-center px-2">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1 sm:mb-2">
        📊 Analytics
      </h1>
      <p class="text-sm sm:text-base text-base-content/70">
        Analyse tes tendances d'humeur en profondeur
      </p>
    </div>

    <!-- Sélecteur de période -->
    <div class="flex justify-center gap-2 px-2">
      <button
        v-for="period in periods"
        :key="period.value"
        @click="selectedPeriod = period.value"
        class="btn btn-sm"
        :class="selectedPeriod === period.value ? 'btn-primary' : 'btn-ghost'"
      >
        {{ period.label }}
      </button>
    </div>

    <!-- Stats globales -->
    <div class="px-2">
      <div class="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100">
        <div class="stat place-items-center p-3 sm:p-4">
          <div class="stat-figure text-primary">
            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="stat-title text-xs sm:text-sm">Moyenne</div>
          <div class="stat-value text-xl sm:text-3xl text-primary">{{ stats.avg?.toFixed(1) || '0.0' }}</div>
          <div class="stat-desc text-xs">/5.0</div>
        </div>
        
        <div class="stat place-items-center p-3 sm:p-4">
          <div class="stat-figure text-secondary">
            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="stat-title text-xs sm:text-sm">Min / Max</div>
          <div class="stat-value text-xl sm:text-3xl">{{ stats.min || 0 }} → {{ stats.max || 0 }}</div>
          <div class="stat-desc text-xs">Étendue</div>
        </div>
        
        <div class="stat place-items-center p-3 sm:p-4">
          <div class="stat-figure text-accent">
            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-xs sm:text-sm">Total entrées</div>
          <div class="stat-value text-xl sm:text-3xl text-accent">{{ stats.count || 0 }}</div>
          <div class="stat-desc text-xs">{{ selectedPeriod === 'week' ? 'Cette semaine' : 'Ce mois' }}</div>
        </div>
      </div>
    </div>
    
    <!-- Graphiques principaux -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2">
      <!-- Répartition des humeurs (Donut) -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-base sm:text-lg">🍩 Répartition des humeurs</h2>
          <div class="h-48 sm:h-64 md:h-80 flex items-center justify-center relative">
            <canvas v-show="stats.count > 0" ref="pieChartCanvas"></canvas>
            <div v-if="stats.count === 0" class="absolute inset-0 flex flex-col items-center justify-center text-base-content/50">
              <div class="text-4xl mb-2">📊</div>
              <p class="text-sm">Pas encore de données</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Évolution dans le temps (Line) -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-base sm:text-lg">📈 Évolution dans le temps</h2>
          <div class="h-48 sm:h-64 md:h-80 flex items-center justify-center relative">
            <canvas v-show="periodMoods.length > 0" ref="lineChartCanvas"></canvas>
            <div v-if="periodMoods.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-base-content/50">
              <div class="text-4xl mb-2">📈</div>
              <p class="text-sm">Pas encore de données</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Graphique distribution (Bar) -->
    <div class="px-2">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-base sm:text-lg">📊 Distribution détaillée</h2>
          <div class="h-48 sm:h-64 md:h-72 flex items-center justify-center relative">
            <canvas v-show="stats.count > 0" ref="barChartCanvas"></canvas>
            <div v-if="stats.count === 0" class="absolute inset-0 flex flex-col items-center justify-center text-base-content/50">
              <div class="text-4xl mb-2">📊</div>
              <p class="text-sm">Pas encore de données</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights & Patterns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
      <!-- Meilleurs jours -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h3 class="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
            <span>🌟</span>
            <span>Meilleurs moments</span>
          </h3>
          <div class="space-y-2">
            <div v-for="(mood, index) in bestMoods" :key="mood.id" class="flex items-center gap-3 p-2 bg-success/10 rounded-lg">
              <div class="text-2xl">{{ getMoodEmoji(mood.score) }}</div>
              <div class="flex-1">
                <div class="font-medium text-sm">{{ formatDate(mood.mood_date) }}</div>
                <div class="text-xs text-base-content/70">{{ mood.label || 'Pas de note' }}</div>
              </div>
              <div class="badge badge-success">{{ mood.score }}/5</div>
            </div>
            <div v-if="bestMoods.length === 0" class="text-center text-sm text-base-content/50 py-4">
              Pas encore de données
            </div>
          </div>
        </div>
      </div>

      <!-- Jours difficiles -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h3 class="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
            <span>💪</span>
            <span>Moments difficiles</span>
          </h3>
          <div class="space-y-2">
            <div v-for="mood in worstMoods" :key="mood.id" class="flex items-center gap-3 p-2 bg-error/10 rounded-lg">
              <div class="text-2xl">{{ getMoodEmoji(mood.score) }}</div>
              <div class="flex-1">
                <div class="font-medium text-sm">{{ formatDate(mood.mood_date) }}</div>
                <div class="text-xs text-base-content/70">{{ mood.label || 'Pas de note' }}</div>
              </div>
              <div class="badge badge-error">{{ mood.score }}/5</div>
            </div>
            <div v-if="worstMoods.length === 0" class="text-center text-sm text-base-content/50 py-4">
              Pas encore de données
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patterns & Corrélations -->
    <div v-if="stats.count > 0" class="px-2">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-base sm:text-lg mb-4">🔍 Patterns & Insights</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Jour de la semaine le plus heureux -->
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Meilleur jour</div>
              <div class="stat-value text-base sm:text-lg">{{ bestDayOfWeek || '—' }}</div>
              <div class="stat-desc text-xs">En moyenne</div>
            </div>

            <!-- Activité la plus fréquente -->
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Activité #1</div>
              <div class="stat-value text-base sm:text-lg">{{ topActivity || '—' }}</div>
              <div class="stat-desc text-xs">La plus fréquente</div>
            </div>

            <!-- Sommeil moyen -->
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">Sommeil moyen</div>
              <div class="stat-value text-base sm:text-lg">{{ avgSleep || '—' }}</div>
              <div class="stat-desc text-xs">Heures par nuit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useMoodsStore } from '@/stores/moods'
import { useInsightsStore } from '@/stores/insights'
import { Chart, registerables } from 'chart.js'
import { format, parseISO, startOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

Chart.register(...registerables)

const moodsStore = useMoodsStore()
const insightsStore = useInsightsStore()

// Refs pour les canvas
const pieChartCanvas = ref(null)
const lineChartCanvas = ref(null)
const barChartCanvas = ref(null)

// Instances des graphiques
let pieChart = null
let lineChart = null
let barChart = null

// Période sélectionnée
const selectedPeriod = ref('week')
const periods = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
]

// Stats selon la période
const stats = computed(() => {
  if (selectedPeriod.value === 'week') {
    return moodsStore.weeklyStats
  } else {
    return insightsStore.monthInsights || {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
      histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
})

// Humeurs selon la période
const periodMoods = computed(() => {
  if (selectedPeriod.value === 'week') {
    return moodsStore.getWeeklyMoods()
  } else {
    return moodsStore.moods.filter(mood => {
      const moodDate = new Date(mood.mood_date)
      const now = new Date()
      return moodDate.getMonth() === now.getMonth() && 
             moodDate.getFullYear() === now.getFullYear()
    })
  }
})

// Meilleurs humeurs
const bestMoods = computed(() => {
  return [...periodMoods.value]
    .filter(m => m.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
})

// Pires humeurs
const worstMoods = computed(() => {
  return [...periodMoods.value]
    .filter(m => m.score <= 2)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
})

// Meilleur jour de la semaine
const bestDayOfWeek = computed(() => {
  if (periodMoods.value.length === 0) return null
  
  const dayScores = {}
  periodMoods.value.forEach(mood => {
    const day = format(parseISO(mood.mood_date), 'EEEE', { locale: fr })
    if (!dayScores[day]) {
      dayScores[day] = { total: 0, count: 0 }
    }
    dayScores[day].total += mood.score
    dayScores[day].count += 1
  })
  
  let bestDay = null
  let bestAvg = 0
  Object.entries(dayScores).forEach(([day, data]) => {
    const avg = data.total / data.count
    if (avg > bestAvg) {
      bestAvg = avg
      bestDay = day
    }
  })
  
  return bestDay
})

// Activité la plus fréquente
const topActivity = computed(() => {
  if (periodMoods.value.length === 0) return null
  
  const activityCount = {}
  periodMoods.value.forEach(mood => {
    if (mood.activities && mood.activities.length > 0) {
      mood.activities.forEach(activity => {
        activityCount[activity] = (activityCount[activity] || 0) + 1
      })
    }
  })
  
  if (Object.keys(activityCount).length === 0) return null
  
  return Object.entries(activityCount)
    .sort((a, b) => b[1] - a[1])[0][0]
})

// Sommeil moyen
const avgSleep = computed(() => {
  const sleepMoods = periodMoods.value.filter(m => m.sleep_hours)
  if (sleepMoods.length === 0) return null
  
  const total = sleepMoods.reduce((sum, m) => sum + m.sleep_hours, 0)
  return (total / sleepMoods.length).toFixed(1) + 'h'
})

// Créer le graphique en donut (répartition)
const createPieChart = () => {
  if (!pieChartCanvas.value) {
    console.log('Canvas pie non disponible')
    return
  }
  
  if (stats.value.count === 0) {
    console.log('Pas de données pour le pie chart')
    if (pieChart) {
      pieChart.destroy()
      pieChart = null
    }
    return
  }
  
  const ctx = pieChartCanvas.value.getContext('2d')
  
  if (pieChart) {
    pieChart.destroy()
  }
  
  const data = {
    labels: ['😢 Très triste', '😔 Triste', '😐 Neutre', '😊 Content', '😄 Très content'],
    datasets: [{
      label: 'Humeurs',
      data: [
        stats.value.histogram[1] || 0,
        stats.value.histogram[2] || 0,
        stats.value.histogram[3] || 0,
        stats.value.histogram[4] || 0,
        stats.value.histogram[5] || 0
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',   // Rouge
        'rgba(249, 115, 22, 0.8)',  // Orange
        'rgba(234, 179, 8, 0.8)',   // Jaune
        'rgba(34, 197, 94, 0.8)',   // Vert
        'rgba(59, 130, 246, 0.8)'   // Bleu
      ],
      borderColor: [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#3b82f6'
      ],
      borderWidth: 2
    }]
  }
  
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
              return ` ${context.label}: ${value} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

// Créer le graphique d'évolution (ligne)
const createLineChart = () => {
  if (!lineChartCanvas.value) {
    console.log('Canvas line non disponible')
    return
  }
  
  if (periodMoods.value.length === 0) {
    console.log('Pas de données pour le line chart')
    if (lineChart) {
      lineChart.destroy()
      lineChart = null
    }
    return
  }
  
  const ctx = lineChartCanvas.value.getContext('2d')
  
  if (lineChart) {
    lineChart.destroy()
  }
  
  // Préparer les données
  const sortedMoods = [...periodMoods.value].sort((a, b) => 
    new Date(a.mood_date) - new Date(b.mood_date)
  )
  
  const data = {
    labels: sortedMoods.map(m => format(parseISO(m.mood_date), 'd MMM', { locale: fr })),
    datasets: [{
      label: 'Humeur',
      data: sortedMoods.map(m => m.score),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#667eea',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  }
  
  lineChart = new Chart(ctx, {
    type: 'line',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: (value) => {
              const emojis = ['', '😢', '😔', '😐', '😊', '😄']
              return emojis[value] || ''
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: {
            label: (context) => {
              const labels = ['', 'Très triste', 'Triste', 'Neutre', 'Content', 'Très content']
              return `${labels[context.parsed.y]} (${context.parsed.y}/5)`
            }
          }
        }
      }
    }
  })
}

// Créer le graphique en barres (distribution)
const createBarChart = () => {
  if (!barChartCanvas.value) {
    console.log('Canvas bar non disponible')
    return
  }
  
  if (stats.value.count === 0) {
    console.log('Pas de données pour le bar chart')
    if (barChart) {
      barChart.destroy()
      barChart = null
    }
    return
  }
  
  const ctx = barChartCanvas.value.getContext('2d')
  
  if (barChart) {
    barChart.destroy()
  }
  
  const data = {
    labels: ['😢 Très triste', '😔 Triste', '😐 Neutre', '😊 Content', '😄 Très content'],
    datasets: [{
      label: 'Nombre de jours',
      data: [
        stats.value.histogram[1] || 0,
        stats.value.histogram[2] || 0,
        stats.value.histogram[3] || 0,
        stats.value.histogram[4] || 0,
        stats.value.histogram[5] || 0
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)'
      ],
      borderColor: [
        '#ef4444',
        '#f97316',
        '#eab308',
        '#22c55e',
        '#3b82f6'
      ],
      borderWidth: 2,
      borderRadius: 8
    }]
  }
  
  barChart = new Chart(ctx, {
    type: 'bar',
    data,
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

// Créer tous les graphiques
const createCharts = () => {
  nextTick(() => {
    createPieChart()
    createLineChart()
    createBarChart()
  })
}

// Charger les données
const loadData = async () => {
  try {
    if (selectedPeriod.value === 'week') {
      const today = new Date()
      const monday = startOfWeek(today, { weekStartsOn: 1 })
      const sunday = addDays(monday, 6)
      
      const from = format(monday, 'yyyy-MM-dd')
      const to = format(sunday, 'yyyy-MM-dd')
      
      console.log('🔍 Analytics - Chargement semaine:', from, '→', to)
      await moodsStore.fetchMoods(from, to)
      await moodsStore.fetchWeeklyStats()
      console.log('✅ Stats semaine chargées:', moodsStore.weeklyStats)
      console.log('✅ Humeurs chargées:', moodsStore.moods.length)
    } else {
      const today = new Date()
      const firstDay = startOfMonth(today)
      const lastDay = endOfMonth(today)
      
      const from = format(firstDay, 'yyyy-MM-dd')
      const to = format(lastDay, 'yyyy-MM-dd')
      
      console.log('🔍 Analytics - Chargement mois:', from, '→', to)
      await moodsStore.fetchMoods(from, to)
      await insightsStore.loadMonthInsights()
      console.log('✅ Stats mois chargées:', insightsStore.monthInsights)
      console.log('✅ Humeurs chargées:', moodsStore.moods.length)
    }
  } catch (error) {
    console.error('❌ Erreur chargement Analytics:', error)
  }
}

// Formater une date
const formatDate = (dateStr) => {
  return format(parseISO(dateStr), 'd MMMM yyyy', { locale: fr })
}

// Obtenir l'emoji selon le score
const getMoodEmoji = (score) => {
  const emojis = ['😢', '😔', '😐', '😊', '😄']
  return emojis[score - 1] || '😐'
}

// Watcher pour recréer les graphiques quand les données ou la période changent
watch(selectedPeriod, async () => {
  await loadData()
  await nextTick()
  createCharts()
})

// Watcher séparé pour les données
watch(() => periodMoods.value, () => {
  nextTick(() => {
    createCharts()
  })
}, { deep: true })

// Initialisation
onMounted(async () => {
  await loadData()
  await nextTick()
  setTimeout(() => {
    createCharts()
  }, 100)
})

// Nettoyer les graphiques
onBeforeUnmount(() => {
  if (pieChart) pieChart.destroy()
  if (lineChart) lineChart.destroy()
  if (barChart) barChart.destroy()
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
