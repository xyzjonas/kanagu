<template>
  <div>
    <StockoutCountBadge :count="selectedSlot?.value ?? 0" :wanted-count="wantedCount ?? 0" />
    <ConfirmWarehousePlace v-model="isConfirmed" :selected-place="props.selectedSlot?.place" />
  </div>
</template>

<script setup lang="ts">
import type { PostStockMovement } from '@/composables/useApi'
import { watch } from 'vue'
import ConfirmWarehousePlace from '../ConfirmWarehousePlace.vue'
import StockoutCountBadge from '../StockoutCountBadge.vue'

const props = defineProps<{
  selectedSlot?: PostStockMovement
  wantedCount?: number | null
}>()

const emit = defineEmits(['next'])

const isConfirmed = defineModel<boolean>({ default: false })
watch(isConfirmed, () => {
  if (isConfirmed.value) {
    setTimeout(() => emit('next'), 500)
  }
})
</script>

<style lang="css" scoped></style>
