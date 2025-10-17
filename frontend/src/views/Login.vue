<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gradient mb-2">
          🌈 MoodFlow
        </h1>
        <h2 class="text-3xl font-bold">
          Connexion Utilisateur
        </h2>
        <p class="mt-2 text-base-content/70">
          Ou 
          <RouterLink to="/register" class="link link-primary">
            créez un compte
          </RouterLink>
        </p>
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="votre@email.com"
                class="input input-bordered w-full"
                :class="{ 'input-error': errors.email }"
                required
                autofocus
                :disabled="authStore.loading"
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
            </div>

            <!-- Se souvenir de moi + Mot de passe oublié -->
            <div class="flex items-center justify-between mt-2">
              <label class="label cursor-pointer gap-2">
                <input v-model="formData.remember" type="checkbox" class="checkbox checkbox-sm" />
                <span class="label-text">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="link link-primary text-sm"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <!-- Bouton de connexion -->
            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-primary w-full"
                :class="{ 'loading': authStore.loading }"
                :disabled="authStore.loading"
              >
                <span v-if="!authStore.loading">Se connecter</span>
                <span v-else>Connexion...</span>
              </button>
            </div>

            <!-- Divider -->
            <div class="divider">ou</div>

           <!-- Connexion avec Google -->
          <button
            @click="handleGoogleLogin"
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
            {{ googleLoading ? 'Connexion...' : 'Continuer avec Google' }}
          </button>
        </div>
      </div>

        <!-- Lien vers inscription -->
        <div class="text-center">
          <p class="text-base-content/70">
            Vous n'avez pas de compte ?
            <RouterLink to="/register" class="link link-primary font-semibold">
              S'inscrire gratuitement
            </RouterLink>
          </p>
        </div>
      </form>
    </div>

    <!-- Modal Mot de passe oublié -->
    <dialog ref="forgotPasswordModal" class="modal" :class="{ 'modal-open': showForgotPassword }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Réinitialiser le mot de passe</h3>
        <form @submit.prevent="handleForgotPassword">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="resetEmail"
              type="email"
              placeholder="votre@email.com"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div class="modal-action">
            <button type="button" @click="showForgotPassword = false" class="btn btn-ghost">Annuler</button>
            <button type="submit" class="btn btn-primary" :class="{ 'loading': authStore.loading }" :disabled="authStore.loading">Envoyer</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showForgotPassword = false">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// États réactifs
const formData = reactive({
  email: '',
  password: '',
  remember: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')
const googleLoading = ref(false)
const error = ref('')

// Validation du formulaire
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
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
  
  return true
}

// Soumission du formulaire
const handleSubmit = async () => {
  if (!validateForm()) return
  
  const result = await authStore.signIn(formData.email, formData.password)
  
  if (result.success) {
    if (authStore.isAdmin) {
      toast.error('Les administrateurs doivent utiliser la page de connexion admin')
      await authStore.signOut()
      router.push('/admin/login')
    } else {
      router.push('/dashboard')
    }
  }
}

// Mot de passe oublié
const handleForgotPassword = async () => {
  if (!resetEmail.value) {
    toast.error('Veuillez entrer votre email')
    return
  }
  
  const result = await authStore.resetPassword(resetEmail.value)
  
  if (result.success) {
    showForgotPassword.value = false
    resetEmail.value = ''
  }
}

// Connexion avec Google
const handleGoogleLogin = async () => {
  googleLoading.value = true
  error.value = ''
  
  try {
    await authStore.signInWithGoogle()
    // router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion Google'
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
