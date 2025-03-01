<template>
    <div class="flex flex-col border-gray-3 border-solid border-1 border-rounded-md shadow-md overflow-hidden">
      <div class="ml-auto flex flex-col p-2 gap-1 items-end">
        <q-skeleton width="5rem" />
        <q-skeleton width="7rem" />
      </div>
      <div class="flex flex-col text-left p-2 gap-1 mt-5">
        <q-skeleton width="8rem" height=".6rem" />
        <q-skeleton width="10rem" height="1rem" />
        <q-skeleton width="12rem" height="1.4rem" />
      </div>
      <q-skeleton type="QBtn" square width="100%" height="3rem" />
    </div>
</template>

<script setup lang="ts"></script>

<style lang="sass" scoped></style>
