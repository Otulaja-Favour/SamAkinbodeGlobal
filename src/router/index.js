import { createRouter, createWebHistory } from 'vue-router'
import landing from '../views/landing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landing,
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/userdashboard.vue'),
      meta: { requiresAuth: true }, // Mark route as protected
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/books.vue'),
      meta: { requiresAuth: true }, // Mark route as protected

    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/cart.vue'),
      meta: { requiresAuth: true }, // Mark route as protected

    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/dashboard.vue'),
      meta: { requiresAuth: true }, // Mark route as protected
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin.vue'),
      // meta: { requiresAuth: true }, // Mark route as protected
    },
  ],
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const userId = sessionStorage.getItem('userId')
  const adminEmail = sessionStorage.getItem('adminEmail')

  // Only allow admin to access /admin
  if (to.path === '/admin') {
    if (adminEmail === 'akinbodetomiwa04@gmail.com') {
      next()
    } else {
      next('/auth')
    }
    return
  }

  // User dashboard and other protected routes
  if (to.meta.requiresAuth) {
    if (userId) {
      next()
    } else {
      next('/auth')
    }
    return
  }

  // Default: allow
  next()
})

export default router
