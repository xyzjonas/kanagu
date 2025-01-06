<template>
  <q-page padding class="flex flex-col">
    <main v-if="receiveOrder && orderItem">
      <div class="flex items-center gap-1 mb-5">
        <q-btn
          flat
          dense
          icon="i-hugeicons-arrow-left-03"
          :to="{ name: 'ro-detail', params: { id: orderId } }"
        ></q-btn>
        <q-separator vertical class="mr-2" />
        <OrderHeader :order="receiveOrder" />
      </div>

      <ItemAllocation :item="orderItem" @allocated="(slot, count) => handleAllocated(count)" />
    </main>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import ItemAllocation from '@/components/ItemAllocation.vue'
import NotFound from '@/components/NotFound.vue'
import OrderHeader from '@/components/OrderHeader.vue'
import { useApi } from '@/composables/useApi'
import { useRoute, useRouter } from 'vue-router'

const { receiveOrders } = useApi()

const orderId = useRoute().params.orderId as string
const id = useRoute().params.id as string

const receiveOrder = receiveOrders.value.find((val) => val.id === orderId)

const orderItem = receiveOrder?.items.find((item) => item.id === id)

const router = useRouter()
const handleAllocated = (count: number) => {
  console.info(`foo: ${count}`)
  if (orderItem) {
    orderItem.count = orderItem.count - count
    if (orderItem.count <= 0) {
      orderItem.count = 0
      orderItem.resolved = true
    }
  }
  router.push({ name: 'ro-detail', params: { id: orderId } })
}
</script>

<style lang="sass" scoped></style>
