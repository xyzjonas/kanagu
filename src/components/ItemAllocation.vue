<template>
  <div class="flex-1 flex flex-col">
    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      class="shadow-none bg-transparent flex flex-col"
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
          <span class="text-gray-7 mt-2">{{ movement.stockProduct?.code ?? 'N/A' }}</span>
          <span class="text-lg">{{ movement.stockProduct?.name ?? 'N/A' }}</span>
          <span class="text-xs text-gray-7"
            >MJ = {{ movement.stockProduct?.product?.unitType?.code ?? 'N/A' }}</span
          >

          <q-list class="border-rounded-md mt-5">
            <q-item
              clickable
              v-ripple
              v-for="(item, index) in displayedWarehousePlaces"
              :key="index"
              @click="select(item.warehousePlaceCode)"
              :active="selectedSlot.place === item.warehousePlaceCode"
              class="border-rounded-md my-1"
              active-class="text-white bg-primary font-bold"
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
      >
        <div class="flex flex-col justify-center items-center min-h-xs">
          <span>VYBRÁNO</span>
          <span class="text-2xl"
            ><span class="text-gray-5">BUŇKA</span>
            {{ getWarehousePlace(selectedSlot?.place ?? '') }}</span
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
          <div class="h-[0rem]">
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

      <q-step :name="3" title="" icon="plus_one" style="min-height: 200px">
        <div class="flex flex-col min-h-xs">
          <span class="uppercase text-lg text-primary font-600">Naskladnit</span>
          <span class="text-gray-7 mt-2">{{ movement.stockProduct?.code ?? 'N/A' }}</span>
          <span class="text-lg">{{ movement.stockProduct?.name ?? 'N/A' }}</span>

          <span class="mt-6">Zadat počet MJ k naskladnění</span>
          <span class="text-2xl mb-6">
            <span class="text-gray-5">BUŇKA</span> {{ adjustedWarehousePlace }}
          </span>
          <q-form @submit="submitAllocation">
            <q-input
              v-model="selectedSlot.value"
              :label="`Počet MJ [${movement.stockProduct?.product?.unitType?.code ?? 'jednotka chybí'}]`"
              hint="Počet množstevních jednotek k naskladnění."
              autofocus
              no-error-icon
              input-class="text-center text-2xl"
              :rules="[rules.notEmpty, rules.atLeastOne]"
              inputmode="numeric"
            />
            <div class="flex justify-end mt-auto py-5 gap-1"></div>
          </q-form>
        </div>
      </q-step>
    </q-stepper>

    <q-dialog v-model="seamless" position="bottom">
      <q-card class="w-lg">
        <div class="p-4 flex flex-col">
          <div class="w-full flex justify-between items-center">
            <span class="text-2xl uppercase">Přidat buňku</span>
            <q-btn flat round icon="close" v-close-popup />
          </div>
          <span class="text-gray-7 mt-3">{{ documentItem.stockProductId }}</span>
          <span class="text-lg">{{ documentItem.name }}</span>
          <q-form @submit="addNewSlot">
            <q-input
              v-model="newSlot"
              hint="Naskenovat nebo zadat buňku."
              label="Kód buňky"
              autofocus
              :rules="[(val) => !!val || 'Pole nesmí být prázdné']"
            />
            <q-btn
              type="submit"
              unelevated
              color="primary"
              class="w-full mt-5 h-[3rem]"
              label="Přidat"
            ></q-btn>
          </q-form>
        </div>
      </q-card>
    </q-dialog>
    <transition name="slide-fade" mode="out-in">
      <div v-if="step === 1" class="flex h-[3rem] gap-2 mt-auto">
        <q-btn
          unelevated
          color="primary"
          label="přidat buňku"
          icon="add"
          class="flex-[2]"
          @click="seamless = true"
        />
        <q-btn
          color="primary"
          outline
          icon-right="arrow_forward"
          label="dále"
          @click="step += 1"
          :disable="!selectedSlot"
          class="flex-1"
        />
      </div>
      <q-btn
        v-else-if="step === 3"
        unelevated
        @click="submitAllocation"
        :loading="loading"
        color="primary"
        label="uložit"
        class="mt-auto h-[3rem]"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { StockDocumentItem, StockMovementItemApiModel } from '@/client'
import { useApi, type PostStockMovement } from '@/composables/useApi'
import { useWarehouse } from '@/composables/warehouse'
import { filterOutPlacesOnly, rules } from '@/utils'
import { QStepper, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  stockDocumentId: string
  documentItem: StockDocumentItem
  movement: StockMovementItemApiModel
}>()

const { getWarehousePlace, stripWarehousePlace } = useWarehouse()

const warehousePlaces = ref(filterOutPlacesOnly(props.movement.stockItems ?? []))
const displayedWarehousePlaces = computed(() => filterOutPlacesOnly(warehousePlaces.value))

const step = ref(1)
const stepper = ref<QStepper>()

const selectedSlot = ref<PostStockMovement>({
  id: props.movement.id ?? 0,
  lineNumber: props.movement.lineNumber ?? 1,
  stockProductId: props.movement.stockProductId ?? 1,
  place: (warehousePlaces.value ?? [])[0]?.warehousePlaceCode ?? undefined,
  value: props.movement.value ?? 0,
})

function select(slot?: string | null) {
  if (!slot) {
    return
  }
  selectedSlot.value.place = slot
  setTimeout(() => (step.value = 2), 300)
}

const confirmation = ref('')

const adjustedWarehousePlace = computed(() => getWarehousePlace(selectedSlot.value?.place ?? ''))

watch(confirmation, () => {
  if (confirmation.value === adjustedWarehousePlace.value) {
    setTimeout(() => (step.value += 1), 500)
  }
})

const isConfirmed = computed(() => confirmation.value === adjustedWarehousePlace.value)

const seamless = ref(false) // dialog control
const newSlot = ref('')
async function addNewSlot() {
  warehousePlaces.value.push({
    warehousePlaceCode: stripWarehousePlace(newSlot.value),
    value: 0,
    id: 0,
    warehousePlaceId: 0
  })
  selectedSlot.value.place = stripWarehousePlace(newSlot.value)
  newSlot.value = ''
  seamless.value = false
}

const { postStockMovement } = useApi()
const $q = useQuasar()
const emit = defineEmits<{
  (e: 'allocated', movement: PostStockMovement): void
}>()
const loading = ref(false)
async function submitAllocation() {
  if (!isConfirmed.value) {
    $q.notify({
      type: 'negative',
      message: 'Je potřeba buňku potvrdit scannerem!',
      timeout: 1000
    })
    step.value = 2
    return
  }

  loading.value = true
  const wasPosted = await postStockMovement(props.stockDocumentId, [selectedSlot.value])
  loading.value = false
  if (!wasPosted) {
    return
  }

  $q.notify({
    color: 'positive',
    message: `${selectedSlot.value.value} MJ naskladněno do ${selectedSlot.value.place}`
  })

  setTimeout(() => emit('allocated', selectedSlot.value), 300)
}
</script>
