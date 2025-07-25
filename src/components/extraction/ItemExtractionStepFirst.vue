<template>
  <div class="flex flex-col">
    <StockoutCountBadge :count="count ?? 0" :wanted-count="count ?? 0" />
    <span class="text-gray-7 mt-2">{{ code ?? 'N/A' }}</span>
    <span class="text-lg">{{ name ?? 'N/A' }}</span>
    <span class="text-xs text-gray-7">MJ = 100ks</span>
    <q-separator class="my-5" />
    <q-list class="border-rounded-md" v-if="stockItems.length > 0">
      <q-item
        clickable
        v-ripple
        v-for="(item, index) in displayedStockItems"
        :key="index"
        @click="select(item.warehousePlaceCode)"
        :active="movement.place === item.warehousePlaceCode"
        class="border-rounded-md my-1"
        active-class="bg-primary text-white font-bold"
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
    <EmptyBox v-else title="Není skladem" />
  </div>
</template>

<script setup lang="ts">
import type { StockItemApiModel } from '@/client'
import type { PostStockMovement } from '@/composables/useApi'
import StockoutCountBadge from '../StockoutCountBadge.vue'
import EmptyBox from '../EmptyBox.vue'
import { computed } from 'vue'
import { filterOutPlacesOnly } from '@/utils'

const props = defineProps<{
  count?: number | null
  code?: string | null
  name?: string | null // movement.stockProduct?.name
  stockItems: StockItemApiModel[]
}>()

const emit = defineEmits(['next'])

const movement = defineModel<PostStockMovement>({ required: true })

const displayedStockItems = computed(() => filterOutPlacesOnly(props.stockItems))

function select(slot?: string | null) {
  if (!slot) {
    return
  }

  const selectedPlace = props.stockItems?.find((it) => it.warehousePlaceCode === slot)
  if (!selectedPlace) {
    return
  }

  movement.value.place = slot

  if (movement.value.value > (selectedPlace.value ?? 0)) {
    movement.value.value = selectedPlace.value ?? 0
  } else {
    movement.value.value = props.count ?? 0
  }

  setTimeout(() => emit('next'), 300)
}
</script>

<style lang="css" scoped></style>
