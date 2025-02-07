<script setup lang="ts">
</script>

<template>
  <q-page padding class="flex flex-col gap-5 items-center justify-center">
    <div class="flex">
      <q-card flat bordered @click="$router.push({ name: 'ro-list' })" class="p-5 flex items-center justify-center hover:cursor-pointer flex-1 bg-primary text-white h-xs w-xs">
        <span class="uppercase font-bold">příjemky</span>
      </q-card>
    </div>
    <div class="flex gap-5">
      <q-card flat bordered @click="$router.push({ name: 'po-list' })" class="p-5 flex items-center justify-center hover:cursor-pointer flex-1 bg-green-4 text-white h-xs w-xs">
        <span class="uppercase font-bold">výdejky</span>
      </q-card>
      <q-card flat bordered  @click="$router.push({ name: 'quicksell' })" class="p-5 flex items-center justify-center hover:cursor-pointer flex-1 bg-red-4 text-white h-xs w-xs">
        <span class="uppercase font-bold">prodej</span>
      </q-card>
    </div>
  </q-page>
</template>

