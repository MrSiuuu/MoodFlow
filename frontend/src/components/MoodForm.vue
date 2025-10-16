<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box w-11/12 max-w-md">
      <h3 class="font-bold text-lg mb-4">
        {{ isEditing ? 'Modifier l\'humeur' : 'Ajouter une humeur' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Date</span>
          </label>
          <input 
            type="date" 
            v-model="formData.mood_date"
            class="input input-bordered"
            :disabled="isEditing"
            required
          />
        </div>
        
        <!-- Score -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Comment te sens-tu ?</span>
          </label>
          <div class="flex justify-center space-x-2 mb-2">
            <button
              v-for="score in 5"
              :key="score"
              type="button"
              @click="formData.score = score"
              class="btn-mood"
              :class="{
                [`mood-score-${score}`]: formData.score === score,
                'btn-outline': formData.score !== score
              }"
            >
              {{ getMoodDisplay(score).emoji }}
            </button>
          </div>
          <div class="text-center text-sm text-base-content/70">
            {{ formData.score ? getMoodDisplay(formData.score).label : 'Sélectionne ton humeur' }}
          </div>
        </div>
        
        <!-- Label -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Label (optionnel)</span>
          </label>
          <input 
            type="text" 
            v-model="formData.label"
            placeholder="Ex: Fatigué, En forme, Stressé..."
            class="input input-bordered"
            maxlength="50"
          />
        </div>
        
        <!-- Note -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Note (optionnel)</span>
          </label>
          <textarea 
            v-model="formData.note"
            placeholder="Décris ce qui influence ton humeur..."
            class="textarea textarea-bordered h-24 resize-none"
            maxlength="2000"
          ></textarea>
          <div class="label">
            <span class="label-text-alt">{{ formData.note?.length || 0 }}/2000</span>
          </div>
        </div>
        
        <!-- Météo -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Météo (optionnel)</span>
          </label>
          <div class="flex justify-center space-x-2">
            <button
              v-for="weather in weatherOptions"
              :key="weather.emoji"
              type="button"
              @click="formData.weather = { emoji: weather.emoji, condition: weather.condition }"
              class="btn btn-sm"
              :class="{
                'btn-primary': formData.weather?.emoji === weather.emoji,
                'btn-outline': formData.weather?.emoji !== weather.emoji
              }"
            >
              {{ weather.emoji }}
            </button>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="modal-action">
          <button 
            type="button" 
            @click="$emit('close')"
            class="btn btn-ghost"
            :disabled="loading"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || !formData.score"
            :class="{ 'loading': loading }"
          >
            {{ isEditing ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getMoodDisplay, formatDate } from '@/lib/utils'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingMood: {
    type: Object,
    default: null
  },
  selectedDate: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  mood_date: '',
  score: null,
  label: '',
  note: '',
  weather: null
})

const weatherOptions = [
  { emoji: '☀️', condition: 'Ensoleillé' },
  { emoji: '⛅', condition: 'Nuageux' },
  { emoji: '🌧️', condition: 'Pluvieux' },
  { emoji: '❄️', condition: 'Neigeux' },
  { emoji: '🌤️', condition: 'Partiellement nuageux' },
  { emoji: '⛈️', condition: 'Orageux' }
]

const isEditing = computed(() => !!props.editingMood)

// Réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    mood_date: props.selectedDate || formatDate(new Date(), 'yyyy-MM-dd'),
    score: null,
    label: '',
    note: '',
    weather: null
  }
}

// Watcher pour l'édition
watch(() => props.editingMood, (newMood) => {
  if (newMood) {
    formData.value = {
      mood_date: newMood.mood_date,
      score: newMood.score,
      label: newMood.label || '',
      note: newMood.note || '',
      weather: newMood.weather || null
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watcher pour la date sélectionnée
watch(() => props.selectedDate, (newDate) => {
  if (newDate && !isEditing.value) {
    formData.value.mood_date = newDate
  }
})

const handleSubmit = () => {
  if (!formData.value.score) return
  
  const submitData = { ...formData.value }
  if (!submitData.weather) {
    delete submitData.weather
  }
  
  emit('submit', submitData)
}
</script>
