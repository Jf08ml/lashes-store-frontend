<template>
  <q-page class="payment-page">
    <div class="payment-container">
      <!-- Primera columna -->
      <div class="payment-main">
        <!-- Sección de dirección de entrega -->
        <DeliveryAddress @updateDeliveryAddress="updateDeliveryAddress" />

        <!-- Sección de método de pago -->
        <PaymentMethod />

        <!-- Sección de lista de cosas a comprar -->
        <ListItems
          :listItems="listItems"
          @reCalculate="reCalculate"
          @removeItem="removeItem"
        />
      </div>

      <!-- Segunda columna - Resumen -->
      <div class="payment-sidebar">
        <div v-if="!isMobile" class="summary-card-wrapper">
          <q-card class="summary-card">
            <q-card-section class="summary-header">
              <div class="summary-title">Resumen de compra</div>
            </q-card-section>

            <q-separator />

            <q-card-section class="summary-content">
              <!-- Indicador de precio mayorista -->
              <div v-if="isWholesaleApplied" class="wholesale-badge">
                <q-icon name="stars" size="18px" />
                <span>¡Precio mayorista aplicado!</span>
              </div>

              <div class="summary-row">
                <span class="summary-label">Productos</span>
                <div class="price-container">
                  <span v-if="isWholesaleApplied" class="regular-price">{{ formatPrice(getTotalRegularPrice()) }}</span>
                  <span class="summary-amount">{{ formatPrice(getTotalProducts()) }}</span>
                </div>
              </div>
              <div v-if="isWholesaleApplied" class="summary-row discount-row">
                <span class="summary-label">
                  <q-icon name="savings" size="16px" class="q-mr-xs" />
                  Descuento mayorista
                </span>
                <span class="summary-amount discount-amount">-{{ formatPrice(wholesaleSavings) }}</span>
              </div>
              <div
                v-if="deliveryAddress.city && deliveryAddress.city.length >= 4"
                class="summary-row"
              >
                <span class="summary-label">Envío</span>
                <span class="summary-amount">{{ shippingCost }}</span>
              </div>
              <div v-if="cuponDiscount > 0" class="summary-row discount-row">
                <span class="summary-label">
                  <q-icon name="local_offer" size="16px" class="q-mr-xs" />
                  Descuento
                </span>
                <span class="summary-amount discount-amount">-{{ formatPrice(cuponDiscount) }}</span>
              </div>

              <q-separator class="q-my-md" />

              <div class="summary-total-row">
                <span class="total-label">Total a pagar</span>
                <span class="total-amount">{{ formatPrice(totalPayment) }}</span>
              </div>

              <div v-if="deliveryAddress.city.toLowerCase() === 'neiva'" class="delivery-type-section">
                <q-select
                  outlined
                  v-model="deliveryType"
                  :options="optionsDeliveryType"
                  label="Tipo de entrega"
                  class="delivery-select"
                />
              </div>

              <div class="coupon-section">
                <div class="coupon-input-wrapper">
                  <q-input
                    outlined
                    v-model="cupon"
                    label="Cupón de descuento"
                    :disable="inputCuponDisabled"
                    class="coupon-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="local_offer" />
                    </template>
                  </q-input>
                  <q-btn
                    v-if="!inputCuponDisabled"
                    @click="aplicarDescuento()"
                    unelevated
                    label="Aplicar"
                    color="black"
                    class="coupon-btn"
                  />
                  <q-btn
                    v-else
                    @click="inputCuponDisabled = false; cupon = ''; cuponDiscount = 0"
                    flat
                    label="Quitar"
                    color="grey-8"
                    class="coupon-btn"
                  />
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="validation-section">
              <div class="validation-item">
                <q-icon
                  :name="showSummaryDetails ? 'check_circle' : 'error'"
                  :color="showSummaryDetails ? 'positive' : 'negative'"
                  size="20px"
                />
                <span class="validation-text">{{
                  showSummaryDetails ? 'Dirección completa' : 'Falta dirección'
                }}</span>
              </div>
              <div
                v-if="deliveryAddress.city.toLowerCase() === 'neiva'"
                class="validation-item"
              >
                <q-icon
                  :name="deliveryType ? 'check_circle' : 'error'"
                  :color="deliveryType ? 'positive' : 'negative'"
                  size="20px"
                />
                <span class="validation-text">{{
                  deliveryType ? 'Entrega seleccionada' : 'Falta tipo de entrega'
                }}</span>
              </div>
              <div v-if="listItems.length === 0" class="validation-item">
                <q-icon name="error" color="negative" size="20px" />
                <span class="validation-text">Carrito vacío</span>
              </div>
            </q-card-section>

            <q-card-actions class="q-pa-md">
              <q-btn
                :disable="disableSendOrder || isProcessing"
                @click="sendOrder()"
                unelevated
                no-caps
                color="black"
                class="checkout-btn-main"
              >
                <div class="checkout-content">
                  <q-icon v-if="!isProcessing" name="lock" size="20px" />
                  <q-spinner v-else size="20px" color="black" />
                  <span v-if="!isProcessing">Realizar pedido</span>
                  <span v-else>Procesando...</span>
                </div>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>

        <!-- Mobile Bottom Summary -->
        <div v-else class="mobile-summary">
          <q-card>
            <!-- Header móvil -->
            <q-card-section class="mobile-summary-header">
              <div class="mobile-summary-title">Resumen de compra</div>
            </q-card-section>

            <q-separator />

            <q-slide-transition>
              <div v-show="showSummaryDetails">
                <!-- Badge mayorista móvil -->
                <div v-if="isWholesaleApplied" class="wholesale-badge-mobile">
                  <q-icon name="stars" size="16px" />
                  <span>¡Precio mayorista!</span>
                </div>

                <div class="mobile-summary-details">
                  <div class="summary-row">
                    <span class="summary-label">Productos</span>
                    <div class="price-container-mobile">
                      <span v-if="isWholesaleApplied" class="regular-price-mobile">{{ formatPrice(getTotalRegularPrice()) }}</span>
                      <span class="summary-amount">{{ formatPrice(getTotalProducts()) }}</span>
                    </div>
                  </div>
                  <div v-if="isWholesaleApplied" class="summary-row">
                    <span class="summary-label">
                      <q-icon name="savings" size="14px" />
                      Ahorro mayorista
                    </span>
                    <span class="discount-amount">-{{ formatPrice(wholesaleSavings) }}</span>
                  </div>
                  <div
                    v-if="deliveryAddress.city && deliveryAddress.city.length >= 4"
                    class="summary-row"
                  >
                    <span class="summary-label">Envío</span>
                    <span class="summary-amount">{{ shippingCost }}</span>
                  </div>
                  <div v-if="cuponDiscount > 0" class="summary-row">
                    <span class="summary-label">Descuento</span>
                    <span class="discount-amount">-{{ formatPrice(cuponDiscount) }}</span>
                  </div>
                </div>
                <div v-if="deliveryAddress.city.toLowerCase() === 'neiva'" class="q-px-md q-pb-md">
                  <q-select
                    outlined
                    dense
                    v-model="deliveryType"
                    :options="optionsDeliveryType"
                    label="Seleccione tipo de domicilio"
                  />
                </div>
                <div class="coupon-mobile-section">
                  <q-input
                    dense
                    outlined
                    v-model="cupon"
                    label="Cupón de descuento"
                    :disable="inputCuponDisabled"
                    class="coupon-input-mobile"
                  >
                    <template v-slot:prepend>
                      <q-icon name="local_offer" size="18px" />
                    </template>
                  </q-input>
                  <q-btn
                    v-if="!inputCuponDisabled"
                    @click="aplicarDescuento()"
                    unelevated
                    size="sm"
                    label="Aplicar"
                    color="black"
                  />
                  <q-btn
                    v-else
                    @click="inputCuponDisabled = false; cupon = ''; cuponDiscount = 0"
                    flat
                    size="sm"
                    label="Quitar"
                    color="grey-8"
                  />
                </div>
              </div>
            </q-slide-transition>

            <q-card-section class="mobile-footer">
              <div class="mobile-total-row">
                <div class="mobile-total-left">
                  <span class="mobile-total-label">Total a pagar</span>
                  <q-btn
                    flat
                    dense
                    @click="showSummaryDetails = !showSummaryDetails"
                    :icon="showSummaryDetails ? 'expand_less' : 'expand_more'"
                    size="sm"
                  />
                </div>
                <span class="mobile-total-amount">{{ formatPrice(totalPayment) }}</span>
              </div>

              <div class="mobile-validations">
                <div class="validation-item-small">
                  <q-icon
                    :name="showSummaryDetails ? 'check_circle' : 'error'"
                    :color="showSummaryDetails ? 'positive' : 'negative'"
                    size="16px"
                  />
                  <span>{{ showSummaryDetails ? 'Dirección OK' : 'Falta dirección' }}</span>
                </div>
                <div
                  v-if="deliveryAddress.city.toLowerCase() === 'neiva'"
                  class="validation-item-small"
                >
                  <q-icon
                    :name="deliveryType ? 'check_circle' : 'error'"
                    :color="deliveryType ? 'positive' : 'negative'"
                    size="16px"
                  />
                  <span>{{ deliveryType ? 'Entrega OK' : 'Falta entrega' }}</span>
                </div>
                <div v-if="listItems.length === 0" class="validation-item-small">
                  <q-icon name="error" color="negative" size="16px" />
                  <span>Carrito vacío</span>
                </div>
              </div>

              <q-btn
                :disable="disableSendOrder || isProcessing"
                @click="sendOrder()"
                unelevated
                no-caps
                color="black"
                class="checkout-btn-mobile"
              >
                <q-icon v-if="!isProcessing" name="lock" size="18px" class="q-mr-sm" />
                <q-spinner v-else size="18px" color="black" class="q-mr-sm" />
                <span v-if="!isProcessing">Realizar pedido</span>
                <span v-else>Procesando...</span>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { searchReward } from "src/services/rewardService";
