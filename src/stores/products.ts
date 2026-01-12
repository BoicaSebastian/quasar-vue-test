import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '../types/product'
import { fetchProducts as fetchProductsApi } from '../services/products'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
      products.value = await fetchProductsApi()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function updateProduct(updatedProduct: Product) {
    const index = products.value.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    clearError,
    updateProduct
  }
})
