<template>
  <div>
    <q-input
      v-model="scanInput"
      :label="modelValue ? (modelValue?.name ?? 'N/A') : 'Kód Položky'"
      hint="Naskenujte kód položky."
      outlined
      inputmode="none"
      :error="!!errorMessage"
      :error-message="errorMessage"
    />
  </div>
</template>

<script setup lang="ts">
import type { StockProduct } from '@/client'
import { useApi } from '@/composables/useApi'
import { rules } from '@/utils'
import { onMounted, ref, watch } from 'vue'

const { searchItems } = useApi()

const modelValue = defineModel<StockProduct | undefined>({ default: undefined })

const errorMessage = ref('')
const scanInput = ref('')
watch(scanInput, async (value: string) => {
  const result = await searchItems(value)
  if (result.length <= 0) {
    errorMessage.value = 'Kód položky nenalezen.'
    modelValue.value = undefined
  } else {
    errorMessage.value = ''
    modelValue.value = result[0]
  }
})

watch(modelValue, () => {
  if (scanInput.value !== modelValue.value?.code) {
    scanInput.value = modelValue.value?.code ?? ''
  }
})

onMounted(() => {
  if (scanInput.value !== modelValue.value?.name) {
    scanInput.value = modelValue.value?.code ?? ''
  }
})
</script>

<style lang="css" scoped></style>
