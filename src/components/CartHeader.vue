<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <q-btn flat round dense icon="shopping_cart" to="/cart">
    <q-badge color="red" floating>
      {{ cartStore.cartCount }}
    </q-badge>
  </q-btn>
</template>