import { createOnlineOrder } from "src/services/onlineOrderService";
import { formatPrice } from "src/utils/utilsFunctions";
import { useCarStore } from "src/stores/car";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import DeliveryAddress from "./components/DeliveryAddress.vue";
import PaymentMethod from "./components/PaymentMethod.vue";
import ListItems from "./components/ListsItems.vue";
import { Notify } from "quasar";

const carStore = useCarStore();
const $route = useRoute();
const $router = useRouter();
const deliveryAddress = ref({
  contactName: "",
  phoneContact: "",
  department: "",
  city: "",
  neighborhood: "",
  address: "",
});

const cupon = ref("");
const cuponDiscount = ref(0);
const inputCuponDisabled = ref(false);

const showSummaryDetails = ref(false);
const isMobile = ref(false);

const listItems = ref([]);

const deliveryType = ref(null);
const optionsDeliveryType = [
  "Entrega normal (1 día habil sin costo)",
  "Entrega inmediata ( 10 a 30 mins, costo según domicilio)",
];

// Configuración de costos de envío
const shippingRates = {
  neiva: {
    normal: 0,
    express: 5000 // Costo de entrega inmediata en Neiva
  },
  national: 20000 // Costo de envío a otras ciudades
};

const disableSendOrder = computed(() => {
  listItems.value.length;
  if (
    deliveryAddress.value.address === "" ||
    (deliveryAddress.value.city.toLowerCase() === "neiva" &&
      deliveryType.value === null) ||
    listItems.value.length === 0
  ) {
    return true;
  } else {
    return false;
  }
});

