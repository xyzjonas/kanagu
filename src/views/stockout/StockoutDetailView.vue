<template>
  <main v-if="stockDocument && stockDocument.stockDocumentNumber">
    <q-btn-group
      spread
      unelevated
      class="border-solid border-slate-4 border-[1px] my-5 max-w-md mx-auto md:mx-0"
    >
      <q-btn
        color="primary"
        :label="`neuzavřené \(${resolvedMovements.length}\)`"
        :flat="showResolved"
        @click="showResolved = false"
      />
      <q-btn
        color="primary"
        :label="`vše \(${movements.length}\)`"
        :flat="!showResolved"
        @click="showResolved = true"
      />
    </q-btn-group>

    <div class="flex flex-col gap-2 mt-5" v-if="displayedMovements.length > 0">
      <TransitionGroup name="fade-slide">
        <StockDocumentMovement
          v-for="movement in displayedMovements"
          :key="movement.id"
          :movement="movement"
          :item="stockDocumentItems.find((it) => it.lineNumber === movement.lineNumber)"
          :order-id="stockDocument.stockDocumentNumber"
          is-stock-oout
          @clickPrint="() => postPrint(movement, movement.value)"
          :waiting-for-print="waitingForPrint"
          :is-printed="!!db.find(item => item.stockId === `${movement.stockProductId}` && item.movementId === `${movement.id}`)"
        />
      </TransitionGroup>
    </div>
    <EmptyBox v-else>
      <div class="text-center min-h-xs sm:min-h-md flex flex-col items-center justify-center">
        <q-icon size="3rem" name="assignment_turned_in" class="text-gray-7" />
        <h2 class="text-gray-6 font-400">Žádné zbývající pohyby.</h2>
      </div>
    </EmptyBox>
  </main>
</template>

<script setup lang="ts">
import { type StockDocument, type StockMovementItemApiModel } from '@/client'
import EmptyBox from '@/components/EmptyBox.vue'
import StockDocumentMovement from '@/components/StockDocumentMovement.vue'
import { useAlreadyPrintedDb } from '@/composables/alreaduPrintedDb'
import { useApi } from '@/composables/useApi'
import { isItemResolved } from '@/utils'
import { useQuasar } from 'quasar'
import { computed, inject, ref, type Ref } from 'vue'

const stockDocument = inject<Ref<StockDocument>>('stockoutDocument')
const movements = inject<Ref<StockMovementItemApiModel[]>>('movements', ref([]))
const showResolved = ref(
  (stockDocument?.value.stockDocumentItems ?? []).filter((it) => !isItemResolved(it)).length === 0
)

const stockDocumentItems = computed(() => stockDocument?.value?.stockDocumentItems ?? [])

// todo: inconsistent information, decide which one
const resolvedMovements = computed(() => movements.value.filter((mov) => !mov.place))

function sortById(movements: StockMovementItemApiModel[]) {
  return movements.sort((a, b) => (a.lineNumber ?? 0) - (b.lineNumber ?? 0))
}

const displayedMovements = computed(() =>
  showResolved.value ? sortById(movements.value) : sortById(resolvedMovements.value)
)

const waitingForPrint = ref(false)
const $q = useQuasar()

const { db } = useAlreadyPrintedDb()
const { printStockout } = useApi()
const postPrint = async (movement: StockMovementItemApiModel, count?: number | null) => {
  waitingForPrint.value = true
  const printCount = 1
  await printStockout(movement.stockProductId ?? -1, count ?? 1)
  $q.notify({
    type: 'positive',
    message: `Odesláno na tisk - ${printCount} štítek`
  })
  if (movement.id && movement.stockProductId) {
    db.value.push({
      stockId: `${movement.stockProductId}`,
      movementId: `${movement.id}`,
    })
  }
  waitingForPrint.value = false
}
</script>
<style lang="sass" scoped></style>
