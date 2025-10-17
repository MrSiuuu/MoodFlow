<template>
  <div class="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
    <!-- En-tête -->
    <div class="text-center px-2">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1 sm:mb-2">
        📅 Calendrier
      </h1>
      <p class="text-sm sm:text-base text-base-content/70">
        Vue mensuelle de tes humeurs
      </p>
    </div>

    <!-- Navigation du mois -->
    <div class="flex items-center justify-between px-2">
      <button
        @click="previousMonth"
        class="btn btn-circle btn-sm sm:btn-md btn-ghost"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold">
        {{ currentMonthLabel }}
      </h2>
      
      <button
        @click="nextMonth"
        class="btn btn-circle btn-sm sm:btn-md btn-ghost"
        :disabled="isCurrentMonth"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Stats du mois -->
    <div class="px-2">
      <div class="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100">
        <div class="stat place-items-center p-2 sm:p-4">
          <div class="stat-title text-xs sm:text-sm">Moyenne du mois</div>
          <div class="stat-value text-lg sm:text-2xl text-primary">{{ monthStats.avg?.toFixed(1) || '0.0' }}</div>
          <div class="stat-desc text-xs">/5</div>
        </div>
        
        <div class="stat place-items-center p-2 sm:p-4">
          <div class="stat-title text-xs sm:text-sm">Jours enregistrés</div>
          <div class="stat-value text-lg sm:text-2xl">{{ monthStats.count || 0 }}</div>
          <div class="stat-desc text-xs">/{{ daysInMonth }}</div>
        </div>
        
        <div class="stat place-items-center p-2 sm:p-4">
          <div class="stat-title text-xs sm:text-sm">Régularité</div>
          <div class="stat-value text-lg sm:text-2xl">{{ consistencyPercentage }}%</div>
          <div class="stat-desc text-xs">Suivi</div>
        </div>
      </div>
    </div>

    <!-- Calendrier -->
    <div class="px-2">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-3 sm:p-6">
          <!-- Jours de la semaine -->
          <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            <div
              v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
              :key="day"
              class="text-center text-xs sm:text-sm font-semibold text-base-content/70 p-1 sm:p-2"
            >
              <span class="hidden sm:inline">{{ day }}</span>
              <span class="sm:hidden">{{ day.charAt(0) }}</span>
            </div>
          </div>

          <!-- Grille du calendrier -->
          <div class="grid grid-cols-7 gap-1 sm:gap-2">
            <!-- Jours vides avant le début du mois -->
            <div
              v-for="n in firstDayOfMonth"
              :key="'empty-' + n"
              class="aspect-square"
            ></div>

            <!-- Jours du mois -->
            <div
              v-for="day in daysInMonth"
              :key="day"
              class="aspect-square"
            >
              <button
                @click="handleDayClick(day)"
                class="w-full h-full btn btn-ghost p-0 flex flex-col items-center justify-center relative"
                :class="{
                  'btn-primary': isToday(day),
                  'opacity-50': day > currentDay && isCurrentMonth
                }"
              >
                <!-- Numéro du jour -->
                <span class="text-xs sm:text-sm font-medium mb-1">{{ day }}</span>
                
                <!-- Emoji de l'humeur si existe -->
                <div v-if="getMoodForDay(day)" class="text-lg sm:text-2xl">
                  {{ getMoodEmoji(getMoodForDay(day).score) }}
                </div>
                
                <!-- Point si pas d'humeur mais jour passé -->
                <div v-else-if="day <= currentDay || !isCurrentMonth" class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-base-content/20"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Légende -->
    <div class="px-2">
      <div class="card bg-base-200/50 shadow-md">
        <div class="card-body p-4">
          <h3 class="font-semibold text-sm mb-3">Légende</h3>
          <div class="flex flex-wrap gap-3 text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <span class="text-2xl">😢</span>
              <span>Très triste (1)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">😔</span>
              <span>Triste (2)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">😐</span>
              <span>Neutre (3)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">😊</span>
              <span>Content (4)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl">😄</span>
              <span>Très content (5)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal détails du jour -->
    <dialog ref="dayModal" class="modal" :class="{ 'modal-open': showDayModal }">
      <div class="modal-box">
        <h3 class="font-bold text-base sm:text-lg mb-4">
          {{ selectedDayLabel }}
        </h3>
        
        <div v-if="selectedDayMood" class="space-y-4">
          <!-- Humeur -->
          <div class="flex items-center justify-center gap-4">
            <div class="text-5xl">{{ getMoodEmoji(selectedDayMood.score) }}</div>
            <div>
              <div class="font-semibold text-lg">{{ getMoodLabel(selectedDayMood.score) }}</div>
              <div class="rating rating-sm">
                <span
                  v-for="i in 5"
                  :key="i"
                  class="mask mask-star-2 w-4 h-4"
                  :class="i <= selectedDayMood.score ? 'bg-warning' : 'bg-base-300'"
                ></span>
              </div>
            </div>
          </div>

          <!-- Label -->
          <div v-if="selectedDayMood.label" class="alert alert-info">
            <span class="text-sm">{{ selectedDayMood.label }}</span>
          </div>

          <!-- Note -->
          <div v-if="selectedDayMood.note">
            <div class="font-semibold text-sm mb-1">Note :</div>
            <p class="text-sm text-base-content/80 whitespace-pre-wrap">{{ selectedDayMood.note }}</p>
          </div>

          <!-- Détails supplémentaires -->
          <div class="flex flex-wrap gap-2">
            <div v-if="selectedDayMood.weather?.emoji" class="badge badge-lg">
              {{ selectedDayMood.weather.emoji }} {{ selectedDayMood.weather.label }}
            </div>
            <div v-if="selectedDayMood.sleep_hours" class="badge badge-lg badge-ghost">
              😴 {{ selectedDayMood.sleep_hours }}h
            </div>
            <div v-if="selectedDayMood.energy_level" class="badge badge-lg badge-success">
              ⚡ {{ selectedDayMood.energy_level }}/5
            </div>
            <div v-if="selectedDayMood.stress_level" class="badge badge-lg badge-error">
              😰 {{ selectedDayMood.stress_level }}/5
            </div>
          </div>

          <!-- Tags -->
          <div v-if="selectedDayMood.tags && selectedDayMood.tags.length > 0">
            <div class="font-semibold text-sm mb-2">Tags :</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="tag in selectedDayMood.tags" :key="tag" class="badge badge-primary">
                {{ tag }}
              </div>
            </div>
          </div>

          <!-- Activités -->
          <div v-if="selectedDayMood.activities && selectedDayMood.activities.length > 0">
            <div class="font-semibold text-sm mb-2">Activités :</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="activity in selectedDayMood.activities" :key="activity" class="badge badge-outline">
                {{ activity }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-base-content/50">
          <div class="text-4xl mb-3">😊</div>
          <p>Pas d'humeur enregistrée ce jour-là</p>
        </div>

        <div class="modal-action">
          <button @click="closeDayModal" class="btn btn-sm">Fermer</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeDayModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMoodsStore } from '@/stores/moods'
