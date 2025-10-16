<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title justify-center mb-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        Évolution de la semaine
      </h2>
      
      <div v-if="loading" class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      
      <div v-else-if="!hasData" class="text-center py-8 text-base-content/60">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p>Aucune donnée pour cette semaine</p>
        <p class="text-sm">Ajoute des humeurs pour voir l'évolution</p>
      </div>
      
      <div v-else class="space-y-4">
        <!-- Graphique -->
        <div class="h-64">
          <canvas ref="chartCanvas"></canvas>
        </div>
        
        <!-- Statistiques -->
        <div class="stats stats-horizontal shadow">
          <div class="stat">
            <div class="stat-title">Moyenne</div>
            <div class="stat-value text-primary">{{ weekStats.avg }}/5</div>
          </div>
          <div class="stat">
            <div class="stat-title">Min</div>
            <div class="stat-value text-error">{{ weekStats.min }}/5</div>
          </div>
          <div class="stat">
            <div class="stat-title">Max</div>
            <div class="stat-value text-success">{{ weekStats.max }}/5</div>
          </div>
          <div class="stat">
            <div class="stat-title">Entrées</div>
            <div class="stat-value">{{ weekStats.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  weekData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const hasData = computed(() => {
  return props.weekData.some(day => day.mood)
})

const weekStats = computed(() => {
  const moods = props.weekData
    .filter(day => day.mood)
    .map(day => day.mood.score)
  
  if (moods.length === 0) {
    return { avg: 0, min: 0, max: 0, count: 0 }
  }
  
  const avg = moods.reduce((sum, score) => sum + score, 0) / moods.length
  return {
    avg: Math.round(avg * 100) / 100,
    min: Math.min(...moods),
    max: Math.max(...moods),
    count: moods.length
  }
})

const chartData = computed(() => {
  const labels = props.weekData.map(day => day.dayShort)
  const data = props.weekData.map(day => day.mood ? day.mood.score : null)
  
  return {
    labels,
    datasets: [{
      label: 'Humeur',
      data,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: data.map(score => {
        if (score === null) return '#9ca3af'
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
        return colors[score - 1]
      }),
      pointBorderColor: data.map(score => {
        if (score === null) return '#9ca3af'
        const colors = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb']
        return colors[score - 1]
      }),
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  }
})

const createChart = () => {
  if (!chartCanvas.value) return
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              const labels = ['', 'Très triste', 'Triste', 'Neutre', 'Content', 'Très content']
              return labels[value] || value
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.parsed.y === null) return 'Aucune humeur'
              const labels = ['', 'Très triste', 'Triste', 'Neutre', 'Content', 'Très content']
              return `Humeur: ${labels[context.parsed.y]} (${context.parsed.y}/5)`
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = chartData.value
    chartInstance.update()
  }
}

watch(chartData, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    createChart()
  })
})
</script>
