<template>
  <Card>
    <div :class="`flex justify-between ${order.resolved ? 'text-green' : ''}`">
      <div class="flex flex-col">
        <span class="font-bold">{{ order.id }}</span>
        <span>{{ order.rackId }}</span>
      </div>
      <div class="flex flex-col text-right">
        <span>{{ received }}</span>
        <span>{{ order.supplier }}</span>
      </div>
    </div>
    <div class="flex justify-end">
      <q-btn
        :label="order.resolved ? 'hotovo' : 'naskladnit'"
        unelevated
        color="primary"
        :class="order.resolved ? 'bg-green-4' : ''"
        :to="{ name: 'ro-detail', params: { id: order.id } }"
        :disable="order.resolved"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ReceiveOrder } from '@/composables/useApi'
import Card from './Card.vue'
import { computed } from 'vue';

const props = defineProps<{ order: ReceiveOrder }>()

const received = computed(() => new Date(props.order.received).toLocaleDateString())
</script>

<style lang="sass" scoped></style>
