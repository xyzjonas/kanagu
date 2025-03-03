<template>
  <q-page padding class="flex flex-col gap-5">
    <section class="flex gap-2 h-[5rem]">
      <q-btn
        unelevated
        :to="{ name: 'ro-list' }"
        label="příjemky"
        class="flex-1 bg-stockin text-white"
      />
      <q-btn
        unelevated
        :to="{ name: 'po-list' }"
        label="výdejky"
        class="flex-1 bg-stockout text-white"
      />
      <q-btn
        unelevated
        color="primary"
        :to="{ name: 'quicksell' }"
        label="prodej"
        class="flex-1"
        disable
      />
    </section>
    <q-separator />
    <section class="flex flex-col gap-5">
      <q-input
        v-model="search"
        outlined
        rounded
        placeholder="Vyhledat položku podle čísla dokladu"
        :debounce="600"
        :loading="loading"
        clearable
      >
        <template #prepend>
          <q-icon name="search" class="ml-2" />
        </template>
      </q-input>

      <StockDocumentList :receive-orders="stockDocumentsIn" />
      <StockDocumentList :receive-orders="stockDocumentsOut" is-stock-out />
      <section
        v-if="stockDocumentsIn.length <= 0 && stockDocumentsOut.length <= 0"
        class="grid content-center justify-center h-sm"
      >
        <div v-if="search" class="text-center">
          <q-icon size="3rem" name="content_paste_search" class="text-gray-7" />
          <h2 class="text-gray-6 font-400">Na hledaný výraz nebylo nic nalezeno.</h2>
        </div>
      </section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import type { StockDocument } from '@/client'
import StockDocumentList from '@/components/StockDocumentList.vue'
import { useApi } from '@/composables/useApi'
import { ref, watch } from 'vue'

const { getStockDocuments } = useApi()

const loading = ref(false)
const search = ref('')
const stockDocumentsIn = ref<StockDocument[]>([])
const stockDocumentsOut = ref<StockDocument[]>([])

watch(search, async () => {
  if (!search.value) {
    stockDocumentsIn.value = []
    stockDocumentsOut.value = []
    return
  }

  loading.value = true
  try {
    stockDocumentsIn.value = await getStockDocuments({
      searchString: search.value,
      type: 'STOCKIN'
    })
    stockDocumentsOut.value = await getStockDocuments({
      searchString: search.value,
      type: 'STOCKOUT'
    })
  } finally {
    setTimeout(() => (loading.value = false), 100)
  }
})
</script>
