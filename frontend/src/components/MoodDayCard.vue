<template>
  <div 
    class="card-mood p-4 text-center transition-all duration-300 hover:scale-105"
    :class="{
      'opacity-50': day.isFuture,
      'ring-2 ring-primary': day.isToday
    }"
  >
    <!-- Jour de la semaine -->
    <div class="text-sm font-medium text-base-content/70 mb-2">
      {{ day.dayShort }}
    </div>
    
    <!-- Date -->
    <div class="text-xs text-base-content/50 mb-3">
      {{ formatDate(day.date, 'dd/MM') }}
    </div>
    
    <!-- Humeur existante -->
    <div v-if="day.mood" class="space-y-2">
      <!-- Emoji et score -->
      <div 
        class="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl font-bold"
        :class="`mood-score-${day.mood.score}`"
      >
        {{ getMoodDisplay(day.mood.score).emoji }}
      </div>
      
      <!-- Label -->
      <div v-if="day.mood.label" class="text-xs font-medium text-base-content">
        {{ day.mood.label }}
      </div>
      
      <!-- Note (aperçu) -->
      <div v-if="day.mood.note" class="text-xs text-base-content/60 truncate">
        {{ day.mood.note.substring(0, 20) }}{{ day.mood.note.length > 20 ? '...' : '' }}
      </div>
      
      <!-- Actions -->
      <div class="flex justify-center space-x-1">
        <button 
          @click="$emit('edit', day.mood)"
          class="btn btn-xs btn-ghost"
          :disabled="day.isFuture"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button 
          @click="$emit('delete', day.mood)"
          class="btn btn-xs btn-ghost text-error"
          :disabled="day.isFuture"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Pas d'humeur -->
    <div v-else class="space-y-2">
      <div class="w-12 h-12 mx-auto rounded-full bg-base-300 flex items-center justify-center">
        <svg class="w-6 h-6 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </div>
      
      <button 
        @click="$emit('add', day)"
        class="btn btn-xs btn-primary"
        :disabled="day.isFuture"
      >
        Ajouter
      </button>
    </div>
  </div>
</template>

<script setup>
import { getMoodDisplay, formatDate } from '@/lib/utils'

defineProps({
  day: {
    type: Object,
    required: true
  }
})

defineEmits(['add', 'edit', 'delete'])
</script>
