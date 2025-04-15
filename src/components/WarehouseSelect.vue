<template>
  <q-select
    outlined
    label="Vyberte Sklad"
    v-model="warehouseIdentifier"
    :options="options"
    emit-value
  >
    <template v-slot:selected-item :props="opt">
      <q-item class="p-0">
        <q-item-section>
          <span class="uppercase">
            {{ warehouses[warehouseIdentifier] }}
          </span>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useWarehouse } from '@/composables/warehouse'
import { computed } from 'vue'

const { getWarehousePlace, warehouseIdentifier, warehouses } = useWarehouse()

const options = computed(() => {
  return Object.entries(warehouses).map((kv, _) => {
    const [key, value] = kv
    return {
      label: value.toUpperCase(),
      value: key
    }
  })
})
</script>

<style lang="css" scoped></style>
