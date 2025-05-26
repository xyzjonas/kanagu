<template>
  <div class="flex flex-col justify-center items-center mt-10">
    <span>VYBRÁNO</span>
    <span class="text-2xl"><span class="text-gray-5">BUŇKA</span> {{ correctedPlaceName }}</span>
    <q-input
      v-model="confirmation"
      autofocus
      :rules="[(val) => val === correctedPlaceName]"
      no-error-icon
      input-class="text-center"
      inputmode="none"
    />
    <span>POTVRDIT BUŇKU SCANNEREM</span>
    <div class="h-[3rem]">
      <transition mode="out-in" name="slide-fade">
        <q-btn
          v-if="confirmation.length >= 1 && confirmation !== correctedPlaceName"
          label="reset"
          @click="confirmation = ''"
          flat
          class="mt-5"
        />
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useWarehouse } from '@/composables/warehouse'
import { computed, ref, watch } from 'vue'

const { getWarehousePlace } = useWarehouse()

const props = defineProps<{
  selectedPlace?: string | undefined | null
}>()

const confirmation = ref('')
const modelValue = defineModel({ required: true })

const correctedPlaceName = computed(() => getWarehousePlace(props.selectedPlace ?? 'N/A'))

watch(confirmation, () => {
  if (confirmation.value === correctedPlaceName.value) {
    modelValue.value = true
  } else {
    modelValue.value = false
  }
})

modelValue.value = false
</script>

<style lang="css" scoped></style>
