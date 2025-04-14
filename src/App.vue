<template>
  <q-layout view="lHh LpR fFf" class="font-sans bg-slate-2">
    <!-- <LoadingWindowBlocker /> -->
    <q-header class="bg-slate-2 text-dark">
      <q-toolbar class="app-page">
        <q-toolbar-title>
          <!-- <q-avatar class="mr-2">
            <img alt="Vue logo" class="logo bg-primary p-2" src="/logo.svg" />
          </q-avatar> -->
          <span class="text-primary font-bold ml-1 uppercase">{{ title }}</span>
        </q-toolbar-title>

        <!-- <q-btn
          dense
          flat
          :icon="isDark ? 'i-hugeicons-moon-02' : 'i-hugeicons-sun-01'"
          @click="toggle"
          class="mr-3"
        /> -->
        <q-btn dense flat :icon="rightDrawerOpen ? 'close' : 'menu'" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="left" overlay bordered class="bg-slate-2">
      <div
        class="absolute-top bg-primary text-white flex justify-between items-center px-5"
        style="height: 80px"
      >
        <div v-if="isLoggedIn" class="bg-transparent flex flex-col">
          <div class="text-weight-bold">{{ loggedUser }}</div>
          <span class="opacity-[0.5]">Přihlášení vyprší:</span>
          <span class="text-xs"
            >{{ expiresAt.toLocaleDateString() }} - {{ expiresAt.toLocaleTimeString() }}</span
          >
        </div>
        <q-btn v-if="isLoggedIn" flat dense icon="logout" @click="clickLogout" />
        <q-btn v-else flat dense label="přihlásit" icon="login" @click="clickLogin" />
      </div>
      <q-scroll-area style="height: calc(100% - 80px); margin-top: 80px">
        <q-list padding class="menu-list">
          <q-item :to="{ name: 'home' }" clickable v-ripple :disable="!isLoggedIn">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section> Domů </q-item-section>
          </q-item>
          <q-item :to="{ name: 'ro-list' }" clickable v-ripple :disable="!isLoggedIn">
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>

            <q-item-section> Příjemky </q-item-section>
          </q-item>

          <q-item :to="{ name: 'po-list' }" clickable v-ripple :disable="!isLoggedIn">
            <q-item-section avatar>
              <q-icon name="output" />
            </q-item-section>

            <q-item-section> Výdejky </q-item-section>
          </q-item>

          <q-item :to="{ name: 'quicksell' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="paid" />
            </q-item-section>

            <q-item-section> Prodej </q-item-section>
          </q-item>

          <q-item :to="{ name: 'settings' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section> Nastavení </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="app-page">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <KeepAlive exclude="StockinBaseView,StockoutBaseView">
            <Suspense>
              <!-- hlavní obsah -->
              <component :is="Component"></component>
              <template #fallback>
                <q-page class="grid justify-center items-center">
                  <div class="flex flex-col items-center gap-2">
                    <q-spinner color="primary" size="4rem" :thickness="2"></q-spinner>
                    <h1 class="uppercase text-xl text-primary">Načítám...</h1>
                  </div>
                </q-page>
              </template>
            </Suspense>
          </KeepAlive>
        </template>
      </RouterView>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import { useQuasar, Notify, LoadingBar } from 'quasar'
import { useAuth } from './composables/useAuth'
import LoadingWindowBlocker from './components/LoadingWindowBlocker.vue'

// import { useDark } from '@/composables/dark'
// const { isDark, toggle } = useDark()

Notify.setDefaults({
  position: 'top',
  classes: 'w-full text-md font-bold',
  progress: true,
  icon: 'chat_bubble',
  timeout: 3000
})

LoadingBar.setDefaults({
  size: '8px',
  skipHijack: false,
  position: 'top',
  color: 'primary'
})

const router = useRouter()
const { logout, loggedUser, expiresAt, isLoggedIn } = useAuth()

const clickLogout = () => {
  logout()
  router.push({ name: 'login' })
}

const clickLogin = () => {
  router.push({ name: 'login' })
  rightDrawerOpen.value = false
}

const { currentRoute } = useRouter()
const title = computed(() => {
  if (currentRoute.value.name === 'ro-printout') {
    return 'Příjemka - Tisk Štítků'
  }

  if (currentRoute.value.name == 'po-list') {
    return 'Výdejky'
  }

  if (currentRoute.value.name == 'po-detail') {
    return 'Výdejka'
  }

  if (currentRoute.value.name == 'po-allocation') {
    return 'Výdejka'
  }

  if (currentRoute.value.name == 'ro-list') {
    return 'Příjemky'
  }

  if (currentRoute.value.name == 'ro-detail') {
    return 'Příjemka'
  }

  if (currentRoute.value.name == 'ro-allocation') {
    return 'Příjemka'
  }

  if (currentRoute.value.name == 'settings') {
    return 'Nastavení'
  }

  if (currentRoute.value.name == 'quicksell') {
    return 'Prodej'
  }

  return 'Sklad'
})

const rightDrawerOpen = ref(false)
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>

<style lang="css">
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* QUASAR OVERRIDES */
.q-stepper--horizontal .q-stepper__step-inner {
  padding-inline: 0px !important;
  padding-block: 8px !important;
}
</style>
