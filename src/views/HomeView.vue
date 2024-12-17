<script setup lang="ts">
</script>

<template>
  <q-page padding class="flex flex-col gap-2">
    
    <q-card flat bordered  @click="$router.push({ name: 'ro-list' })" class="p-5 flex items-center justify-center hover:cursor-pointer">
      <span class="uppercase font-bold text-primary">příjemky</span>
    </q-card>
    <q-card flat bordered  @click="$router.push({ name: 'po-list' })" class="p-5 flex items-center justify-center hover:cursor-pointer">
      <span class="uppercase font-bold text-green">výdejky</span>
    </q-card>
    <q-card flat bordered  @click="$router.push({ name: 'quicksell' })" class="p-5 flex items-center justify-center hover:cursor-pointer">
      <span class="uppercase font-bold text-blue">prodej</span>
    </q-card>
  </q-page>
</template>

