<template>
  <q-page padding class="flex flex-col gap-2">
    <q-btn-group spread unelevated class="border-solid border-primary border-[1px]">
      <q-btn color="primary" label="vše" :flat="filter !== undefined" @click="filter = undefined" />
      <q-btn
        color="primary"
        label="neuzavřené"
        :flat="filter !== 'UNFULLFILED'"
        @click="filter = 'UNFULLFILED'"
      />
      <q-btn
        color="primary"
        label="uzavřené"
        :flat="filter !== 'FULLFILED'"
        @click="filter = 'FULLFILED'"
      />
    </q-btn-group>
    <StockDocumentList :receive-orders="receiveOrders" :loading="loading" />
    <div class="flex items-center justify-center mt-auto">
      <q-pagination v-model="current" :max="10" :max-pages="6" :boundary-numbers="false" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { StockDocument } from '@/client'
import StockDocumentList from '@/components/StockDocumentList.vue'
import { type DocumentFilter, useApi } from '@/composables/useApi'
import { onActivated, onMounted, ref, watch } from 'vue'

const { getStockDocuments } = useApi()

const loading = ref(true)
const filter = ref<DocumentFilter>()
const current = ref(1)
const receiveOrders = ref<StockDocument[]>([])

const refetch = async () => {
  loading.value = true
  receiveOrders.value = await getStockDocuments({
    type: 'STOCKIN',
    pageNum: current.value,
    filter: filter.value
  })
  setTimeout(() => (loading.value = false), 250)
}

onMounted(refetch)
onActivated(() => console.info('activated!!!!'))

watch(filter, refetch)
watch(current, refetch)
</script>

<style lang="sass" scoped></style>
