<template>
  <q-select
    outlined
    label="Vyhledat Zákazníka"
    v-model="modelValue"
    :options="options"
    option-label="name"
    use-input
    clearable
    @filter="filterFn"
    @abort="abortFilterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> Žádné Výsledky </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import type { Customer } from '@/client'
import { useApi } from '@/composables/useApi'
import { ref } from 'vue'

const MAX_LEN = 5

const { searchCustomers } = useApi()

const modelValue = defineModel<Customer>()

const options = ref<Customer[]>([])
async function filterFn(val: string, update: any, abort: () => void) {
  if (!val) {
    update()
    return
  }

  const customers = await searchCustomers(val)
  if (customers.length > MAX_LEN) {
    customers.length = MAX_LEN
  }

  update(() => {
    options.value = customers
  })
}

function abortFilterFn() {
  // console.log('delayed filter aborted')
}
</script>

<style lang="css" scoped></style>
