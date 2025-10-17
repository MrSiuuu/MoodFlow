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
      meta: { requiresAuth: false, userOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/AdminLogin.vue'),
      meta: { requiresAuth: false, adminLoginPage: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true, userOnly: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/Analytics.vue'),
      meta: { requiresAuth: true, userOnly: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/Calendar.vue'),
      meta: { requiresAuth: true, userOnly: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/Chat.vue'),
      meta: { requiresAuth: true, userOnly: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
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
  
  // Attendre que l'auth soit initialisé (uniquement à la première navigation)
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  // Vérifier si l'utilisateur est connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Rediriger vers la bonne page de connexion selon le type de route
    if (to.meta.requiresAdmin) {
      next('/admin/login')
    } else {
      next('/login')
    }
    return
  }
  
  // Vérifier les rôles admin (routes /admin/*)
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    console.warn('Accès refusé : droits admin requis')
    next('/dashboard')
    return
  }
  
  // Empêcher les admins d'accéder aux routes utilisateur
  if (to.meta.userOnly && authStore.isAdmin) {
    console.warn('Accès refusé : route réservée aux utilisateurs')
    next('/admin')
    return
  }
  
  // Rediriger si déjà connecté selon le rôle
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/dashboard')
    }
    return
  }
  
  // Rediriger les utilisateurs connectés qui essaient d'accéder à la page de login admin
  if (to.name === 'admin-login' && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/dashboard')
    }
    return
  }
  
  next()
})

export default router
