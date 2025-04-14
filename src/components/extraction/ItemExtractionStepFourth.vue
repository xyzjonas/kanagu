<template>
  <div>
    <StockoutCountBadge :count="selectedCount" :wanted-count="movementWantedCount ?? 0" />
    <div class="flex flex-col justify-center items-center mt-10 text-center">
      <span class="text-gray-5 mt-5">z buňky</span>
      <span class="text-xl">{{ correctedPlaceName }}</span>
      <span class="text-2xl font-bold">{{ productName ?? 'N/A' }}</span>
      <span class="text-gray-7 mt-2">{{ productCode ?? 'N/A' }}</span>
      <q-input
        v-model="finalConfirmation"
        autofocus
        :rules="[(val) => val === productCode]"
        no-error-icon
        input-class="text-center"
        inputmode="none"
      />
      <span class="text-center"
        >POTVRDIT POLOŽKU SCANNEREM <br />
        PRO ODESLÁNÍ</span
      >
      <div class="h-[3rem]">
        <transition mode="out-in" name="slide-fade">
          <q-btn
            v-if="finalConfirmation.length >= 1 && finalConfirmation !== productCode"
            label="reset"
            @click="finalConfirmation = ''"
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
import type { StockItemApiModel } from '@/client'
import { rules } from '@/utils'
import { useQuasar } from 'quasar'

const { getWarehousePlace } = useWarehouse()

const props = defineProps<{
  productCode?: string | null
  productName?: string | null
  placeCode?: string | null
  selectedCount: number
  movementWantedCount?: number | null
}>()

const correctedPlaceName = computed(() => getWarehousePlace(props.placeCode ?? 'N/A'))
const emit = defineEmits(['submit'])

const finalConfirmation = ref('')
const isValid = defineModel<boolean>({ required: true })

isValid.value = finalConfirmation.value === props.productCode

const $q = useQuasar()

watch(finalConfirmation, (val) => {
  if (val === props.productCode) {
    isValid.value = true
    emit('submit')
  } else {
    isValid.value = false
    $q.notify({
      type: 'negative',
      message: `Kód neodpovídá zvolené položce: ${props.productCode}`,
      timeout: 2000
    })
  }
})
</script>

<style lang="css" scoped></style>
