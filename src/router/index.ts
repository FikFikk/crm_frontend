import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/Login.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import SetPassword from '../views/auth/SetPassword.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import Chat from '../views/dashboard/chat/Chat.vue'
import Company from '../views/dashboard/company/Company.vue'
import Agent from '../views/dashboard/agents/Agent.vue'
import Whatsapp from '../views/dashboard/whatsapp/Whatsapp.vue'
import type { UserSession } from '../interfaces'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    component: ResetPassword
  },
  {
    path: '/set-password',
    name: 'Set Password',
    component: SetPassword
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true,
       allowedRoles: ['pimpinan'] 
    }
  },
  {
    path: '/agents',
    name: 'Agents',
    component: Agent,
    meta: { requiresAuth: true, 
      allowedRoles: ['pimpinan'] 
    } 
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true, 
      allowedRoles: ['pimpinan', 'agent', 'anggota'] 
    } 
  },
  {
    path: '/company',
    name: 'Company',
    component: Company,
    // component: () => import('@/views/profile/CompanyProfile.vue'),
    meta: { requiresAuth: true, 
      allowedRoles: ['pimpinan'] 
    }
  },
  {
    path: '/whatsapp',
    name: 'WhatsApp',
    component: Whatsapp,
    // component: () => import('@/views/profile/CompanyProfile.vue'),
    meta: { requiresAuth: true, 
      allowedRoles: ['pimpinan']  
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const userStr = localStorage.getItem('user')
  let user: UserSession | null = null

  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch {
      user = null
    }
  }

  // Belum login tapi butuh auth → paksa ke login
  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  // Kalau sudah login & masuk ke /login → redirect sesuai role
  if (to.path === '/login' && user) {
    const role = user.user?.role?.toLowerCase() || ''
    if (role === 'agent' || role === 'anggota') {
      return next('/chat')
    } else if (role === 'pimpinan') {
      return next('/dashboard')
    } else {
      return next('/dashboard') // default
    }
  }

  // ✅ Role-based access validation
  if (to.meta.requiresAuth && user) {
    const role = user.user?.role?.toLowerCase() || ''
    const allowedRoles = (to.meta.allowedRoles as string[]) || []

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      // kalau role tidak boleh akses, redirect ke default
      if (role === 'agent' || role === 'anggota') {
        return next('/chat')
      } else if (role === 'pimpinan') {
        return next('/dashboard')
      } else {
        return next('/login')
      }
    }
  }

  return next()
})

export default router
