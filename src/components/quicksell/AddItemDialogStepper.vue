<template>
  <div class="p-4 flex flex-col">
    <div class="w-full flex justify-between items-center mb-3">
      <span class="text-2xl uppercase">{{ title ?? 'Přidat položku' }}</span>
      <q-btn v-if="!hideClose" flat round icon="close" v-close-popup />
    </div>
    <q-form class="flex flex-col gap-2" @submit="addItem" ref="formRef">
      <ItemScanByScanner v-model="newItem" class="flex-1" />
      <q-expansion-item v-model="isExpanded" header-class="hidden">
        <q-card class="bg-transparent">
          <q-card-section>
            <q-inner-loading :showing="isExpanded && isLoading">
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
            <div v-if="selectedStockItem" class="flex flex-col items-center justify-center">
              <q-btn flat dense icon="swap_vert" label="vybrat jinou buňku" @click="resetPlace" />
              <ConfirmWarehousePlace
                v-model="isPlaceConfirmed"
                :selected-place="selectedStockItem.warehousePlace?.code"
              />
            </div>
            <q-list v-else>
              <q-item
                clickable
                v-ripple
                v-for="(item, index) in availableStockItems"
                :key="index"
                :active="newItem === item.warehousePlace?.code"
                class="border-rounded-md my-1"
                active-class="text-white bg-primary font-bold"
                @click="selectedStockItem = item"
              >
                <q-item-section>
                  <div class="flex justify-between">
                    <div>
                      <span class="mr-3">BUŇKA</span>
                      <span class="font-bold">{{ item.warehousePlace?.name }}</span>
                    </div>
                    <span>{{ item.value }}MJ</span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <PlaceScanByScanner v-if="selectedStockItem && newPlace && isPlaceConfirmed" v-model="newPlace" />

      <q-input
        v-model.number="newItemQuantity"
        outlined
        :label="countLabel"
        :hint="`Počet Kusů dle MJ ${maxLabel}`"
        inputmode="numeric"
        :rules="[
          rules.atLeastOne,
          (val) => parseFloat(val) <= maxCount || `Neplatný počet${maxLabel}`
        ]"
      />
      <q-btn
        type="submit"
        :disable="!isAllFilledout"
        unelevated
        color="primary"
        :label="submitLabel ?? 'přidat'"
        class="h-[3rem] mt-3"
        @click="addItem"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import type { StockItem, StockProduct, WarehousePlace } from '@/client'
import { useApi } from '@/composables/useApi'
import { rules } from '@/utils'
import { QForm, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

import ConfirmWarehousePlace from '../ConfirmWarehousePlace.vue'
import ItemScanByScanner from './ItemScanByScanner.vue'
import PlaceScanByScanner from './PlaceScanByScanner.vue'

const props = defineProps<{ title?: string; submitLabel?: string; noResetOnSubmit?: boolean; hideClose?: boolean }>()

const $q = useQuasar()
const { getProduct } = useApi()
const emit = defineEmits<{
  (e: 'submit', item: StockProduct, place: WarehousePlace, quantity: number): void
}>()

// Form and UI state
const formRef = ref<QForm | null>(null)
const isExpanded = ref(false)
const isLoading = ref(false)

// Main form values
// const modelValue = defineModel<MoveItem>()

const newItem = defineModel<StockProduct>("product", { required: false } )
const newPlace = defineModel<WarehousePlace>("place", { required: false } )
const newItemQuantity = defineModel<number>("quantity", { required: false, default: 0 } )
const isPlaceConfirmed = defineModel<boolean>("isConfirmed", { required: false, default: false })

// const newItem = ref<StockProduct>()
// const newPlace = ref<WarehousePlace>()
// const newItemQuantity = ref(0)

// watch([newItem, newPlace, newItemQuantity], () => {
//   if (newItem.value && newPlace.value) {
//     modelValue.value = {
//       item: newItem.value,
//       place: newPlace.value,
//       quantity: newItemQuantity.value
//     }
//   } else {
//     modelValue.value = undefined
//   }
// })

// Selection state
const availableStockItems = ref<StockItem[]>([])
const selectedStockItem = ref<StockItem>()
const selectedPlaceCode = ref('')

// Constants
const MAX = 99999

// Computed helpers
const countLabel = computed(() => {
  const unit = newItem.value?.product?.unitType?.code ?? 'jednotka chybí'
  return `Počet MJ [${unit}]`
})

const maxCount = computed(() => selectedStockItem.value?.value ?? MAX)

const maxLabel = computed(() => (maxCount.value === MAX ? '' : ` (maximálně ${maxCount.value} MJ)`))

// Watchers
watch(newItem, async (item) => {
  if (!item?.id) {
    resetItem()
    return
  }

  isExpanded.value = true
  isLoading.value = true

  const product = await getProduct(item.id)
  isLoading.value = false

  if (!product) {
    notifyError('Položka nenalezena')
    return
  }

  availableStockItems.value = (product.stockItems ?? []).filter(
    (item) =>
      !item?.warehousePlace?.name?.startsWith('P') && !item?.warehousePlace?.name?.startsWith('V')
  )
})

watch(isPlaceConfirmed, (confirmed) => {
  if (confirmed && selectedStockItem.value?.warehousePlace) {
    newPlace.value = selectedStockItem.value.warehousePlace
    isExpanded.value = false
  } else {
    resetPlace()
  }
})

if (newPlace.value) {
  // selectedStockItem.value = newPlace
}

watch(newPlace, (place) => {
  if (!place) {
    resetPlace()
    isExpanded.value = true
  }
})

const isAllFilledout = computed(
  () => newItem.value && newPlace.value && isPlaceConfirmed.value && newItemQuantity.value > 0
)

// Action handlers
async function addItem() {
  if (!newItem.value || !newPlace.value) {
    console.error('no form or item ir place')
    console.error(`itemc code: ${newItem.value?.code}, place code: ${newPlace.value?.code}`)
    return
  }

  let isValid = true
  if (formRef.value) {
    isValid = await formRef.value.validate()
  }

  if (!isPlaceConfirmed.value) return notifyError('Je potřeba buňku potvrdit scannerem!')
  if (newItemQuantity.value <= 0) return notifyError('Počet MJ musí být větší než nula!')
  if (newItemQuantity.value > maxCount.value)
    return notifyError('Počet MJ nesmí být větší než maximální dostupné množství!')

  if (!isValid) return

  emit('submit', newItem.value, newPlace.value, newItemQuantity.value)
  if (!props.noResetOnSubmit) {
    resetForm()
  }
}

// Utility functions
function resetItem() {
  isExpanded.value = false
  availableStockItems.value = []
}

function resetPlace() {
  newPlace.value = undefined
  isPlaceConfirmed.value = false
  selectedStockItem.value = undefined
  selectedPlaceCode.value = ''
}

function resetForm() {
  newItem.value = undefined
  newItemQuantity.value = 0
  resetPlace()
  isExpanded.value = false
}

function notifyError(message: string) {
  $q.notify({ type: 'negative', message })
}
</script>

<style lang="css" scoped></style>
