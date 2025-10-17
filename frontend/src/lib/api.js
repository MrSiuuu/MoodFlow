import axios from 'axios'
import { supabase } from './supabase'

// URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Créer une instance axios
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  async (config) => {
    try {
      // Récupérer le token de session Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (error) {
      console.error('Erreur récupération token:', error)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 (non authentifié)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tenter de rafraîchir la session
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError || !session) {
          // Déconnecter l'utilisateur
          await supabase.auth.signOut()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Réessayer la requête avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Erreur refresh token:', refreshError)
        await supabase.auth.signOut()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    // Si erreur 403 (accès refusé)
    if (error.response?.status === 403) {
      console.error('Accès refusé:', error.response.data)
    }

    // Si erreur 429 (rate limit)
    if (error.response?.status === 429) {
      console.error('Trop de requêtes, réessayez plus tard')
    }

    // Si erreur 500 (erreur serveur)
    if (error.response?.status >= 500) {
      console.error('Erreur serveur:', error.response.data)
    }

    return Promise.reject(error)
  }
)

// Fonctions helper pour les appels API
export const apiHelpers = {
  // Moods
  getMoods: (from, to) => api.get('/moods', { params: { from, to } }),
  createMood: (data) => api.post('/moods', data),
  updateMood: (id, data) => api.patch(`/moods/${id}`, data),
  deleteMood: (id) => api.delete(`/moods/${id}`),
  
  // Insights
  getWeekInsights: () => api.get('/insights/week'),
  getMonthInsights: () => api.get('/insights/month'),
  
  // AI
  sendAIMessage: (message, sessionId) => api.post('/ai/query', { message, session_id: sessionId }),
  getAISessions: () => api.get('/ai/sessions'),
  getAIMessages: (sessionId) => api.get(`/ai/sessions/${sessionId}/messages`),
  
  // Health
  checkHealth: () => api.get('/health'),
}

export default api

