<template>
  <div>
    <StockoutCountBadge :count="selectedCount" :wanted-count="maxAvailable ?? 0" />
    <div class="flex flex-col justify-center items-center mt-10 text-center">
      <span class="text-gray-7 mt-2">{{ productCode ?? 'N/A' }}</span>
      <span class="text-2xl font-bold">{{ productName ?? 'N/A' }}</span>
      <!-- <span class="text-gray-5 mt-5">z buňky</span>
      <span class="text-xl">{{ correctedPlaceName }}</span> -->
      <q-input
        v-model.number="selectedCount"
        type="number"
        :label="`Počet MJ [${unitType ?? 'jednotka chybí'}]`"
        hint="Počet množstevních jednotek k vyskladnění."
        autofocus
        no-error-icon
        input-class="text-center text-3xl"
        :rules="[rules.notEmpty, rules.atLeastOne, isAvailable]"
        inputmode="numeric"
      />
      <!-- TODO: add "MJ =" indicator -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostStockMovement } from '@/composables/useApi'
import { useWarehouse } from '@/composables/warehouse'
import { computed, ref, watch } from 'vue'
import StockoutCountBadge from '../StockoutCountBadge.vue'
import type { StockItemApiModel } from '@/client'
import { rules } from '@/utils'

const { getWarehousePlace } = useWarehouse()

const props = defineProps<{
  productCode?: string | null
  productName?: string | null
  unitType?: string | null
  placeCode?: string | null
  stockItems: StockItemApiModel[]
  movementWantedCount?: number | null
}>()

const correctedPlaceName = computed(() => getWarehousePlace(props.placeCode ?? 'N/A'))
const emit = defineEmits(['next'])

const selectedCount = defineModel<number>({ required: true, default: 0 })
const isValid = defineModel<boolean>('isValid')

const originalPlace = computed(() =>
  props.stockItems?.find((it) => it.warehousePlaceCode === props.placeCode)
)
const maxAvailable = computed(() => {
  if ((props.movementWantedCount ?? 0) > (originalPlace.value?.value ?? 0)) {
    return originalPlace.value?.value ?? 0
  }
  return props.movementWantedCount ?? 0
})

function isAvailable(val: any) {
  const value = parseFloat(val)
  if (value > (originalPlace.value?.value ?? 0)) {
    return `Maximální počet MJ na skladovém místě je ${originalPlace.value?.value ?? 0}`
  }

  return true
}

function updateValid(val: any) {
  if (isAvailable(val) === true) {
    isValid.value = true
  } else {
    isValid.value = false
  }
}

updateValid(selectedCount.value)

watch(selectedCount, (val) => {
  if (isAvailable(val) === true) {
    isValid.value = true
  } else {
    isValid.value = false
  }
})
</script>

<style lang="css" scoped></style>
