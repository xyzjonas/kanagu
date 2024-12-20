<template>
  <!-- <Card class="bg-secondary text-white">
    <div class="flex flex-col">
      <span class="text-2xl text-bold uppercase mb-3">Příjem</span>
      <span class="text-gray-3">{{ item.item.id }}</span>
      <span class="text-lg">{{ item.item.name }}</span>
      <span class="text-xs text-gray-3">MJ = 100ks</span>
    </div>
  </Card> -->

  <q-stepper v-model="step" ref="stepper" color="primary" animated class="mt-2">
    <q-step :name="1" title="" icon="settings" :done="step > 1">
      <div class="flex flex-col min-h-xs">
        <span class="text-gray-7">{{ item.item.id }}</span>
        <span class="text-lg">{{ item.item.name }}</span>
        <span class="text-xs text-gray-7">MJ = 100ks</span>
        <q-list bordered padding separator class="mt-3 border-rounded-md">
          <q-item clickable v-ripple v-for="item in bunky" :key="item.name" @click="select(item)">
            <q-item-section>
              <div class="flex justify-between">
                <span>BUŇKA {{ item.name }}</span>
                <span>{{ item.count }}MJ</span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="flex justify-end mt-auto py-5">
            <q-btn unelevated color="primary" label="přidat buňku" icon="add"/>
        </div>
      </div>
    </q-step>

    <q-step :name="2" title="" icon="create_new_folder" :done="step > 2">
      <div class="flex flex-col justify-center items-center min-h-xs">
        <span>VYBRÁNO</span>
        <span class="text-2xl"
          ><span class="text-gray-5">BUŇKA</span> {{ selectedSlot?.name }}</span
        >
        <!-- <div class="h-[2rem] overflow-hidden"> -->
        <q-input v-model="confirmation" autofocus :rules="[val => val === selectedSlot?.name]" no-error-icon input-class="text-transparent"/>
        <!-- </div> -->
        <span>POTVRDIT BUŇKU SCANNEREM</span>
      </div>
    </q-step>

    <q-step :name="4" title="" icon="add_comment" style="min-height: 200px">
      Try out different ad text to see what brings in the most customers, and learn how to enhance
      your ads using features like ad extensions. If you run into any problems with your ads, find
      out how to tell if they're running and how to resolve approval issues.
    </q-step>

    <!-- <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template> -->
  </q-stepper>
</template>

<script setup lang="ts">
import type { OrderItem } from '@/composables/useApi'
import Card from './Card.vue'
import { ref } from 'vue'
import { QStepper } from 'quasar'

defineProps<{
  item: OrderItem
}>()

interface Slot {
  name: string
  count: number
}

const step = ref(1)
const stepper = ref<QStepper>()

const selectedSlot = ref<Slot>()
const confirmation = ref("")

function select(slot: Slot) {
  selectedSlot.value = slot
  step.value = 2
}

const bunky = [
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
]
</script>

<style lang="sass" scoped></style>
