<template>
  <q-page padding class="flex flex-col gap-5">
    <ConnectionSettings />
    <q-separator />
    <!-- <section>
      <h1>
        Kopírovat token
        <q-btn flat round icon="content_copy" @click="copyToken" />
      </h1>
    </section> -->

    <div class="mt-auto text-center m-2 text-gray-4">
      Verze aplikace <strong>{{ version }}</strong>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue'
import { useAuth } from '@/composables/useAuth'
import { version } from '@/version'
import { useClipboard } from '@vueuse/core'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const { copy } = useClipboard()

const { token } = useAuth()
const copyToken = () => {
  copy(`Bearer ${token.value}`)
  $q.notify({
    message: 'Token zkopírován do schránky.',
    type: 'positive'
  })
}
</script>

<style lang="sass" scoped></style>
