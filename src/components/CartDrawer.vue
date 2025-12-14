<template>
  <q-drawer
    v-model="isOpen"
    side="right"
    overlay
    elevated
    :width="400"
    :breakpoint="600"
    class="cart-drawer"
  >
    <div class="cart-header">
      <div class="cart-title">
        <q-icon name="shopping_cart" size="24px" />
        <span>Carrito ({{ cartStore.itemCount }})</span>
      </div>
      <q-btn
        flat
        round
        dense
        icon="close"
        @click="closeCart"
        class="close-btn"
      />
    </div>

    <q-separator />

    <!-- Lista de items -->
    <div class="cart-content">
      <div v-if="!cartStore.hasItems" class="empty-cart">
        <q-icon name="shopping_cart_off" size="64px" color="grey-5" />
        <p class="text-grey-6">Tu carrito está vacío</p>
        <q-btn
          color="black"
          label="Ir a la tienda"
          @click="goToStore"
          class="store-btn"
        />
      </div>

      <div v-else class="cart-items">
        <div
          v-for="(item, index) in cartStore.items"
          :key="`${item._id}-${index}`"
          class="cart-item"
        >
          <div class="item-image">
            <img
              :src="item.image || '/placeholder.jpg'"
              :alt="item.name"
              @error="handleImageError"
            />
          </div>

          <div class="item-details">
            <h6 class="item-name">{{ item.name }}</h6>

            <!-- Variantes/Referencias -->
            <div v-if="item.references && item.references.length" class="item-variants">
              <span
                v-for="ref in item.references"
                :key="ref.name"
                class="variant-chip"
              >
                {{ ref.name }}: {{ ref.selectedOption }}
              </span>
            </div>

            <div class="item-price">
              {{ formatPrice(item.priceUnit || item.price || 0) }}
            </div>

            <!-- Controles de cantidad -->
            <div class="quantity-controls">
              <q-btn
                flat
                round
                dense
                icon="remove"
                size="sm"
                @click="decreaseQuantity(index)"
                :disable="item.quantity <= 1"
              />
              <span class="quantity">{{ item.quantity || 1 }}</span>
              <q-btn
                flat
                round
                dense
                icon="add"
                size="sm"
                @click="increaseQuantity(index)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                size="sm"
                color="negative"
                @click="removeItem(index)"
                class="remove-btn"
              />
            </div>
          </div>

          <div class="item-total">
            {{ formatPrice((item.priceUnit || item.price || 0) * (item.quantity || 1)) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con totales y checkout -->
    <div v-if="cartStore.hasItems" class="cart-footer">
      <q-separator />

      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span class="amount">{{ formatPrice(cartStore.subtotal) }}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total:</span>
          <span class="amount">{{ formatPrice(cartStore.total) }}</span>
        </div>
      </div>

      <div class="checkout-actions">
        <q-btn
          color="black"
          label="Proceder al pago"
          icon="payment"
          @click="goToCheckout"
          class="checkout-btn"
          :loading="isProcessing"
        />
        <q-btn
          flat
          label="Limpiar carrito"
          @click="clearCart"
          class="clear-btn"
        />
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarStore } from 'src/stores/car'
import { Notify } from 'quasar'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Composables
const router = useRouter()
const cartStore = useCarStore()

// State
const isProcessing = ref(false)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const closeCart = () => {
  isOpen.value = false
}

const goToStore = () => {
  closeCart()
  router.push('/catalogo')
}

const goToCheckout = () => {
  closeCart()
  console.log('CartDrawer: Navegando a página de pago...')
  try {
    router.push({
      path: "/payment",
      query: { type: "car", time: Date.now() },
    })
    console.log('CartDrawer: Navegación exitosa')
  } catch (error) {
    console.error('CartDrawer: Error en navegación:', error)
  }
}

const increaseQuantity = (index) => {
  const currentQuantity = cartStore.items[index].quantity || 1
  cartStore.updateQuantity(index, currentQuantity + 1)
}

const decreaseQuantity = (index) => {
  const currentQuantity = cartStore.items[index].quantity || 1
  if (currentQuantity > 1) {
    cartStore.updateQuantity(index, currentQuantity - 1)
  }
}

const removeItem = (index) => {
  cartStore.removeItem(index)
  Notify.create({
    type: 'positive',
    message: 'Producto eliminado del carrito',
    position: 'top'
  })
}

const clearCart = () => {
  cartStore.clearCart()
  Notify.create({
    type: 'positive',
    message: 'Carrito limpiado',
    position: 'top'
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price)
}

const handleImageError = (event) => {
  event.target.src = '/placeholder.jpg'
}
</script>

<style scoped>
.cart-drawer {
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8f9fa;
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
}

.empty-cart p {
  margin: 16px 0;
  font-size: 16px;
}

.store-btn {
  margin-top: 16px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.variant-chip {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  color: #666;
}

.item-price {
  font-size: 13px;
  color: #666;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
}

.remove-btn {
  margin-left: auto;
}

.item-total {
  font-weight: 600;
  font-size: 14px;
  align-self: flex-start;
}

.cart-footer {
  background: #f8f9fa;
  padding: 16px;
}

.cart-summary {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.total-row {
  font-weight: 600;
  font-size: 16px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
  margin-bottom: 0;
}

.amount {
  font-weight: 600;
}

.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  font-weight: 600;
}

.clear-btn {
  color: #666;
}
</style>
