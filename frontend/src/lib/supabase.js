import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MANQUANT')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'OK' : 'MANQUANT')
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'moodflow-auth',
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'moodflow-web',
    },
  },
})

// Helper functions pour l'authentification
export const authHelpers = {
  // S'inscrire avec email et mot de passe
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return { data, error }
  },

  // Se connecter avec email et mot de passe
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Se déconnecter
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Récupérer la session actuelle
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Récupérer l'utilisateur actuel
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Réinitialiser le mot de passe
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  // Mettre à jour le mot de passe
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })
    return { data, error }
  },
}

// Helper functions pour la base de données
export const dbHelpers = {
  // Récupérer le profil de l'utilisateur
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Mettre à jour le profil
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Récupérer les humeurs
  getMoods: async (userId, fromDate, toDate) => {
    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('mood_date', { ascending: false })

    if (fromDate) {
      query = query.gte('mood_date', fromDate)
    }
    if (toDate) {
      query = query.lte('mood_date', toDate)
    }

    const { data, error } = await query
    return { data, error }
  },
}

// Écouter les changements d'état d'authentification
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

export default supabase

