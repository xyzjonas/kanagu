<template>
  <div
    v-if="!isActive"
    @click.capture="() => undefined"
    class="z-[9999999] absolute inset-0 bg-slate-4 pointer-events-none opacity-[0.6]"
  ></div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()

const isActive = computed(() => $q.loading?.isActive)
</script>

<style lang="css" scoped></style>
