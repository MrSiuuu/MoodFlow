<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body p-4 sm:p-6">
      <h2 class="card-title text-xl sm:text-2xl justify-center">
        {{ editMode ? '✏️ Modifier mon humeur' : '😊 Comment vas-tu aujourd\'hui ?' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        <!-- 1. HUMEUR (PRINCIPAL) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-bold text-base sm:text-lg">Mon humeur *</span>
          </label>
          <div class="flex gap-2 sm:gap-3 justify-center py-3 sm:py-4">
            <button
              v-for="mood in moods"
              :key="mood.score"
              type="button"
              @click="formData.score = mood.score"
              class="btn btn-circle transition-all duration-200"
              :class="[
                formData.score === mood.score 
                  ? 'btn-primary scale-110 shadow-lg ring-4 ring-primary/30' 
                  : 'btn-ghost opacity-60 hover:opacity-100 hover:scale-105',
                'w-14 h-14 sm:w-16 sm:h-16'
              ]"
              :title="mood.label"
            >
              <span class="text-3xl sm:text-4xl">{{ mood.emoji }}</span>
            </button>
          </div>
          <div v-if="formData.score" class="text-center mt-2">
            <p class="text-base sm:text-lg font-medium">{{ getMoodLabel(formData.score) }}</p>
            <div class="rating rating-sm gap-1 mt-1">
              <span
                v-for="i in 5"
                :key="i"
                class="mask mask-star-2 w-4 h-4"
                :class="i <= formData.score ? 'bg-warning' : 'bg-base-300'"
              ></span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider text-xs sm:text-sm opacity-50">Détails optionnels</div>

        <!-- 2. LABEL & NOTE -->
        <div class="grid grid-cols-1 gap-4">
          <!-- Label court -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-sm sm:text-base">En quelques mots</span>
              <span class="label-text-alt text-xs">{{ formData.label.length }}/100</span>
            </label>
            <input
              v-model="formData.label"
              type="text"
              placeholder="Ex: Journée productive ✨"
              maxlength="100"
              class="input input-bordered input-sm sm:input-md w-full"
            />
          </div>

          <!-- Note détaillée -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-sm sm:text-base">Note détaillée</span>
              <span class="label-text-alt text-xs">{{ formData.note.length }}/2000</span>
            </label>
            <textarea
              v-model="formData.note"
              class="textarea textarea-bordered text-sm sm:text-base h-20 sm:h-24"
              placeholder="Raconte ta journée, tes émotions..."
              maxlength="2000"
            ></textarea>
          </div>
        </div>

        <!-- 3. CONTEXTE (Météo, Lieu, Tags) -->
        <div class="collapse collapse-arrow bg-base-200/50 rounded-lg">
          <input type="checkbox" v-model="showContextSection" />
          <div class="collapse-title text-sm sm:text-base font-medium">
            🌤️ Contexte & Environnement
          </div>
          <div class="collapse-content space-y-4">
            <!-- Météo -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-sm">Météo</span>
              </label>
              <div class="flex gap-1 sm:gap-2 flex-wrap">
                <button
                  v-for="weather in weatherOptions"
                  :key="weather.emoji"
                  type="button"
                  @click="selectWeather(weather)"
                  class="btn btn-xs sm:btn-sm"
                  :class="{
                    'btn-primary': formData.weather?.emoji === weather.emoji,
                    'btn-ghost': formData.weather?.emoji !== weather.emoji
                  }"
                >
                  {{ weather.emoji }}
                  <span class="hidden sm:inline ml-1">{{ weather.label }}</span>
                </button>
              </div>
            </div>

            <!-- Tags -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-sm">Tags personnalisés</span>
              </label>
              <div class="flex gap-2 flex-wrap mb-2">
                <div
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="badge badge-primary gap-1"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="btn btn-ghost btn-xs p-0 h-auto min-h-0 w-4"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div class="join w-full">
                <input
                  v-model="newTag"
                  @keyup.enter="addTag"
                  type="text"
                  placeholder="Ajouter un tag..."
                  class="input input-bordered input-sm sm:input-md join-item flex-1"
                  maxlength="30"
                />
                <button
                  type="button"
                  @click="addTag"
                  class="btn btn-primary btn-sm sm:btn-md join-item"
                  :disabled="!newTag.trim()"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Activités -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-sm">Activités du jour</span>
              </label>
              <div class="flex gap-1 sm:gap-2 flex-wrap">
                <button
                  v-for="activity in commonActivities"
                  :key="activity"
                  type="button"
                  @click="toggleActivity(activity)"
                  class="btn btn-xs sm:btn-sm"
                  :class="{
                    'btn-primary': formData.activities.includes(activity),
                    'btn-outline': !formData.activities.includes(activity)
                  }"
                >
                  {{ activity }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. BIEN-ÊTRE (Sommeil, Énergie, Stress) -->
        <div class="collapse collapse-arrow bg-base-200/50 rounded-lg">
          <input type="checkbox" v-model="showWellnessSection" />
          <div class="collapse-title text-sm sm:text-base font-medium">
            💪 Bien-être & Santé
          </div>
          <div class="collapse-content space-y-4">
            <!-- Heures de sommeil -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-sm">Heures de sommeil</span>
                <span class="label-text-alt text-sm font-medium">{{ formData.sleep_hours || '—' }}h</span>
              </label>
              <input
                v-model.number="formData.sleep_hours"
                type="range"
                min="0"
                max="12"
                step="0.5"
                class="range range-primary range-sm"
              />
              <div class="w-full flex justify-between text-xs px-2 mt-1 opacity-60">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            <!-- Niveau d'énergie -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-sm">Niveau d'énergie</span>
              </label>
              <div class="flex gap-2 justify-center">
                <button
                  v-for="level in 5"
                  :key="'energy-' + level"
                  type="button"
                  @click="formData.energy_level = level"
                  class="btn btn-sm sm:btn-md btn-circle"
                  :class="{
                    'btn-success': formData.energy_level === level,
                    'btn-ghost opacity-50': formData.energy_level !== level
                  }"
                >
                  {{ level }}
                </button>
              </div>
              <p class="text-xs text-center mt-1 opacity-60">1 = Épuisé → 5 = Plein d'énergie</p>
            </div>

            <!-- Niveau de stress -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-sm">Niveau de stress</span>
              </label>
              <div class="flex gap-2 justify-center">
                <button
                  v-for="level in 5"
                  :key="'stress-' + level"
                  type="button"
                  @click="formData.stress_level = level"
                  class="btn btn-sm sm:btn-md btn-circle"
                  :class="{
                    'btn-error': formData.stress_level === level,
                    'btn-ghost opacity-50': formData.stress_level !== level
                  }"
                >
                  {{ level }}
                </button>
              </div>
              <p class="text-xs text-center mt-1 opacity-60">1 = Zen → 5 = Très stressé</p>
            </div>
          </div>
        </div>

        <!-- Date (visible si édition) -->
        <div v-if="editMode" class="form-control">
          <label class="label py-1">
            <span class="label-text text-sm">Date</span>
          </label>
          <input
            v-model="formData.mood_date"
            type="date"
            class="input input-bordered input-sm sm:input-md w-full"
            :max="today"
            disabled
          />
        </div>

        <!-- Boutons d'action - Mobile optimisé -->
        <div class="card-actions justify-end gap-2 pt-2">
          <button
            v-if="editMode"
            type="button"
            @click="$emit('cancel')"
            class="btn btn-ghost btn-sm sm:btn-md"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary btn-sm sm:btn-md flex-1 sm:flex-none"
            :class="{ 'loading': loading }"
            :disabled="!formData.score || loading"
          >
            <svg v-if="!loading" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span v-if="!loading" class="text-sm sm:text-base">
              {{ editMode ? 'Mettre à jour' : 'Enregistrer' }}
            </span>
            <span v-else class="text-sm sm:text-base">Enregistrement...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useMoodsStore } from '@/stores/moods'
