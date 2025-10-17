<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gradient mb-2">
          🌈 MoodFlow
        </h1>
        <h2 class="text-3xl font-bold">
          Créer un compte
        </h2>
        <p class="mt-2 text-base-content/70">
          Ou 
          <RouterLink to="/login" class="link link-primary">
            connectez-vous
          </RouterLink>
        </p>
      </div>

      <!-- Formulaire d'inscription -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <!-- Nom d'affichage -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nom d'affichage</span>
                <span class="label-text-alt text-base-content/50">(Optionnel)</span>
              </label>
              <input
                v-model="formData.displayName"
                type="text"
                placeholder="Comment souhaitez-vous être appelé ?"
                class="input input-bordered w-full"
                :disabled="authStore.loading"
              />
            </div>

            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email *</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="votre@email.com"
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.email }"
                required
                :disabled="authStore.loading"
              />
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">{{ errors.email }}</span>
              </label>
            </div>

            <!-- Mot de passe -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Mot de passe *</span>
              </label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="input input-bordered w-full pr-10"
                  :class="{ 'input-error': errors.password }"
                  required
                  :disabled="authStore.loading"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
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
              <label v-if="errors.password" class="label">
                <span class="label-text-alt text-error">{{ errors.password }}</span>
              </label>
              <!-- Force du mot de passe -->
              <div v-if="formData.password" class="mt-2">
                <div class="flex gap-1 mb-1">
                  <div class="h-1 flex-1 rounded-full" :class="passwordStrength >= 1 ? 'bg-error' : 'bg-base-300'"></div>
                  <div class="h-1 flex-1 rounded-full" :class="passwordStrength >= 2 ? 'bg-warning' : 'bg-base-300'"></div>
                  <div class="h-1 flex-1 rounded-full" :class="passwordStrength >= 3 ? 'bg-success' : 'bg-base-300'"></div>
                </div>
                <p class="text-xs text-base-content/60">
                  {{ passwordStrengthText }}
                </p>
              </div>
            </div>

            <!-- Confirmer le mot de passe -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Confirmer le mot de passe *</span>
              </label>
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.confirmPassword }"
                required
                :disabled="authStore.loading"
              />
              <label v-if="errors.confirmPassword" class="label">
                <span class="label-text-alt text-error">{{ errors.confirmPassword }}</span>
              </label>
            </div>

            <!-- Accepter les conditions - OBLIGATOIRE RGPD -->
            <div class="form-control mt-4">
              <div class="alert alert-warning mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-xs">
                  <div class="font-semibold">Conformité RGPD</div>
                  <div>Vous devez accepter nos conditions pour créer un compte.</div>
                </div>
              </div>
              
              <label class="label cursor-pointer justify-start gap-3 bg-base-200 p-4 rounded-lg border-2" 
                     :class="{ 'border-error': errors.acceptTerms, 'border-transparent': !errors.acceptTerms }">
                <input
                  v-model="formData.acceptTerms"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  required
                />
                <span class="label-text text-sm leading-relaxed">
                  <strong>J'accepte</strong> les 
                  <RouterLink to="/terms" class="link link-primary font-semibold" target="_blank">
                    conditions d'utilisation
                  </RouterLink>
                  et la 
                  <RouterLink to="/privacy" class="link link-primary font-semibold" target="_blank">
                    politique de confidentialité
                  </RouterLink>
                  de MoodFlow. Je comprends que mes données seront traitées conformément au RGPD.
                </span>
              </label>
              <label v-if="errors.acceptTerms" class="label">
                <span class="label-text-alt text-error font-semibold">{{ errors.acceptTerms }}</span>
              </label>
            </div>

            <!-- Newsletter (optionnel) -->
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-2">
                <input v-model="formData.newsletter" type="checkbox" class="checkbox checkbox-sm" />
                <span class="label-text text-sm">
                  Je souhaite recevoir des conseils et actualités par email
                </span>
              </label>
            </div>

            <!-- Bouton d'inscription -->
            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary w-full"
                :class="{ 'loading': authStore.loading }"
                :disabled="authStore.loading"
              >
                <span v-if="!authStore.loading">Créer mon compte</span>
                <span v-else>Création du compte...</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="divider">ou</div>

            <!-- Inscription avec Google -->
            <button
              type="button"
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
            Vous avez déjà un compte ?
            <RouterLink to="/login" class="link link-primary font-semibold">
              Se connecter
            </RouterLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// État du formulaire
const formData = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  newsletter: false,
})

const errors = reactive({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const googleLoading = ref(false)

// Force du mot de passe
const passwordStrength = computed(() => {
  const password = formData.password
  if (!password) return 0
  
  let strength = 0
  
  // Longueur
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Complexité
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  
  return Math.min(strength, 3)
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 0:
    case 1:
      return 'Faible - Utilisez plus de caractères'
    case 2:
      return 'Moyen - Ajoutez des caractères spéciaux'
    case 3:
      return 'Fort - Bon mot de passe !'
    default:
      return ''
  }
})

// Validation du formulaire
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.acceptTerms = ''
  
  if (!formData.email) {
    errors.email = 'L\'email est requis'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email invalide'
    return false
  }
  
  if (!formData.password) {
    errors.password = 'Le mot de passe est requis'
    return false
  }
  
  if (formData.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    return false
  }
  
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation et la politique de confidentialité (RGPD obligatoire)'
    return false
  }
  
  return true
}

// Soumettre le formulaire classique
const handleSubmit = async () => {
  if (!validateForm()) return
  
  const result = await authStore.signUp(
    formData.email,
    formData.password,
    formData.displayName
  )
  
  if (result.success) {
    if (result.requiresEmailConfirmation) {
      // Rediriger vers page de confirmation
      router.push('/login')
    } else {
      // Rediriger vers le dashboard
      router.push('/dashboard')
    }
  }
}

// Inscription avec Google
const handleGoogleRegister = async () => {
  // Vérifier que les conditions sont acceptées AVANT Google
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'Vous devez accepter les conditions avant de vous inscrire avec Google'
    return
  }
  
  googleLoading.value = true
  
  try {
    const result = await authStore.signInWithGoogle()
    
    if (result.success) {
      // Google redirigera automatiquement vers /dashboard après connexion
      // Pas besoin de router.push ici car c'est une redirection externe
    }
  } catch (err) {
    console.error('Erreur Google OAuth:', err)
  } finally {
    googleLoading.value = false
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
