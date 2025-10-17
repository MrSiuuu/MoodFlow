import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'

export const useMoodsStore = defineStore('moods', () => {
  // État
  const moods = ref([])
  const weeklyStats = ref({
    avg: 0,
    min: 0,
    max: 0,
    count: 0,
    histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    trend: 'new'
  })
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const fetchMoods = async (from, to) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.get('/moods', {
        params: { from, to }
      })

      moods.value = response.data || []
      return moods.value
    } catch (err) {
      error.value = err.message
      console.error('Erreur récupération humeurs:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchWeeklyStats = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await api.get('/insights/week')
      weeklyStats.value = response.data || {
        avg: 0,
        min: 0,
        max: 0,
        count: 0,
        histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        trend: 'new'
      }

      return weeklyStats.value
    } catch (err) {
      error.value = err.message
      console.error('Erreur récupération stats hebdomadaires:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addMood = async (moodData) => {
    // Créer une humeur optimiste temporaire
    const optimisticMood = {
      id: `temp-${Date.now()}`, // ID temporaire
      user_id: 'current-user',
      mood_date: moodData.mood_date,
      score: moodData.score,
      label: moodData.label,
      note: moodData.note,
      weather: moodData.weather,
      tags: moodData.tags || [],
      activities: moodData.activities || [],
      sleep_hours: moodData.sleep_hours,
      energy_level: moodData.energy_level,
      stress_level: moodData.stress_level,
      created_at: new Date().toISOString(),
      _optimistic: true // Marquer comme optimiste
    }

    try {
      // 1. MAJ IMMÉDIATE (Optimistic UI)
      moods.value.unshift(optimisticMood)
      
      // Mettre à jour les stats optimistiquement
      updateStatsOptimistically(optimisticMood, 'add')
      
      loading.value = true
      error.value = null

      // 2. Requête serveur en arrière-plan
      const response = await api.post('/moods', moodData)
      
      // 3. Remplacer l'humeur optimiste par la vraie
      const index = moods.value.findIndex(m => m.id === optimisticMood.id)
      if (index !== -1) {
        moods.value[index] = response.data
      }
      
      // 4. Recharger les vraies stats
      await fetchWeeklyStats()
      
      return response.data
    } catch (err) {
      // ROLLBACK en cas d'erreur
      const index = moods.value.findIndex(m => m.id === optimisticMood.id)
      if (index !== -1) {
        moods.value.splice(index, 1)
      }
      
      // Rollback stats
      updateStatsOptimistically(optimisticMood, 'remove')
      
      error.value = err.message
      console.error('Erreur ajout humeur:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMood = async (id, moodData) => {
    // Sauvegarder l'ancien état pour rollback
    const originalMood = moods.value.find(m => m.id === id)
    const originalIndex = moods.value.findIndex(m => m.id === id)
    
    if (originalIndex === -1) {
      throw new Error('Humeur non trouvée')
    }

    try {
      // 1. MAJ IMMÉDIATE (Optimistic UI)
      const updatedMood = {
        ...originalMood,
        ...moodData,
        _optimistic: true
      }
      moods.value[originalIndex] = updatedMood
      
      loading.value = true
      error.value = null

      // 2. Requête serveur
      const response = await api.patch(`/moods/${id}`, moodData)
      
      // 3. Remplacer par les vraies données
      moods.value[originalIndex] = response.data
      
      // 4. Recharger les stats
      await fetchWeeklyStats()
      
      return response.data
    } catch (err) {
      // ROLLBACK en cas d'erreur
      if (originalMood) {
        moods.value[originalIndex] = originalMood
      }
      
      error.value = err.message
      console.error('Erreur mise à jour humeur:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMood = async (id) => {
    // Sauvegarder pour rollback
    const originalMood = moods.value.find(m => m.id === id)
    const originalIndex = moods.value.findIndex(m => m.id === id)
    
    if (originalIndex === -1) {
      throw new Error('Humeur non trouvée')
    }

    try {
      // 1. SUPPRESSION IMMÉDIATE (Optimistic UI)
      moods.value.splice(originalIndex, 1)
      updateStatsOptimistically(originalMood, 'remove')
      
      loading.value = true
      error.value = null

      // 2. Requête serveur
      await api.delete(`/moods/${id}`)
      
      // 3. Recharger les stats
      await fetchWeeklyStats()
      
      return true
    } catch (err) {
      // ROLLBACK en cas d'erreur
      if (originalMood) {
        moods.value.splice(originalIndex, 0, originalMood)
        updateStatsOptimistically(originalMood, 'add')
      }
      
      error.value = err.message
      console.error('Erreur suppression humeur:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les stats de manière optimiste
  const updateStatsOptimistically = (mood, action) => {
    if (!mood) return

    const stats = { ...weeklyStats.value }
    
    if (action === 'add') {
      stats.count = (stats.count || 0) + 1
      stats.histogram[mood.score] = (stats.histogram[mood.score] || 0) + 1
      
      // Recalculer avg, min, max
      const allMoods = moods.value.filter(m => !m._optimistic || m.id === mood.id)
      if (allMoods.length > 0) {
        const scores = allMoods.map(m => m.score)
        stats.avg = Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 100) / 100
        stats.min = Math.min(...scores)
        stats.max = Math.max(...scores)
      }
    } else if (action === 'remove') {
      stats.count = Math.max(0, (stats.count || 0) - 1)
      stats.histogram[mood.score] = Math.max(0, (stats.histogram[mood.score] || 0) - 1)
    }
    
    weeklyStats.value = stats
  }

  const getTodayMood = () => {
    const today = new Date().toISOString().split('T')[0]
    return moods.value.find(mood => mood.mood_date === today) || null
  }

  const getWeeklyMoods = () => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    
    const weekStart = monday.toISOString().split('T')[0]
    const weekEnd = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    return moods.value.filter(mood => 
      mood.mood_date >= weekStart && mood.mood_date <= weekEnd
    )
  }

  const getRecentMoods = (limit = 10) => {
    return moods.value
      .sort((a, b) => new Date(b.mood_date) - new Date(a.mood_date))
      .slice(0, limit)
  }

  // Getters
  const getMoodEmoji = (score) => {
    const emojis = ['😢', '😔', '😐', '😊', '😄']
    return emojis[score - 1] || '😐'
  }

  const getMoodLabel = (score) => {
    const labels = ['Très mal', 'Mal', 'Moyen', 'Bien', 'Excellent']
    return labels[score - 1] || 'Moyen'
  }

  return {
    // État
    moods,
    weeklyStats,
    loading,
    error,
    
    // Actions
    fetchMoods,
    fetchWeeklyStats,
    addMood,
    updateMood,
    deleteMood,
    
    // Getters
    getTodayMood,
    getWeeklyMoods,
    getRecentMoods,
    getMoodEmoji,
    getMoodLabel
  }
})
