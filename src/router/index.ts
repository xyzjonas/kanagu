import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import QuicksellView from '@/views/QuicksellView.vue'
import SettingsView from '@/views/SettingsView.vue'
import StockinAllocationView from '@/views/stockin/StockinAllocationView.vue'
import StockinBaseView from '@/views/stockin/StockinBaseView.vue'
import StockinDetailView from '@/views/stockin/StockinDetailView.vue'
import StockinListView from '@/views/stockin/StockinListView.vue'
import StockoutAllocationView from '@/views/stockout/StockoutAllocationView.vue'
import StockoutBaseView from '@/views/stockout/StockoutBaseView.vue'
import StockoutDetailView from '@/views/stockout/StockoutDetailView.vue'
import StockoutListView from '@/views/stockout/StockoutListView.vue'

import { createRouter, createWebHistory } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { colorQuicksell, colorStockin, colorStockout } from '@/constants'
import TransferView from '@/views/TransferView.vue'

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
    component: StockoutListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/purchase-orders/:id',
    name: 'po-detail',
    component: StockoutDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receive-orders',
    name: 'ro-list',
    component: StockinListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/receive-orders/:id',
    component: StockinBaseView,
    meta: { requiresAuth: true },
    props: true,
    children: [
      {
        name: 'ro-detail',
        component: StockinDetailView,
        meta: { requiresAuth: true },
        path: '',
      },
      {
        name: 'ro-allocation',
        path: 'allocate/:movementId',
        component: StockinAllocationView,
        meta: { requiresAuth: true },
        props: true,
      },
    ]
  },
  {
    path: '/purchase-orders/:id',
    component: StockoutBaseView,
    meta: { requiresAuth: true },
    props: true,
    children: [
      {
        name: 'po-detail',
        component: StockoutDetailView,
        path: '',
        meta: { requiresAuth: true },
        props: true,
      },
      {
        name: 'po-allocation',
        path: 'collect/:movementId',
        component: StockoutAllocationView,
        meta: { requiresAuth: true },
        props: true,
      },
    ]
  },
  {
    path: '/quicksell',
    name: 'quicksell',
    component: QuicksellView,
    meta: { requiresAuth: true }
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: TransferView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
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

  if(to.path.includes("purchase")) {
    document.body.style.setProperty('--q-primary', colorStockout)
  } else if(to.path.includes("receive")) {
    document.body.style.setProperty('--q-primary', colorStockin)
  } else if (to.path.includes('quicksell')) {
    document.body.style.setProperty('--q-primary', colorQuicksell)
  } else {
    document.body.style.removeProperty('--q-primary')
  }

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
