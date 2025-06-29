import { createRouter, createWebHistory } from "vue-router"
import landing from "../views/landing.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: landing,
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/userdashboard.vue"),
      meta: { requiresAuth: true, role: "user" },
    },
    {
      path: "/books",
      name: "books",
      component: () => import("../views/books.vue"),
      meta: { requiresAuth: true, role: "user" },
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("../views/cart.vue"),
      meta: { requiresAuth: true, role: "user" },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/dashboard.vue"),
      meta: { requiresAuth: true, role: "user" },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin.vue"),
      meta: { requiresAuth: true, role: "admin" },
    },
    // Catch-all route for 404 errors
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      redirect: "/",
    },
  ],
})

// Enhanced navigation guard
router.beforeEach((to, from, next) => {
  // Get user data from session storage
  const userDataStr = sessionStorage.getItem("userData")
  const userId = sessionStorage.getItem("userId")

  let userData = null
  if (userDataStr) {
    try {
      userData = JSON.parse(userDataStr)
    } catch (error) {
      console.error("Error parsing user data:", error)
      // Clear corrupted data
      sessionStorage.removeItem("userData")
      sessionStorage.removeItem("userId")
      sessionStorage.removeItem("adminEmail")
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!userData || !userId) {
      // Not authenticated, redirect to auth page
      next("/auth")
      return
    }

    // Check role-based access
    if (to.meta.role) {
      if (to.meta.role === "admin") {
        // Admin route - check if user is admin
        if (userData.role !== "admin" && userData.email !== "akinbodetomiwa04@gmail.com") {
          next("/dashboard") // Redirect non-admin users to dashboard
          return
        }
      } else if (to.meta.role === "user") {
        // User route - check if user is not admin trying to access user routes
        if (userData.role === "admin" && to.path !== "/admin") {
          next("/admin") // Redirect admin to admin dashboard
          return
        }
      }
    }
  }

  // If user is authenticated and trying to access auth page, redirect appropriately
  if (to.path === "/auth" && userData) {
    if (userData.role === "admin") {
      next("/admin")
    } else {
      next("/dashboard")
    }
    return
  }

  // If user is authenticated and trying to access landing page, redirect appropriately
  // if (to.path === "/" && userData) {
  //   if (userData.role === "admin") {
  //     next("/admin")
  //   } else {
  //     next("/dashboard")
  //   }
  //   return
  // }

  // Default: allow navigation
  next()
})

export default router