function updateDrawerWidth() {
  const breakpoint = 1024;
  const mobile = window.innerWidth < breakpoint;
  isMobile.value = mobile;
}

const removeItem = (index) => {
  carStore.removeItem(index);
  asignItemOrder();
};

const reCalculate = () => {
  const totalPrice = getTotalProducts();
  const itemsMix = listItems.value
    .filter((item) => item.isWholesaleMix)
    .reduce((acumulator, item) => acumulator + item.quantity, 0);

  const updatedItems = listItems.value.map((item) => {
    let newPrice = item.priceUnit * item.quantity;

    if (
      (item.isWholesaleMix && itemsMix >= item.wholesaleQuantity) ||
      totalPrice >= 100000
    ) {
      if (item.wholesalePrice > 0) {
        newPrice = item.wholesalePrice * item.quantity;
      }
    }

    return { ...item, totalPrice: newPrice };
  });

  const newTotalPrice = updatedItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  const finalItems = updatedItems.map((item) => {
    let newPrice = item.priceUnit * item.quantity;

    if (
      (item.isWholesaleMix && itemsMix >= item.wholesaleQuantity) ||
      newTotalPrice >= 100000
    ) {
      if (item.wholesalePrice > 0) {
        newPrice = item.wholesalePrice * item.quantity;
      }
    }

    return { ...item, totalPrice: newPrice };
  });

  listItems.value = finalItems;
};

onMounted(() => {
  asignItemOrder();
  updateDrawerWidth();
  window.addEventListener("resize", updateDrawerWidth);
});

const updateDeliveryAddress = (newAddress) => {
  deliveryAddress.value = { ...newAddress };
  showSummaryDetails.value = true;
};

