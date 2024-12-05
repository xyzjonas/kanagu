<template>
  <q-layout view="lhh LpR fFf" class="font-sans">
    <q-header class="bg-white text-dark shadow-sm">
      <q-toolbar class="app-page">
        <q-toolbar-title>
          <q-avatar class="mr-2">
            <img alt="Vue logo" class="logo bg-primary p-2" src="/logo.svg" />
          </q-avatar>
          <span class="text-primary font-bold ml-1">Application</span>
        </q-toolbar-title>

        <!-- <q-btn
          dense
          flat
          :icon="isDark ? 'i-hugeicons-moon-02' : 'i-hugeicons-sun-01'"
          @click="toggle"
          class="mr-3"
        /> -->
        <q-btn dense flat :icon="rightDrawerOpen ? 'i-hugeicons-cancel-01' : 'i-hugeicons-menu-07'" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="left" overlay bordered>
      <q-scroll-area class="fit">
          <q-list padding class="menu-list">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section>
                Inbox
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section>
                Star
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                Send
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                Drafts
              </q-item-section>
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
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import { useQuasar } from 'quasar'
import { useDark } from '@/composables/dark'

const { isDark, toggle } = useDark()

const $q = useQuasar()
$q.iconMapFn = (iconName) => {
  return {
    cls: iconName
  }
}

const rightDrawerOpen = ref(false)
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
