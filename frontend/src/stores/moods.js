import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/api'
import { useToast } from 'vue-toastification'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isFuture } from 'date-fns'
import { fr } from 'date-fns/locale'

export const useMoodsStore = defineStore('moods', () => {
  const moods = ref([])
  const loading = ref(false)
  const currentWeek = ref([])
  const toast = useToast()

  // Générer la semaine courante
  const generateCurrentWeek = () => {
    const now = new Date()
    const start = startOfWeek(now, { weekStartsOn: 1 }) // Lundi
    const end = endOfWeek(now, { weekStartsOn: 1 }) // Dimanche
    
    return eachDayOfInterval({ start, end }).map(date => ({
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEEE', { locale: fr }),
      dayShort: format(date, 'EEE', { locale: fr }),
      isToday: isToday(date),
      isFuture: isFuture(date),
      mood: null
    }))
  }

  // Initialiser la semaine
  const initWeek = () => {
    currentWeek.value = generateCurrentWeek()
  }

  // Charger les humeurs de la semaine
  const loadWeekMoods = async () => {
    try {
      loading.value = true
      const startDate = currentWeek.value[0].date
      const endDate = currentWeek.value[6].date
      
      const response = await api.get(`/moods?from=${startDate}&to=${endDate}`)
      const weekMoods = response.data || []
      
      // Associer les humeurs aux jours
      currentWeek.value = currentWeek.value.map(day => ({
        ...day,
        mood: weekMoods.find(mood => mood.mood_date === day.date) || null
      }))
      
    } catch (error) {
      console.error('Erreur chargement humeurs:', error)
      toast.error('Erreur lors du chargement des humeurs')
    } finally {
      loading.value = false
    }
  }

  // Ajouter une humeur
  const addMood = async (moodData) => {
    try {
      loading.value = true
      const response = await api.post('/moods', moodData)
      
      // Mettre à jour la semaine localement (optimistic UI)
      const dayIndex = currentWeek.value.findIndex(day => day.date === moodData.mood_date)
      if (dayIndex !== -1) {
        currentWeek.value[dayIndex].mood = response.data
      }
      
      toast.success('Humeur enregistrée !')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erreur ajout humeur:', error)
      toast.error(error.response?.data?.error || 'Erreur lors de l\'enregistrement')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Modifier une humeur
  const updateMood = async (moodId, moodData) => {
    try {
      loading.value = true
      const response = await api.patch(`/moods/${moodId}`, moodData)
      
      // Mettre à jour la semaine localement
      const dayIndex = currentWeek.value.findIndex(day => 
        day.mood && day.mood.id === moodId
      )
      if (dayIndex !== -1) {
        currentWeek.value[dayIndex].mood = { ...currentWeek.value[dayIndex].mood, ...moodData }
      }
      
      toast.success('Humeur mise à jour !')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erreur mise à jour humeur:', error)
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Supprimer une humeur
  const deleteMood = async (moodId) => {
    try {
      loading.value = true
      await api.delete(`/moods/${moodId}`)
      
      // Mettre à jour la semaine localement
      const dayIndex = currentWeek.value.findIndex(day => 
        day.mood && day.mood.id === moodId
      )
      if (dayIndex !== -1) {
        currentWeek.value[dayIndex].mood = null
      }
      
      toast.success('Humeur supprimée !')
      return { success: true }
    } catch (error) {
      console.error('Erreur suppression humeur:', error)
      toast.error('Erreur lors de la suppression')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Obtenir l'humeur du jour
  const getTodayMood = computed(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return currentWeek.value.find(day => day.date === today)?.mood || null
  })

  // Statistiques de la semaine
  const weekStats = computed(() => {
    const weekMoods = currentWeek.value
      .filter(day => day.mood)
      .map(day => day.mood.score)
    
    if (weekMoods.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 }
    }
    
    const avg = weekMoods.reduce((sum, score) => sum + score, 0) / weekMoods.length
    return {
      avg: Math.round(avg * 100) / 100,
      min: Math.min(...weekMoods),
      max: Math.max(...weekMoods),
      count: weekMoods.length
    }
  })

  return {
    moods,
    currentWeek,
    loading,
    initWeek,
    loadWeekMoods,
    addMood,
    updateMood,
    deleteMood,
    getTodayMood,
    weekStats
  }
})
