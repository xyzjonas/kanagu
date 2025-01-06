<template>
  <!-- <Card class="bg-secondary text-white">
    <div class="flex flex-col">
      <span class="text-2xl text-bold uppercase mb-3">Příjem</span>
      <span class="text-gray-3">{{ item.item.id }}</span>
      <span class="text-lg">{{ item.item.name }}</span>
      <span class="text-xs text-gray-3">MJ = 100ks</span>
    </div>
  </Card> -->

  <q-stepper
    v-model="step"
    ref="stepper"
    color="primary"
    animated
    class="mt-2"
    contracted
    header-nav
  >
    <q-step :name="1" active-icon="place" icon="place" done-icon="place" title="" :done="step > 1">
      <div class="flex flex-col min-h-xs">
        <span class="uppercase text-lg text-primary font-600">Příjem</span>
        <span class="text-gray-7 mt-2">{{ item.item.id }}</span>
        <span class="text-lg">{{ item.item.name }}</span>
        <span class="text-xs text-gray-7">MJ = 100ks</span>
        <q-list class="mt-3 border-rounded-md">
          <q-item
            clickable
            v-ripple
            v-for="item in bunky"
            :key="item.name"
            @click="select(item)"
            :active="selectedSlot?.name === item.name"
            class="border-rounded-md"
            active-class="text-white bg-green-4 font-bold"
          >
            <q-item-section>
              <div class="flex justify-between">
                <span>BUŇKA {{ item.name }}</span>
                <span>{{ item.count }}MJ</span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="flex justify-end mt-auto py-5 gap-1">
          <q-btn
            unelevated
            color="primary"
            label="přidat buňku"
            icon="add"
            class="flex-1"
            @click="seamless = true"
          />
          <q-btn
            flat
            color="primary"
            icon-right="arrow_forward"
            label="dále"
            @click="step += 1"
            :disable="!selectedSlot"
          />
        </div>
      </div>
    </q-step>

    <q-step
      :name="2"
      title=""
      active-icon="qr_code"
      icon="qr_code"
      done-icon="qr_code"
      :done="step > 2"
    >
      <div class="flex flex-col justify-center items-center min-h-xs">
        <span>VYBRÁNO</span>
        <span class="text-2xl"
          ><span class="text-gray-5">BUŇKA</span> {{ selectedSlot?.name }}</span
        >
        <q-input
          v-model="confirmation"
          autofocus
          :rules="[(val) => val === selectedSlot?.name]"
          no-error-icon
          input-class="text-transparentt text-center"
          inputmode="none"
        />
        <!-- <input @ -->
        <span>POTVRDIT BUŇKU SCANNEREM</span>
      </div>
    </q-step>

    <q-step :name="3" title="" icon="plus_one" style="min-height: 200px">
      <div class="flex flex-col min-h-xs">
        <span class="uppercase text-lg text-primary font-600">Naskladnit</span>
        <span class="text-gray-7 mt-2">{{ item.item.id }}</span>
        <span class="text-lg">{{ item.item.name }}</span>

        <span class="mt-6">Zadat počet MJ k naskladnění</span>
        <span class="text-2xl">
          <span class="text-gray-5">BUŇKA</span> {{ selectedSlot?.name }}
        </span>
        <q-form @submit="submitAllocation">
          <q-input
            v-model="count"
            label="Počet MJ"
            autofocus
            no-error-icon
            input-class="text-transparentt text-center"
            :rules="[rules.notEmpty, rules.atLeastOne]"
            inputmode="numeric"
          />
          <div class="flex justify-end mt-auto py-5 gap-1">
            <q-btn unelevated color="primary" label="uložit" class="flex-1" type="submit" />
          </div>
        </q-form>
      </div>
    </q-step>
  </q-stepper>

  <q-dialog v-model="seamless" position="bottom">
    <q-card style="width: 350px">
      <div class="p-4 flex flex-col">
        <div class="w-full flex justify-between items-center">
          <span class="text-2xl uppercase">Přidat buňku</span>
          <q-btn flat round icon="close" v-close-popup />
        </div>
        <span class="text-gray-7 mt-3">{{ item.item.id }}</span>
        <span class="text-lg">{{ item.item.name }}</span>
        <q-form @submit="addNewSlot">
          <q-input
            v-model="newSlot"
            hint="Naskenovat nebo zadat buňku."
            label="Kód buňky"
            autofocus
            :rules="[(val) => !!val || 'Pole nesmí být prázdné']"
          />
          <q-btn type="submit" unelevated color="primary" class="w-full mt-5" label="Přidat"></q-btn>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { OrderItem } from '@/composables/useApi'
import Card from './Card.vue'
import { ref, watch } from 'vue'
import { QStepper, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { rules } from '@/utils'

defineProps<{
  item: OrderItem
}>()

interface Slot {
  name: string
  count: number
}

const step = ref(1)
const stepper = ref<QStepper>()

function select(slot: Slot) {
  selectedSlot.value = slot
  setTimeout(() => (step.value = 2), 300)
}

const confirmation = ref('')
watch(confirmation, () => {
  if (confirmation.value === selectedSlot.value.name) {
    setTimeout(() => (step.value += 1), 500)
  }
})

const bunky = ref([
  {
    name: 'AX-23-88',
    count: 22
  },
  {
    name: 'AX-23-89',
    count: 122
  },
  {
    name: 'AX-23-90',
    count: 222
  },
  {
    name: 'AX-23-01',
    count: 522
  }
])

const selectedSlot = ref<Slot>(bunky.value[0])
const count = ref<number>()

const seamless = ref(false)
const newSlot = ref('')
async function addNewSlot() {
  // todo: API call
  const slot = {
    name: newSlot.value,
    count: 100
  }
  bunky.value.push(slot)
  selectedSlot.value = slot
  seamless.value = false
}

const $q = useQuasar()
const emit = defineEmits<{
  (e: 'allocated', slot: string, count: number): void
}>()
async function submitAllocation() {
  // todo: API call
  $q.notify({
    color: 'positive',
    message: `${count.value} MJ naskladněno do ${selectedSlot.value.name}`
  })
  
  setTimeout(() => emit('allocated', selectedSlot.value.name, count.value ?? 0), 300)
}
</script>

<style lang="sass" scoped></style>
