<template>
  <Card>
    <div class="flex justify-between">
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
import { computed } from 'vue';

const props = defineProps<{ order: ReceiveOrder }>()

const received = computed(() => new Date(props.order.received).toLocaleDateString())
</script>

<style lang="sass" scoped></style>
