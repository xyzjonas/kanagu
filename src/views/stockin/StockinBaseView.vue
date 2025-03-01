<template>
  <q-page padding class="flex flex-col">
    <div v-if="stockDocument" class="flex-1 flex flex-col">
      <div class="flex items-center gap-1 flex-nowrap">
        <q-btn flat dense icon="arrow_back" :to="to"></q-btn>
        <q-separator vertical class="mx-3" />
        <OrderHeader :order="stockDocument" />
      </div>
      <router-view class="flex-1" @allocated=""></router-view>
    </div>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import type { StockDocument, StockMovementItemApiModel } from '@/client'
import NotFound from '@/components/NotFound.vue'
import OrderHeader from '@/components/OrderHeader.vue'
import { useStockDocumentById } from '@/composables/byId'
import { computed, provide, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ id: string }>()

const { stockDocument, movements, reload } = useStockDocumentById({ id: props.id, type: 'STOCKIN' })
await reload()

// two-way communication channel
const reloadTrigger = ref(0)
watch(reloadTrigger, async () => await reload())
provide('triggerReload', reloadTrigger)

if (stockDocument.value) {
  provide<Ref<StockDocument | undefined>>('stockinDocument', stockDocument)
  provide<Ref<StockMovementItemApiModel[]>>('movements', movements)
}

const { currentRoute } = useRouter()
const to = computed(() => {
  if (currentRoute.value.path.endsWith(props.id)) {
    return { name: 'ro-list' }
  }

  return { name: 'ro-detail', id: props.id }
})

const router = useRouter()
const handleAllocated = () => {
  router.push({ name: 'ro-detail', params: { id: props.id } })
  reload()
}
</script>
<style lang="sass" scoped></style>
