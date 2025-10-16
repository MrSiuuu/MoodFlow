<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="text-4xl mb-4">🌈</div>
        <h2 class="text-3xl font-bold text-gradient">Connexion</h2>
        <p class="mt-2 text-base-content/70">
          Connecte-toi à ton compte MoodFlow
        </p>
      </div>

      <!-- Formulaire -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleLogin" class="space-y-6">
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

            <!-- Options -->
            <div class="flex items-center justify-between">
              <label class="label cursor-pointer">
                <input v-model="form.remember" type="checkbox" class="checkbox checkbox-primary checkbox-sm" />
                <span class="label-text ml-2">Se souvenir de moi</span>
              </label>
              <a href="#" class="link link-primary text-sm">Mot de passe oublié ?</a>
            </div>

            <!-- Erreur générale -->
            <div v-if="error" class="alert alert-error">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Bouton de connexion -->
            <button
              type="submit"
              class="btn btn-primary w-full"
              :class="{ 'loading': loading }"
              :disabled="loading"
            >
              <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

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
          Pas encore de compte ?
          <RouterLink to="/register" class="link link-primary font-semibold">
            S'inscrire
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
  email: '',
  password: '',
  remember: false
})

const errors = reactive({})
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const showPassword = ref(false)

// Méthodes
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
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
  
  return !errors.email && !errors.password
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.signIn(form.email, form.password)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  googleLoading.value = true
  error.value = ''
  
  try {
    await authStore.signInWithGoogle()
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion Google'
  } finally {
    googleLoading.value = false
  }
}
</script>