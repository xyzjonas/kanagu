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
          class="overflow-hidden"
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
                dense
                icon-right="refresh"
              ></q-btn>
            </div>
            <q-form class="flex flex-col gap-2">
              <CustomerSelect v-model="selectedCustomer" />
              <PaymentSelect v-model="selectedPayment" />
              <q-input v-model="responsibleContact" outlined label="Odpovědná Osoba" disable />
              <q-input
                v-model="order.externalNumber"
                outlined
                label="Externí Číslo"
                inputmode="numeric"
              />
              <q-input v-model="order.note" outlined label="Poznámka *" autogrow />
            </q-form>
          </div>
        </q-step>

        <q-step :name="2" title="" active-icon="list" icon="list" done-icon="list">
          <EmptyBox v-if="isEmpty" title="Žádné položky"></EmptyBox>
          <div v-else>
            <h2 class="uppercase">{{ orderItems.length }} {{ polozky }}</h2>
            <div class="grid gap-1 md:grid-cols-2 lg:grid-cols-4">
              <ItemCard
                :item="item.item"
                :place="item.place"
                :quantity="item.quantity"
                v-for="item in orderItems"
                @delete="() => removeItem(item.item?.code ?? '')"
              />
            </div>
          </div>
        </q-step>

        <q-step :name="3" title="" active-icon="check" icon="check" done-icon="check">
          <EmptyBox v-if="isEmpty" title="Žádné položky"></EmptyBox>
          <div v-else>
            <h2 class="uppercase">{{ orderItems.length }} {{ polozky }}</h2>
            <div class="grid gap-1 md:grid-cols-2 lg:grid-cols-4">
              <ItemCard
                :item="item.item"
                :place="item.place"
                :quantity="item.quantity"
                v-for="item in orderItems"
                @delete="() => removeItem(item.item?.code ?? '')"
                readonly
              />
            </div>
          </div>
        </q-step>
      </q-stepper>

      <div class="position-sticky mt-auto bg-slate-2">
        <transition name="slide-fade" mode="out-in">
          <div v-if="step === 1" class="flex h-[3rem]">
            <q-btn
              icon-right="arrow_forward"
              label="dále"
              @click="step += 1"
              class="flex-1"
              outline
              color="primary"
            />
          </div>
          <div v-else-if="step == 2" class="flex h-[3rem] gap-2">
            <q-btn
              unelevated
              @click="step += 1"
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
          <div v-else class="flex h-[3rem] gap-2">
            <q-btn
              unelevated
              @click="submitQuicksell"
              color="primary"
              label="uzavřít"
              class="mt-auto h-[3rem] flex-1"
            />
          </div>
        </transition>
      </div>
    </div>

    <q-dialog v-model="seamless" position="bottom">
      <q-card class="w-lg">
        <div class="p-4 flex flex-col">
          <div class="w-full flex justify-between items-center mb-3">
            <span class="text-2xl uppercase">Přidat položku</span>
            <q-btn flat round icon="close" v-close-popup />
          </div>
          <q-form class="flex flex-col gap-2" @submit="addItem">
            <ItemSelectByName v-model="newItem" :rules="[rules.notEmpty]" />
            <PlaceSelect v-model="newPlace" :rules="[rules.notEmpty]" />
            <q-input
              v-model.number="newItemQuantity"
              outlined
              :hint="
                newItem?.product?.unitType?.code
                  ? `1MJ = ${newItem?.product?.unitType?.code}`
                  : 'N/A'
              "
              label="Počet Kusů (dle MJ)"
              inputmode="numeric"
              :rules="[rules.atLeastOne]"
            />
            <q-btn type="submit" unelevated color="primary" label="přidat" class="h-[3rem] mt-3" />
          </q-form>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import type { Customer, FastOrder, PaymentType, StockProduct, WarehousePlace } from '@/client'
import EmptyBox from '@/components/EmptyBox.vue'
import CustomerSelect from '@/components/quicksell/CustomerSelect.vue'
import ItemCard from '@/components/quicksell/QuiacksellItem.Card.vue'
import ItemSelectByName from '@/components/quicksell/ItemSelectByName.vue'
import PaymentSelect from '@/components/quicksell/PaymentSelect.vue'
import PlaceSelect from '@/components/quicksell/PlaceSelect.vue'
import { usePolozky } from '@/composables/usePolozky'
import { rules } from '@/utils'
import { useLocalStorage } from '@vueuse/core'
import { QStepper, useQuasar } from 'quasar'
import { computed, onActivated, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'

interface OrderItem {
  item: StockProduct
  place: WarehousePlace
  quantity: number
}

const step = ref(1)
const stepper = ref<QStepper>()

const seamless = ref(false) // dialog control

const $q = useQuasar()

const order = useLocalStorage<FastOrder>('fast-order', {})
const orderItems = useLocalStorage<OrderItem[]>('fast-order-items', [])

const count = computed(() => orderItems.value.length)
const { polozky } = usePolozky(count)

const responsibleContact = ref('')
const selectedPayment = useLocalStorage<PaymentType>('fast-order-payment', {})
const selectedCustomer = ref<Customer>()

const clearForm = () => {
  selectedCustomer.value = undefined
  selectedPayment.value = undefined
  order.value = {
    fastOrderItems: []
  }
  orderItems.value = []
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
      email: customer.email,
      customerStreet: customer.street
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

watch(orderItems, () => {
  order.value.fastOrderItems = []

  for (let i = 0; i < orderItems.value.length; i++) {
    const item = orderItems.value[i]
    order.value.fastOrderItems.push({
      stockProductId: item.item.id,
      name: item.item.name,
      warehousePlaceCode: item.place.code,
      quantity: item.quantity,
      lineNumber: i
    })
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
      email: order.value.email,
      street: order.value.customerStreet
    }
  }
})

const isEmpty = computed(() => orderItems.value.length === 0)

const newItem = ref<StockProduct>()
const newPlace = ref<WarehousePlace>()
const newItemQuantity = ref(0)

function addItem() {
  if (!newItem.value || !newPlace.value) {
    return
  }

  orderItems.value = [
    ...orderItems.value,
    {
      item: newItem.value,
      place: newPlace.value,
      quantity: newItemQuantity.value
    }
  ]

  seamless.value = false
  setTimeout(() => {
    newItem.value = undefined
    newPlace.value = undefined
    newItemQuantity.value = 0
  }, 500)
}

function removeItem(code: string) {
  orderItems.value = orderItems.value.filter((item) => item.item.code !== code)
}

const { postFastOrder } = useApi()
const router = useRouter()
async function submitQuicksell() {
  const success = await postFastOrder(order.value)
  if (!success) {
    return
  }

  $q.notify({
    color: 'positive',
    message: 'Prodej uzavřen.'
  })
  step.value = 1
  clearForm()
  router.push({ name: 'home' })
}
</script>
<style lang="css"></style>
