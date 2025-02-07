<template>
  <div class="flex flex-col gap-5 items-center justify-center h-md">
    <div class="flex gap-3">
      <span class="text-3xl font-bold">404</span>
      <q-separator vertical />
      <span class="text-3xl font-bold">NOT FOUND</span>
    </div>
    <div>
      <q-btn flat icon="west" label="zpět" @click="$router.back()"/>
      <!-- <q-btn unelevated color="secondary" label="domů" @click="$router.back()"/> -->
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped></style>
