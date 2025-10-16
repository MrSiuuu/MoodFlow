<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <!-- Bouton retour -->
        <div class="flex justify-start mb-4">
          <RouterLink to="/" class="btn btn-ghost btn-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à l'accueil
          </RouterLink>
        </div>
        
        <div class="text-4xl mb-4">🌈</div>
        <h2 class="text-3xl font-bold text-gradient">Créer un compte</h2>
        <p class="mt-2 text-base-content/70">
          Rejoins la communauté MoodFlow
        </p>
      </div>

      <!-- Formulaire -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Nom d'affichage -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nom d'affichage</span>
              </label>
              <input
                v-model="form.displayName"
                type="text"
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.displayName }"
                placeholder="Ton prénom"
                required
              />
              <label v-if="errors.displayName" class="label">
                <span class="label-text-alt text-error">{{ errors.displayName }}</span>
              </label>
            </div>

            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Adresse email</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.email }"
                placeholder="ton@email.com"
                required
              />
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">{{ errors.email }}</span>
              </label>
            </div>

            <!-- Mot de passe -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Mot de passe</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="input input-bordered w-full pr-10"
                  :class="{ 'input-error': errors.password }"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="!showPassword" class="h-5 w-5 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <label v-if="errors.password" class="label">
                <span class="label-text-alt text-error">{{ errors.password }}</span>
              </label>
            </div>

            <!-- Confirmation mot de passe -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Confirmer le mot de passe</span>
              </label>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.confirmPassword }"
                placeholder="••••••••"
                required
              />
              <label v-if="errors.confirmPassword" class="label">
                <span class="label-text-alt text-error">{{ errors.confirmPassword }}</span>
              </label>
            </div>

            <!-- Conditions d'utilisation -->
            <div class="form-control">
              <label class="label cursor-pointer">
                <input v-model="form.acceptTerms" type="checkbox" class="checkbox checkbox-primary checkbox-sm" required />
                <span class="label-text ml-2">
                  J'accepte les 
                  <RouterLink to="/terms" class="link link-primary">conditions d'utilisation</RouterLink>
                  et la 
                  <RouterLink to="/privacy" class="link link-primary">politique de confidentialité</RouterLink>
                </span>
              </label>
            </div>

            <!-- Newsletter -->
            <div class="form-control">
              <label class="label cursor-pointer">
                <input v-model="form.newsletter" type="checkbox" class="checkbox checkbox-primary checkbox-sm" />
                <span class="label-text ml-2">
                  Je souhaite recevoir les actualités de MoodFlow
                </span>
              </label>
            </div>

            <!-- Erreur générale -->
            <div v-if="error" class="alert alert-error">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Bouton d'inscription -->
            <button
              type="submit"
              class="btn btn-primary w-full"
              :class="{ 'loading': loading }"
              :disabled="loading"
            >
              <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {{ loading ? 'Création...' : 'Créer mon compte' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">ou</div>

          <!-- Inscription avec Google -->
          <button
            @click="handleGoogleRegister"
            class="btn btn-outline w-full"
            :class="{ 'loading': googleLoading }"
            :disabled="googleLoading"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {{ googleLoading ? 'Inscription...' : 'Continuer avec Google' }}
          </button>
        </div>
      </div>

      <!-- Lien vers connexion -->
      <div class="text-center">
        <p class="text-base-content/70">
          Déjà un compte ?
          <RouterLink to="/login" class="link link-primary font-semibold">
            Se connecter
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// État du formulaire
const form = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  newsletter: false
})

const errors = reactive({})
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Méthodes
const validateForm = () => {
  errors.displayName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  if (!form.displayName) {
    errors.displayName = 'Le nom d\'affichage est requis'
  } else if (form.displayName.length < 2) {
    errors.displayName = 'Le nom doit contenir au moins 2 caractères'
  }
  
  if (!form.email) {
    errors.email = 'L\'email est requis'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'L\'email n\'est pas valide'
  }
  
  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
  
  return !errors.displayName && !errors.email && !errors.password && !errors.confirmPassword
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.signUp(form.email, form.password, {
      display_name: form.displayName,
      newsletter: form.newsletter
    })
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Erreur lors de la création du compte'
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
  googleLoading.value = true
  error.value = ''
  
  try {
    await authStore.signInWithGoogle()
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Erreur lors de l\'inscription Google'
  } finally {
    googleLoading.value = false
  }
}
</script>