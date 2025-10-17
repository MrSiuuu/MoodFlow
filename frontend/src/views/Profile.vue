<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- En-tête -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gradient mb-2">Mon Profil</h1>
      <p class="text-lg text-base-content/70">Gérez vos informations personnelles</p>
    </div>

    <!-- Informations du profil -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Informations personnelles</h2>
        
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <!-- Email (lecture seule) -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              :value="authStore.userEmail"
              type="email"
              class="input input-bordered w-full"
              disabled
            />
            <label class="label">
              <span class="label-text-alt text-base-content/50">
                L'email ne peut pas être modifié
              </span>
            </label>
          </div>

          <!-- Nom d'affichage -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nom d'affichage</span>
            </label>
            <input
              v-model="profileForm.display_name"
              type="text"
              placeholder="Comment souhaitez-vous être appelé ?"
              class="input input-bordered w-full"
              :disabled="authStore.loading"
            />
          </div>

          <!-- Rôle (lecture seule) -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Rôle</span>
            </label>
            <div class="flex items-center gap-2">
              <div class="badge" :class="authStore.isAdmin ? 'badge-error' : 'badge-primary'">
                {{ authStore.isAdmin ? 'Administrateur' : 'Utilisateur' }}
              </div>
            </div>
          </div>

          <!-- Date d'inscription -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Membre depuis</span>
            </label>
            <p class="text-base-content/70">
              {{ memberSince }}
            </p>
          </div>

          <!-- Bouton de sauvegarde -->
          <div class="card-actions justify-end">
            <button
              type="submit"
              class="btn btn-primary"
              :class="{ 'loading': authStore.loading }"
              :disabled="authStore.loading || !hasChanges"
            >
              <span v-if="!authStore.loading">Enregistrer</span>
              <span v-else>Enregistrement...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Changer le mot de passe -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Sécurité</h2>
        
        <form @submit.prevent="handleUpdatePassword" class="space-y-4">
          <!-- Nouveau mot de passe -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nouveau mot de passe</span>
            </label>
            <div class="relative">
              <input
                v-model="passwordForm.newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input input-bordered w-full pr-10"
                :disabled="authStore.loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                tabindex="-1"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirmer le mot de passe -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirmer le mot de passe</span>
            </label>
            <input
              v-model="passwordForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="input input-bordered w-full"
              :disabled="authStore.loading"
            />
          </div>

          <!-- Bouton de changement -->
          <div class="card-actions justify-end">
            <button
              type="submit"
              class="btn btn-secondary"
              :class="{ 'loading': authStore.loading }"
              :disabled="authStore.loading || !passwordForm.newPassword"
            >
              <span v-if="!authStore.loading">Changer le mot de passe</span>
              <span v-else>Changement...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Statistiques personnelles -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Mes statistiques</h2>
        
        <div class="stats stats-vertical sm:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="stat-title">Total d'entrées</div>
            <div class="stat-value text-primary">{{ totalEntries }}</div>
            <div class="stat-desc">Humeurs enregistrées</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-secondary">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="stat-title">Moyenne globale</div>
            <div class="stat-value text-secondary">{{ globalAverage }}/5</div>
            <div class="stat-desc">Toutes périodes confondues</div>
          </div>
          
          <div class="stat">
            <div class="stat-figure text-accent">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Série actuelle</div>
            <div class="stat-value text-accent">{{ currentStreak }}</div>
            <div class="stat-desc">Jours consécutifs</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone dangereuse -->
    <div class="card bg-error/10 border-2 border-error/30 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-error">Zone dangereuse</h2>
        <p class="text-base-content/70">
          Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière.
        </p>
        <div class="card-actions justify-end">
          <button class="btn btn-error btn-outline" disabled>
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMoodsStore } from '@/stores/moods'
import { useToast } from 'vue-toastification'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const authStore = useAuthStore()
const moodsStore = useMoodsStore()
const toast = useToast()

// Formulaires
const profileForm = reactive({
  display_name: '',
})

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: '',
})

const showPassword = ref(false)

// Initialiser le formulaire avec les données actuelles
onMounted(() => {
  if (authStore.userProfile) {
    profileForm.display_name = authStore.userProfile.display_name || ''
  }
})

// Vérifier si le profil a changé
const hasChanges = computed(() => {
  if (!authStore.userProfile) return false
  return profileForm.display_name !== (authStore.userProfile.display_name || '')
})

// Date d'inscription formatée
const memberSince = computed(() => {
  if (!authStore.userProfile?.created_at) return 'Inconnu'
  
  try {
    return format(new Date(authStore.userProfile.created_at), 'PPPP', { locale: fr })
  } catch {
    return 'Inconnu'
  }
})

// Statistiques
const totalEntries = computed(() => moodsStore.moods.length)

const globalAverage = computed(() => {
  const moods = moodsStore.moods
  if (moods.length === 0) return '0.0'
  
  const sum = moods.reduce((acc, mood) => acc + mood.score, 0)
  return (sum / moods.length).toFixed(1)
})

const currentStreak = computed(() => {
  // TODO: Calculer la série de jours consécutifs
  return 0
})

// Handlers
const handleUpdateProfile = async () => {
  const result = await authStore.updateProfile({
    display_name: profileForm.display_name,
  })
  
  if (result.success) {
    toast.success('Profil mis à jour !')
  }
}

const handleUpdatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    toast.error('Le mot de passe doit contenir au moins 6 caractères')
    return
  }
  
  const result = await authStore.updatePassword(passwordForm.newPassword)
  
  if (result.success) {
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

