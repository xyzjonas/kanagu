import HomeView from '@/views/HomeView.vue'
import PurchaseOrderDetail from '@/views/PurchaseOrderDetail.vue'
import PurchaseOrderList from '@/views/PurchaseOrderList.vue'
import QuicksellView from '@/views/QuicksellView.vue'
import ReceiveOrderDetail from '@/views/ReceiveOrderDetail.vue'
import ReceiveOrderList from '@/views/ReceiveOrderList.vue'
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
      component: PurchaseOrderList
    },
    {
      path: '/purchase-orders/:id',
      name: 'po-detail',
      component: PurchaseOrderDetail
    },
    {
      path: '/receive-orders',
      name: 'ro-list',
      component: ReceiveOrderList
    },
    {
      path: '/receive-orders/:id',
      name: 'ro-detail',
      component: ReceiveOrderDetail
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
