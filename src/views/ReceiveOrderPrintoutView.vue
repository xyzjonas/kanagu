<template>
  <q-page padding>
    <main v-if="receiveOrder && orderItem">
      <div class="flex items-center gap-1 mb-5">
        <q-btn
          flat
          dense
          icon="i-hugeicons-arrow-left-03"
          :to="{ name: 'ro-detail', params: { id: orderId } }"
        ></q-btn>
        <q-separator vertical class="mr-2" />
        <OrderHeader :order="receiveOrder" />
      </div>

      <Card>
        <div class="flex flex-col">
          <span class="text-gray-">{{ orderItem?.item.id }}</span>
          <span class="text-lg">{{ orderItem?.item.name }}</span>
          <span class="text-xs text-gray-7">MJ = 100ks</span>
          <q-form @submit="submitPrint" class="mt-5">
            <q-input
              v-model="count"
              label="Počet štítků k tisku"
              hint=""
              :rules="[rules.notEmpty, rules.atLeastOne]"
            ></q-input>
            <q-btn label="tisk" type="submit" class="w-full mt-2" unelevated color="primary" />
          </q-form>
        </div>
      </Card>
    </main>
    <NotFound v-else />
  </q-page>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import NotFound from '@/components/NotFound.vue'
import OrderHeader from '@/components/OrderHeader.vue'
import { useApi } from '@/composables/useApi'
import { rules } from '@/utils'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { receiveOrders } = useApi()

const id = useRoute().params.id as string
const orderId = useRoute().params.orderId as string

const receiveOrder = receiveOrders.value.find((val) => val.id === orderId)

const orderItem = receiveOrder?.items.find((item) => item.id === id)

const count = ref<number>()

const router = useRouter()
const $q = useQuasar()
function submitPrint() {
  $q.notify({
    color: 'positive',
    message: `${count.value} štítků odesláno k tisku`
  })
  setTimeout(() => router.push({ name: 'ro-detail', params: { id: orderId } }), 300)
}
</script>

<style lang="sass" scoped></style>
