import HomeView from '@/views/HomeView.vue'
import PurchaseOrderDetailView from '@/views/PurchaseOrderDetailView.vue'
import PurchaseOrderListView from '@/views/PurchaseOrderListView.vue'
import QuicksellView from '@/views/QuicksellView.vue'
import ReceiveOrderAllocationView from '@/views/ReceiveOrderAllocationView.vue'
import ReceiveOrderDetailView from '@/views/ReceiveOrderDetailView.vue'
import ReceiveOrderListView from '@/views/ReceiveOrderListView.vue'
import ReceiveOrderPrintoutView from '@/views/ReceiveOrderPrintoutView.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/purchase-orders',
      name: 'po-list',
      component: PurchaseOrderListView
    },
    {
      path: '/purchase-orders/:id',
      name: 'po-detail',
      component: PurchaseOrderDetailView
    },
    {
      path: '/receive-orders',
      name: 'ro-list',
      component: ReceiveOrderListView
    },
    {
      path: '/receive-orders/:id',
      name: 'ro-detail',
      component: ReceiveOrderDetailView
    },
    {
      path: '/receive-orders/:orderId/items/:id/allocate',
      name: 'ro-allocation',
      component: ReceiveOrderAllocationView
    },
    {
      path: '/receive-orders/:orderId/items/:id/printout',
      name: 'ro-printout',
      component: ReceiveOrderPrintoutView
    },
    {
      path: '/quicksell',
      name: 'quicksell',
      component: QuicksellView
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
})

export default router
