import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/Analytics.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/Calendar.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    // Pages publiques
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/Help.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/Contact.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/Help.vue'),
      meta: { requiresAuth: false }
    },
    // Pages légales
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/Privacy.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/Terms.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: () => import('@/views/Privacy.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Attendre que l'initialisation soit terminée
  if (authStore.loading) {
    // Attendre un peu que l'init se termine
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Vérifier si l'utilisateur est connecté
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('Accès refusé - utilisateur non authentifié')
      next('/login')
      return
    }
    
    // Vérifier les rôles spécifiques
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      console.log('Accès refusé - droits admin requis')
      next('/dashboard')
      return
    }
  }
  
  // Rediriger les utilisateurs connectés depuis login/register
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