import { useToast } from 'vue-toastification'

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['success', 'cancel'])

const moodsStore = useMoodsStore()
const toast = useToast()

// Options d'humeur
const moods = [
  { score: 1, emoji: '😢', label: 'Très triste' },
  { score: 2, emoji: '😔', label: 'Triste' },
  { score: 3, emoji: '😐', label: 'Neutre' },
  { score: 4, emoji: '😊', label: 'Content' },
  { score: 5, emoji: '😄', label: 'Très content' },
]

// Options météo
const weatherOptions = [
  { emoji: '☀️', label: 'Soleil', condition: 'sunny' },
  { emoji: '⛅', label: 'Nuages', condition: 'cloudy' },
  { emoji: '🌧️', label: 'Pluie', condition: 'rainy' },
  { emoji: '⛈️', label: 'Orage', condition: 'stormy' },
  { emoji: '❄️', label: 'Neige', condition: 'snowy' },
  { emoji: '🌤️', label: 'Mitigé', condition: 'partly-cloudy' },
]

// Activités communes
const commonActivities = [
  '🏃 Sport', '💼 Travail', '👨‍👩‍👧 Famille', '🎮 Loisirs',
  '📚 Lecture', '🎬 Cinéma', '🍽️ Resto', '🛌 Repos',
  '🎨 Créatif', '🧘 Méditation', '🎵 Musique', '🚶 Marche'
]

