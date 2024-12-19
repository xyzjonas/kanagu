<template>
    <Card class="bg-secondary text-white">
        <div class="flex flex-col">
            <span class="text-2xl  text-bold uppercase mb-3">Příjem</span>
            <span class="text-gray-3">{{ item.item.id }}</span>
            <span class="text-lg">{{ item.item.name }}</span>
            <span class="text-xs text-gray-3">MJ = 100ks</span>
        </div>
    </Card>
</template>

<script setup lang="ts">
import type { OrderItem } from '@/composables/useApi';
import Card from './Card.vue';

defineProps<{
    item: OrderItem
}>()
</script>

<style lang="sass" scoped>

</style>