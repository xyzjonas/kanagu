<template>
  <div>
    <StockoutCountBadge :count="selectedCount" :wanted-count="movementWantedCount ?? 0" />
    <div class="flex flex-col justify-center items-center mt-10 text-center">
      <span class="text-gray-5 mt-5">z buňky</span>
      <span class="text-xl">{{ correctedPlaceName }}</span>
      <span class="text-2xl font-bold">{{ productName ?? 'N/A' }}</span>
      <span class="text-gray-7 mt-2">{{ printedBarcodes }}</span>
      <div v-if="loading" class="flex flex-col gap-3 mt-5 items-center">
        <q-spinner color="primary" size="4rem" :thickness="3"></q-spinner>
        <span class="uppercase text-primary">odesílám</span>
      </div>
      <div v-else>
        <q-input
          v-model="finalConfirmation"
          autofocus
          :rules="[(val) => validateCode(val)]"
          no-error-icon
          input-class="text-center"
          inputmode="none"
          :readonly="loading"
        />
        <span class="text-center"
          >POTVRDIT POLOŽKU SCANNEREM <br />
          PRO ODESLÁNÍ</span
        >
        <div class="h-[3rem]">
          <transition mode="out-in" name="slide-fade">
            <q-btn
              v-if="showReset"
              label="reset"
              @click="finalConfirmation = ''"
              flat
              class="mt-5"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWarehouse } from '@/composables/warehouse'
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import StockoutCountBadge from '../StockoutCountBadge.vue'

const { getWarehousePlace } = useWarehouse()

const props = defineProps<{
  productName?: string | null
  placeCode?: string | null
  selectedCount: number
  movementWantedCount?: number | null
  barCodes: string[] | null
  loading?: boolean
}>()

const correctedPlaceName = computed(() => getWarehousePlace(props.placeCode ?? 'N/A'))
const emit = defineEmits(['submit'])

const finalConfirmation = ref('')
const isValid = defineModel<boolean>({ required: true })

const barCodes = computed(() => props.barCodes ?? [])
const printedBarcodes = computed(() => {
  if (barCodes.value.length === 0) {
    return 'Položka nemá EAN'
  }
  return barCodes.value.join(', ')
})

function validateCode(val: string) {
  return barCodes.value.includes(val)
}

const showReset = computed(
  () => finalConfirmation.value.length >= 1 && !validateCode(finalConfirmation.value)
)

isValid.value = validateCode(finalConfirmation.value)

const $q = useQuasar()

watch(finalConfirmation, (val) => {
  if (validateCode(val)) {
    isValid.value = true
    emit('submit')
  } else {
    isValid.value = false
    $q.notify({
      type: 'negative',
      message: `Kód neodpovídá zvolené položce: ${printedBarcodes.value}`,
      timeout: 2000
    })
  }
})
</script>

<style lang="css" scoped></style>
