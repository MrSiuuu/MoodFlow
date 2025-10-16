import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const loading = ref(false)
  const toast = useToast()

  const isAuthenticated = computed(() => {
    return !!(user.value && userProfile.value)
  })

  // Vérifier si l'utilisateur est admin
  const isAdmin = computed(() => {
    return userProfile.value?.role === 'admin'
  })

  // Initialiser l'utilisateur au démarrage
  const init = async () => {
    try {
      loading.value = true
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Erreur session:', error)
        user.value = null
        userProfile.value = null
        return
      }

      if (session?.user) {
        // Vérifier que le token est valide
        const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !userData) {
          console.error('Token invalide:', userError)
          user.value = null
          userProfile.value = null
          return
        }

        user.value = userData
        // Charger le profil utilisateur
        await loadUserProfile()
      }
    } catch (error) {
      console.error('Erreur initialisation auth:', error)
      user.value = null
      userProfile.value = null
    } finally {
      loading.value = false
    }
  }

  // Charger le profil utilisateur depuis la table profiles
  const loadUserProfile = async () => {
    try {
      if (!user.value) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) {
        console.error('Erreur chargement profil:', error)
        
        // Si le profil n'existe pas, créer un profil par défaut
        if (error.code === 'PGRST116') {
          console.log('Profil non trouvé, création d\'un profil par défaut')
          const defaultProfile = {
            id: user.value.id,
            email: user.value.email,
            display_name: user.value.user_metadata?.display_name || user.value.email,
            role: 'user'
          }
          userProfile.value = defaultProfile
          return defaultProfile
        }
        
        // Si erreur de permission (RLS), créer un profil par défaut
        if (error.code === '42501') {
          console.log('Erreur RLS, création d\'un profil par défaut')
          const defaultProfile = {
            id: user.value.id,
            email: user.value.email,
            display_name: user.value.user_metadata?.display_name || user.value.email,
            role: 'user'
          }
          userProfile.value = defaultProfile
          return defaultProfile
        }
        
        throw error
      }

      userProfile.value = data
      return data
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
      
      // En cas d'erreur, créer un profil par défaut pour permettre la connexion
      const fallbackProfile = {
        id: user.value.id,
        email: user.value.email,
        display_name: user.value.user_metadata?.display_name || user.value.email,
        role: 'user'
      }
      
      userProfile.value = fallbackProfile
      return fallbackProfile
    }
  }

  // Connexion
  const signIn = async (email, password) => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Vérifier que l'utilisateur est valide
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData) {
        throw new Error('Token invalide')
      }

      user.value = userData
      await loadUserProfile()

      if (!userProfile.value) {
        throw new Error('Impossible de charger le profil utilisateur')
      }

      toast.success('Connexion réussie !')
      return { success: true }
    } catch (error) {
      console.error('Erreur connexion:', error)
      user.value = null
      userProfile.value = null
      toast.error(error.message || 'Erreur de connexion')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Inscription
  const signUp = async (email, password, displayName) => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      })

      if (error) throw error

      toast.success('Compte créé ! Vérifiez votre email.')
      return { success: true }
    } catch (error) {
      console.error('Erreur inscription:', error)
      toast.error(error.message || 'Erreur d\'inscription')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const signOut = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      user.value = null
      userProfile.value = null
      toast.success('Déconnexion réussie')
      return { success: true }
    } catch (error) {
      console.error('Erreur déconnexion:', error)
      toast.error('Erreur de déconnexion')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user
      await loadUserProfile()
    } else if (event === 'SIGNED_OUT') {
      user.value = null
      userProfile.value = null
    }
  })

  return {
    user,
    userProfile,
    loading,
    isAuthenticated,
    isAdmin,
    init,
    signIn,
    signUp,
    signOut,
    loadUserProfile
  }
})
