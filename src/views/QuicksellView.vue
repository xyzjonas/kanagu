<template>
  <q-page padding class="flex flex-col">
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
          active-icon="description"
          icon="description"
          done-icon="description"
          title=""
          :done="step > 1"
        >
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <h2 class="uppercase">identifikace</h2>
              <q-btn
                v-show="order.customerName || order.paymentTypeId || order.externalNumber"
                color="primary"
                label=""
                @click="clearForm"
                flat
                rounded
                outline
                icon-right="refresh"
              ></q-btn>
            </div>
            <CustomerSelect v-model="selectedCustomer" />
            <PaymentSelect v-model="selectedPayment" />
            <q-input v-model="responsibleContact" outlined label="Odpovědná Osoba" disable />
            <q-input
              v-model="order.externalNumber"
              outlined
              label="Externí Číslo"
              inputmode="numeric"
            />
          </div>
        </q-step>

        <q-step :name="2" title="" active-icon="list" icon="list" done-icon="list"> FOO #2 </q-step
        >>
      </q-stepper>

      <q-dialog v-model="seamless" position="bottom">
        <q-card style="width: 350px">
          <div class="p-4 flex flex-col">
            <div class="w-full flex justify-between items-center">
              <span class="text-2xl uppercase">Přidat položku</span>
              <q-btn flat round icon="close" v-close-popup />
            </div>
          </div>
        </q-card>
      </q-dialog>
      <div class="position-sticky bottom-2 mt-auto">
        <transition name="slide-fade" mode="out-in">
          <div v-if="step === 1" class="flex h-[3rem]">
            <q-btn
              icon-right="arrow_forward"
              label="dále"
              @click="step += 1"
              class="flex-1 bg-slate-2"
            />
          </div>
          <div v-else class="flex h-[3rem] gap-2">
            <q-btn
              unelevated
              @click="submitQuicksell"
              color="primary"
              label="uzavřít"
              class="mt-auto h-[3rem] flex-1"
            />
            <q-btn
              unelevated
              color="primary"
              outline
              label="přidat položku"
              icon="add"
              class="flex-[2]"
              @click="seamless = true"
            />
          </div>
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { type Customer, type FastOrder, type PaymentType } from '@/client'
import CustomerSelect from '@/components/quicksell/CustomerSelect.vue'
import PaymentSelect from '@/components/quicksell/PaymentSelect.vue'
import { useLocalStorage } from '@vueuse/core'
import { QStepper, useQuasar } from 'quasar'
import { onActivated, ref, watch } from 'vue'

const step = ref(1)
const stepper = ref<QStepper>()

const seamless = ref(false) // dialog control

const $q = useQuasar()

const order = useLocalStorage<FastOrder>('fast-order', {})

const responsibleContact = ref('')
const selectedPayment = ref<PaymentType>()
const selectedCustomer = ref<Customer>()

const clearForm = () => {
  selectedCustomer.value = undefined
  selectedPayment.value = undefined
  order.value = {}
}

watch(selectedCustomer, (customer) => {
  if (customer) {
    order.value = {
      ...order.value,
      customerId: customer.id,
      customerName: customer.name,
      customerCity: customer.city,
      customerPostalCode: customer.postalCode,
      customerState: customer.state,
      customerCompanyIdentification: customer.identification,
      customerTaxIdentification: customer.taxIdentification,
      phone: customer.phone,
      email: customer.email
    }
  } else {
    order.value = {
      ...order.value,
      customerId: undefined,
      customerName: undefined,
      customerCity: undefined,
      customerPostalCode: undefined,
      customerState: undefined,
      customerCompanyIdentification: undefined,
      customerTaxIdentification: undefined,
      phone: undefined,
      email: undefined
    }
  }
})

watch(selectedPayment, (payment) => {
  if (payment) {
    order.value = {
      ...order.value,
      paymentTypeId: payment.id
    }
  }
})

onActivated(() => {
  if (!order.value) {
    return
  }

  if (order.value.customerName) {
    selectedCustomer.value = {
      id: order.value.customerId as number | undefined,
      name: order.value.customerName,
      city: order.value.customerCity,
      postalCode: order.value.customerPostalCode,
      state: order.value.customerState,
      identification: order.value.customerCompanyIdentification,
      taxIdentification: order.value.customerTaxIdentification,
      phone: order.value.phone,
      email: order.value.email
    }
  }
})

const isConfirmed = ref(false)
async function submitQuicksell() {
  if (!isConfirmed.value) {
    $q.notify({
      type: 'negative',
      message: 'Je potřeba buňku potvrdit scannerem!',
      timeout: 1000
    })
    step.value = 2
    return
  }

  // todo: post

  $q.notify({
    color: 'positive',
    message: 'Prodej uzavřen.'
  })
}
</script>
