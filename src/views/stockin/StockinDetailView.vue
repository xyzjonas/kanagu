<template>
  <q-page padding>
    <main v-if="stockDocument">
      <div class="flex items-center gap-1">
        <q-btn flat dense icon="i-hugeicons-arrow-left-03" :to="{ name: 'ro-list' }"></q-btn>
        <q-separator vertical class="mr-2" />
        <OrderHeader :order="stockDocument" />
      </div>
      <router-view></router-view>
      <div class="flex flex-col gap-2 mt-5">
        <ReceiveOrderItem
          v-for="item in stockDocument.items"
          :key="item.item.id"
          :item="item"
          :order-id="stockDocument.stockDocumentNumber"
        />
      </div>
    </main>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import NotFound from '@/components/NotFound.vue';
import OrderHeader from '@/components/OrderHeader.vue';
import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue';
import { useApi } from '@/composables/useApi';
import { useRoute } from 'vue-router';

const props = defineProps<{ id: string }>()

const { getStockDocument } = useApi()

// const id = useRoute().params.id as string

const stockDocument = await getStockDocument(props.id)

</script>
<style lang="sass" scoped></style>
