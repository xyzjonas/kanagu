<template>
  <div
    class="font-400 uppercase mb-2 text-lg border-solid border-1 border-rounded-lg border-slate-4 w-fit py-1 px-3"
  >
    Výdej
    <span v-if="count === 0">
      <span class="text-negative font-bold"> {{ count }}&hairsp;MJ </span>
      <span v-if="wantedCount !== count"> / {{ wantedCount }}&hairsp;MJ</span>
    </span>
    <span v-else-if="wantedCount === count" class="text-positive font-bold">
      {{ count }}&hairsp;MJ
    </span>
    <span v-else-if="count !== wantedCount">
      <span class="text-amber-600 font-bold"> {{ count }}&hairsp;MJ </span>
      <span v-if="wantedCount !== count" class="text-gray-5"> / {{ wantedCount }}&hairsp;MJ</span>
    </span>
    <span v-else> {{ count }}&hairsp;MJ</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ count: number; wantedCount: number }>()
</script>
<style lang="css" scoped></style>