// État des sections repliables
const showContextSection = ref(false)
const showWellnessSection = ref(false)

// Date du jour
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// État du formulaire
const formData = reactive({
  score: null,
  label: '',
  note: '',
  weather: null,
  tags: [],
  activities: [],
  sleep_hours: null,
  energy_level: null,
  stress_level: null,
  mood_date: today.value,
})

// Pour les tags
const newTag = ref('')

const loading = computed(() => moodsStore.loading)

// Initialiser avec les données existantes si en mode édition
if (props.initialData) {
  formData.score = props.initialData.score
  formData.label = props.initialData.label || ''
  formData.note = props.initialData.note || ''
  formData.weather = props.initialData.weather || null
  formData.tags = props.initialData.tags || []
  formData.activities = props.initialData.activities || []
  formData.sleep_hours = props.initialData.sleep_hours || null
  formData.energy_level = props.initialData.energy_level || null
  formData.stress_level = props.initialData.stress_level || null
  formData.mood_date = props.initialData.mood_date || today.value
  
  // Ouvrir les sections si des données sont présentes
  if (formData.weather || formData.tags.length > 0 || formData.activities.length > 0) {
    showContextSection.value = true
  }
  if (formData.sleep_hours || formData.energy_level || formData.stress_level) {
    showWellnessSection.value = true
  }
}

// Obtenir le label de l'humeur
const getMoodLabel = (score) => {
  return moods.find(m => m.score === score)?.label || ''
}

// Sélectionner la météo
const selectWeather = (weather) => {
  if (formData.weather?.emoji === weather.emoji) {
    formData.weather = null
  } else {
    formData.weather = {
      emoji: weather.emoji,
      condition: weather.condition,
      label: weather.label,
    }
  }
}

// Gestion des tags
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
    formData.tags.push(tag)
    newTag.value = ''
  } else if (formData.tags.length >= 10) {
    toast.warning('Maximum 10 tags')
  }
}

const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

// Gestion des activités
const toggleActivity = (activity) => {
  const index = formData.activities.indexOf(activity)
  if (index > -1) {
    formData.activities.splice(index, 1)
  } else {
    formData.activities.push(activity)
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!formData.score) {
    toast.error('Veuillez sélectionner votre humeur')
    return
  }

  const data = {
    mood_date: formData.mood_date,
    score: formData.score,
    label: formData.label || null,
    note: formData.note || null,
    weather: formData.weather || null,
    tags: formData.tags.length > 0 ? formData.tags : [],
    activities: formData.activities.length > 0 ? formData.activities : [],
    sleep_hours: formData.sleep_hours || null,
    energy_level: formData.energy_level || null,
    stress_level: formData.stress_level || null,
  }

  try {
    if (props.editMode && props.initialData?.id) {
      // Mise à jour
      await moodsStore.updateMood(props.initialData.id, {
        score: data.score,
        label: data.label,
        note: data.note,
        weather: data.weather,
        tags: data.tags,
        activities: data.activities,
        sleep_hours: data.sleep_hours,
        energy_level: data.energy_level,
        stress_level: data.stress_level,
      })
      toast.success('✅ Humeur mise à jour !')
    } else {
      // Création avec Optimistic UI
      await moodsStore.addMood(data)
      toast.success('✅ Humeur enregistrée !')
      
      // Réinitialiser le formulaire
      formData.score = null
      formData.label = ''
      formData.note = ''
      formData.weather = null
      formData.tags = []
      formData.activities = []
      formData.sleep_hours = null
      formData.energy_level = null
      formData.stress_level = null
      showContextSection.value = false
      showWellnessSection.value = false
    }

    emit('success')
  } catch (error) {
    console.error('Erreur enregistrement humeur:', error)
    if (error.response?.status === 409) {
      toast.error('❌ Une humeur existe déjà pour cette date')
    } else {
      toast.error('❌ Erreur lors de l\'enregistrement')
    }
  }
}
</script>

<style scoped>
.btn-circle {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-circle:active {
  transform: scale(0.95);
}

/* Responsive touch targets */
@media (max-width: 640px) {
  .btn-circle {
    min-width: 3.5rem;
    min-height: 3.5rem;
  }
}
</style>
