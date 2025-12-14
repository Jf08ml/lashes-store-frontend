<template>
  <q-drawer
    v-model="isOpen"
    side="right"
    overlay
    elevated
    :width="drawerWidth"
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

      <div v-else>
        <!-- Indicador de precio mayorista -->
        <div v-if="isWholesaleApplied" class="wholesale-banner">
          <q-icon name="stars" size="18px" />
          <span>¡Precio mayorista aplicado!</span>
        </div>

        <div class="cart-items">
          <div
            v-for="(item, index) in itemsWithPrices"
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

              <!-- Badge de precio mayorista -->
              <div v-if="item.hasWholesalePrice" class="wholesale-badge-item">
                <q-icon name="local_offer" size="12px" />
                <span>Precio mayorista</span>
              </div>

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
              <div v-if="item.hasWholesalePrice" class="total-with-discount">
                <span class="original-total">{{ formatPrice(item.regularPrice * item.quantity) }}</span>
                <span class="discounted-total">{{ formatPrice(item.totalPrice) }}</span>
              </div>
              <span v-else>{{ formatPrice(item.totalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con totales y checkout -->
    <div v-if="cartStore.hasItems" class="cart-footer">
      <q-separator />

      <div class="cart-summary">
        <div class="summary-row">
          <span class="summary-label">Subtotal productos</span>
          <div class="price-container">
            <span v-if="isWholesaleApplied" class="regular-price-small">{{ formatPrice(totalRegularPrice) }}</span>
            <span class="summary-amount">{{ formatPrice(totalWithWholesale) }}</span>
          </div>
        </div>
        <div v-if="isWholesaleApplied" class="summary-row discount-row">
          <span class="summary-label">
            <q-icon name="savings" size="14px" class="q-mr-xs" />
            Descuento mayorista
          </span>
          <span class="summary-amount discount-amount">-{{ formatPrice(wholesaleSavings) }}</span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">Total a pagar</span>
          <span class="summary-total">{{ formatPrice(totalWithWholesale) }}</span>
        </div>
      </div>

      <div class="checkout-actions">
        <q-btn
          unelevated
          no-caps
          color="black"
          class="checkout-btn"
          :loading="isProcessing"
          @click="goToCheckout"
        >
          <div class="checkout-btn-content">
            <q-icon name="lock" size="18px" />
            <span>Proceder al pago</span>
          </div>
        </q-btn>
        <q-btn
          flat
          no-caps
          size="sm"
          icon="delete_outline"
          label="Limpiar carrito"
          @click="clearCart"
          class="clear-btn"
        />
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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

// Drawer width responsivo
const drawerWidth = ref(400)
function updateDrawerWidth() {
  if (window.innerWidth <= 600) {
    drawerWidth.value = window.innerWidth
  } else {
    drawerWidth.value = 400
  }
}
onMounted(() => {
  updateDrawerWidth()
  window.addEventListener('resize', updateDrawerWidth)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDrawerWidth)
})

// Calcular si aplica precio mayorista
const isWholesaleApplied = computed(() => {
  const itemsMix = cartStore.items.filter(item => item.isWholesaleMix)

  if (itemsMix.length === 0) return false

  const itemsMixTotal = itemsMix.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const totalPrice = totalRegularPrice.value

  return (
    (itemsMixTotal >= itemsMix[0]?.wholesaleQuantity) ||
    totalPrice >= 100000
  )
})

// Items con precios calculados
const itemsWithPrices = computed(() => {
  return cartStore.items.map(item => {
    const regularPrice = item.priceUnit || item.price || 0
    let finalPrice = regularPrice

    // Aplicar precio mayorista si corresponde
    if (isWholesaleApplied.value && item.wholesalePrice && item.wholesalePrice > 0) {
      finalPrice = item.wholesalePrice
    }

    const hasWholesalePrice = finalPrice < regularPrice
    const totalPrice = finalPrice * (item.quantity || 1)

    return {
      ...item,
      regularPrice,
      finalPrice,
      hasWholesalePrice,
      totalPrice
    }
  })
})

// Total con precio regular
const totalRegularPrice = computed(() => {
  return cartStore.items.reduce((acc, item) => {
    const price = item.priceUnit || item.price || 0
    return acc + (price * (item.quantity || 1))
  }, 0)
})

// Total con precio mayorista aplicado
const totalWithWholesale = computed(() => {
  return itemsWithPrices.value.reduce((acc, item) => acc + item.totalPrice, 0)
})

// Ahorro por mayorista
const wholesaleSavings = computed(() => {
  if (!isWholesaleApplied.value) return 0
  return totalRegularPrice.value - totalWithWholesale.value
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
  try {
    router.push({
      path: "/payment",
      query: { type: "car", time: Date.now() },
    })
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

.wholesale-banner {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
}

.wholesale-banner span {
  flex: 1;
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
  position: relative;
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
  min-width: 0;
  overflow: hidden;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  word-break: break-word;
}

.wholesale-badge-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 4px;
  width: fit-content;
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
  white-space: nowrap;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
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
  flex-shrink: 0;
  text-align: right;
  min-width: 70px;
}

.total-with-discount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.original-total {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  white-space: nowrap;
}

.discounted-total {
  font-size: 14px;
  color: #4caf50;
  font-weight: 700;
  white-space: nowrap;
}

.cart-footer {
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.cart-summary {
  background: #ffffff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.regular-price-small {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
}

.discount-row {
  color: #4caf50;
}

.discount-row .summary-label {
  color: #4caf50;
  display: flex;
  align-items: center;
}

.discount-amount {
  color: #4caf50;
  font-weight: 700;
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.summary-amount {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.total-row {
  padding-top: 12px;
  margin-top: 8px;
  border-top: 2px solid #f0f0f0;
}

.total-row .summary-label {
  font-size: 1rem;
  color: #000;
  font-weight: 600;
}

.summary-total {
  font-size: 1.35rem;
  font-weight: 700;
  color: #000;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-btn {
  width: 100%;
  padding: 14px 20px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.checkout-btn:active {
  transform: translateY(0);
}

.checkout-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.clear-btn {
  color: #888;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #e74c3c;
}

/* Responsive styles */
@media (max-width: 600px) {
  .cart-header {
    padding: 12px;
  }

  .cart-title {
    font-size: 15px;
  }

  .cart-title .q-icon {
    font-size: 18px;
  }

  .cart-content {
    padding: 10px;
  }

  .wholesale-banner {
    padding: 8px 10px;
    font-size: 11px;
    margin-bottom: 10px;
  }

  .wholesale-banner .q-icon {
    font-size: 14px;
  }

  .cart-items {
    gap: 10px;
  }

  .cart-item {
    padding: 8px;
    gap: 8px;
  }

  .item-image {
    width: 50px;
    height: 50px;
  }

  .item-name {
    font-size: 12px;
    line-height: 1.3;
  }

  .wholesale-badge-item {
    font-size: 8px;
    padding: 2px 6px;
  }

  .wholesale-badge-item .q-icon {
    font-size: 10px;
  }

  .variant-chip {
    font-size: 9px;
    padding: 2px 4px;
  }

  .quantity-controls {
    gap: 4px;
    margin-top: 6px;
  }

  .quantity-controls .q-btn {
    padding: 4px;
  }

  .quantity {
    min-width: 16px;
    font-size: 12px;
  }

  .item-total {
    font-size: 12px;
    min-width: 60px;
  }

  .original-total {
    font-size: 9px;
  }

  .discounted-total {
    font-size: 12px;
  }

  .cart-footer {
    padding: 10px;
  }

  .cart-summary {
    padding: 10px;
    margin-bottom: 12px;
  }

  .summary-row {
    margin-bottom: 6px;
  }

  .summary-label {
    font-size: 0.8rem;
  }

  .summary-amount {
    font-size: 0.85rem;
  }

  .regular-price-small {
    font-size: 9px;
  }

  .summary-total {
    font-size: 1.1rem;
  }

  .checkout-btn {
    padding: 10px 14px;
  }

  .checkout-btn-content {
    font-size: 0.85rem;
    gap: 6px;
  }

  .checkout-btn-content .q-icon {
    font-size: 16px;
  }

  .clear-btn {
    font-size: 0.75rem;
  }
}

@media (max-width: 400px) {
  .cart-content {
    padding: 8px;
  }

  .cart-items {
    gap: 8px;
  }

  .cart-item {
    padding: 6px;
    gap: 6px;
    flex-wrap: wrap;
  }

  .item-image {
    width: 45px;
    height: 45px;
  }

  .item-details {
    flex: 1;
    min-width: calc(100% - 55px);
  }

  .item-name {
    font-size: 11px;
  }

  .wholesale-badge-item {
    font-size: 7px;
    padding: 1px 4px;
  }

  .variant-chip {
    font-size: 8px;
    padding: 1px 3px;
  }

  .quantity-controls {
    gap: 3px;
  }

  .quantity {
    min-width: 14px;
    font-size: 11px;
  }

  .item-total {
    font-size: 11px;
    min-width: 100%;
    text-align: left;
    margin-top: 4px;
  }

  .total-with-discount {
    flex-direction: row;
    gap: 6px;
    align-items: center;
  }

  .original-total {
    font-size: 9px;
  }

  .discounted-total {
    font-size: 11px;
  }

  .summary-label {
    font-size: 0.75rem;
  }

  .summary-amount {
    font-size: 0.8rem;
  }

  .summary-total {
    font-size: 1rem;
  }

  .checkout-btn {
    padding: 8px 12px;
  }

  .checkout-btn-content {
    font-size: 0.8rem;
    gap: 4px;
  }

  .checkout-btn-content .q-icon {
    font-size: 14px;
  }
}
</style>
