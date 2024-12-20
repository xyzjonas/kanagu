<template>
  <q-page padding>
    <main v-if="receiveOrder">
      <OrderHeader :order="receiveOrder" />

      <q-separator class="mb-5 mt-1"></q-separator>

      <div class="flex flex-col gap-2">
        <ReceiveOrderItem
          v-for="item in receiveOrder.items"
          :key="item.item.id"
          :item="item"
          :order-id="receiveOrder.id"
        />
      </div>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import OrderHeader from '@/components/OrderHeader.vue';
import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'

const { receiveOrders } = useApi()

const id = useRoute().params.id as string

const receiveOrder = receiveOrders.value.find((val) => val.id === id)
</script>
<style lang="sass" scoped></style>
