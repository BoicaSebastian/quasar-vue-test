<script setup lang="ts">
import { useCounterStore } from '../stores/counter'

defineProps<{
  msg: string
}>()

const counterStore = useCounterStore()
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="counterStore.increment()">count is {{ counterStore.count }}</button>
    <p>Double count: {{ counterStore.doubleCount }}</p>
    <div style="margin-top: 10px;">
      <button type="button" @click="counterStore.decrement()" style="margin-right: 8px;">Decrement</button>
      <button type="button" @click="counterStore.reset()">Reset</button>
    </div>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
