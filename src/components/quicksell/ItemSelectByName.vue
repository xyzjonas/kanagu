<template>
  <q-select
    outlined
    label="Položka"
    hint="Vyhledat položku podle názvu nebo EAN kódu."
    v-model="modelValue"
    :options="options"
    option-label="name"
    use-input
    clearable
    :multiple="false"
    @filter="filterFn"
    @abort="abortFilterFn"
    autofocus
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> Žádné Výsledky </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item :props="opt">
      <q-item class="p-0">
        <q-item-section>
          <span>{{ modelValue?.name }}</span>
          <br />
          <small>{{ modelValue?.code }}</small>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import type { StockProduct } from '@/client'
import { useApi } from '@/composables/useApi'
import { ref } from 'vue'

const MAX_LEN = 5

const { searchItems } = useApi()

const modelValue = defineModel<StockProduct>()

const options = ref<StockProduct[]>([])
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
