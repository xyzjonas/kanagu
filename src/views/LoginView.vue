<template>
  <q-page padding class="grid content-start md:content-center justify-stretch max-w-md mx-auto">
    <q-form @submit="postLogin" autofocus class="text-center">
      <h1 class="uppercase">Přihlášení</h1>
      <h2 class="mb-10">Použíjte lokální účet pro přihlášení.</h2>

      <div class="flex flex-col gap-3">
        <q-input
          outlined
          label="E-mail"
          hint="Váš email"
          v-model="email"
          type="email"
          :rules="[rules.notEmpty]"
        />
        <q-input
          outlined
          label="Heslo"
          hint="Vaše bezpečné heslo"
          v-model="password"
          type="password"
          :rules="[rules.notEmpty]"
        />
        <q-btn
          unelevated
          color="primary"
          type="submit"
          class="w-full h-[3.5rem] mt-3"
          :loading="loading"
          >Přihlásit</q-btn
        >
        <span class="text-xs text-gray-4 mt-3">{{ baseUrl }}</span>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { baseUrl } from '@/composables/useApi'
import { rules } from '@/utils'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { login } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref<string>('')
const password = ref<string>('')
const loading = ref(false)
const postLogin = () => {
  loading.value = true
  login(email.value, password.value)
    .then(() => {
      if (route.query.redirect) {
        const decodedRoute = JSON.parse(decodeURIComponent(route.query.redirect as string))
        router.push(decodedRoute)
      } else {
        router.push({ name: 'home' })
      }
    })
    .finally(() => (loading.value = false))
}
</script>
