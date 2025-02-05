<template>
    <q-page padding class="flex flex-col gap-5">
        <section>
            <h1>Nastavení připojení</h1>
            <q-input outlined v-model="baseUrl" label="API URL" hint="URL adresa serveru" />
            <q-btn class="mt-3" icon="network_check" flat label="otestovat připojení" @click="testConnection" />
        </section>

        <q-separator />
        <!-- <section>
            <h2>Testovací data</h2>
            <q-list bordered>
                <q-item clickable v-ripple @click="resetDummyData()">
                    <q-item-section avatar>
                        <q-icon name="i-hugeicons-reload" />
                    </q-item-section>
                    
                    <q-item-section> Resetovat Testovací Data </q-item-section>
                </q-item>
            </q-list>
        </section> -->

        <div class="mt-auto text-center m-2 text-gray-4">Verze aplikace <strong>{{ version }}</strong></div>
    </q-page>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { version } from '@/version';

const { baseUrl, testConnection } = useApi()

</script>

<style lang="sass" scoped>

</style>