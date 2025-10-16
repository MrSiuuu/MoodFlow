import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

// Formater une date
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''
  
  return format(dateObj, formatStr, { locale: fr })
}

// Formater une date relative
export const formatRelativeDate = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''
  
  const now = new Date()
  const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Aujourd\'hui'
  if (diffInDays === 1) return 'Hier'
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  
  return formatDate(dateObj)
}

// Obtenir l'emoji et la couleur pour un score d'humeur
export const getMoodDisplay = (score) => {
  const moods = {
    1: { emoji: '😢', color: 'mood-1', label: 'Très triste' },
    2: { emoji: '😔', color: 'mood-2', label: 'Triste' },
    3: { emoji: '😐', color: 'mood-3', label: 'Neutre' },
    4: { emoji: '😊', color: 'mood-4', label: 'Content' },
    5: { emoji: '😄', color: 'mood-5', label: 'Très content' }
  }
  
  return moods[score] || moods[3]
}

// Générer des couleurs pour les graphiques
export const getChartColors = (count) => {
  const baseColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f59e0b'
  ]
  
  const colors = []
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length])
  }
  
  return colors
}

// Valider un email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Valider un mot de passe
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

// Générer un ID unique
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce une fonction
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle une fonction
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Copier du texte dans le presse-papiers
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Erreur copie presse-papiers:', error)
    return false
  }
}

// Obtenir la météo actuelle (simulation)
export const getCurrentWeather = () => {
  const weathers = ['☀️', '⛅', '🌧️', '❄️', '🌤️', '⛈️']
  return weathers[Math.floor(Math.random() * weathers.length)]
}

// Calculer la moyenne d'un tableau
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0
  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return Math.round((sum / numbers.length) * 100) / 100
}

// Obtenir le pourcentage
export const getPercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
