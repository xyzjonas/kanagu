<template>
  <q-page padding class="flex flex-col">
    <q-btn-group spread unelevated class="border-solid border-primary border-[1px]">
      <q-btn color="primary" label="vše" :flat="filter !== undefined" @click="filter = undefined" />
      <q-btn
        color="primary"
        label="neuzavřené"
        :flat="filter !== 'UNFULFILLED'"
        @click="filter = 'UNFULFILLED'"
      />
      <q-btn
        color="primary"
        label="uzavřené"
        :flat="filter !== 'FULFILLED'"
        @click="filter = 'FULFILLED'"
      />
    </q-btn-group>

    <div class="min-h-[4rem]">
      <transition name="slide-fade" mode="out-in">
        <h2 v-if="!loading" class="font-400">
          {{ totalItems }} <span class="uppercase">{{ polozky }}</span>
        </h2>
      </transition>
    </div>

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
import { usePolozky } from '@/composables/usePolozky'
import { onActivated, onMounted } from 'vue'

const { receiveOrders, next, reset, thatsIt, current, filter, loading, totalItems } = usePaginatedDocuments({
  localStorageFilterId: 'stockout-filter',
  localStoragePageId: 'stockout-pagenum',
  type: 'STOCKOUT'
})

const { polozky } = usePolozky(totalItems)

onActivated(() => {
  if (receiveOrders.value.length === 0) {
    reset()
  }
})

onMounted(reset)
</script>

<style lang="sass" scoped></style>
