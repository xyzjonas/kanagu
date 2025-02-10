<template>
  <section>
    <h1>Nastavení připojení</h1>
    <q-input outlined v-model="baseUrl" label="API URL" hint="URL adresa serveru" />
    <q-btn
      class="mt-3"
      icon="network_check"
      flat
      label="otestovat připojení"
      @click="test"
      :loading="testingConnection"
    />
  </section>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { ref } from 'vue';

const { baseUrl, testConnection } = useApi()

const testingConnection = ref(false)
const test = () => {
    testingConnection.value = true
    testConnection().finally(() => testingConnection.value = false)
}
</script>

<style lang="scss" scoped></style>
