<template>
  <Card>
    <div :class="`flex flex-col ${item.resolved ? 'text-green' : ''}`">
      <span class="font-bold">{{ item.item.id }}</span>
      <span :class="`${item.resolved ? 'text-green' : 'text-secondary'} text-lg`">{{ item.item.name }}</span>
      <span class="text-gray-4">MJ = 100ks</span>
    </div>
    <div class="flex justify-end gap-1">
      <q-btn
        label="tisk"
        unelevated
        class="flex-1"
        color="secondary"
        :to="{ name: 'ro-printout', params: { orderId, id: item.id } }"
      />
      <q-btn
        :label="item.resolved ? 'hotovo' : 'přijmout'"
        unelevated
        color="primary"
        :class="`flex-1 ${ item.resolved ? 'bg-green-4' : ''}`"
        :to="{ name: 'ro-allocation', params: { orderId, id: item.id } }"
        :disable="item.resolved"
      />
      <q-btn
        :label="`${item.resolved ? 0 : item.count} MJ`"
        unelevated
        color="dark"
        class="min-w-[5rem]"
        disable
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { OrderItem } from '@/composables/useApi'
import Card from './Card.vue'

defineProps<{ orderId: string, item: OrderItem }>()
</script>

<style lang="sass" scoped></style>
