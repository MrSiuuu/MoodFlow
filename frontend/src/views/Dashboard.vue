<template>
  <div class="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
    <!-- En-tête mobile-optimisé -->
    <div class="text-center px-2">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1 sm:mb-2">
        Salut {{ authStore.userName }} 👋
      </h1>
      <p class="text-sm sm:text-base md:text-lg text-base-content/70">
        {{ greetingMessage }}
      </p>
    </div>

    <!-- Section formulaire OU confirmation -->
    <div class="px-2" id="mood-form-section">
      <!-- Si pas d'humeur aujourd'hui -->
      <div v-if="!todayMood" class="animate-fade-in">
        <MoodForm @success="handleMoodSuccess" />
      </div>

      <!-- Si humeur déjà enregistrée -->
      <div v-else class="animate-fade-in">
        <div class="alert alert-success shadow-lg">
          <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <div class="text-sm sm:text-base font-semibold">✅ Humeur du jour enregistrée !</div>
              <div class="text-xs sm:text-sm opacity-80">Clique sur ta carte ci-dessous pour modifier</div>
            </div>
          </div>
          <button @click="handleEditMood(todayMood)" class="btn btn-sm btn-ghost">
            Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Citation + Résumé de la semaine -->
    <div v-if="weekInsights && weekInsights.count > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 animate-slide-up">
      <!-- Citation du jour -->
      <div v-if="dailyQuote" class="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-md">
        <div class="card-body p-4 sm:p-6 text-center">
          <p class="text-sm sm:text-base md:text-lg italic leading-relaxed">
            "{{ dailyQuote.text }}"
          </p>
          <p class="text-xs sm:text-sm text-base-content/60 mt-2">
            — {{ dailyQuote.author }}
          </p>
        </div>
      </div>

      <!-- Résumé de la semaine -->
      <div v-if="weekSummary" class="card bg-base-200/50 shadow-md">
        <div class="card-body p-4 sm:p-6">
          <h3 class="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
            <span>📊</span>
            <span>Cette semaine</span>
          </h3>
          <p class="text-xs sm:text-sm leading-relaxed">
            {{ weekSummary }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats rapides -->
    <div v-if="weekInsights && weekInsights.count > 0" class="px-2 animate-slide-up" style="animation-delay: 0.1s">
      <div class="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100">
        <div class="stat place-items-center p-3 sm:p-4">
          <div class="stat-title text-xs sm:text-sm">Moyenne</div>
          <div class="stat-value text-xl sm:text-2xl md:text-3xl text-primary">
            {{ weekInsights.avg?.toFixed(1) || '0.0' }}
          </div>
          <div class="stat-desc text-xs">/5</div>
        </div>
        
        <div class="stat place-items-center p-3 sm:p-4">
          <div class="stat-title text-xs sm:text-sm">Humeurs</div>
          <div class="stat-value text-xl sm:text-2xl md:text-3xl">
            {{ weekInsights.count || 0 }}
          </div>
          <div class="stat-desc text-xs">/7 jours</div>
        </div>
        
        <div class="stat place-items-center p-3 sm:p-4">
          <div class="stat-title text-xs sm:text-sm">Tendance</div>
          <div class="stat-value text-xl sm:text-2xl md:text-3xl">
            <span v-if="weekInsights.trend === 'up'" class="text-success" title="En hausse">↗️</span>
            <span v-else-if="weekInsights.trend === 'down'" class="text-error" title="En baisse">↘️</span>
            <span v-else-if="weekInsights.trend === 'stable'" class="text-info" title="Stable">→</span>
            <span v-else title="Nouvelle">🆕</span>
          </div>
          <div class="stat-desc text-xs">{{ trendLabel }}</div>
        </div>
      </div>
    </div>

    <!-- Graphique (si données disponibles) -->
    <div v-if="weeklyMoods.length > 0" class="px-2 animate-slide-up" style="animation-delay: 0.2s">
      <WeekChart :moods="weeklyMoods" :stats="weekInsights" />
    </div>

    <!-- Vue semaine en cartes -->
    <div class="px-2 animate-slide-up" style="animation-delay: 0.3s">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-6">
          <h2 class="card-title text-lg sm:text-xl justify-between">
            <span>📅 Ma semaine</span>
            <span v-if="!loading" class="text-sm font-normal text-base-content/60">
              {{ weekStart }} → {{ weekEnd }}
            </span>
          </h2>
          
          <!-- Grille des jours - Mobile optimisée -->
          <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4">
            <MoodDayCard
              v-for="day in weekDays"
              :key="day.date"
              :date="day.date"
              :mood="day.mood"
              @click="handleDayClick"
              @edit="handleEditMood"
              @delete="handleDeleteMood"
            />
          </div>

          <!-- État de chargement - Skeleton -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4">
            <div v-for="i in 7" :key="i" class="skeleton h-40 sm:h-48"></div>
          </div>

          <!-- Message si aucune humeur -->
          <div v-if="!loading && weeklyMoods.length === 0" class="text-center py-8 sm:py-12">
            <div class="text-4xl sm:text-5xl mb-3 sm:mb-4">😊</div>
            <p class="text-base sm:text-lg font-medium mb-2">Aucune humeur cette semaine</p>
            <p class="text-xs sm:text-sm text-base-content/60 mb-4">
              Commence par enregistrer ton humeur du jour !
            </p>
            <button @click="scrollToTop" class="btn btn-primary btn-sm sm:btn-md">
              Enregistrer maintenant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition OU d'ajout - Full screen sur mobile -->
    <dialog ref="editModal" class="modal" :class="{ 'modal-open': showEditModal }">
      <div class="modal-box max-w-full sm:max-w-2xl h-full sm:h-auto overflow-y-auto">
        <button
          @click="closeEditModal"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
        >
          ✕
        </button>
        <h3 class="font-bold text-lg mb-4">
          {{ selectedMood ? 'Modifier mon humeur' : 'Ajouter mon humeur' }}
        </h3>
        <MoodForm
          :initial-data="selectedMood"
          :edit-mode="!!selectedMood"
          @success="handleEditSuccess"
          @cancel="closeEditModal"
        />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeEditModal">close</button>
      </form>
    </dialog>

    <!-- Modal de confirmation suppression -->
    <dialog ref="deleteModal" class="modal" :class="{ 'modal-open': showDeleteModal }">
      <div class="modal-box">
        <h3 class="font-bold text-base sm:text-lg">Supprimer cette humeur ?</h3>
        <p class="py-4 text-sm sm:text-base">
          Confirmes-tu la suppression de l'humeur du 
          <strong>{{ formatDate(selectedMood?.mood_date) }}</strong> ?
          <br />
          <span class="text-xs sm:text-sm text-error">Cette action est irréversible.</span>
        </p>
        <div class="modal-action">
          <button
            @click="closeDeleteModal"
            class="btn btn-ghost btn-sm sm:btn-md"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
            class="btn btn-error btn-sm sm:btn-md"
            :class="{ 'loading': deleting }"
            :disabled="deleting"
          >
            <span v-if="!deleting">Supprimer</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeDeleteModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMoodsStore } from '@/stores/moods'
