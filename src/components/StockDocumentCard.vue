<template>
    <div class="flex flex-col justify-between border-gray-3 border-solid border-1 border-rounded-md overflow-hidden relative">
      <div class="absolute-top pl-2 pt-1 opacity-[0.8]">
        <q-icon :name="isStockOut ? 'upload' : 'get_app'" size="1.2rem" />
      </div>
      <div class="ml-auto flex items-end flex-col p-2 text-left">
        <span class="font-600">{{ order.stockDocumentNumber }}</span>
        <span>{{ order.externalNumber }}</span>
      </div>
      <div class="flex flex-col text-left p-2">
        <div>
          <span class="opacity-[0.5]">Vystaveno:</span>
          <span>{{ createdOn }}</span>
        </div>
        <span class="text-lg font-500">{{ customer }}</span>
      </div>
      <q-btn
          square
          :label="isStockOut ? 'vyskladnit' : 'naskladnit'"
          unelevated
          color="primary"
          :to="{ name: 'ro-detail', params: { id: order.id } }"
          :disable="isStockOut"
        />
    </div>
</template>

<script setup lang="ts">
// import type { ReceiveOrder } from '@/composables/useApi'
import Card from './Card.vue'
import { computed } from 'vue'
import type { StockDocument } from '@/client'

const props = defineProps<{ order: StockDocument; isStockOut?: boolean }>()

const received = computed(() => new Date(props.order.deliveryDate).toLocaleDateString())

const customer = computed(() => {
  if (props.isStockOut) {
    return props.order.customerName
  }
  return props.order.supplierName
})

const createdOn = computed(() => {
  if (!props.order.createdOn) {
    return 'Datum chybí'
  }
  return new Date(props.order.createdOn).toLocaleDateString()
})

const closedOn = computed(() => {
  if (props.order.expeditionDate) {
    return new Date(props.order.expeditionDate) < new Date()
  }

  return false
})
</script>

<style lang="sass" scoped></style>
