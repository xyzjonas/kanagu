<template>
  <div class="flex flex-col gap-5 items-center justify-center h-md">
    <span class="text-3xl font-bold">404 | NOT FOUND</span>
    <div>
      <q-btn flat icon="i-hugeicons-arrow-turn-backward" label="zpět" @click="$router.back()"/>
      <!-- <q-btn unelevated color="secondary" label="domů" @click="$router.back()"/> -->
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped></style>
