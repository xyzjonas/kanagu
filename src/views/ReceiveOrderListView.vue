<template>
  <q-page padding>
    <div class="flex flex-col gap-2">
      <ReceiveOrderItem v-for="order in receiveOrders" :key="order.id" :order="order" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ReceiveOrderItem from '@/components/ReceiveOrder.vue';
import { useApi } from '@/composables/useApi'

const { getStockinOrders } = useApi()

const receiveOrders = await getStockinOrders()
</script>

<style lang="sass" scoped></style>
