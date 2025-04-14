<template>
  <main v-if="stockItem && movement" class="flex flex-col">
    <ItemExtraction
      :item="stockItem"
      :movement="movement"
      :stock-document-id="stockDocument?.id"
      @extracted="handleExtracted"
    />
  </main>
  <NotFound v-else />
</template>

<script setup lang="ts">
import { type StockDocument, type StockMovementItemApiModel } from '@/client'
import ItemAllocation from '@/components/ItemAllocation.vue'
import ItemExtraction from '@/components/extraction/ItemExtraction.vue'
import NotFound from '@/components/NotFound.vue'
import { inject, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const stockDocument = inject<Ref<StockDocument>>('stockoutDocument')
const movements = inject<Ref<StockMovementItemApiModel[]>>('movements', ref([]))
const reloadTrigger = inject<Ref<number>>('triggerReload', ref(0))

const props = defineProps<{ id: string; movementId: string }>()

const movement = movements.value.find((mov) => `${mov.id}` === props.movementId)
const stockItem = stockDocument?.value?.stockDocumentItems?.find(
  (item) => item.lineNumber === movement?.lineNumber
)

const router = useRouter()
const handleExtracted = () => {
  reloadTrigger.value += 1
  router.push({ name: 'po-detail', params: { id: props.id } })
}
</script>

<style lang="sass" scoped></style>
