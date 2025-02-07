<template>
  <q-page padding class="flex flex-col gap-5">
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
    <StockDocumentList
      :receive-orders="receiveOrders"
      :loading="current === 1 && loading"
      is-stock-out
      class="mb-5"
    />
    <div v-if="!thatsIt" class="flex items-center justify-center mt-auto">
      <q-btn icon="add" dense flat color="primary" label="načíst další" :loading="loading" @click="next" />
    </div>

    <BackToTopFab />
  </q-page>
</template>

<script setup lang="ts">
import BackToTopFab from '@/components/BackToTopFab.vue'
import StockDocumentList from '@/components/StockDocumentList.vue'
import { usePaginatedDocuments } from '@/composables/pagination'
import { onMounted } from 'vue'

const { receiveOrders, next, reset, thatsIt, current, filter, loading } = usePaginatedDocuments({
  localStorageFilterId: 'stockout-filter',
  localStoragePageId: 'stockout-pagenum',
  type: 'STOCKOUT'
})

onMounted(reset)
</script>

<style lang="sass" scoped></style>
