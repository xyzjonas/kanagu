<template>
  <q-page padding>
    <main v-if="receiveOrder">
      <h1 class="text-2xl font-semibold m-0">{{ receiveOrder.id }}</h1>
      <h2 class="text-lg m-0">{{ receiveOrder.supplier }}</h2>

      <q-separator class="mb-5"></q-separator>

      <div class="flex flex-col gap-2">
        <ReceiveOrderItem v-for="item in receiveOrder.items" :key="item.item.id" :item="item" />
      </div>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'

const { receiveOrders } = useApi()

const id = useRoute().params.id as string

const receiveOrder = receiveOrders.find((val) => val.id === id)
</script>
<style lang="sass" scoped></style>
