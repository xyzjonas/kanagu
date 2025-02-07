<template>
  <q-page padding>
    <main v-if="stockDocument">
      <div class="flex items-center gap-1">
        <q-btn flat dense icon="i-hugeicons-arrow-left-03" :to="{ name: 'ro-list' }"></q-btn>
        <q-separator vertical class="mr-2" />
        <!-- <OrderHeader :order="stockDocument" /> -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-400 m-0">{{ stockDocument.stockDocumentNumber }}</h1>
            <h2 class="text-lg m-0">{{ stockDocument.supplierName }}</h2>
          </div>
          <!-- <q-btn flat icon="i-hugeicons-arrow-turn-backward" @click="$router.back()" /> -->
        </div>
      </div>
      <router-view></router-view>
    </main>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import NotFound from '@/components/NotFound.vue'
import OrderHeader from '@/components/OrderHeader.vue'
import ReceiveOrderItem from '@/components/ReceiveOrderItem.vue'
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'

const { getStockDocument } = useApi()

const id = useRoute().params.id as string

const stockDocument = await getStockDocument(id)
</script>
<style lang="sass" scoped></style>
