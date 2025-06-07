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
    },
    {
      path: '/books',
      name: 'books',
     
      component: () => import('../views/books.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
     
      component: () => import('../views/cart.vue'),
    },
     {
      path: '/profile',
      name: 'profile',
     
      component: () => import('../views/dashboard.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
     
      component: () => import('../views/admin.vue'),
    },
    
  ],
})

export default router
