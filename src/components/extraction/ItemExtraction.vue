<template>
  <div class="flex-1 flex flex-col">
    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      class="shadow-none bg-transparent"
      contracted
      header-nav
    >
      <q-step
        :name="1"
        active-icon="place"
        icon="place"
        done-icon="place"
        title=""
        :done="step > 1"
      >
        <ItemExtractionStepFirst
          v-model="selectedSlot"
          :name="movement.stockProduct?.name"
          :code="movement.stockProduct?.code"
          :stock-items="stockItems"
          :count="movement.value"
          @next="step += 1"
        />
      </q-step>

      <q-step
        :name="2"
        title=""
        active-icon="qr_code"
        icon="qr_code"
        done-icon="qr_code"
        :done="step > 2 && isPlaceConfirmed"
        :error="step > 2 && !isPlaceConfirmed"
        :disable="stockItems.length === 0"
      >
        <ItemExtractionStepSecond
          v-model="isPlaceConfirmed"
          :selected-slot="selectedSlot"
          :wanted-count="movement.value"
          @next="step += 1"
        />
      </q-step>

      <q-step
        :name="3"
        title=""
        active-icon="123"
        icon="123"
        done-icon="123"
        :done="step > 2 && isCountValid"
        :error="step > 2 && !isCountValid"
        :disable="stockItems.length === 0"
      >
        <ItemExtractionStepThird
          v-model="selectedSlot.value"
          v-model:is-valid="isCountValid"
          :stock-items="stockItems"
          :place-code="selectedSlot.place"
          :product-code="movement.stockProduct?.code"
          :product-name="movement.stockProduct?.name"
          :movement-wanted-count="movement.value"
          :unit-type="movement.stockProduct?.product?.unitType?.code"
        />
      </q-step>

      <q-step
        :name="4"
        title=""
        active-icon="download_done"
        icon="download_done"
        done-icon="download_done"
        :disable="stockItems.length === 0"
        :error="step > 3 && !isItemValid"
      >
        <ItemExtractionStepFourth
          v-model="isItemValid"
          :bar-codes="movement.stockProduct?.stockBarCodes?.map((code) => code.barCode) ?? []"
          :product-code="movement.stockProduct?.code"
          :product-name="movement.stockProduct?.name"
          :movement-wanted-count="movement.value"
          :place-code="selectedSlot.place"
          :selected-count="selectedSlot.value"
          @submit="submitAllocation"
        />
      </q-step>
    </q-stepper>
  </div>
  <transition name="slide-fade" mode="out-in">
    <div v-if="step === 2 || step === 3" class="flex h-[3rem] gap-2 mt-auto">
      <q-btn unelevated color="primary" label="zpět" class="flex-1" @click="step -= 1" />
      <q-btn
        color="primary"
        outline
        icon-right="arrow_forward"
        label="dále"
        @click="step += 1"
        class="flex-1"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { StockDocumentItem, StockMovementItemApiModel } from '@/client'
import { useApi, type PostStockMovement } from '@/composables/useApi'
import { QStepper, useQuasar } from 'quasar'
import { ref, watch } from 'vue'
import ItemExtractionStepFirst from './ItemExtractionStepFirst.vue'
import ItemExtractionStepFourth from './ItemExtractionStepFourth.vue'
import ItemExtractionStepSecond from './ItemExtractionStepSecond.vue'
import ItemExtractionStepThird from './ItemExtractionStepThird.vue'

const props = defineProps<{
  stockDocumentId: string
  item: StockDocumentItem
  movement: StockMovementItemApiModel
}>()

const stockItems = ref(props.movement.stockItems ?? [])

const step = ref(1)
const stepper = ref<QStepper>()

const isPlaceConfirmed = ref(false)
const isCountValid = ref(true)
const isItemValid = ref(false)

const selectedSlot = ref<PostStockMovement>({
  id: props.movement.id ?? 0,
  lineNumber: props.movement.lineNumber ?? 1,
  stockProductId: props.movement.stockProductId ?? 1,
  place: (props.movement.stockItems ?? [])[0]?.warehousePlaceCode ?? undefined,
  value: props.movement.value ?? 0
})

const { postStockMovement } = useApi()
const $q = useQuasar()
const emit = defineEmits<{
  (e: 'extracted', movement: PostStockMovement): void
}>()
async function submitAllocation() {
  if (!isPlaceConfirmed.value) {
    $q.notify({
      type: 'negative',
      message: 'Je potřeba buňku potvrdit scannerem!',
      timeout: 1000
    })
    finalConfirmation.value = ''
    step.value = 2
    return
  }

  if (!isCountValid.value || selectedSlot.value.value <= 0) {
    $q.notify({
      type: 'negative',
      message: 'Neplatný zvolený počet!',
      timeout: 1000
    })
    finalConfirmation.value = ''
    step.value = 3
    return
  }

  if (!isItemValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Je potřeba položku potvrdit scannerem!',
      timeout: 1000
    })
    finalConfirmation.value = ''
    step.value = 4
    return
  }

  // todo: "vydej" amount corrected to reflect cell's max current amount?
  // todo: api call: negative value if items taken away?
  const payload: PostStockMovement = JSON.parse(JSON.stringify(selectedSlot.value))
  payload.value = 1 * payload.value
  const wasPosted = await postStockMovement(props.stockDocumentId, [payload])
  if (!wasPosted) {
    return
  }

  $q.notify({
    color: 'positive',
    message: `${selectedSlot.value.value} MJ vyskladněno z ${selectedSlot.value.place}`
  })

  setTimeout(() => emit('extracted', selectedSlot.value), 300)
}

const finalConfirmation = ref('')
watch(finalConfirmation, async () => {
  if (finalConfirmation.value === selectedSlot.value.place) {
    await submitAllocation()
  }
})
</script>
