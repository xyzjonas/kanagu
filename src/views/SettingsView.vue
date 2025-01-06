<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { version } from '@/version';


const { resetDummyData } = useApi()

</script>

<template>
    <q-page padding class="flex flex-col">
        <q-list bordered>
            <q-item clickable v-ripple @click="resetDummyData()">
                <q-item-section avatar>
                    <q-icon name="i-hugeicons-reload" />
                </q-item-section>
                
                <q-item-section> Resetovat Testovací Data </q-item-section>
            </q-item>
        </q-list>

        <div class="mt-auto text-center m-2 text-gray-4">Verze aplikace <strong>{{ version }}</strong></div>
    </q-page>
</template>

<style lang="sass" scoped>

</style>