import { format, startOfMonth, endOfMonth, getDaysInMonth, getDay, addMonths, subMonths, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const moodsStore = useMoodsStore()

// État
const currentDate = ref(new Date())
const showDayModal = ref(false)
const selectedDay = ref(null)
const monthStats = ref({
  avg: 0,
  count: 0,
  min: 0,
  max: 0,
  histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
})

// Label du mois actuel
const currentMonthLabel = computed(() => {
  return format(currentDate.value, 'MMMM yyyy', { locale: fr })
})

// Vérifier si c'est le mois actuel
const isCurrentMonth = computed(() => {
  const now = new Date()
  return currentDate.value.getMonth() === now.getMonth() &&
         currentDate.value.getFullYear() === now.getFullYear()
})

// Jour actuel
const currentDay = computed(() => {
  return isCurrentMonth.value ? new Date().getDate() : 999
})

// Nombre de jours dans le mois
const daysInMonth = computed(() => {
  return getDaysInMonth(currentDate.value)
})

// Premier jour du mois (0 = dimanche, 1 = lundi, etc.)
const firstDayOfMonth = computed(() => {
  const firstDay = startOfMonth(currentDate.value)
  const day = getDay(firstDay)
  // Convertir dimanche (0) en 7 pour commencer par lundi
  return day === 0 ? 6 : day - 1
})

// Pourcentage de régularité
const consistencyPercentage = computed(() => {
  if (daysInMonth.value === 0) return 0
  return Math.round((monthStats.value.count / daysInMonth.value) * 100)
})

// Humeurs du mois
const monthMoods = computed(() => {
  return moodsStore.moods.filter(mood => {
    const moodDate = parseISO(mood.mood_date)
    return moodDate.getMonth() === currentDate.value.getMonth() &&
           moodDate.getFullYear() === currentDate.value.getFullYear()
  })
})

// Obtenir l'humeur pour un jour spécifique
const getMoodForDay = (day) => {
  const dateStr = format(
    new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day),
    'yyyy-MM-dd'
  )
  return monthMoods.value.find(m => m.mood_date === dateStr)
}

