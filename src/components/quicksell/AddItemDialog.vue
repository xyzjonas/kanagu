<template>
  <q-dialog v-model="modelValue" position="bottom">
    <q-card class="w-lg">
      <div class="p-4 flex flex-col">
        <div class="w-full flex justify-between items-center mb-3">
          <span class="text-2xl uppercase">Přidat položku</span>
          <q-btn flat round icon="close" v-close-popup />
        </div>
        <q-form class="flex flex-col gap-2" @submit="addItem">
          <ItemSelectByName v-model="newItem" :rules="[rules.notEmpty]" />
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
import { ref } from 'vue'
import PlaceSelect from './PlaceSelect.vue'
import ItemSelectByName from './ItemSelectByName.vue'

const modelValue = defineModel({ default: false })
const newItem = ref<StockProduct>()
const newPlace = ref<WarehousePlace>()
const newItemQuantity = ref(0)

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
  }, 500)
}
</script>
<style lang="css" scoped></style>