const asignItemOrder = () => {
  if ($route.query.type === "buy") {
    listItems.value = [...carStore.order];
  } else {
    let items = [...carStore.items];

    const itemsMixFilter = items.filter((item) => item.isWholesaleMix);

    const itemsMixTotal = itemsMixFilter.reduce(
      (acumulator, item) => acumulator + item.quantity,
      0
    );
    const totalPrice = items.reduce(
      (acumulator, item) => acumulator + item.totalPrice,
      0
    );

    if (
      itemsMixTotal >= itemsMixFilter[0]?.wholesaleQuantity ||
      totalPrice >= 100000
    ) {
      items = items.map((item) => ({
        ...item,
        totalPrice:
          item.wholesalePrice > 0
            ? item.wholesalePrice * item.quantity
            : item.priceUnit * item.quantity,
      }));

      listItems.value = items;
    } else {
      items = items.map((item) => ({
        ...item,
        totalPrice: item.quantity * item.priceUnit,
      }));

      listItems.value = items;
    }
  }
};

const getTotalProducts = () => {
  if (listItems.value) {
    const total = listItems.value.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    return total;
  }
};

// Calcular el total si todos los productos tuvieran precio regular
const getTotalRegularPrice = () => {
  if (listItems.value) {
    const total = listItems.value.reduce(
      (acc, item) => acc + (item.priceUnit * item.quantity),
      0
    );
    return total;
  }
  return 0;
};

// Verificar si se está aplicando precio mayorista
const isWholesaleApplied = computed(() => {
  const itemsMixFilter = listItems.value.filter((item) => item.isWholesaleMix);

  if (itemsMixFilter.length === 0) return false;

  const itemsMixTotal = itemsMixFilter.reduce(
    (acumulator, item) => acumulator + item.quantity,
    0
  );
  const totalPrice = getTotalRegularPrice();

  return (
    (itemsMixTotal >= itemsMixFilter[0]?.wholesaleQuantity) ||
    totalPrice >= 100000
  );
});

// Calcular el ahorro por precio mayorista
const wholesaleSavings = computed(() => {
  if (!isWholesaleApplied.value) return 0;

  const regularTotal = getTotalRegularPrice();
  const wholesaleTotal = getTotalProducts();

  return regularTotal - wholesaleTotal;
});

const calculateShippingCost = () => {
  const city = deliveryAddress.value.city?.toLowerCase();

  if (!city || city.length < 4) {
    return 0;
  }

  // Si es Neiva
  if (city === "neiva") {
    // Si es entrega normal, es gratis
    if (!deliveryType.value || deliveryType.value === optionsDeliveryType[0]) {
      return 0;
    }
    // Si es entrega inmediata
    if (deliveryType.value === optionsDeliveryType[1]) {
      return shippingRates.neiva.express;
    }
    return 0;
  }

  // Si es cualquier otra ciudad (nacional)
  return shippingRates.national;
};

const shippingCost = computed(() => {
  return formatPrice(calculateShippingCost());
});

const totalPayment = computed(() => {
  const productsTotal = getTotalProducts();
  const shipping = calculateShippingCost();

  const total = productsTotal + shipping - cuponDiscount.value;
  return total;
});

const aplicarDescuento = async () => {
  try {
    if (cupon.value === "") {
      return;
    }
    const response = await searchReward({ "cupon.codeCupon": cupon.value });
    if (response.data.cupon.used === true) {
      Notify.create({
        icon: "info",
        message: "El cupon ya ha sido usado.",
        color: "negative",
      });
      return;
    }
    cuponDiscount.value = response.data.cupon.valorCupon;
    inputCuponDisabled.value = true;
  } catch (error) {
    Notify.create({
      icon: "error",
      message: "Cupón no válido",
      color: "negative",
    });
  }
};

