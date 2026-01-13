<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { toast } from 'vue3-toastify'
import type { QTableColumn } from 'quasar'
import type { CartItem } from '../types/cart'

const cartStore = useCartStore()

const handleRemoveFromCart = (productId: number) => {
  try {
    const cartItem = cartStore.items.find(item => item.product.id === productId)
    if (cartItem) {
      const productName = cartItem.product.productName
      cartStore.removeFromCart(productId)
      toast.success(`${productName} removed from cart`)
    } else {
      toast.error('Product not found in cart')
    }
  } catch (error) {
    toast.error('Failed to remove product from cart')
    console.error('Error removing from cart:', error)
  }
}

const columns: QTableColumn<CartItem>[] = [
  {
    name: 'thumbnail',
    label: 'Image',
    field: (row) => row.product.thumbnail,
    align: 'center'
  },
  {
    name: 'productName',
    label: 'Product',
    field: (row) => row.product.productName,
    align: 'left'
  },
  {
    name: 'price',
    label: 'Price',
    field: (row) => row.product.price,
    align: 'right',
    format: (val: number) => `$${val.toFixed(2)}`
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'quantity',
    align: 'center'
  },
  {
    name: 'subtotal',
    label: 'Subtotal',
    field: (row) => row.product.price * row.quantity,
    align: 'right',
    format: (val: number) => `$${val.toFixed(2)}`
  },
  {
    name: 'actions',
    label: 'Actions',
    field: () => 'actions',
    align: 'center'
  }
]
</script>

<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg text-center">Shopping Cart</div>

    <div class="table-wrapper">
      <q-table
        v-if="cartStore.items.length > 0"
        :rows="cartStore.items"
        :columns="columns"
        row-key="product.id"
        flat
        bordered
        hide-pagination
        :rows-per-page-options="[0]"
        class="cart-table"
      >
      <template v-slot:body-cell-thumbnail="props">
        <q-td :props="props">
          <q-avatar square size="60px">
            <img :src="props.row.product.thumbnail" :alt="props.row.product.productName" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            color="negative"
            icon="delete"
            @click="handleRemoveFromCart(props.row.product.id)"
          >
            <q-tooltip>Remove from cart</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      </q-table>
    </div>

    <div v-if="cartStore.items.length > 0" class="q-mt-md q-pa-md bg-grey-2 rounded-borders">
      <div class="row justify-end">
        <div class="text-h5 text-weight-bold">
          Total: ${{ cartStore.cartTotal.toFixed(2) }}
        </div>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-icon name="shopping_cart" size="4em" color="grey-5" />
      <div class="text-h6 q-mt-md text-grey-7">Your cart is empty</div>
      <q-btn
        flat
        color="primary"
        label="Continue Shopping"
        class="q-mt-md"
        to="/"
      />
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.cart-table {
  width: 100%;
  display: table;
}

@media (max-width: 599px) {
  .table-wrapper {
    overflow-x: scroll;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    width: calc(100vw - 32px);
    margin-left: -16px;
    margin-right: -16px;
    padding: 0 16px;
  }
  
  .cart-table {
    min-width: 650px;
    width: 100%;
  }
  
  .cart-table :deep(.q-table__container) {
    min-width: 650px;
  }
  
  .cart-table :deep(.q-table) {
    min-width: 650px;
  }
}
</style>
