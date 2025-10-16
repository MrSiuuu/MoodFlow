import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/api'
import { useToast } from 'vue-toastification'

export const useInsightsStore = defineStore('insights', () => {
  const weekInsights = ref(null)
  const monthInsights = ref(null)
  const loading = ref(false)
  const toast = useToast()

  // Charger les insights de la semaine
  const loadWeekInsights = async () => {
    try {
      loading.value = true
      const response = await api.get('/insights/week')
      weekInsights.value = response.data
    } catch (error) {
      console.error('Erreur chargement insights semaine:', error)
      toast.error('Erreur lors du chargement des insights')
    } finally {
      loading.value = false
    }
  }

  // Charger les insights du mois
  const loadMonthInsights = async () => {
    try {
      loading.value = true
      const response = await api.get('/insights/month')
      monthInsights.value = response.data
    } catch (error) {
      console.error('Erreur chargement insights mois:', error)
      toast.error('Erreur lors du chargement des insights mensuels')
    } finally {
      loading.value = false
    }
  }

  // Données pour les graphiques
  const chartData = computed(() => {
    if (!weekInsights.value) return null

    const { histogram } = weekInsights.value
    return {
      labels: ['Très triste', 'Triste', 'Neutre', 'Content', 'Très content'],
      datasets: [{
        label: 'Humeurs de la semaine',
        data: [histogram[1], histogram[2], histogram[3], histogram[4], histogram[5]],
        backgroundColor: [
          '#ef4444', // Rouge
          '#f97316', // Orange
          '#eab308', // Jaune
          '#22c55e', // Vert
          '#3b82f6'  // Bleu
        ],
        borderColor: [
          '#dc2626',
          '#ea580c',
          '#ca8a04',
          '#16a34a',
          '#2563eb'
        ],
        borderWidth: 2
      }]
    }
  })

  // Données pour le graphique de tendances mensuelles
  const trendsChartData = computed(() => {
    if (!monthInsights.value?.trends) return null

    const trends = monthInsights.value.trends
    return {
      labels: trends.map(t => {
        const date = new Date(t.week)
        return date.toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        })
      }),
      datasets: [{
        label: 'Moyenne hebdomadaire',
        data: trends.map(t => t.avg),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  })

  // Résumé textuel de la semaine
  const weekSummary = computed(() => {
    if (!weekInsights.value) return 'Aucune donnée disponible'

    const { avg, min, max, count } = weekInsights.value
    
    if (count === 0) return 'Aucune humeur enregistrée cette semaine'
    
    let summary = `Cette semaine, tu as enregistré ${count} humeur${count > 1 ? 's' : ''}. `
    
    if (avg >= 4) {
      summary += 'Tu as été globalement de bonne humeur ! 🌟'
    } else if (avg >= 3) {
      summary += 'Tu as eu une semaine équilibrée. 👍'
    } else {
      summary += 'Cette semaine a été difficile, mais ça va s\'améliorer ! 💪'
    }
    
    summary += ` Ta moyenne est de ${avg}/5 (min: ${min}, max: ${max}).`
    
    return summary
  })

  // Citation du jour basée sur l'humeur
  const dailyQuote = computed(() => {
    const todayMood = weekInsights.value?.avg || 3
    
    const quotes = {
      1: {
        text: "Les nuages passent, mais le ciel reste bleu.",
        author: "Proverbe"
      },
      2: {
        text: "Chaque jour est un nouveau commencement.",
        author: "Anonyme"
      },
      3: {
        text: "La vie est un équilibre entre ce que tu contrôles et ce que tu ne contrôles pas.",
        author: "Anonyme"
      },
      4: {
        text: "La gratitude transforme ce que nous avons en suffisance.",
        author: "Anonyme"
      },
      5: {
        text: "Le bonheur n'est pas une destination, c'est un mode de voyage.",
        author: "Margaret Lee Runbeck"
      }
    }
    
    const moodLevel = Math.round(todayMood)
    return quotes[moodLevel] || quotes[3]
  })

  return {
    weekInsights,
    monthInsights,
    loading,
    loadWeekInsights,
    loadMonthInsights,
    chartData,
    trendsChartData,
    weekSummary,
    dailyQuote
  }
})
