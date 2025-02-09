<template>
  <Card>
    <div :class="`flex flex-col ${resolved ? 'text-green' : ''}`">
      <span class="text-gray-7">{{ item.stockProductId }}</span>
      <span :class="`${resolved ? 'text-green' : 'text-secondary'} text-lg font-500`">{{ item.name }}</span>
      <span class="text-gray-4">MJ = {{ item.unit }}</span>
    </div>
    <div class="flex justify-end gap-1 mt-3">
      <q-btn
        label="tisk"
        unelevated
        class="flex-1"
        color="secondary"
        :to="{ name: 'ro-printout', params: { orderId, id: item.id } }"
      />
      <q-btn
        :label="resolved ? 'hotovo' : 'přijmout'"
        unelevated
        color="primary"
        :class="`flex-1 ${ resolved ? 'bg-green-4' : ''}`"
        :to="{ name: 'ro-allocation', params: { orderId, id: item.id } }"
        :disable="resolved"
      />
      <q-btn
        :label="remaining"
        unelevated
        color="dark"
        class="min-w-[5rem]"
        disable
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from './Card.vue'
import type { StockDocumentItem } from '@/client';

const props = defineProps<{ orderId: string, item: StockDocumentItem }>()

const resolved = computed(() => props.item.quantity === props.item.quantityMoved)
const remaining = computed(() => (props.item.quantity ?? 0) - (props.item.quantityMoved ?? 0))
</script>

<style lang="sass" scoped></style>
