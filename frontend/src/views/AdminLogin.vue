<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-error/10 to-warning/10 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header avec badge Admin -->
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="badge badge-error badge-lg gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            ADMINISTRATION
          </div>
        </div>
        <h1 class="text-4xl font-bold mb-2">
          🔐 Connexion Administrateur
        </h1>
        <p class="mt-2 text-base-content/70">
          Réservé aux administrateurs MoodFlow
        </p>
        <div class="alert alert-warning mt-4 text-left">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-sm">Cette page est uniquement pour les comptes administrateurs. Si vous êtes un utilisateur standard, veuillez utiliser la <RouterLink to="/login" class="link link-primary font-semibold">page de connexion utilisateur</RouterLink>.</span>
        </div>
      </div>

      <!-- Formulaire de connexion Admin -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div class="card bg-base-100 shadow-xl border-2 border-error/20">
          <div class="card-body">
            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Email Administrateur</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="admin@moodflow.com"
                class="input input-bordered input-error w-full"
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
                <span class="label-text font-semibold">Mot de passe</span>
              </label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="input input-bordered input-error w-full pr-10"
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

            <!-- Se souvenir -->
            <div class="flex items-center justify-between mt-2">
              <label class="label cursor-pointer gap-2">
                <input v-model="formData.remember" type="checkbox" class="checkbox checkbox-error checkbox-sm" />
                <span class="label-text">Se souvenir de moi</span>
              </label>
            </div>

            <!-- Message d'erreur si pas admin -->
            <div v-if="notAdminError" class="alert alert-error mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ce compte n'a pas les droits d'administrateur. Veuillez utiliser un compte admin ou <RouterLink to="/login" class="link link-primary font-semibold">connectez-vous en tant qu'utilisateur</RouterLink>.</span>
            </div>

            <!-- Bouton de connexion -->
            <div class="form-control mt-6">
              <button
                type="submit"
                class="btn btn-error w-full"
                :class="{ 'loading': authStore.loading }"
                :disabled="authStore.loading"
              >
                <svg v-if="!authStore.loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span v-if="!authStore.loading">Accéder à l'administration</span>
                <span v-else>Vérification...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Lien retour -->
        <div class="text-center">
          <RouterLink to="/" class="link link-primary">
            ← Retour à l'accueil
          </RouterLink>
        </div>
      </form>
    </div>
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

// État du formulaire
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
const notAdminError = ref(false)

// Validation du formulaire
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  notAdminError.value = false
  
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

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!validateForm()) return
  
  const result = await authStore.signIn(formData.email, formData.password)
  
  if (result.success) {
    // Vérifier que l'utilisateur est bien admin
    if (authStore.isAdmin) {
      toast.success('Bienvenue Administrateur !')
      router.push('/admin')
    } else {
      // Pas admin, déconnecter et afficher erreur
      notAdminError.value = true
      await authStore.signOut()
      toast.error('Accès refusé : droits administrateur requis')
    }
  }
}
</script>

<style scoped>
/* Pas de styles personnalisés nécessaires */
</style>

