<template>
  <div
    :class="`flex flex-col border-slate-3 border-solid border-1 border-rounded-md bg-slate-1 shadow-md overflow-hidden relative ${dynamicClasses} hover:cursor-pointer hover:border-slate-4`"
    @click="onClick"
  >
    <div class="absolute-top pl-2 pt-1 opacity-[0.8]">
      <q-icon
        :name="isStockOut ? 'output' : 'exit_to_app'"
        size="1.2rem"
        :class="isStockOut ? 'text-stockout' : 'text-stockin'"
      />
    </div>
    <div class="ml-auto flex items-end flex-col p-2 text-left">
      <span :class="`${isStockOut ? 'text-stockout' : 'text-stockin'} font-600`">{{
        order.stockDocumentNumber
      }}</span>
      <span>{{ order.externalNumber }}</span>
    </div>
    <div class="flex flex-col text-left p-2 mt-auto">
      <div>
        <span class="opacity-[0.5] mr-1">Vystaveno:</span>
        <span>{{ createdOn }}</span>
      </div>
      <div>
        <span class="opacity-[0.5] mr-1 text-xs"
          >{{ status.itemsCompleted }}/{{ status.items }} provedené pohyby</span
        >
      </div>
      <span class="text-lg font-500">{{ customer }}</span>
    </div>
    <q-btn
      v-if="!isDone"
      square
      :label="isStockOut ? 'vyskladnit' : 'naskladnit'"
      unelevated
      class="h-[3rem]"
      color="primary"
    />
    <q-btn
      v-else-if="cancelled"
      square
      label="st"
      unelevated
      class="h-[3rem]"
      color="gray"
      disable
    />
    <q-btn
      v-else
      square
      :label="isStockOut ? 'výdej uzavřen' : 'příjem uzavřen'"
      unelevated
      color="positive"
      :class="`${isDone ? 'opacity-[0.8]' : ''} h-[3rem]`"
    />
  </div>
</template>

<script setup lang="ts">
// import type { ReceiveOrder } from '@/composables/useApi'
import type { StockDocument } from '@/client'
import { getDocumentStatus } from '@/utils'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ order: StockDocument; isStockOut?: boolean }>()

// const received = computed(() => new Date(props.order.deliveryDate).toLocaleDateString())

const customer = computed(() => {
  if (props.isStockOut) {
    return props.order.customerName
  }
  return props.order.supplierName
})

const createdOn = computed(() => {
  if (!props.order.createdOn) {
    return 'Datum chybí'
  }
  return new Date(props.order.createdOn).toLocaleDateString()
})

const status = computed(() => getDocumentStatus(props.order))

const isDone = computed(() => status.value.items === status.value.itemsCompleted)

const dynamicClasses = computed(() => {
  if (isDone.value) {
    return ''
  }

  return ''
})

const cancelled = computed(() => !!props.order.cancelledOn)

const router = useRouter()
const onClick = () => {
  router.push({
    name: props.isStockOut ? 'po-detail' : 'ro-detail',
    params: { id: props.order.stockDocumentNumber }
  })
}
</script>
