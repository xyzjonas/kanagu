<template>
  <q-layout view="lhh LpR fFf" class="font-sans">
    <q-header class="bg-white text-dark shadow-sm">
      <q-toolbar class="app-page">
        <q-toolbar-title>
          <q-avatar class="mr-2">
            <img alt="Vue logo" class="logo bg-primary p-2" src="/logo.svg" />
          </q-avatar>
          <span class="text-primary font-bold ml-1">{{ title }}</span>
        </q-toolbar-title>

        <!-- <q-btn
          dense
          flat
          :icon="isDark ? 'i-hugeicons-moon-02' : 'i-hugeicons-sun-01'"
          @click="toggle"
          class="mr-3"
        /> -->
        <q-btn
          dense
          flat
          :icon="rightDrawerOpen ? 'i-hugeicons-cancel-01' : 'i-hugeicons-menu-07'"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="left" overlay bordered>
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item :to="{ name: 'ro-list' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="i-hugeicons-package-receive" />
            </q-item-section>

            <q-item-section> Příjemky </q-item-section>
          </q-item>

          <q-item :to="{ name: 'po-list' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="i-hugeicons-share-03" />
            </q-item-section>

            <q-item-section> Výdejky </q-item-section>
          </q-item>

          <q-item :to="{ name: 'quicksell' }" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="i-hugeicons-wallet-03" />
            </q-item-section>

            <q-item-section> Prodej </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="app-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import { useQuasar } from 'quasar'
import { useDark } from '@/composables/dark'

const { isDark, toggle } = useDark()

const $q = useQuasar()
$q.iconMapFn = (iconName) => {
  if (iconName.startsWith('i-hugeicons')) {
    return {
      cls: iconName
    }
  }
}

const { currentRoute } = useRouter()
const title = computed(() => {
  if (currentRoute.value.name == 'po-list') {
    return 'Výdejky'
  }

  if (currentRoute.value.name == 'po-detail') {
    return 'Výdejka'
  }

  if (currentRoute.value.name == 'ro-list') {
    return 'Příjemky'
  }

  if (currentRoute.value.name == 'ro-detail') {
    return 'Příjemka'
  }
  
  return "Sklad"
})

const rightDrawerOpen = ref(false)
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
