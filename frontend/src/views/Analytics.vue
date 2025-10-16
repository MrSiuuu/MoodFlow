<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gradient mb-2">Analytics</h1>
      <p class="text-lg text-base-content/70">Analyse tes tendances d'humeur</p>
    </div>
    
    <!-- Graphiques -->
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Répartition des humeurs</h2>
          <div class="h-64">
            <canvas ref="pieChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Tendances mensuelles</h2>
          <div class="h-64">
            <canvas ref="lineChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Statistiques -->
    <div class="stats stats-horizontal shadow w-full">
      <div class="stat">
        <div class="stat-title">Moyenne</div>
        <div class="stat-value text-primary">{{ insightsStore.weekInsights?.avg || 0 }}/5</div>
      </div>
      <div class="stat">
        <div class="stat-title">Min</div>
        <div class="stat-value text-error">{{ insightsStore.weekInsights?.min || 0 }}/5</div>
      </div>
      <div class="stat">
        <div class="stat-title">Max</div>
        <div class="stat-value text-success">{{ insightsStore.weekInsights?.max || 0 }}/5</div>
      </div>
      <div class="stat">
        <div class="stat-title">Entrées</div>
        <div class="stat-value">{{ insightsStore.weekInsights?.count || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInsightsStore } from '@/stores/insights'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const insightsStore = useInsightsStore()
const pieChart = ref(null)
const lineChart = ref(null)

onMounted(async () => {
  await insightsStore.loadWeekInsights()
  await insightsStore.loadMonthInsights()
  // Ici on créerait les graphiques avec Chart.js
})
</script>
