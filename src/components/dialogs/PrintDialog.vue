<template>
  <q-dialog v-model="modelValue" position="bottom">
    <q-card class="sm:w-xl">
      <div class="p-4 flex flex-col">
        <div class="w-full flex justify-between items-center">
          <span class="text-2xl uppercase">Tisk štítků</span>
          <q-btn flat round icon="close" v-close-popup />
        </div>
        <span class="text-gray-7 mt-3">{{ productCode ?? 'N/A' }}</span>
        <span class="text-lg">{{ productName ?? 'N/A' }}</span>
        <q-form @submit="$emit('print', printCount)">
          <q-input
            v-model="printCount"
            type="number"
            inputmode="numeric"
            label="Počet štítků k tisku"
            autofocus
            :rules="[
              rules.notEmpty,
              rules.isNumber,
              (val: number) => val <= 200 || 'Víc jak 200 je možná trochu moc, ne?'
            ]"
            input-class=""
          >
            <template #append>
              <span class="text-sm">ks</span>
            </template>
          </q-input>
          <q-btn
            type="submit"
            unelevated
            color="primary"
            class="w-full mt-5 h-[3rem]"
            label="Tisknout"
            :loading="loading"
          ></q-btn>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { rules } from '@/utils'
import { ref } from 'vue'

const modelValue = defineModel<boolean>({ required: true })

defineProps<{
  productCode?: string | null
  productName?: string | null
  loading?: boolean
}>()

const printCount = ref(1)

const emit = defineEmits<{
  (e: 'print', count: number): void
}>()
</script>
<style lang="css" scoped></style>
