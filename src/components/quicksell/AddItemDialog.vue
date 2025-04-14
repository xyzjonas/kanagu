<template>
  <q-dialog v-model="modelValue" position="bottom">
    <q-card class="w-lg">
      <div class="p-4 flex flex-col">
        <div class="w-full flex justify-between items-center mb-3">
          <span class="text-2xl uppercase">Přidat položku</span>
          <q-btn flat round icon="close" v-close-popup />
        </div>
        <q-form class="flex flex-col gap-2" @submit="addItem">
          <transition name="slide-fade" mode="out-in">
            <div v-if="manualSearchItem">
              <ItemSelectByName v-model="newItem" :rules="[rules.notEmpty]" />
            </div>
            <div v-else class="flex gap-2">
              {{ manualSearchItemValue }}
              <q-input
                v-model="manualSearchItemValue"
                outlined
                :rules="[rules.notEmpty]"
                class="flex-1"
              />
              <q-btn icon="search" outline @click="manualSearchItem = true" />
            </div>
          </transition>
          <PlaceSelect v-model="newPlace" :rules="[rules.notEmpty]" />
          <q-input
            v-model.number="newItemQuantity"
            outlined
            :hint="
              newItem?.product?.unitType?.code ? `1MJ = ${newItem?.product?.unitType?.code}` : 'N/A'
            "
            label="Počet Kusů (dle MJ)"
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
import { ref, watch } from 'vue'
import PlaceSelect from './PlaceSelect.vue'
import ItemSelectByName from './ItemSelectByName.vue'
import { useApi } from '@/composables/useApi'

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
</script>
<style lang="css" scoped></style>
