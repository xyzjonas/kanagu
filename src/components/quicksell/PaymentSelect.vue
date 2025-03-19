<template>
  <q-select
    outlined
    label="Typ Platby"
    v-model="modelValue"
    :options="options"
    :option-label="(val) => getLabel(val)"
    clearable
    @filter="filterFn"
    @abort="abortFilterFn"
  />
</template>

<script setup lang="ts">
import type { PaymentType } from '@/client'
import { useApi } from '@/composables/useApi'
import { ref } from 'vue'

const { getPayments } = useApi()

const modelValue = defineModel<PaymentType>()

const labelMap: Record<string, string> = {
  locCash: 'Hotovost',
  locCard: 'Kartou',
  locTransfer: 'Převodem',
  locCashOnDelivery: 'Při převzetí'
}

const getLabel = (value: PaymentType) => labelMap[value.name ?? ''] ?? value.name

const options = ref<PaymentType[]>([])
async function filterFn(val: string, update: any, abort: () => void) {
  if (options.value.length > 0) {
    update()
    return
  }

  const payments = await getPayments()
  update(() => {
    options.value = payments
  })
}

function abortFilterFn() {
  // console.log('delayed filter aborted')
}
</script>

<style lang="css" scoped></style>