// Vérifier si c'est aujourd'hui
const isToday = (day) => {
  if (!isCurrentMonth.value) return false
  const now = new Date()
  return day === now.getDate()
}

// Emoji selon le score
const getMoodEmoji = (score) => {
  const emojis = ['😢', '😔', '😐', '😊', '😄']
  return emojis[score - 1] || '😐'
}

// Label selon le score
const getMoodLabel = (score) => {
  const labels = ['Très triste', 'Triste', 'Neutre', 'Content', 'Très content']
  return labels[score - 1] || 'Neutre'
}

// Label du jour sélectionné
const selectedDayLabel = computed(() => {
  if (!selectedDay.value) return ''
  const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), selectedDay.value)
  return format(date, 'EEEE d MMMM yyyy', { locale: fr })
})

// Humeur du jour sélectionné
const selectedDayMood = computed(() => {
  if (!selectedDay.value) return null
  return getMoodForDay(selectedDay.value)
})

// Naviguer au mois précédent
const previousMonth = async () => {
  currentDate.value = subMonths(currentDate.value, 1)
  await loadMonthData()
}

// Naviguer au mois suivant
const nextMonth = async () => {
  if (isCurrentMonth.value) return
  currentDate.value = addMonths(currentDate.value, 1)
  await loadMonthData()
}

// Cliquer sur un jour
const handleDayClick = (day) => {
  selectedDay.value = day
  showDayModal.value = true
}

// Fermer le modal
const closeDayModal = () => {
  showDayModal.value = false
  setTimeout(() => {
    selectedDay.value = null
  }, 300)
}

// Charger les données du mois
const loadMonthData = async () => {
  const firstDay = startOfMonth(currentDate.value)
  const lastDay = endOfMonth(currentDate.value)
  
  const from = format(firstDay, 'yyyy-MM-dd')
  const to = format(lastDay, 'yyyy-MM-dd')
  
  await moodsStore.fetchMoods(from, to)
  
  // Calculer les stats du mois
  if (monthMoods.value.length > 0) {
    const scores = monthMoods.value.map(m => m.score)
    const histogram = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    scores.forEach(score => {
      histogram[score] = (histogram[score] || 0) + 1
    })
    
    monthStats.value = {
      avg: scores.reduce((sum, s) => sum + s, 0) / scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores),
      count: scores.length,
      histogram
    }
  } else {
    monthStats.value = {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
      histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
}

// Initialisation
onMounted(async () => {
  console.log('📅 Calendar - Initialisation')
  await loadMonthData()
  console.log('✅ Données du mois chargées:', monthMoods.value.length, 'humeurs')
  console.log('📊 Stats:', monthStats.value)
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Animation hover sur les jours */
.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.95);
}
</style>
