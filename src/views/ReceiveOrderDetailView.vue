<template>
  <q-page padding>
    <main v-if="receiveOrder">
      <div class="flex items-center gap-1">
        <q-btn flat dense icon="i-hugeicons-arrow-left-03" :to="{ name: 'ro-list' }"></q-btn>
        <q-separator vertical class="mr-2" />
        <OrderHeader :order="receiveOrder" />
      </div>

      <div class="flex flex-col gap-2 mt-5">
        <ReceiveOrderItem
          v-for="item in receiveOrder.items"
          :key="item.item.id"
          :item="item"
          :order-id="receiveOrder.id"
        />
      </div>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import OrderHeader from '@/components/OrderHeader.vue';
import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue';
import { useApi } from '@/composables/useApi';
import { useRoute } from 'vue-router';

const { receiveOrders } = useApi()

const id = useRoute().params.id as string

const receiveOrder = receiveOrders.value.find((val) => val.id === id)

</script>
<style lang="sass" scoped></style>
