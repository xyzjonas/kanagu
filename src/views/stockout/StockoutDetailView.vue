<template>
  <main v-if="stockDocument && stockDocument.stockDocumentNumber">
    <q-btn-group
      spread
      unelevated
      class="border-solid border-slate-4 border-[1px] mb-5 mt-10 max-w-md mx-auto md:mx-0"
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

    <div class="flex flex-col gap-2 mt-5">
      <StockDocumentMovement
        v-for="movement in displayedMovements"
        :key="movement.id"
        :movement="movement"
        :item="stockDocumentItems.find((it) => it.lineNumber === movement.lineNumber)"
        :order-id="stockDocument.stockDocumentNumber"
        is-stock-oout
        @clickPrint="() => clickPrint(movement)"
      />
    </div>

    <q-dialog v-model="dialogToggle" position="bottom">
      <q-card style="width: 350px">
        <div class="p-4 flex flex-col">
          <div class="w-full flex justify-between items-center">
            <span class="text-2xl uppercase">Tisk štítků</span>
            <q-btn flat round icon="close" v-close-popup />
          </div>
          <span class="text-gray-7 mt-3">{{ movementToBePrinted?.stockProduct?.productId }}</span>
          <span class="text-lg">{{ movementToBePrinted?.stockProduct?.name }}</span>
          <q-form @submit="postPrint">
            <q-input
              v-model="printCount"
              label="Počet štítků k tisku"
              autofocus
              :rules="[
                rules.notEmpty,
                rules.isNumber,
                (val: number) => val <= 200 || 'Víc jak 200 je možná trochu moc, ne?'
              ]"
              input-class=""
            >
              <template #append>
                <span class="text-sm">ks</span>
              </template>
            </q-input>
            <q-btn
              type="submit"
              unelevated
              color="primary"
              class="w-full mt-5 h-[3rem]"
              label="Tisknout"
            ></q-btn>
          </q-form>
        </div>
      </q-card>
    </q-dialog>
  </main>
</template>

<script setup lang="ts">
import { type StockDocument, type StockMovementItemApiModel } from '@/client'
import StockDocumentMovement from '@/components/StockDocumentMovement.vue'
import { isItemResolved, isMovementResolved } from '@/utils'
import { useQuasar } from 'quasar'
import { rules } from '@/utils'
import { computed, inject, ref, type Ref } from 'vue'

const showResolved = ref(false)
const stockDocument = inject<Ref<StockDocument>>('stockoutDocument')
const movements = inject<Ref<StockMovementItemApiModel[]>>('movements', ref([]))

const stockDocumentItems = computed(() => stockDocument?.value?.stockDocumentItems ?? [])

// todo: inconsistent information, decide which one
const resolvedMovements = computed(() => {
  return movements.value.filter((mov) => {
    const item = stockDocumentItems.value.find((it) => it.lineNumber === mov.lineNumber)
    if (item) {
      return !isItemResolved(item)
    }

    return !isMovementResolved(mov)
  })
})

const displayedMovements = computed(() =>
  showResolved.value ? movements.value : resolvedMovements.value
)

const $q = useQuasar()
const dialogToggle = ref(false)
const printCount = ref(1)
const movementToBePrinted = ref<StockMovementItemApiModel>()
const clickPrint = (movement: StockMovementItemApiModel) => {
  ;(movementToBePrinted.value = movement), (dialogToggle.value = true)
}
const postPrint = () => {
  $q.notify({
    type: 'positive',
    message: `Odesláno na tisk - ${printCount.value}ks`
  })

  // todo: API call
  dialogToggle.value = false
  printCount.value = 1
  movementToBePrinted.value = undefined
}
</script>
<style lang="sass" scoped></style>
