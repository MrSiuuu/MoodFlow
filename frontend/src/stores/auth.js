import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, authHelpers, dbHelpers, onAuthStateChange } from '@/lib/supabase'
import { useToast } from 'vue-toastification'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const userProfile = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const initialized = ref(false)
  const isSigningOut = ref(false)
  const toast = useToast()

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!session.value)
  const isAdmin = computed(() => userProfile.value?.role === 'admin')
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => userProfile.value?.display_name || user.value?.email?.split('@')[0] || 'Utilisateur')

  // Actions
  
  /**
   * Initialiser le store (vérifier la session existante)
   */
  const initialize = async () => {
    if (initialized.value) return

    try {
      loading.value = true
      
      // Récupérer la session actuelle
      const { session: currentSession, error } = await authHelpers.getSession()
      
      if (error) {
        console.error('Erreur initialisation session:', error)
        return
      }

      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        
        // Charger le profil
        await loadUserProfile()
      }

      // Écouter les changements d'authentification
      onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event)
        
        session.value = newSession
        user.value = newSession?.user || null

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUserProfile()
        }

        if (event === 'SIGNED_OUT') {
          user.value = null
          userProfile.value = null
          session.value = null
        }
      })

      initialized.value = true
    } catch (error) {
      console.error('Erreur initialisation auth:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Charger le profil utilisateur depuis la DB
   */
  const loadUserProfile = async () => {
    if (!user.value) return

    try {
      const { data, error } = await dbHelpers.getProfile(user.value.id)
      
      if (error) {
        console.error('Erreur chargement profil:', error)
        return
      }

      userProfile.value = data
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    }
  }

  /**
   * Inscription
   */
  const signUp = async (email, password, displayName = '') => {
    try {
      loading.value = true

      const { data, error } = await authHelpers.signUp(email, password, {
        display_name: displayName || email.split('@')[0],
        newsletter: false,
      })

      if (error) {
        console.error('Erreur inscription:', error)
        toast.error(error.message || 'Erreur lors de l\'inscription')
        return { success: false, error }
      }

      // Si l'inscription nécessite une confirmation par email
      if (data.user && !data.session) {
        toast.info('Vérifiez votre email pour confirmer votre inscription')
        return { success: true, requiresEmailConfirmation: true }
      }

      // Si l'inscription est immédiate
      if (data.session) {
        session.value = data.session
        user.value = data.user
        await loadUserProfile()
        toast.success('Compte créé avec succès !')
        return { success: true }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur inscription:', error)
      toast.error('Erreur lors de l\'inscription')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  /**
   * Connexion
   */
  const signIn = async (email, password) => {
    try {
      loading.value = true

      const { data, error } = await authHelpers.signIn(email, password)

      if (error) {
        console.error('Erreur connexion:', error)
        toast.error('Email ou mot de passe incorrect')
        return { success: false, error }
      }

      if (data.session) {
        session.value = data.session
        user.value = data.user
        await loadUserProfile()
        toast.success(`Bienvenue ${userName.value} !`)
        return { success: true }
      }

      return { success: false }
    } catch (error) {
      console.error('Erreur connexion:', error)
      toast.error('Erreur lors de la connexion')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  /**
   * Déconnexion
   */
  const signOut = async () => {
    try {
      loading.value = true
      isSigningOut.value = true

      const { error } = await authHelpers.signOut()

      if (error) {
        console.error('Erreur déconnexion:', error)
        toast.error('Erreur lors de la déconnexion')
        isSigningOut.value = false
        return { success: false, error }
      }

      // Réinitialiser l'état
      user.value = null
      userProfile.value = null
      session.value = null

      // Toast avec délai pour qu'il soit visible
      toast.success('Déconnexion réussie ! À bientôt 👋')
      
      // Attendre un peu pour que le toast soit visible
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Redirection smooth avec Vue Router
      router.push('/')
      
      return { success: true }
    } catch (error) {
      console.error('Erreur déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
      return { success: false, error }
    } finally {
      loading.value = false
      isSigningOut.value = false
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  const resetPassword = async (email) => {
    try {
      loading.value = true

      const { data, error } = await authHelpers.resetPassword(email)

      if (error) {
        console.error('Erreur réinitialisation mot de passe:', error)
        toast.error('Erreur lors de l\'envoi de l\'email')
        return { success: false, error }
      }

      toast.success('Email de réinitialisation envoyé !')
      return { success: true }
    } catch (error) {
      console.error('Erreur réinitialisation mot de passe:', error)
      toast.error('Erreur lors de l\'envoi de l\'email')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour le profil
   */
  const updateProfile = async (updates) => {
    try {
      loading.value = true

      if (!user.value) {
        toast.error('Utilisateur non connecté')
        return { success: false }
      }

      // Mettre à jour dans la base de données
      const { data, error } = await dbHelpers.updateProfile(user.value.id, updates)

      if (error) {
        console.error('Erreur mise à jour profil:', error)
        toast.error('Erreur lors de la mise à jour du profil')
        return { success: false, error }
      }

      // Mettre à jour le state local
      userProfile.value = data
      toast.success('Profil mis à jour !')

      return { success: true, data }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      toast.error('Erreur lors de la mise à jour du profil')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  /**
   * Mettre à jour le mot de passe
   */
  const updatePassword = async (newPassword) => {
    try {
      loading.value = true

      const { data, error } = await authHelpers.updatePassword(newPassword)

      if (error) {
        console.error('Erreur mise à jour mot de passe:', error)
        toast.error('Erreur lors de la mise à jour du mot de passe')
        return { success: false, error }
      }

      toast.success('Mot de passe mis à jour !')
      return { success: true }
    } catch (error) {
      console.error('Erreur mise à jour mot de passe:', error)
      toast.error('Erreur lors de la mise à jour du mot de passe')
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }



// AJOUT FONCTIONNALITE
// Connexion avec Google

const signInWithGoogle = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard', // redirection après login
      },
    })

    if (error) throw error

    toast.info('Redirection vers Google...')
    return { success: true }
  } catch (error) {
    console.error('Erreur connexion Google:', error)
    toast.error(error.message || 'Erreur lors de la connexion avec Google')
    return { success: false, error: error.message }
  } finally {
    loading.value = false
  }
}





  return {
    // State
    user,
    userProfile,
    session,
    loading,
    initialized,
    isSigningOut,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userEmail,
    userName,
    
    // Actions
    initialize,
    loadUserProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    signInWithGoogle,
  }
})

