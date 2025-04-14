<template>
  <div>
    <StockoutCountBadge :count="selectedSlot?.value ?? 0" :wanted-count="wantedCount ?? 0" />
    <div class="flex flex-col justify-center items-center mt-10">
      <span>VYBRÁNO</span>
      <span class="text-2xl"><span class="text-gray-5">BUŇKA</span> {{ correctedPlaceName }}</span>
      <q-input
        v-model="confirmation"
        autofocus
        :rules="[(val) => val === correctedPlaceName]"
        no-error-icon
        input-class="text-center"
        inputmode="none"
      />
      <span>POTVRDIT BUŇKU SCANNEREM</span>
      <div class="h-[3rem]">
        <transition mode="out-in" name="slide-fade">
          <q-btn
            v-if="confirmation.length >= 1 && confirmation !== correctedPlaceName"
            label="reset"
            @click="confirmation = ''"
            flat
            class="mt-5"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostStockMovement } from '@/composables/useApi'
import { useWarehouse } from '@/composables/warehouse'
import { computed, ref, watch } from 'vue'
import StockoutCountBadge from '../StockoutCountBadge.vue'

const { getWarehousePlace } = useWarehouse()

const props = defineProps<{
  selectedSlot?: PostStockMovement
  wantedCount?: number | null
}>()

const emit = defineEmits(['next'])

const isConfirmed = defineModel<boolean>({ default: false })
const confirmation = ref('')

const correctedPlaceName = computed(() => getWarehousePlace(props.selectedSlot?.place ?? 'N/A'))

function updateConfirmation() {
  if (confirmation.value === correctedPlaceName.value) {
    isConfirmed.value = true
    setTimeout(() => emit('next'), 500)
  } else {
    isConfirmed.value = false
  }
}

updateConfirmation()

watch(confirmation, () => {
  if (confirmation.value === correctedPlaceName.value) {
    isConfirmed.value = true
    setTimeout(() => emit('next'), 500)
  } else {
    isConfirmed.value = false
  }
})
</script>

<style lang="css" scoped></style>
