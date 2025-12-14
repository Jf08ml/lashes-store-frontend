<template>
  <q-card class="products-list-card">
    <q-card-section class="products-header">
      <div class="header-content">
        <q-avatar color="black" text-color="white" icon="shopping_bag" size="40px" />
        <div class="header-text">
          <div class="products-title">
            Lista de productos
            <q-badge color="black" :label="listItems.length" class="q-ml-sm" />
          </div>
          <div class="products-subtitle">Revisa tu pedido</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="products-content">
      <div v-if="listItems.length === 0" class="empty-state">
        <q-icon name="shopping_cart_off" size="64px" color="grey-5" />
        <p class="empty-title">No hay productos en tu carrito</p>
        <p class="empty-subtitle">¡Revisa el <a href="/catalogo" class="catalog-link">catálogo</a> y agrega tus productos favoritos!</p>
      </div>

      <div v-else class="products-grid">
        <div
          v-for="(itemToBuy, index) in listItems"
          :key="itemToBuy._id"
          class="product-item"
        >
          <div class="product-image">
            <img v-if="itemToBuy.image" :src="itemToBuy.image" :alt="itemToBuy.name" />
            <div v-else class="no-image">
              <q-icon name="image_not_supported" size="48px" color="grey-4" />
            </div>
          </div>

          <div class="product-details">
            <div class="product-name">{{ itemToBuy.name }}</div>

            <div v-if="itemToBuy.references && itemToBuy.references.length > 0" class="product-variants">
              <span
                v-for="(reference, idx) in itemToBuy.references"
                :key="idx"
                class="variant-chip"
              >
                {{ reference.selectedOption }}
              </span>
            </div>

            <div class="product-quantity">
              <span class="quantity-label">Cantidad:</span>
              <div class="quantity-controls">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="remove"
                  @click="changeQuantity(itemToBuy, index, -1)"
                  :disable="itemToBuy.quantity <= 1"
                  class="quantity-btn"
                />
                <span class="quantity-value">{{ itemToBuy.quantity }}</span>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="add"
                  @click="changeQuantity(itemToBuy, index, 1)"
                  class="quantity-btn"
                />
              </div>
            </div>

            <div class="product-footer">
              <div class="product-price-section">
                <!-- Mostrar precio regular tachado si aplica precio mayorista -->
                <div v-if="itemToBuy.wholesalePrice > 0 && itemToBuy.totalPrice < (itemToBuy.priceUnit * itemToBuy.quantity)" class="price-comparison">
                  <span class="regular-price-item">{{ formatPrice(itemToBuy.priceUnit * itemToBuy.quantity) }}</span>
                  <div class="wholesale-price-wrapper">
                    <span class="product-price">{{ formatPrice(itemToBuy.totalPrice) }}</span>
                    <q-badge color="amber-7" label="Mayorista" class="wholesale-badge-small" />
                  </div>
                </div>
                <!-- Precio normal -->
                <div v-else class="product-price">{{ formatPrice(itemToBuy.totalPrice) }}</div>
              </div>
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="removeItem(index)"
                class="remove-btn"
              >
                <q-tooltip>Eliminar producto</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  listItems: Array,
});


const emit = defineEmits(["reCalculate", "removeItem"]);

const changeQuantity = (item, index, increment) => {
  if (increment === 1) {
    item.quantity++;
    reCalculate(index);
  } else if (increment === -1 && item.quantity > 1) {
    item.quantity--;
    reCalculate(index);
  }
};

const reCalculate = (index) => {
  emit("reCalculate", index);
};

const removeItem = (index) => {
  emit("removeItem", index);
};
</script>

<style scoped>
.products-list-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  background: white;
  margin-bottom: 16px;
}

.products-header {
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-text {
  flex: 1;
}

.products-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.products-subtitle {
  font-size: 0.9rem;
  color: #666;
}

.products-content {
  background: #fafafa;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px;
}

.empty-subtitle {
  color: #666;
  margin: 0;
}

.catalog-link {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}

.catalog-link:hover {
  text-decoration: underline;
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
}

.product-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d0d0d0;
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #000;
  line-height: 1.3;
  margin-bottom: 4px;
}

.product-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}

.variant-chip {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #555;
}

.product-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.quantity-label {
  font-size: 0.85rem;
  color: #666;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 6px;
}

.quantity-btn {
  color: #000;
}

.quantity-value {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.product-price-section {
  flex: 1;
}

.price-comparison {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.regular-price-item {
  font-size: 0.85rem;
  color: #999;
  text-decoration: line-through;
  font-weight: 500;
}

.wholesale-price-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wholesale-badge-small {
  font-size: 0.65rem;
  padding: 2px 6px;
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: #000;
}

.remove-btn {
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #fee;
}

@media (max-width: 600px) {
  .products-header {
    padding: 16px;
  }

  .products-content {
    padding: 16px;
  }

  .product-item {
    padding: 10px;
    gap: 10px;
  }

  .product-image {
    width: 70px;
    height: 70px;
  }

  .product-name {
    font-size: 0.9rem;
  }

  .variant-chip {
    font-size: 0.7rem;
  }

  .quantity-label {
    font-size: 0.8rem;
  }

  .product-price {
    font-size: 0.95rem;
  }

  .regular-price-item {
    font-size: 0.75rem;
  }

  .wholesale-badge-small {
    font-size: 0.6rem;
    padding: 1px 4px;
  }

  .wholesale-price-wrapper {
    gap: 4px;
  }
}
</style>
