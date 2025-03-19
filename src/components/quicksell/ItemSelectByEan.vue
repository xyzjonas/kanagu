<template>
  <q-select
    outlined
    label="EAN"
    hint="Kód položky."
    v-model="modelValue"
    :options="options"
    option-label="code"
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
    <template v-slot:option>
      {{ option }}
    </template>
  </q-select>
</template>

<script setup lang="ts">
import type { Customer } from '@/client'
import { useApi } from '@/composables/useApi'
import { ref } from 'vue'

const MAX_LEN = 5

const { searchItems } = useApi()

const modelValue = defineModel<Customer>()

const options = ref<Customer[]>([])
async function filterFn(val: string, update: any, abort: () => void) {
  if (!val) {
    update()
    return
  }

  const items = await searchItems(val)
  if (items.length > MAX_LEN) {
    items.length = MAX_LEN
  }

  update(() => {
    options.value = items
  })
}

function abortFilterFn() {
  // console.log('delayed filter aborted')
}
</script>

<style lang="css" scoped></style>
