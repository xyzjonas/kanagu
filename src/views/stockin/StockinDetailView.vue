<template>
  <main v-if="stockDocument && stockDocument.stockDocumentNumber">
    <div class="flex flex-col gap-2 mt-5">
      <ReceiveOrderItem
        v-for="item in stockDocument.stockDocumentItems ?? []"
        :key="item.id"
        :item="item"
        :order-id="stockDocument.stockDocumentNumber"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { StockDocument } from '@/client'
import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue';
import { inject } from 'vue'

// import NotFound from '@/components/NotFound.vue';
// import OrderHeader from '@/components/OrderHeader.vue';
// import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue';
// import { useStockDocumentById } from '@/composables/byId';

// const props = defineProps<{ id: string }>()

// const { stockDocument, reload } = useStockDocumentById({ id: props.id, type: 'STOCKIN' })
// await reload()

const stockDocument = inject<StockDocument>('stockinDocument')
</script>
<style lang="sass" scoped></style>
