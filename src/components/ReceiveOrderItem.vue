<template>
  <Card>
    <div class="flex flex-col">
      <span class="font-bold">{{ item.item.id }}</span>
      <span class="text-secondary text-lg">{{ item.item.name }}</span>
      <span class="text-gray-4">MJ = 100ks</span>
    </div>
    <div class="flex justify-end gap-1">
      <q-btn
        label="tisk"
        unelevated
        color="secondary"
        icon="print"
        :to="{ name: 'ro-printout', params: { orderId, id: item.id } }"
      />
      <q-btn
        label="přijmout"
        unelevated
        color="secondary"
        icon="get_app"
        :to="{ name: 'ro-allocation', params: { orderId, id: item.id } }"
      />
      <q-btn
        :label="`${item.count} MJ`"
        unelevated
        color="dark"
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
