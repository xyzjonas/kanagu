<template>
  <q-page padding>
    <main v-if="receiveOrder">
      <h1 class="text-2xl font-semibold m-0">{{ receiveOrder.id }}</h1>
      <h2 class="text-lg m-0">{{ receiveOrder.supplier }}</h2>

      <q-separator class="mb-5"></q-separator>

      <q-icon size="10rem" name="print"></q-icon>

    </main>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import NotFound from '@/components/NotFound.vue';
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'

const { receiveOrders } = useApi()

const id = useRoute().params.orderId as string

const receiveOrder = receiveOrders.value.find((val) => val.id === id)
</script>

<style lang="sass" scoped></style>
