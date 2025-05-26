<template>
  <q-page padding class="flex flex-col">
    <div class="flex-1 flex flex-col">
      <q-stepper
        v-model="step"
        ref="stepper"
        animated
        class="shadow-none bg-transparent flex flex-col"
        contracted
        header-nav
      >
        <q-step
          :name="1"
          active-icon="description"
          icon="description"
          done-icon="description"
          title=""
          :done="step > 1"
          class="overflow-hidden"
        >
          STEP #1
        </q-step>

        <q-step :name="2" title="" active-icon="list" icon="list" done-icon="list">
          <!-- <EmptyBox v-if="isEmpty" title="Žádné položky"></EmptyBox> -->
          STEP #2
        </q-step>

        <q-step :name="3" title="" active-icon="check" icon="check" done-icon="check">
          <!-- <EmptyBox v-if="isEmpty" title="Žádné položky"></EmptyBox> -->
          STEP #3
        </q-step>
      </q-stepper>

      <div class="position-sticky mt-auto bg-slate-2">
        <transition name="slide-fade" mode="out-in">
          <div v-if="step === 1" class="flex h-[3rem]">
            <q-btn
              icon-right="arrow_forward"
              label="dále"
              @click="identificationNextStep"
              class="flex-1"
              outline
              color="primary"
            />
          </div>
          <div v-else-if="step == 2" class="flex h-[3rem] gap-2">
            <q-btn
              unelevated
              @click="step += 1"
              color="primary"
              label="uzavřít"
              class="mt-auto h-[3rem] flex-1"
              :disable="orderItems.length === 0"
            />
            <q-btn
              unelevated
              color="primary"
              outline
              label="přidat"
              icon="add"
              class="flex-[2]"
              @click="seamless = true"
            />
          </div>
          <div v-else class="flex h-[3rem] gap-2">
            <q-btn
              unelevated
              @click="submitQuicksell"
              color="positive"
              label="uzavřít"
              icon="check"
              class="mt-auto h-[3rem] flex-1"
            />
          </div>
        </transition>
      </div>
    </div>

    <!-- <AddItemDialog v-model="seamless" @submit="addItem" /> -->
    <AddItemDialogStepper v-model="seamless" @submit="addItem" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const step = ref(1)
</script>

<style lang="css" scoped></style>
