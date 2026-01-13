<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { toast } from 'vue3-toastify'
import type { QTableColumn } from 'quasar'
import type { Product } from '../types/product'

const productsStore = useProductsStore()
const cartStore = useCartStore()

const showEditDialog = ref(false)
const editingProduct = ref<Product | null>(null)

const showQuantityDialog = ref(false)
const selectedProduct = ref<Product | null>(null)
const selectedQuantity = ref(1)

const columns: QTableColumn<Product>[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    sortable: true,
    align: 'left'
  },
  {
    name: 'thumbnail',
    label: 'Image',
    field: 'thumbnail',
    align: 'center'
  },
  {
    name: 'productName',
    label: 'Product Name',
    field: 'productName',
    sortable: true,
    align: 'left'
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left'
  },
  {
    name: 'category',
    label: 'Category',
    field: 'category',
    sortable: true,
    align: 'left'
  },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    sortable: true,
    align: 'right',
    format: (val: number) => `$${val.toFixed(2)}`
  },
  {
    name: 'stock',
    label: 'Stock',
    field: 'stock',
    sortable: true,
    align: 'center'
  },
  {
    name: 'manufacturer',
    label: 'Manufacturer',
    field: 'manufacturer',
    sortable: true,
    align: 'left'
  },
  {
    name: 'sku',
    label: 'SKU',
    field: 'sku',
    sortable: true,
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: () => 'actions',
    align: 'center'
  }
]

const openEditDialog = (product: Product) => {
  editingProduct.value = { ...product }
  showEditDialog.value = true
}

const closeDialog = () => {
  showEditDialog.value = false
  editingProduct.value = null
}

const saveProduct = () => {
  if (editingProduct.value) {
    try {
      const productExists = productsStore.products.find(p => p.id === editingProduct.value?.id)
      if (productExists) {
        productsStore.updateProduct(editingProduct.value)
        toast.success('Product updated successfully!')
        closeDialog()
      } else {
        toast.error('Product not found!')
      }
    } catch (error) {
      toast.error('Failed to update product')
      console.error('Error updating product:', error)
    }
  } else {
    toast.error('No product to update')
  }
}

const openQuantityDialog = (product: Product) => {
  selectedProduct.value = product
  selectedQuantity.value = 1
  showQuantityDialog.value = true
}

const closeQuantityDialog = () => {
  showQuantityDialog.value = false
  selectedProduct.value = null
  selectedQuantity.value = 1
}