import { useInsightsStore } from '@/stores/insights'
import { useToast } from 'vue-toastification'
import { startOfWeek, addDays, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import MoodForm from '@/components/MoodForm.vue'
import MoodDayCard from '@/components/MoodDayCard.vue'
import WeekChart from '@/components/WeekChart.vue'

const authStore = useAuthStore()
const moodsStore = useMoodsStore()
const insightsStore = useInsightsStore()
const toast = useToast()

const loading = ref(true)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedMood = ref(null)
const deleting = ref(false)

// Message de bienvenue selon l'heure (mobile-friendly)
const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Comment te sens-tu ce matin ?'
  if (hour < 18) return 'Comment s\'est passée ta journée ?'
  return 'Comment était ta journée ?'
})

// Humeur du jour
const todayMood = computed(() => moodsStore.getTodayMood())

// Humeurs de la semaine
const weeklyMoods = computed(() => moodsStore.getWeeklyMoods())

// Insights de la semaine
const weekInsights = computed(() => moodsStore.weeklyStats)

// Citation du jour
const dailyQuote = computed(() => insightsStore.dailyQuote)

// Résumé de la semaine
const weekSummary = computed(() => insightsStore.weekSummary)

// Label de tendance
const trendLabel = computed(() => {
  switch (weekInsights.value?.trend) {
    case 'up': return 'En hausse'
    case 'down': return 'En baisse'
    case 'stable': return 'Stable'
    default: return 'Nouvelle'
  }
})

