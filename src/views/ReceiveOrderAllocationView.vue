<template>
  <q-page padding>
    <main v-if="receiveOrder && orderItem">
      <OrderHeader :order="receiveOrder" />

      <q-separator class="mb-5"></q-separator>

      <ItemAllocation :item="orderItem" />
    </main>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import ItemAllocation from '@/components/ItemAllocation.vue'
import NotFound from '@/components/NotFound.vue'
import OrderHeader from '@/components/OrderHeader.vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'

const { receiveOrders } = useApi()

const orderId = useRoute().params.orderId as string
const id = useRoute().params.id as string

const receiveOrder = receiveOrders.value.find((val) => val.id === orderId)

const orderItem = receiveOrder?.items.find((item) => item.id === id)
</script>

<style lang="sass" scoped></style>
