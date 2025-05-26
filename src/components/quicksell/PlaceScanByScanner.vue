<template>
  <q-input
    v-model="scanInput"
    label="Kód Místa"
    hint="Naskenujte kód skladového místa."
    outlined
    inputmode="none"
    :debounce="100"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :rules="[rules.notEmpty]"
    clearable
  />
</template>

<script setup lang="ts">
import type { WarehousePlace } from '@/client'
import { useApi } from '@/composables/useApi'
import { useWarehouse } from '@/composables/warehouse'
import { rules } from '@/utils'
import { ref, watch } from 'vue'

const { stripWarehousePlace, areEqual } = useWarehouse()
const { searchWarehousePlaces } = useApi()

const modelValue = defineModel<WarehousePlace>()

const errorMessage = ref('')
const scanInput = ref('')
watch(scanInput, async (value: string) => {
  if (!value) {
    errorMessage.value = 'Naskenujte kód skladového místa!'
    modelValue.value = undefined
    return
  }

  if (areEqual(scanInput.value, modelValue.value?.code ?? 'N/A')) {
    return
  }

  const cleanedInput = stripWarehousePlace(value)
  const result = await searchWarehousePlaces(cleanedInput)
  if (result.length <= 0) {
    errorMessage.value = 'Kód skladového místa nenalezen.'
    modelValue.value = undefined
  } else {
    errorMessage.value = ''
    modelValue.value = result[0]
  }
})

watch(modelValue, () => {
  if (!areEqual(scanInput.value, modelValue.value?.name ?? 'N/A')) {
    scanInput.value = modelValue.value?.name ?? ''
  }
})

if (modelValue.value?.code) {
  scanInput.value = modelValue.value.code
} else {
  scanInput.value = ''
}
</script>

<style lang="css" scoped></style>
