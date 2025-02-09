<template>
  <q-page padding>
    <div v-if="stockDocument">
      <div class="flex items-center gap-1 flex-nowrap">
        <q-btn flat dense icon="arrow_back" :to="{ name: 'ro-list' }"></q-btn>
        <q-separator vertical class="mx-3" />
        <OrderHeader :order="stockDocument" />
      </div>
      <router-view></router-view>
    </div>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import type { StockDocument } from '@/client'
import NotFound from '@/components/NotFound.vue'
import OrderHeader from '@/components/OrderHeader.vue'
import { useStockDocumentById } from '@/composables/byId'
import { provide } from 'vue'

const props = defineProps<{ id: string }>()

const { stockDocument, reload } = useStockDocumentById({ id: props.id, type: 'STOCKIN' })
await reload()

if (stockDocument.value) {
  provide<StockDocument>('stockinDocument', stockDocument.value)
}
</script>
<style lang="sass" scoped></style>
