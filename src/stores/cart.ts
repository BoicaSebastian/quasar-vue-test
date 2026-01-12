import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  })

  function addToCart(product: Product, quantity: number = 1) {
    const existingItem = items.value.find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        product,
        quantity
      })
    }
  }

  return {
    items,
    cartCount,
    cartTotal,
    addToCart
  }
})
