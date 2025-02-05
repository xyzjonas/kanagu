<template>
  <Card>
    <div :class="`flex justify-between ${order.note ? 'text-green' : ''}`">
      <div class="flex flex-col">
        <span class="font-bold">{{ order.id }}</span>
        <span>{{ order.warehousePlaces }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span>{{ received }}</span>
        <span>{{ order.supplierName }}</span>
      </div>
    </div>
    <div class="flex justify-end">
      <q-btn
        :label="resolved ? 'hotovo' : 'naskladnit'"
        unelevated
        color="primary"
        :class="resolved ? 'bg-green-4' : ''"
        :to="{ name: 'ro-detail', params: { id: order.id } }"
        :disable="resolved"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
// import type { ReceiveOrder } from '@/composables/useApi'
import Card from './Card.vue'
import { computed } from 'vue';
import type { StockDocument } from '@/client';

const props = defineProps<{ order: StockDocument }>()

const received = computed(() => new Date(props.order.deliveryDate).toLocaleDateString())

const resolved = computed(() => {
  if (props.order.expeditionDate) {
    return new Date(props.order.expeditionDate) < new Date()
  }

  return false
})
</script>

<style lang="sass" scoped></style>
