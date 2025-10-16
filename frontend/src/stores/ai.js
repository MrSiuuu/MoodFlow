import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/api'
import { useToast } from 'vue-toastification'

export const useAiStore = defineStore('ai', () => {
  const sessions = ref([])
  const currentSession = ref(null)
  const messages = ref([])
  const loading = ref(false)
  const toast = useToast()

  // Charger les sessions
  const loadSessions = async () => {
    try {
      loading.value = true
      const response = await api.get('/ai/sessions')
      sessions.value = response.data || []
    } catch (error) {
      console.error('Erreur chargement sessions IA:', error)
      toast.error('Erreur lors du chargement des sessions')
    } finally {
      loading.value = false
    }
  }

  // Créer une nouvelle session
  const createSession = async (title) => {
    try {
      const response = await api.post('/ai/query', {
        message: title || 'Nouvelle conversation'
      })
      
      const sessionId = response.data.session_id
      currentSession.value = {
        id: sessionId,
        title: title || 'Nouvelle conversation',
        created_at: new Date().toISOString()
      }
      
      sessions.value.unshift(currentSession.value)
      messages.value = []
      
      return { success: true, sessionId }
    } catch (error) {
      console.error('Erreur création session:', error)
      toast.error('Erreur lors de la création de la session')
      return { success: false, error: error.message }
    }
  }

  // Charger les messages d'une session
  const loadMessages = async (sessionId) => {
    try {
      loading.value = true
      const response = await api.get(`/ai/sessions/${sessionId}/messages`)
      messages.value = response.data || []
      
      // Trouver la session courante
      currentSession.value = sessions.value.find(s => s.id === sessionId)
    } catch (error) {
      console.error('Erreur chargement messages:', error)
      toast.error('Erreur lors du chargement des messages')
    } finally {
      loading.value = false
    }
  }

  // Envoyer un message
  const sendMessage = async (message, sessionId = null) => {
    try {
      loading.value = true
      
      // Si pas de session, en créer une
      if (!sessionId && !currentSession.value) {
        const result = await createSession(message.substring(0, 50))
        if (!result.success) return result
        sessionId = result.sessionId
      }
      
      const response = await api.post('/ai/query', {
        message,
        session_id: sessionId || currentSession.value?.id
      })
      
      // Ajouter les messages à la liste
      messages.value.push(
        { role: 'user', content: message, created_at: new Date().toISOString() },
        { role: 'assistant', content: response.data.reply, created_at: new Date().toISOString() }
      )
      
      return { success: true, reply: response.data.reply }
    } catch (error) {
      console.error('Erreur envoi message:', error)
      toast.error('Erreur lors de l\'envoi du message')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // Supprimer une session
  const deleteSession = async (sessionId) => {
    try {
      // Note: L'API ne semble pas avoir d'endpoint pour supprimer une session
      // On supprime juste côté client pour l'instant
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      
      if (currentSession.value?.id === sessionId) {
        currentSession.value = null
        messages.value = []
      }
      
      toast.success('Session supprimée')
      return { success: true }
    } catch (error) {
      console.error('Erreur suppression session:', error)
      toast.error('Erreur lors de la suppression')
      return { success: false, error: error.message }
    }
  }

  // Messages groupés par session
  const messagesBySession = computed(() => {
    const grouped = {}
    messages.value.forEach(msg => {
      if (!grouped[msg.session_id]) {
        grouped[msg.session_id] = []
      }
      grouped[msg.session_id].push(msg)
    })
    return grouped
  })

  // Dernière session
  const lastSession = computed(() => {
    return sessions.value.length > 0 ? sessions.value[0] : null
  })

  return {
    sessions,
    currentSession,
    messages,
    loading,
    loadSessions,
    createSession,
    loadMessages,
    sendMessage,
    deleteSession,
    messagesBySession,
    lastSession
  }
})
