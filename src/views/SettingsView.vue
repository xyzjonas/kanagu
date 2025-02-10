<template>
  <q-page padding class="flex flex-col gap-5">
    <ConnectionSettings />
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

    <div class="mt-auto text-center m-2 text-gray-4">
      Verze aplikace <strong>{{ version }}</strong>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue'
import { version } from '@/version'
</script>

<style lang="sass" scoped></style>
