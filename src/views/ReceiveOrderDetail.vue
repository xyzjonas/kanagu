<template>
  <q-page padding>
    <main v-if="receiveOrder">
      <h1 class="text-2xl font-semibold m-0">{{ receiveOrder.id }}</h1>
      <h2 class="text-lg m-0">{{ receiveOrder.supplier }}</h2>

      <q-table flat grid bordered :rows="receiveOrder.items" hide-pagination>
        <template v-slot:item="props">
          <q-card class="p-3 flex flex-col gap-5">
            <div class="flex justify-between gap-30">
              <div class="flex flex-col">
                <span>{{ props.row.item.id }}</span>
                <span>{{ props.row.item.name }}</span>
                <span>{{ props.row.count }}</span>
              </div>
            </div>
            <!-- <div class="flex">
              <q-btn
                label="naskladnit"
                unelevated
                color="secondary"
                class="ml-auto"
                :to="{ name: 'ro-detail', params: { id: props.row.id } }"
              />
            </div> -->
          </q-card>
        </template>
      </q-table>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { useRoute } from 'vue-router'

const { receiveOrders } = useApi()

const id = useRoute().params.id as string

const receiveOrder = receiveOrders.find((val) => val.id === id)
</script>
<style lang="sass" scoped></style>
