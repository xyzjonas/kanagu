<template>
  <q-page padding class="flex flex-col">
    <div class="flex-1 flex flex-col">
      <div v-if="isMoveInProgress">
        <h2 class="text-2xl uppercase">
          Aktivní Přesun <span class="text-slate-4 mx-2">|</span>
          <span class="text-xl"> zbývá&nbsp;{{ remainingQuantity }}&nbsp;MJ</span>
        </h2>
        <div class="row gap-1">
          <QuiacksellItemCard
            :item="movedProduct"
            :quantity="movedQuantity"
            :place="movedFrom"
            readonly
            disable-print
            class="flex-1"
          />
          <q-btn @click="clearForm" flat icon="refresh" label="reset" class="card-shadow" stack />
        </div>
        <EmptyBox v-if="moveDestinations.length === 0">
          <div class="flex flex-col gap-2">
            <h2 class="uppercase font-400">Žádné přesuny</h2>
            <q-btn @click="seamless = true" icon="add" flat label="přidat" />
          </div>
        </EmptyBox>
        <div v-else>
          <q-separator class="my-5" />
          <div class="flex flex-col gap-2">
            <div v-for="(move, index) in moveDestinations" :key="index" class="row gap-1">
              <MoveCard
                :place-code="move.place.code"
                :quantity="move.quantity"
                :saved="move.sent"
                class="flex-1"
                @delete="removeMovement(move.place)"
              />
              <q-btn
                v-if="!move.sent"
                @click="submitMove(move)"
                flat
                icon="upload_file"
                label="uložit"
                class="card-shadow"
                stack
              />
            </div>
            <q-btn v-if="remainingQuantity > 0" @click="seamless = true" icon="add" flat label="přidat" class="mt-5" />
          </div>
        </div>
      </div>
      <AddItemDialogStepper
        v-else
        v-model:product="movedProduct"
        v-model:place="movedFrom"
        v-model:quantity="movedQuantity"
        v-model:is-confirmed="isPlaceConfirmed"
        title="Přesunout Položku"
        submit-label="Potvrdit"
        @submit="addItem"
        no-reset-on-submit
      />
    </div>
    <q-dialog v-model="seamless" position="bottom">
      <q-card class="w-lg">
        <SelectPlaceForMove
          title="Umístit položku"
          :stockProduct="movedProduct"
          :custom-max-count="remainingQuantity"
          @submit="addMovement"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { type StockProduct, type WarehousePlace } from '@/client'
import EmptyBox from '@/components/EmptyBox.vue'
import MoveCard from '@/components/move/MoveCard.vue'
import SelectPlaceForMove from '@/components/move/SelectPlaceForMove.vue'
import AddItemDialogStepper from '@/components/quicksell/AddItemDialogStepper.vue'
import QuiacksellItemCard from '@/components/quicksell/QuiacksellItem.Card.vue'
import type { WarehouseTransferLocal } from '@/types/helpers'
import { useLocalStorage } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'

const movedProduct = useLocalStorage<StockProduct>('move-item-product', {})
const movedFrom = useLocalStorage<WarehousePlace>('move-item-place', {})
const movedQuantity = useLocalStorage<number>('move-item-quantity', 0)
const isPlaceConfirmed = useLocalStorage<boolean>('move-confirmed', false)
const isMoveStarted = useLocalStorage<boolean>('move-started', false)

const moveDestinations = useLocalStorage<WarehouseTransferLocal[]>('move-destinations', [])
const remainingQuantity = computed(() =>
  moveDestinations.value.reduce((a, b) => a - b.quantity, movedQuantity.value)
)

const isMoveInProgress = computed(
  () => !!movedProduct.value && !!movedFrom.value && movedQuantity.value > 0 && isMoveStarted.value
)

const seamless = ref(false) // dialog control

const clearForm = () => {
  movedFrom.value = undefined
  movedProduct.value = undefined
  movedQuantity.value = 0
  isMoveStarted.value = false
  isPlaceConfirmed.value = false
  moveDestinations.value = []
}

function addItem() {
  isMoveStarted.value = true
}

function addMovement(place: WarehousePlace, quantity: number, sent: boolean) {
  moveDestinations.value.push({ place, quantity, sent })
  seamless.value = false
}

function removeMovement(place: WarehousePlace) {
  moveDestinations.value = moveDestinations.value.filter(dest => dest.place.code !== place.code)
}

const $q = useQuasar()
// const { postFastOrder, printStockout } = useApi()
// const router = useRouter()
async function submitMove(move: WarehouseTransferLocal) {
  console.info('POST HERE!!!')
  //   $q.loading.show({ delay: 100 })
  //   const success = await postFastOrder(order.value)
  //   $q.loading.hide()
  //   if (!success) {
  //     return
  //   }
  //   $q.notify({
  //     color: 'positive',
  //     message: 'Prodej uzavřen.'
  //   })
  //   step.value = 1
  //   clearForm()
  //   router.push({ name: 'home' })
  moveDestinations.value.forEach(dest => {
    if (dest.place.code === move.place.code && dest.quantity === move.quantity) {
      dest.sent = true
    }
  })
  $q.notify({
    type: 'positive',
    message: 'Pohyb uložen'
  })

}
</script>
<style lang="css"></style>
