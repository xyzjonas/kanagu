<template>
  <q-dialog v-model="modelValue" position="bottom">
    <q-card class="w-lg">
      <div class="p-4 flex flex-col">
        <div class="w-full flex justify-between items-center mb-3">
          <span class="text-2xl uppercase">Přidat položku</span>
          <q-btn flat round icon="close" v-close-popup />
        </div>
        <q-btn-group spread unelevated class="border-solid border-slate-2 border-[1px] mb-3">
          <q-btn
            color="primary"
            icon="qr_code_scanner"
            :flat="manualSearchItem"
            @click="manualSearchItem = false"
          />
          <q-btn
            color="primary"
            icon="manage_search"
            :flat="!manualSearchItem"
            @click="manualSearchItem = true"
          />
        </q-btn-group>
        <q-form class="flex flex-col gap-2" @submit="addItem">
          <transition name="slide-fade" mode="out-in">
            <ItemSelectByName
              v-if="manualSearchItem"
              v-model="newItem"
              :rules="[rules.notEmpty]"
              class="flex-1"
            />
            <ItemScanByScanner v-else v-model="newItem" class="flex-1" />
          </transition>
          <transition name="slide-fade" mode="out-in">
            <PlaceSelect v-if="manualSearchItem" v-model="newPlace" :rules="[rules.notEmpty]" />
            <PlaceScanByScanner v-else v-model="newPlace" />
          </transition>
          <q-input
            v-model.number="newItemQuantity"
            outlined
            :label="countLabel"
            hint="Počet Kusů (dle MJ)"
            inputmode="numeric"
            :rules="[rules.atLeastOne]"
          />
          <q-btn type="submit" unelevated color="primary" label="přidat" class="h-[3rem] mt-3" />
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { StockProduct, WarehousePlace } from '@/client'
import { rules } from '@/utils'
import { computed, ref, watch } from 'vue'
import PlaceSelect from './PlaceSelect.vue'
import ItemSelectByName from './ItemSelectByName.vue'
import { useApi } from '@/composables/useApi'
import ItemScanByScanner from './ItemScanByScanner.vue'
import PlaceScanByScanner from './PlaceScanByScanner.vue'

const modelValue = defineModel({ default: false })
const newItem = ref<StockProduct>()
const newPlace = ref<WarehousePlace>()
const newItemQuantity = ref(0)

const { searchItems } = useApi()
const fetching = ref(false)
const manualSearchItem = ref(false)
const manualSearchItemValue = ref('')
watch(manualSearchItemValue, async (value: string) => {
  if (value) {
    try {
      fetching.value = true
      const matches = await searchItems(value)
      if (matches.length > 0) {
        newItem.value = matches[0]
      }
    } finally {
      fetching.value = false
    }
  }
})

const emit = defineEmits<{
  (e: 'submit', item: StockProduct, place: WarehousePlace, quantity: number): void
}>()

function addItem() {
  if (!newItem.value || !newPlace.value) {
    return
  }

  emit('submit', newItem.value, newPlace.value, newItemQuantity.value)
  setTimeout(() => {
    newItem.value = undefined
    newPlace.value = undefined
    newItemQuantity.value = 0
    manualSearchItemValue.value = ''
    manualSearchItem.value = false
  }, 500)
}

const countLabel = computed(() => {
  let unitCode = newItem.value?.product?.unitType?.code
  if (!unitCode) {
    unitCode = 'jednotka chybí'
  }
  return `Počet MJ [${unitCode}]`
})
</script>
<style lang="css" scoped></style>
