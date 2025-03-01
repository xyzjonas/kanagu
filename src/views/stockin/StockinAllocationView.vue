<template>
  <main v-if="stockItem && movement" class="flex flex-col">
    <ItemAllocation
      :item="stockItem"
      :movement="movement"
      :stock-document-id="stockDocument?.id"
      @allocated="handleAllocated"
    />
  </main>
  <NotFound v-else />
</template>

<script setup lang="ts">
import { type StockDocument, type StockMovementItemApiModel } from '@/client'
import ItemAllocation from '@/components/ItemAllocation.vue'
import NotFound from '@/components/NotFound.vue'
import { useStockDocumentById } from '@/composables/byId'
import { inject, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const stockDocument = inject<Ref<StockDocument>>('stockinDocument')
const movements = inject<Ref<StockMovementItemApiModel[]>>('movements', ref([]))
const reloadTrigger = inject<Ref<number>>('triggerReload', ref(0))

const props = defineProps<{ id: string; movementId: string }>()

const movement = movements.value.find((mov) => `${mov.id}` === props.movementId)
const stockItem = stockDocument?.value?.stockDocumentItems?.find(
  (item) => item.lineNumber === movement?.lineNumber
)

const router = useRouter()
const handleAllocated = () => {
  reloadTrigger.value += 1
  router.push({ name: 'ro-detail', params: { id: props.id } })
}
</script>

<style lang="sass" scoped></style>
