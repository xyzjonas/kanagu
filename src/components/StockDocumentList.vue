<template>
  <div v-if="loading" class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <StockDocumentSkeleton v-for="i in 20" :key="i" />
  </div>
  <div v-else class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ReceiveOrderItem
      v-for="order in receiveOrders"
      :key="order.id"
      :order="order"
      :is-stock-out="isStockOut"
    />
  </div>
</template>

<script setup lang="ts">
import type { StockDocument } from '@/client'
import ReceiveOrderItem from '@/components/StockDocumentCard.vue'
import StockDocumentSkeleton from './StockDocumentSkeleton.vue'

defineProps<{
  loading?: boolean
  isStockOut?: boolean
  receiveOrders: StockDocument[]
}>()
</script>

<style lang="sass" scoped></style>
