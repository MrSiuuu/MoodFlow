<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">📊 Évolution de la semaine</h2>
      
      <!-- Graphique -->
      <div class="relative h-64 sm:h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Statistiques -->
      <div class="stats stats-vertical sm:stats-horizontal shadow mt-4 w-full">
        <div class="stat place-items-center">
          <div class="stat-title">Moyenne</div>
          <div class="stat-value text-2xl sm:text-3xl text-primary">
            {{ stats.avg?.toFixed(1) || '0.0' }}/5
          </div>
          <div class="stat-desc">Cette semaine</div>
        </div>
        
        <div class="stat place-items-center">
          <div class="stat-title">Min / Max</div>
          <div class="stat-value text-2xl sm:text-3xl">
            {{ stats.min || '0' }} → {{ stats.max || '0' }}
          </div>
          <div class="stat-desc">Étendue</div>
        </div>
        
        <div class="stat place-items-center">
          <div class="stat-title">Entrées</div>
          <div class="stat-value text-2xl sm:text-3xl">
            {{ stats.count || 0 }}
          </div>
          <div class="stat-desc">Sur 7 jours</div>
        </div>

        <div class="stat place-items-center">
          <div class="stat-title">Tendance</div>
          <div class="stat-value text-2xl sm:text-3xl">
            <span v-if="stats.trend === 'up'" class="text-success">↗️</span>
            <span v-else-if="stats.trend === 'down'" class="text-error">↘️</span>
            <span v-else-if="stats.trend === 'stable'" class="text-info">→</span>
            <span v-else>○</span>
          </div>
          <div class="stat-desc">
            {{ trendLabel }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { format, startOfWeek, addDays, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

Chart.register(...registerables)

const props = defineProps({
  moods: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Object,
    default: () => ({
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
      trend: 'new',
    }),
  },
})

const chartCanvas = ref(null)
let chartInstance = null

// Label de la tendance
const trendLabel = computed(() => {
  switch (props.stats.trend) {
    case 'up':
      return 'En hausse'
    case 'down':
      return 'En baisse'
    case 'stable':
      return 'Stable'
    default:
      return 'Pas de données'
  }
})

// Préparer les données pour le graphique
const prepareChartData = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
  
  // Labels des jours
  const labels = weekDays.map(date => format(date, 'EEE', { locale: fr }))
  
  // Données des humeurs
  const data = weekDays.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const mood = props.moods.find(m => m.mood_date === dateStr)
    return mood ? mood.score : null
  })
  
  // Couleurs selon le score
  const backgroundColors = data.map(score => {
    if (score === null) return 'rgba(200, 200, 200, 0.5)'
    if (score <= 2) return 'rgba(239, 68, 68, 0.7)' // Rouge (triste)
    if (score === 3) return 'rgba(234, 179, 8, 0.7)' // Jaune (neutre)
    return 'rgba(34, 197, 94, 0.7)' // Vert (content)
  })
  
  const borderColors = data.map(score => {
    if (score === null) return 'rgba(200, 200, 200, 1)'
    if (score <= 2) return 'rgba(239, 68, 68, 1)'
    if (score === 3) return 'rgba(234, 179, 8, 1)'
    return 'rgba(34, 197, 94, 1)'
  })
  
  return {
    labels,
    datasets: [
      {
        label: 'Humeur',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }
}

// Créer le graphique
const createChart = () => {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Détruire l'ancien graphique s'il existe
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const data = prepareChartData()
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: (context) => {
              const score = context.parsed.y
              if (score === null) return 'Pas d\'humeur'
              
              const labels = {
                1: 'Très triste',
                2: 'Triste',
                3: 'Neutre',
                4: 'Content',
                5: 'Très content',
              }
              
              return `${labels[score]} (${score}/5)`
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: (value) => {
              const emojis = ['', '😢', '😔', '😐', '😊', '😄']
              return emojis[value] || ''
            },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  })
}

// Mettre à jour le graphique quand les données changent
watch(
  () => [props.moods, props.stats],
  () => {
    nextTick(() => {
      createChart()
    })
  },
  { deep: true }
)

// Initialiser au montage
onMounted(() => {
  nextTick(() => {
    createChart()
  })
})

// Nettoyer à la destruction
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
canvas {
  max-height: 100%;
}

.stats {
  border-radius: 1rem;
}

.stat {
  padding: 1rem;
}

@media (max-width: 640px) {
  .stat-value {
    font-size: 1.5rem !important;
  }
}
</style>

