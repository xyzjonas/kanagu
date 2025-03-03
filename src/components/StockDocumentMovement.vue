<template>
  <div
    :class="`flex flex-col ${isOutOfStock && isStockOout && !resolved ? 'border-negative' : 'border-slate-3'} border-solid border-1 border-rounded-md shadow-md overflow-hidden relative bg-slate-1`"
  >
    <div class="flex justify-between gap-2 p-2 items-center">
      <div :class="`flex flex-col flex-1 ${resolved ? 'text-green' : ''}`">
        <span>{{ movement.stockProduct?.code ?? 'N/A' }}</span>
        {{ movement.stockProductId }}
        <span :class="`${resolved ? 'text-green' : 'text-primary'} text-lg font-500`">{{
          movement.stockProduct?.name
        }}</span>
        <span class="text-gray-5">MJ = {{ movement.stockProduct?.product?.unitType?.name }}</span>
      </div>
      <div
        class="px-3 py-2 flex flex-col items-center border-gray-3 border-solid border-1 border-rounded-md"
      >
        <span v-if="toBeshippedAmount > 0" class="font-bold"
          >{{ round(toBeshippedAmount, 3) }}
          <span v-if="notEnoughInStock && isStockOout">
            /
            <span class="text-negative">{{ round(availableAmount, 3) }}</span>
          </span>
        </span>
        <span v-else class="font-bold"
          >{{ round(movement.value ?? 0, 3) }}
          <span v-if="notEnoughInStock && isStockOout">
            /
            <span class="text-negative">{{ round(availableAmount, 3) }}</span>
          </span>
        </span>
        <span class="text-xs text-gray-4"
          >{{ toBeshippedAmount > 0 ? 'zbývá' : 'přesunuto' }} MJ</span
        >
      </div>
    </div>
    <div class="flex mt-3 h-[3rem] border-t-solid border-1 border-slate-3">
      <q-btn label="tisk" unelevated square flat class="flex-1" @click="$emit('clickPrint')" />
      <q-btn
        v-if="resolved"
        label="hotovo"
        unelevated
        square
        class="flex-[2] bg-positive text-white"
        :to="{
          name: isStockOout ? 'po-allocation' : 'ro-allocation',
          params: { id: orderId, movementId: movement.id }
        }"
        disable
      />
      <q-btn
        v-else-if="isOutOfStock && isStockOout"
        label="není skladem"
        unelevated
        square
        color="negative"
        class="flex-[2]"
        :to="{
          name: isStockOout ? 'po-allocation' : 'ro-allocation',
          params: { id: orderId, movementId: movement.id }
        }"
        disable
      />
      <q-btn
        v-else
        :label="resolved ? 'hotovo' : isStockOout ? 'vydat' : 'přijmout'"
        unelevated
        square
        color="primary"
        :class="`flex-[2] ${resolved ? 'bg-green-4' : ''}`"
        :to="{
          name: isStockOout ? 'po-allocation' : 'ro-allocation',
          params: { id: orderId, movementId: movement.id }
        }"
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
  isStockOout?: boolean
}>()

const resolved = computed(() => props.item?.quantity === props.item?.quantityMoved)
const toBeshippedAmount = computed(
  () => (props.item?.quantity ?? 0) - (props.item?.quantityMoved ?? 0)
)

const availableAmount = computed(
  () => props.movement.stockItems?.reduce((count, item) => count + (item.value ?? 0), 0) ?? 0
)

const isOutOfStock = computed(() => availableAmount.value === 0)
const notEnoughInStock = computed(() => toBeshippedAmount.value > availableAmount.value)
</script>

<style lang="sass" scoped></style>