const isProcessing = ref(false);
const sendOrder = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  const productsSubtotal = getTotalProducts();
  const shippingCostValue = calculateShippingCost();

  const customerName = deliveryAddress.value.contactName || deliveryAddress.value.name || '';
  const customerPhone = deliveryAddress.value.phoneContact || deliveryAddress.value.phone || '';

  if (!customerName.trim()) {
    Notify.create({
      type: 'negative',
      message: 'El nombre de quien recibe es requerido',
      position: 'top'
    });
    return;
  }

  if (!customerPhone.trim()) {
    Notify.create({
      type: 'negative',
      message: 'El teléfono de contacto es requerido',
      position: 'top'
    });
    return;
  }

  const orderData = {
    customer: {
      name: customerName,
      email: deliveryAddress.value.email || '',
      phone: customerPhone,
      address: deliveryAddress.value.address || '',
      city: deliveryAddress.value.city || '',
      state: deliveryAddress.value.state || 'Huila',
      notes: deliveryAddress.value.notes || ''
    },
    items: listItems.value.map(item => {
      // Calcular el precio final basado en si aplica mayorista
      const finalPrice = item.totalPrice / item.quantity; // totalPrice ya tiene el descuento aplicado si corresponde
      const regularPrice = item.priceUnit || item.price || 0;

      return {
        product: item.product || item._id,
        name: item.name,
        sku: item.sku || '',
        quantity: item.quantity,
        price: finalPrice, // Precio final (con descuento mayorista si aplica)
        regularPrice: regularPrice, // Precio original sin descuento
        image: item.image,
        selectedVariant: item.references ? {
          selections: item.references.reduce((acc, ref) => {
            acc[ref.name] = ref.selectedOption
            return acc
          }, {})
        } : (item.selectedVariant || null)
      };
    }),
    subtotal: productsSubtotal, // Subtotal siempre es el total de productos (con descuentos aplicados)
    discountAmount: cuponDiscount.value + wholesaleSavings.value,
    shippingCost: shippingCostValue,
    total: totalPayment.value,
    deliveryType: deliveryType.value,
    paymentMethod: 'contraentrega',
    internalNotes: `Pedido online - Tipo de entrega: ${deliveryType.value}${isWholesaleApplied.value ? ' | Precio mayorista aplicado' : ''}`
  };

  try {
    const response = await createOnlineOrder(orderData);
    if (response.success || response.data?.status === "success") {
      carStore.clearCart();
      $router.push({ name: "OrderSend" });
    } else {
      Notify.create({
        type: 'negative',
        message: 'Error al procesar el pedido. Por favor intenta nuevamente.',
        position: 'top'
      });
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error de conexión. Por favor verifica tu conexión a internet.',
      position: 'top'
    });
  } finally {
    isProcessing.value = false;
  }
};

watch(
  () => $route.query.type,
  (newValue, oldValue) => {
    asignItemOrder();
  }
);
</script>

<style scoped>
.payment-page {
  background: #fafafa;
  min-height: 100vh;
  padding: 20px;
}

.payment-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
}

.payment-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-sidebar {
  position: relative;
}

.summary-card-wrapper {
  position: sticky;
  top: 80px;
}

.summary-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
}

.summary-header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  padding: 20px;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.summary-content {
  padding: 20px;
}

.wholesale-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.wholesale-badge span {
  flex: 1;
}

.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.regular-price {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 500;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.summary-amount {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.discount-row {
  background: #f0fdf4;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 8px -8px;
}

.discount-amount {
  color: #16a34a;
  font-weight: 600;
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}

.total-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.delivery-type-section {
  margin-top: 16px;
}

.delivery-select {
  width: 100%;
}

.coupon-section {
  margin-top: 16px;
}

.coupon-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.coupon-input {
  flex: 1;
}

.coupon-btn {
  margin-top: 4px;
  min-width: 90px;
}

.validation-section {
  padding: 16px 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.validation-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.validation-text {
  font-size: 0.9rem;
  color: #666;
}

.checkout-btn-main {
  width: 100%;
  padding: 14px 20px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.checkout-btn-main:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.checkout-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  letter-spacing: 0.3px;
}

/* Mobile */
.mobile-summary {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.mobile-summary .q-card {
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

.mobile-summary-header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 14px 16px;
}

.mobile-summary-title {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.wholesale-badge-mobile {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 8px 12px;
  margin: 16px 16px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);
}

.price-container-mobile {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
}

.regular-price-mobile {
  font-size: 0.7rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 500;
  line-height: 1;
}

.mobile-summary-details {
  padding: 14px 16px;
}

.mobile-summary-details .summary-row {
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.mobile-summary-details .summary-label {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.mobile-summary-details .summary-amount {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.mobile-summary-details .discount-amount {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.9rem;
}

.coupon-mobile-section {
  padding: 0 16px 14px;
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.coupon-input-mobile {
  flex: 1;
}

.coupon-mobile-section .q-btn {
  margin-top: 1px;
}

.mobile-footer {
  padding: 14px 16px 16px;
  background: #fafafa;
}

.mobile-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mobile-total-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mobile-total-label {
  font-size: 1rem;
  font-weight: 600;
  color: #000;
}

.mobile-total-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mobile-validations {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.75rem;
}

.validation-item-small {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.75rem;
}

.validation-item-small .q-icon {
  font-size: 14px;
}

.checkout-btn-mobile {
  width: 100%;
  padding: 12px 20px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  font-size: 0.95rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.checkout-btn-mobile:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 1024px) {
  .payment-container {
    grid-template-columns: 1fr;
  }

  .summary-card-wrapper {
    display: none;
  }
}

@media (max-width: 600px) {
  .payment-page {
    padding: 12px;
    padding-bottom: 200px;
  }

  .payment-container {
    gap: 12px;
  }
}
</style>
