<template>
  <q-page padding>
    <q-table flat grid bordered :rows="receiveOrders" hide-pagination>
      <template v-slot:item="props">
        <q-card class="p-3 flex flex-col gap-5">
          <div class="flex justify-between gap-30">
            <div class="flex flex-col">
              <span class="font-bold">{{ props.row.id }}</span>
              <span>{{ props.row.rackId }}</span>
            </div>
            <div class="flex flex-col">
              <span>{{ props.row.received.toLocaleDateString() }}</span>
              <span>{{ props.row.supplier }}</span>
            </div>
          </div>
          <div class="flex">
            <q-btn
              label="naskladnit"
              unelevated
              color="secondary"
              class="ml-auto"
              :to="{ name: 'ro-detail', params: { id: props.row.id } }"
            />
          </div>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'

const { receiveOrders } = useApi()

// receiveOrders[0].
</script>

<style lang="sass" scoped></style>
