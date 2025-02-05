<script setup lang="ts">
</script>

<template>
  <q-page padding class="flex flex-col gap-2">
    <q-card flat bordered  @click="$router.push({ name: 'ro-list' })" class="p-5 flex items-center justify-center hover:cursor-pointer flex-1 bg-primary text-white">
      <span class="uppercase font-bold">příjemky</span>
    </q-card>
    <q-card flat bordered  @click="$router.push({ name: 'po-list' })" class="p-5 flex items-center justify-center hover:cursor-pointer flex-1 bg-green-4 text-white">
      <span class="uppercase font-bold">výdejky</span>
    </q-card>
    <q-card flat bordered  @click="$router.push({ name: 'quicksell' })" class="p-5 flex items-center justify-center hover:cursor-pointer flex-1 bg-red-4 text-white">
      <span class="uppercase font-bold">prodej</span>
    </q-card>
  </q-page>
</template>

