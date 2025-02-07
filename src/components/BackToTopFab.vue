<template>
  <q-page-sticky position="bottom-left" :offset="[8, 8]">
    <q-btn v-if="scrolledPerc > 1" fab size=".5rem" icon="arrow_upward" color="primary" @click="y = 0" />
  </q-page-sticky>
</template>
<script setup lang="ts">
import { useWindowSize, useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'

const { height } = useWindowSize()
const { y } = useWindowScroll({ behavior: 'smooth' })
const scrolledPerc = computed(() => y.value / height.value)
</script>

<style lang="scss" scoped></style>