// Dates de la semaine
const weekStart = computed(() => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  return format(monday, 'd MMM', { locale: fr })
})

const weekEnd = computed(() => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  const sunday = addDays(monday, 6)
  return format(sunday, 'd MMM', { locale: fr })
})

// Jours de la semaine
const weekDays = computed(() => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const mood = weeklyMoods.value.find(m => m.mood_date === dateStr)
    
    return {
      date: dateStr,
      mood: mood || null,
    }
  })
})

// Charger les données
const loadData = async () => {
  loading.value = true
  
  try {
    const today = new Date()
    const monday = startOfWeek(today, { weekStartsOn: 1 })
    const sunday = addDays(monday, 6)
    
    const from = format(monday, 'yyyy-MM-dd')
    const to = format(sunday, 'yyyy-MM-dd')
    
    // Charger en parallèle
    await Promise.all([
      moodsStore.fetchMoods(from, to),
      moodsStore.fetchWeeklyStats(),
      insightsStore.loadWeekInsights()
    ])
  } catch (error) {
    console.error('Erreur chargement données:', error)
    toast.error('Erreur lors du chargement')
  } finally {
    loading.value = false
  }
}

// Formater une date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return format(parseISO(dateStr), 'EEEE d MMMM yyyy', { locale: fr })
}

// Handlers
const handleMoodSuccess = async () => {
  // Les données sont déjà mises à jour via Optimistic UI
  // On recharge juste pour être sûr
  await loadData()
}

const handleDayClick = ({ date, mood }) => {
  if (!mood) {
    // Si c'est aujourd'hui, ouvrir le modal d'ajout
    const today = format(new Date(), 'yyyy-MM-dd')
    if (date === today) {
      // Ouvrir modal pour ajouter l'humeur d'aujourd'hui
      selectedMood.value = null
      showEditModal.value = true
    } else {
      // Pour les autres jours passés, on ne peut pas ajouter
      toast.info('Vous ne pouvez enregistrer que pour aujourd\'hui')
    }
  } else {
    // Ouvrir en édition
    handleEditMood(mood)
  }
}

const handleEditMood = (mood) => {
  selectedMood.value = mood
  showEditModal.value = true
}

const handleDeleteMood = (mood) => {
  selectedMood.value = mood
  showDeleteModal.value = true
}

const handleEditSuccess = async () => {
  closeEditModal()
  // Optimistic UI déjà actif, pas besoin de recharger
  // Mais on peut recharger pour être sûr d'avoir les bonnes données
  await loadData()
}

const closeEditModal = () => {
  showEditModal.value = false
  setTimeout(() => {
    selectedMood.value = null
  }, 300)
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  setTimeout(() => {
    selectedMood.value = null
  }, 300)
}

const confirmDelete = async () => {
  if (!selectedMood.value) return
  
  deleting.value = true
  
  try {
    await moodsStore.deleteMood(selectedMood.value.id)
    toast.success('🗑️ Humeur supprimée')
    closeDeleteModal()
  } catch (error) {
    console.error('Erreur suppression:', error)
    toast.error('Erreur lors de la suppression')
  } finally {
    deleting.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // Mettre le focus sur le formulaire après un court délai
  setTimeout(() => {
    const formSection = document.getElementById('mood-form-section')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

// Import parseISO pour le formatage
import { parseISO } from 'date-fns'

// Initialisation
onMounted(async () => {
  await loadData()
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

/* Skeleton shimmer effect */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

:global(.dark) .skeleton {
  background: linear-gradient(90deg, #2a2a2a 25%, #1a1a1a 50%, #2a2a2a 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Touch feedback sur mobile */
@media (hover: none) and (pointer: coarse) {
  .card:active {
    transform: scale(0.98);
  }
  
  .btn:active {
    transform: scale(0.95);
  }
}
</style>
