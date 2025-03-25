<template>
  <q-select
    outlined
    label="Zákazník *"
    hint="Vyberte zákazníka podle jména."
    v-model="modelValue"
    :options="options"
    option-label="name"
    use-input
    clearable
    @filter="filterFn"
    @abort="abortFilterFn"
    :rules="[rules.notEmpty]"
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
import { rules } from '@/utils'
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
