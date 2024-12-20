<script setup lang="ts">
import type { ReceiveOrder } from '@/composables/useApi';

defineProps<{ order: ReceiveOrder }>()
</script>

<template>
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-400 m-0">{{ order.id }}</h1>
      <h2 class="text-lg m-0">{{ order.supplier }}</h2>
    </div>
    <q-btn flat icon="i-hugeicons-arrow-turn-backward" @click="$router.back()" />
  </div>
</template>

<style lang="sass" scoped></style>
