<template>
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-400 m-0">{{ order.stockDocumentNumber }}</h1>
      <h2 class="text-lg m-0">{{ customer }}</h2>
    </div>
    <!-- <q-btn flat icon="i-hugeicons-arrow-turn-backward" @click="$router.back()" /> -->
  </div>
</template>

<script setup lang="ts">
import type { StockDocument } from '@/client'
import { computed } from 'vue';

const props = defineProps<{
  order: StockDocument
  isStockOut?: boolean
}>()

const customer = computed(() => {
  if (props.isStockOut) {
    return props.order.customerName
  }
  return props.order.supplierName
})

</script>

<style lang="sass" scoped></style>