const confirmAddToCart = () => {
  if (selectedProduct.value && selectedQuantity.value > 0 && selectedQuantity.value <= selectedProduct.value.stock) {
    try {
      cartStore.addToCart(selectedProduct.value, selectedQuantity.value)
      productsStore.reduceStock(selectedProduct.value.id, selectedQuantity.value)
      toast.success(`${selectedProduct.value.productName} (${selectedQuantity.value}x) added to cart!`)
      closeQuantityDialog()
    } catch (error) {
      toast.error('Failed to add product to cart')
      console.error('Error adding to cart:', error)
    }
  } else {
    if (!selectedProduct.value) {
      toast.error('No product selected')
    } else if (selectedQuantity.value <= 0) {
      toast.error('Quantity must be greater than 0')
    } else if (selectedQuantity.value > selectedProduct.value.stock) {
      toast.error('Insufficient stock available')
    }
  }
}

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<template>
  <div class="q-pa-md">
    <div class="text-h4 q-mb-lg text-center">Our Products</div>

    <div v-if="productsStore.error" class="q-mb-md">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Error loading products: {{ productsStore.error }}
        <template v-slot:action>
          <q-btn
            flat
            label="Retry"
            @click="productsStore.fetchProducts()"
          />
        </template>
      </q-banner>
    </div>

    <div class="table-wrapper">
      <q-table
        :rows="productsStore.products"
        :columns="columns"
        row-key="id"
        :loading="productsStore.loading"
        :pagination="{ rowsPerPage: 10 }"
        flat
        bordered
        class="products-table"
      >
      <template v-slot:body-cell-thumbnail="props">
        <q-td :props="props">
          <q-avatar square size="60px">
            <img :src="props.row.thumbnail" :alt="props.row.productName" />
          </q-avatar>
        </q-td>
      </template>

      <template v-slot:body-cell-stock="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.stock > 10 ? 'positive' : props.row.stock > 0 ? 'warning' : 'negative'"
          >
            {{ props.row.stock }} units
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              dense
              round
              color="primary"
              icon="shopping_cart"
              :disable="props.row.stock === 0"
              @click="openQuantityDialog(props.row)"
            >
              <q-tooltip>Add to Cart</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              round
              color="secondary"
              icon="edit"
              @click="openEditDialog(props.row)"
            >
              <q-tooltip>Edit Product</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm q-pa-lg">
          <q-icon name="inventory_2" size="2em" color="grey-5" />
          <span class="text-grey-7">No products available</span>
        </div>
      </template>
      </q-table>
    </div>

    <!-- Edit Product Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Edit Product</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </q-card-section>

        <q-card-section v-if="editingProduct">
          <!-- Product Image (Read-only for reference) -->
          <div class="flex flex-center q-mb-md">
            <q-avatar size="100px" square>
              <img :src="editingProduct.thumbnail" :alt="editingProduct.productName" />
            </q-avatar>
          </div>

          <!-- Editable Form Fields -->
          <q-form @submit="saveProduct" class="q-gutter-md">
            <q-input
              v-model="editingProduct.productName"
              label="Product Name"
              filled
              :rules="[val => !!val || 'Product name is required']"
            />

            <q-input
              v-model="editingProduct.description"
              label="Description"
              filled
              type="textarea"
              rows="3"
            />

            <q-input
              v-model="editingProduct.category"
              label="Category"
              filled
            />

            <q-input
              v-model.number="editingProduct.price"
              label="Price"
              filled
              type="number"
              step="0.01"
              prefix="$"
              :rules="[val => val >= 0 || 'Price must be positive']"
            />

            <q-input
              v-model.number="editingProduct.stock"
              label="Stock"
              filled
              type="number"
              suffix="units"
              :rules="[val => val >= 0 || 'Stock must be positive']"
            />

            <q-input
              v-model="editingProduct.manufacturer"
              label="Manufacturer"
              filled
            />

            <q-input
              v-model.number="editingProduct.sku"
              label="SKU"
              filled
              type="number"
            />

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="grey" @click="closeDialog" />
              <q-btn flat label="Save" color="primary" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Quantity Selection Dialog -->
    <q-dialog v-model="showQuantityDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add to Cart</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="closeQuantityDialog" />
        </q-card-section>

        <q-card-section v-if="selectedProduct">
          <div class="text-subtitle1 q-mb-md">{{ selectedProduct.productName }}</div>
          <div class="text-body2 text-grey-7 q-mb-md">
            Available stock:
            <q-badge :color="selectedProduct.stock > 10 ? 'positive' : selectedProduct.stock > 0 ? 'warning' : 'negative'">
              {{ selectedProduct.stock }} units
            </q-badge>
          </div>

          <q-input
            v-model.number="selectedQuantity"
            label="Quantity"
            type="number"
            filled
            :min="1"
            :max="selectedProduct.stock"
            :rules="[
              val => val > 0 || 'Quantity must be greater than 0',
              val => !selectedProduct || val <= selectedProduct.stock || `Cannot exceed available stock (${selectedProduct.stock})`
            ]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" @click="closeQuantityDialog" />
          <q-btn
            flat
            label="Add to Cart"
            color="primary"
            :disable="!selectedProduct || selectedQuantity <= 0 || selectedQuantity > selectedProduct.stock"
            @click="confirmAddToCart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.responsive-modal {
  margin: 0 auto;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.products-table {
  width: 100%;
  display: table;
}

@media (max-width: 599px) {
  .responsive-modal {
    margin: 1rem;
  }
  
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
  
  .products-table {
    min-width: 900px;
    width: 100%;
  }
  
  .products-table :deep(.q-table__container) {
    min-width: 900px;
  }
  
  .products-table :deep(.q-table) {
    min-width: 900px;
  }
}
</style>
