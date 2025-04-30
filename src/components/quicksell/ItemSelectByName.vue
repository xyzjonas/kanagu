<template>
  <q-select
    ref="itemSelect"
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
    @update:model-value="onSelectChange"
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
import type { QSelect } from 'quasar'
import { nextTick, ref } from 'vue'

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

const itemSelect = ref<QSelect | null>(null)
function onSelectChange() {
  // Blur the select after selection
  nextTick(() => {
    // Defensive: make sure the ref exists
    if (itemSelect.value?.blur) {
      itemSelect.value.blur()
    }
  })
}
</script>

<style lang="css" scoped></style>
