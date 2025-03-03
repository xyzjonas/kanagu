<template>
  <div
    class="my-5 py-10 flex items-start justify-center border-dashed border-gray-4 border-1 border-rounded vo"
  >
    <div v-if="title" class="flex flex-col gap-2">
      <h2 class="uppercase font-400">{{ title }}</h2>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style lang="css" scoped></style>
