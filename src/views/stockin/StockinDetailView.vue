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
      <StockDocumentMovement
        v-for="movement in displayedMovements"
        :key="movement.id"
        :movement="movement"
        :order-id="stockDocument.stockDocumentNumber"
        @clickPrint="() => clickPrint(movement)"
      />
    </div>
    <EmptyBox v-else>
      <div class="text-center min-h-xs sm:min-h-md flex flex-col items-center justify-center">
        <q-icon size="3rem" name="assignment_turned_in" class="text-gray-7" />
        <h2 class="text-gray-6 font-400">Žádné zbývající pohyby.</h2>
      </div>
    </EmptyBox>

    <PrintDialog
      @print="postPrint"
      v-model="dialogToggle"
      :product-code="movementToBePrinted?.stockProduct?.code"
      :product-name="movementToBePrinted?.stockProduct?.name"
      :loading="waitingForPrint"
    />
  </main>
</template>

<script setup lang="ts">
import { type StockDocument, type StockMovementItemApiModel } from '@/client'
import PrintDialog from '@/components/dialogs/PrintDialog.vue'
import EmptyBox from '@/components/EmptyBox.vue'
import StockDocumentMovement from '@/components/StockDocumentMovement.vue'
import { useApi } from '@/composables/useApi'
import { isItemResolved, isMovementResolved } from '@/utils'
import { useQuasar } from 'quasar'
import { computed, inject, ref, type Ref } from 'vue'

const stockDocument = inject<Ref<StockDocument>>('stockinDocument')
const movements = inject<Ref<StockMovementItemApiModel[]>>('movements', ref([]))
const showResolved = ref(movements.value.filter((mov) => !mov.place).length === 0)

// todo: inconsistent information, decide which one
const resolvedMovements = computed(() => {
  return movements.value.filter((mov) => !mov.place)
})

function sortById(movements: StockMovementItemApiModel[]) {
  return movements.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
}

const displayedMovements = computed(() =>
  showResolved.value ? sortById(movements.value) : sortById(resolvedMovements.value)
)

const waitingForPrint = ref(false)
const { printStockin } = useApi()
const $q = useQuasar()
const dialogToggle = ref(false)
const movementToBePrinted = ref<StockMovementItemApiModel>()
const clickPrint = (movement: StockMovementItemApiModel) => {
  ;(movementToBePrinted.value = movement), (dialogToggle.value = true)
}
const postPrint = async (count: number) => {
  waitingForPrint.value = true
  await printStockin(movementToBePrinted.value?.stockProductId ?? -1, count)
  $q.notify({
    type: 'positive',
    message: `Odesláno na tisk - ${count}ks`
  })

  waitingForPrint.value = false
  dialogToggle.value = false
  movementToBePrinted.value = undefined
}
</script>
<style lang="sass" scoped></style>
