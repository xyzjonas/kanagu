<template>
  <div class="p-4 flex flex-col">
    <div class="w-full flex justify-between items-center mb-3">
      <span class="text-2xl uppercase">{{ title ?? 'Přidat položku' }}</span>
      <q-btn flat round icon="close" v-close-popup />
    </div>
    <q-form class="flex flex-col gap-2" @submit="addMovement()" ref="formRef">
      <PlaceScanByScanner v-model="newPlace" autofocus />
      <ConfirmWarehousePlace
        v-if="newPlace && newPlace.code !== undefined && !isConfirmed"
        :selectedPlaceCode="newPlace.code"
        v-model="isConfirmed"
      />
      <q-input
        v-model.number="newItemQuantity"
        outlined
        :label="countLabel"
        hint="Počet Kusů dle MJ"
        inputmode="numeric"
        :rules="[
          rules.atLeastOne,
          rules.max99,
          (val) =>
            parseFloat(val) <= customMaxCount ||
            `Neplatný počet (maximálně ${props.customMaxCount} MJ)`
        ]"
      />
      <q-btn
        type="submit"
        :disable="!isAllFilledout"
        unelevated
        color="primary"
        :label="submitLabel ?? 'odeslat pohyb'"
        class="h-[3rem] mt-3"
        @click="addMovement()"
      />
      <div class="row items-center justify-center gap-3 my-1">
        <q-separator class="flex-1" />
        <span class="text-gray-5">nebo</span>
        <q-separator class="flex-1" />
      </div>
      <q-btn
        type="submit"
        :disable="!isAllFilledout"
        unelevated
        color="grey"
        :label="submitLabel ?? 'uložit a odeslat později'"
        class="h-[3rem]"
        @click="addMovement(true)"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import type { StockProduct, WarehousePlace } from '@/client'
import { rules } from '@/utils'
import { QForm, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import ConfirmWarehousePlace from '../ConfirmWarehousePlace.vue'
import PlaceScanByScanner from '../quicksell/PlaceScanByScanner.vue'

const props = defineProps<{
  title?: string
  stockProduct: StockProduct
  submitLabel?: string
  noResetOnSubmit?: boolean
  customMaxCount: number
}>()

const $q = useQuasar()

const emit = defineEmits<{
  (e: 'submitLater', place: WarehousePlace, quantity: number): void
  (e: 'submit', place: WarehousePlace, quantity: number): void
}>()

const isConfirmed = ref(false)

const formRef = ref<QForm | null>(null)

// const newItem = defineModel<StockProduct>('product', { required: false })
const newPlace = defineModel<WarehousePlace>('place', { required: false })
const newItemQuantity = defineModel<number>('quantity', { required: false, default: 0 })

// Computed helpers
const countLabel = computed(() => {
  const unit = props.stockProduct?.product?.unitType?.code ?? 'jednotka chybí'
  return `Počet MJ [${unit}]`
})

watch(newPlace, (place) => {
  if (!place) {
    resetPlace()
  }
})

const isAllFilledout = computed<boolean>(
  () => newPlace.value !== undefined && isConfirmed.value && newItemQuantity.value > 0
)

// Action handlers
async function addMovement(justEmit?: boolean) {
  console.info('ADD')
  if (!newPlace.value) {
    console.error('no form or place')
    return
  }

  let isValid = true
  if (formRef.value) {
    isValid = await formRef.value.validate()
  }

  if (!isConfirmed.value) return notifyError('Je potřeba buňku potvrdit scannerem!')
  if (newItemQuantity.value <= 0) return notifyError('Počet MJ musí být větší než nula!')
  if (newItemQuantity.value > props.customMaxCount)
    return notifyError('Počet MJ nesmí být větší než maximální dostupné množství!')

  if (!isValid) return

  if (justEmit) {
    emit('submitLater', newPlace.value, newItemQuantity.value)
  } else {
    emit('submit', newPlace.value, newItemQuantity.value)
  }

  if (!props.noResetOnSubmit) {
    setTimeout(() => resetForm(), 1000)
  }
}

function resetPlace() {
  newPlace.value = undefined
  isConfirmed.value = false
}

function resetForm() {
  newItemQuantity.value = 0
  resetPlace()
}

function notifyError(message: string) {
  $q.notify({ type: 'negative', message })
}
</script>

<style lang="css" scoped></style>
