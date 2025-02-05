import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PurchaseOrderDetailView from '@/views/PurchaseOrderDetailView.vue'
import PurchaseOrderListView from '@/views/PurchaseOrderListView.vue'
import QuicksellView from '@/views/QuicksellView.vue'
import ReceiveOrderAllocationView from '@/views/ReceiveOrderAllocationView.vue'
import ReceiveOrderDetailView from '@/views/ReceiveOrderDetailView.vue'
import ReceiveOrderListView from '@/views/ReceiveOrderListView.vue'
import ReceiveOrderPrintoutView from '@/views/ReceiveOrderPrintoutView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  },
  {
    path: '/purchase-orders',
    name: 'po-list',
    component: PurchaseOrderListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase-orders/:id',
    name: 'po-detail',
    component: PurchaseOrderDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receive-orders',
    name: 'ro-list',
    component: ReceiveOrderListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receive-orders/:id',
    name: 'ro-detail',
    component: ReceiveOrderDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receive-orders/:orderId/items/:id/allocate',
    name: 'ro-allocation',
    component: ReceiveOrderAllocationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receive-orders/:orderId/items/:id/printout',
    name: 'ro-printout',
    component: ReceiveOrderPrintoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/quicksell',
    name: 'quicksell',
    component: QuicksellView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import('../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Add navigation guard
router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth()

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    // Redirect to login with the original route as a query parameter
    const encodedRoute = encodeURIComponent(JSON.stringify(to))
    next({ name: 'login', query: { redirect: encodedRoute } })
  } else {
    next() // Continue to the intended route
  }
})

export default router
