<template>
  <div
    :class="`flex flex-col border-gray-3 border-solid border-1 border-rounded-md shadow-md overflow-hidden relative`"
  >
    <div class="flex justify-between gap-2 p-2 items-center">
      <div :class="`flex flex-col flex-1 ${resolved ? 'text-green' : ''}`">
        <span>{{ movement.stockProductId }}</span>
        <span :class="`${resolved ? 'text-green' : 'text-secondary'} text-lg font-500`">{{
          movement.stockProduct?.name
        }}</span>
        <span class="text-gray-5">MJ = {{ movement.stockProduct?.product?.unitType?.name }}</span>
      </div>
      <div
        class="px-3 py-2 flex flex-col items-center border-gray-3 border-solid border-1 border-rounded-md"
      >
        <span class="font-bold">{{ round(remaining, 2) }}</span>
        <span class="text-xs text-gray-4">zbývá MJ</span>
      </div>
    </div>
    <div class="flex mt-3 h-[3rem]">
      <q-btn label="tisk" unelevated square flat class="flex-1" @click="$emit('clickPrint')" />
      <q-btn
        :label="resolved ? 'hotovo' : 'přijmout'"
        unelevated
        square
        color="primary"
        :class="`flex-[2] ${resolved ? 'bg-green-4' : ''}`"
        :to="{ name: 'ro-allocation', params: { id: orderId, movementId: movement.id } }"
        :disable="resolved"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StockDocumentItem, StockMovementItemApiModel } from '@/client'
import { round } from '@/utils'

const props = defineProps<{
  orderId: string
  item: StockDocumentItem | undefined
  movement: StockMovementItemApiModel
}>()

const resolved = computed(() => props.item?.quantity === props.item?.quantityMoved)
const remaining = computed(() => (props.item?.quantity ?? 0) - (props.item?.quantityMoved ?? 0))
</script>

<style lang="sass" scoped></style>
