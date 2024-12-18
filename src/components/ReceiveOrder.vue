<template>
  <Card>
    <div class="flex justify-between">
      <div class="flex flex-col">
        <span class="font-bold">{{ order.id }}</span>
        <span>{{ order.rackId }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span>{{ order.received.toLocaleDateString() }}</span>
        <span>{{ order.supplier }}</span>
      </div>
    </div>
    <div class="flex justify-end">
      <q-btn
        size="large"
        label="naskladnit"
        unelevated
        color="secondary"
        :to="{ name: 'ro-detail', params: { id: order.id } }"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ReceiveOrder } from '@/composables/useApi'
import Card from './Card.vue'

defineProps<{ order: ReceiveOrder }>()
</script>

<style lang="sass" scoped></style>
