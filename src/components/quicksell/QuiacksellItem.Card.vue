<template>
  <div
    :class="`flex flex-col border-solid border-1 border-rounded-md border-slate-3 shadow-md overflow-hidden relative bg-slate-1`"
  >
    <div class="flex justify-between gap-2 p-2 items-center mb-2">
      <div class="flex flex-col flex-1">
        <span class="font-600">{{ item.name ?? 'N/A' }}</span>
        {{ item.code }}
        <span class="text-gray-5">MJ = {{ item?.product?.unitType?.code }}</span>
      </div>
      <div
        class="px-3 py-2 flex flex-col items-center border-gray-3 border-solid border-1 border-rounded-md min-w-[4rem]"
      >
        <span class="font-bold">{{ quantity }}</span>
        <span class="opacity-[0.8] font-normal">MJ</span>
      </div>
    </div>
    <q-btn
      v-if="!readonly"
      unelevated
      label="odebrat"
      icon="delete"
      square
      @click="$emit('delete')"
      class="border-solid border-t-1 border-t-slate-3 h-[3rem] mt-auto"
    />
  </div>
</template>

<script setup lang="ts">
import type { StockProduct, WarehousePlace } from '@/client'

defineProps<{ item: StockProduct; place: WarehousePlace; quantity: number; readonly?: boolean }>()
defineEmits(['delete'])
</script>

<style lang="sass" scoped></style>
