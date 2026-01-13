<script setup lang="ts">
import CartHeader from './components/CartHeader.vue'
</script>

<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>
            <router-link to="/" class="store-link">
              <q-icon name="store" size="sm" class="q-mr-sm" />
              My Store
            </router-link>
          </q-toolbar-title>
          <CartHeader />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.store-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.store-link:hover {
  opacity: 0.8;
}
</style>
