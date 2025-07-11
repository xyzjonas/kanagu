<template>
  <div :class="`card-shadow flex flex-col relative ${saved ? '' : 'border-red'}`">
    <div v-if="!saved" class="h-[1rem]">
      <q-btn
        @click="$emit('delete')"
        icon="delete_outline"
        rounded
        dense
        size="sm"
        class="card-shadow absolute top-[-4px] left-[-8px]"
      />
    </div>
    <div class="flex justify-between gap-2 p-2 pl-3 items-center mb-2">
      <div class="flex flex-col">
        <span class="text-xs text-gray-4 uppercase">přesun do</span>
        <span class="font-500">{{ placeCode ?? 'N/A' }}</span>
        <span v-if="!saved" class="text-red text-xs">neuloženo</span>
        <span v-else class="text-green text-xs">potvrzeno</span>
      </div>
      <div
        class="px-3 py-2 flex flex-col items-center border-gray-3 border-solid border-1 border-rounded-md min-w-[4rem]"
      >
        <span class="font-bold">{{ quantity }}</span>
        <span class="opacity-[0.8] font-normal">MJ</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  placeCode?: string | null
  quantity?: number
  saved?: boolean
}>()
defineEmits(['delete', 'click-print'])
</script>

<style lang="sass" scoped></style>
