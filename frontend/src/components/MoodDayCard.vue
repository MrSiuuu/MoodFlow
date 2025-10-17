<template>
  <div
    class="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border-2 group"
    :class="[
      mood ? 'border-primary/30 hover:border-primary' : 'border-base-300 hover:border-base-content/20',
      { 'opacity-50': !mood && !isToday },
      { 'ring-2 ring-primary ring-offset-2': isToday && mood }
    ]"
    @click="handleClick"
  >
    <div class="card-body p-3 sm:p-4">
      <!-- En-tête : Jour + Date -->
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <h3 class="font-semibold text-xs sm:text-sm" :class="{ 'text-primary': isToday }">
            {{ dayName }}
          </h3>
          <p class="text-xs text-base-content/60">
            {{ formattedDate }}
          </p>
        </div>
        
        <!-- Badge aujourd'hui -->
        <div v-if="isToday" class="badge badge-primary badge-sm">
          Aujourd'hui
        </div>
        
        <!-- Indicateur optimiste -->
        <div v-if="mood?._optimistic" class="badge badge-ghost badge-sm">
          <span class="loading loading-spinner loading-xs"></span>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex-1 flex flex-col items-center justify-center py-1 sm:py-2 min-h-[100px] sm:min-h-[120px]">
        <template v-if="mood">
          <!-- Emoji de l'humeur -->
          <div class="text-3xl sm:text-4xl mb-1 transition-transform group-hover:scale-110">
            {{ moodEmoji }}
          </div>
          
          <!-- Score + Label -->
          <div class="text-center w-full">
            <p class="font-medium text-xs sm:text-sm mb-0.5">
              {{ moodLabel }}
            </p>
            <div class="rating rating-xs gap-0.5">
              <span
                v-for="i in 5"
                :key="i"
                class="mask mask-star-2 w-2.5 h-2.5 sm:w-3 sm:h-3"
                :class="i <= mood.score ? 'bg-warning' : 'bg-base-300'"
              ></span>
            </div>
          </div>

          <!-- Label personnalisé -->
          <p v-if="mood.label" class="text-xs text-base-content/70 mt-1 text-center line-clamp-1 px-1">
            {{ mood.label }}
          </p>

          <!-- Indicateurs en bas -->
          <div class="flex gap-1 mt-1 sm:mt-2 flex-wrap justify-center">
            <!-- Météo -->
            <div v-if="mood.weather?.emoji" class="tooltip" :data-tip="mood.weather.label">
              <span class="text-sm sm:text-base">{{ mood.weather.emoji }}</span>
            </div>
            
            <!-- Tags count -->
            <div v-if="mood.tags && mood.tags.length > 0" class="badge badge-xs sm:badge-sm badge-ghost gap-1">
              <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span class="text-xs">{{ mood.tags.length }}</span>
            </div>
            
            <!-- Activities count -->
            <div v-if="mood.activities && mood.activities.length > 0" class="badge badge-xs sm:badge-sm badge-ghost gap-1">
              <span class="text-xs">🎯 {{ mood.activities.length }}</span>
            </div>
            
            <!-- Sleep -->
            <div v-if="mood.sleep_hours" class="badge badge-xs sm:badge-sm badge-ghost gap-1">
              <span class="text-xs">😴 {{ mood.sleep_hours }}h</span>
            </div>
            
            <!-- Energy -->
            <div v-if="mood.energy_level" class="badge badge-xs sm:badge-sm" :class="energyBadgeClass">
              <span class="text-xs">⚡ {{ mood.energy_level }}</span>
            </div>
            
            <!-- Stress -->
            <div v-if="mood.stress_level" class="badge badge-xs sm:badge-sm" :class="stressBadgeClass">
              <span class="text-xs">😰 {{ mood.stress_level }}</span>
            </div>
          </div>
        </template>

        <!-- État vide -->
        <template v-else>
          <div class="text-3xl sm:text-4xl text-base-content/20 mb-2">
            {{ isToday ? '😊' : '○' }}
          </div>
          <p class="text-xs sm:text-sm text-base-content/40 text-center mb-2">
            {{ isToday ? 'Pas encore d\'humeur' : 'Pas d\'humeur' }}
          </p>
          <!-- Bouton CTA si c'est aujourd'hui -->
          <button 
            v-if="isToday && !readonly"
            @click.stop="handleClick"
            class="btn btn-primary btn-xs sm:btn-sm mt-1"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-xs sm:text-sm">Ajouter</span>
          </button>
        </template>
      </div>

      <!-- Actions (visible au survol) -->
      <div v-if="mood && !readonly" class="card-actions justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="handleEdit"
          class="btn btn-ghost btn-xs"
          title="Modifier"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button
          @click.stop="handleDelete"
          class="btn btn-ghost btn-xs text-error"
          title="Supprimer"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, parseISO, isToday as checkIsToday } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps({
  date: {
    type: String, // Format YYYY-MM-DD
    required: true,
  },
  mood: {
    type: Object,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'edit', 'delete'])

// Parseur de date
const parsedDate = computed(() => parseISO(props.date))

// Vérifier si c'est aujourd'hui
const isToday = computed(() => checkIsToday(parsedDate.value))

// Nom du jour
const dayName = computed(() => {
  return format(parsedDate.value, 'EEEE', { locale: fr })
})

// Date formatée
const formattedDate = computed(() => {
  return format(parsedDate.value, 'd MMM', { locale: fr })
})

// Emoji de l'humeur
const moodEmoji = computed(() => {
  if (!props.mood) return ''
  
  const emojis = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '😊',
    5: '😄',
  }
  
  return emojis[props.mood.score] || '😐'
})

// Label de l'humeur
const moodLabel = computed(() => {
  if (!props.mood) return ''
  
  const labels = {
    1: 'Très triste',
    2: 'Triste',
    3: 'Neutre',
    4: 'Content',
    5: 'Très content',
  }
  
  return labels[props.mood.score] || 'Neutre'
})

// Badge classe pour énergie
const energyBadgeClass = computed(() => {
  if (!props.mood?.energy_level) return 'badge-ghost'
  const level = props.mood.energy_level
  if (level >= 4) return 'badge-success'
  if (level >= 3) return 'badge-warning'
  return 'badge-error'
})

// Badge classe pour stress
const stressBadgeClass = computed(() => {
  if (!props.mood?.stress_level) return 'badge-ghost'
  const level = props.mood.stress_level
  if (level >= 4) return 'badge-error'
  if (level >= 3) return 'badge-warning'
  return 'badge-success'
})

// Handlers
const handleClick = () => {
  emit('click', { date: props.date, mood: props.mood })
}

const handleEdit = () => {
  emit('edit', props.mood)
}

const handleDelete = () => {
  emit('delete', props.mood)
}
</script>

<style scoped>
.card {
  min-height: 120px;
}

@media (min-width: 640px) {
  .card {
    min-height: 150px;
  }
}

.card:hover .card-actions {
  opacity: 1 !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation douce au survol */
.card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:active {
  transform: scale(0.98);
}
</style>
