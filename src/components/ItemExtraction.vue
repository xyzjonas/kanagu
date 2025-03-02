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
        <div class="flex flex-col">
          <div
            class="font-400 uppercase mb-2 text-lg border-solid border-1 border-rounded-lg border-slate-4 w-fit py-1 px-3"
          >
            Výdej <span class="text-green font-bold">{{ movement.value }}&hairsp;MJ</span>
          </div>
          <span class="text-gray-7 mt-2">{{ movement.stockProduct?.code ?? 'N/A' }}</span>
          <span class="text-lg">{{ movement.stockProduct?.name ?? 'N/A' }}</span>
          <span class="text-xs text-gray-7">MJ = 100ks</span>
          <q-separator class="my-5" />
          <q-list class="border-rounded-md" v-if="stockItems.length > 0">
            <q-item
              clickable
              v-ripple
              v-for="(item, index) in stockItems"
              :key="index"
              @click="select(item.warehousePlaceCode)"
              :active="selectedSlot.place === item.warehousePlaceCode"
              class="border-rounded-md my-1"
              active-class="text-white bg-green-4 font-bold"
            >
              <q-item-section>
                <div class="flex justify-between">
                  <div>
                    <span class="mr-3">BUŇKA</span>
                    <span class="font-bold">{{ item.warehousePlaceCode }}</span>
                  </div>
                  <span>{{ item.value }}MJ</span>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <div
            v-else
            class="my-5 py-10 flex items-start justify-center border-dashed border-gray-4 border-1 border-rounded vo"
          >
            <div class="flex flex-col gap-2">
              <h2 class="uppercase font-400">Není skladem</h2>
            </div>
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title=""
        active-icon="qr_code"
        icon="qr_code"
        done-icon="qr_code"
        :done="step > 2 && isConfirmed"
        :error="step > 2 && !isConfirmed"
        :disable="stockItems.length === 0"
      >
        <div
          class="font-400 uppercase mb-2 text-lg border-solid border-1 border-rounded-lg border-slate-4 w-fit py-1 px-3"
        >
          Výdej <span class="text-green font-bold">{{ movement.value }}&hairsp;MJ</span>
        </div>
        <div class="flex flex-col justify-center items-center mt-10">
          <span>VYBRÁNO</span>
          <span class="text-2xl"
            ><span class="text-gray-5">BUŇKA</span> {{ selectedSlot?.place }}</span
          >
          <q-input
            v-model="confirmation"
            autofocus
            :rules="[(val) => val === selectedSlot?.place]"
            no-error-icon
            input-class="text-center"
            inputmode="none"
          />
          <span>POTVRDIT BUŇKU SCANNEREM</span>
          <div class="h-[3rem]">
            <transition mode="out-in" name="slide-fade">
              <q-btn
                v-if="confirmation.length >= 1 && confirmation !== selectedSlot?.place"
                label="reset"
                @click="confirmation = ''"
                flat
                class="mt-5"
              />
            </transition>
          </div>
        </div>
      </q-step>

      <q-step
        :name="3"
        title=""
        active-icon="done"
        icon="done"
        done-icon="done"
        :disable="stockItems.length === 0"
      >
        <div
          class="font-400 uppercase mb-2 text-lg border-solid border-1 border-rounded-lg border-slate-4 w-fit py-1 px-3"
        >
          Výdej <span class="text-green font-bold">{{ movement.value }}&hairsp;MJ</span>
        </div>
        <div class="flex flex-col justify-center items-center mt-10 text-center">
          <span class="text-gray-7 mt-2">{{ movement.stockProduct?.code ?? 'N/A' }}</span>
          <span class="text-2xl font-bold">{{ movement.stockProduct?.name ?? 'N/A' }}</span>
          <span class="text-gray-5 mt-5">z buňky</span>
          <span class="text-xl">{{ selectedSlot?.place }}</span>
          <q-input
            v-model="finalConfirmation"
            autofocus
            :rules="[(val) => val === selectedSlot?.place]"
            no-error-icon
            input-class="text-center"
            inputmode="none"
          />
          <span class="text-center"
            >POTVRDIT BUŇKU SCANNEREM <br />
            PRO ODESLÁNÍ</span
          >
          <div class="h-[3rem]">
            <transition mode="out-in" name="slide-fade">
              <q-btn
                v-if="finalConfirmation.length >= 1 && finalConfirmation !== selectedSlot?.place"
                label="reset"
                @click="finalConfirmation = ''"
                flat
                class="mt-5"
              />
            </transition>
          </div>
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup lang="ts">
import type { StockDocumentItem, StockMovementItemApiModel } from '@/client'
import { useApi, type PostStockMovement } from '@/composables/useApi'
import { rules } from '@/utils'
import { QStepper, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  stockDocumentId: string
  item: StockDocumentItem
  movement: StockMovementItemApiModel
}>()

const stockItems = ref(props.movement.stockItems ?? [])

const step = ref(1)
const stepper = ref<QStepper>()

function select(slot?: string | null) {
  if (!slot) {
    return
  }
  selectedSlot.value.place = slot
  setTimeout(() => (step.value = 2), 300)
}

const confirmation = ref('')
watch(confirmation, () => {
  if (confirmation.value === selectedSlot.value.place) {
    setTimeout(() => (step.value += 1), 500)
  }
})

const isConfirmed = computed(() => confirmation.value === selectedSlot.value.place)

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
  if (!isConfirmed.value) {
    $q.notify({
      type: 'negative',
      message: 'Je potřeba buňku potvrdit scannerem!',
      timeout: 1000
    })
    finalConfirmation.value = ''
    step.value = 2
    return
  }

  // todo: "vydej" amount corrected to reflect cell's max current amount?
  // todo: api call: negative value if items taken away?
  // const wasPosted = await postStockMovement(props.stockDocumentId, [selectedSlot.value])
  // if (!wasPosted) {
  //   return
  // }

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
