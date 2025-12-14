<template>
  <q-page class="product-detail-page">
    <!-- Header con breadcrumb -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-inner">
          <q-btn
            flat
            dense
            no-caps
            icon="arrow_back"
            label="Volver"
            class="back-btn"
            @click="$router.push('/catalogo')"
          />

          <div class="breadcrumb">
            <span
              class="breadcrumb-link"
              @click="$router.push('/catalogo')"
            >
              Catálogo
            </span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">
              {{ product.name || "Detalle del producto" }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="page-main">
      <div class="container q-py-lg">
        <div class="row q-col-gutter-xl main-row">
          <!-- Columna de imágenes -->
          <div class="col-12 col-md-6">
            <div class="image-section">
              <div class="image-card">
                <CarouselDetailItem :product="product" />
              </div>
            </div>
          </div>

          <!-- Columna de información -->
          <div class="col-12 col-md-6">
            <div class="info-section">
              <SectionDetailProduct
                :product="product"
                :totalPrice="totalPrice"
                :buyWholesale="buyWholesale"
                @buy-item="buyItem"
                @add-car="addCar"
                @update-reference-option="updateReferenceOption"
                @update-quantity="updateQuantity"
                @update-buy-wholesale="updateBuyWholesale"
              />
            </div>
          </div>
        </div>

        <!-- Sección de detalles -->
        <section class="details-section q-mt-xl">
          <q-card flat bordered class="details-card">
            <q-tabs
              v-model="activeTab"
              dense
              class="details-tabs text-grey-8"
              active-color="black"
              indicator-color="black"
              align="left"
            >
              <q-tab
                name="description"
                label="Descripción"
                icon="description"
              />
              <q-tab
                name="shipping"
                label="Envío"
                icon="local_shipping"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="activeTab" animated>
              <!-- Panel de descripción -->
              <q-tab-panel name="description">
                <div class="description-panel">
                  <div v-if="product.characteristics">
                    <p class="description-text">
                      {{ product.characteristics }}
                    </p>
                  </div>
                  <div v-else class="description-empty">
                    <q-icon
                      name="info"
                      size="3rem"
                      class="q-mb-md text-grey-5"
                    />
                    <div>No hay características disponibles para este producto</div>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Panel de envío -->
              <q-tab-panel name="shipping">
                <div class="shipping-info">
                  <q-card flat bordered class="shipping-card shipping-card-local">
                    <q-card-section>
                      <div class="shipping-row">
                        <div class="shipping-icon-wrapper shipping-icon-local">
                          <q-icon
                            name="local_shipping"
                            size="1.5rem"
                            color="black"
                          />
                        </div>
                        <div>
                          <div class="shipping-title">
                            Envío Local - Neiva
                          </div>
                          <div class="shipping-text">
                            Envío gratis según disponibilidad. Entrega inmediata con costo adicional.
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card flat bordered class="shipping-card shipping-card-national">
                    <q-card-section>
                      <div class="shipping-row">
                        <div class="shipping-icon-wrapper shipping-icon-national">
                          <q-icon
                            name="public"
                            size="1.5rem"
                            color="grey-8"
                          />
                        </div>
                        <div>
                          <div class="shipping-title">
                            Envío Nacional
                          </div>
                          <div class="shipping-text">
                            Costo aproximado entre $10.000 - $20.000 según destino.
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </section>
      </div>
    </main>

    <!-- Drawer de resumen -->
    <ResumeItemDrawer
      :model-value="showDrawer"
      :product="product"
      :itemToBuy="itemToBuy"
      @go-to-pay="goToPay"
      @update:model-value="showDrawer = $event"
    />
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Notify } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useCarStore } from "src/stores/car";
import { getProduct } from "src/services/productService";
import CarouselDetailItem from "./components/CarouselDetailItem.vue";
import SectionDetailProduct from "./components/SectionDetailProduct.vue";
import ResumeItemDrawer from "./components/ResumeItemDrawer.vue";

const $route = useRoute();
const $router = useRouter();

const carStore = useCarStore();
const productId = ref("");
const product = ref({});
const quantity = ref(1);
const itemToBuy = ref(null);
const showDrawer = ref(false);
const buyWholesale = ref(false);
const activeTab = ref("description");

onMounted(async () => {
  productId.value = $route.params.productId;
  await getDetailProduct();
});

const getDetailProduct = async () => {
  try {
    const response = await getProduct(productId.value);
    response.data.references?.forEach((reference) => {
      if (reference.options.length === 1) {
        reference.selectedOption = reference.options[0].value;
      }
    });
    product.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const totalPrice = computed(() => {
  const { salePrice, wholesalePrice, wholesaleQuantity } = product.value;

  const unitPrice = buyWholesale.value
    ? wholesalePrice
    : quantity.value >= wholesaleQuantity && wholesaleQuantity > 0
    ? wholesalePrice
    : salePrice;

  return quantity.value * unitPrice;
});

const updateBuyWholesale = (value) => {
  buyWholesale.value = value;
};

const buyItem = () => {
  const allReferencesSelected = product.value?.references?.every(
    (reference) => reference.selectedOption != null
  );

  if (!allReferencesSelected) {
    Notify.create({
      type: "warning",
      message: "Debes seleccionar las referencias",
      progress: true,
      textColor: "white",
    });
    return;
  }

  itemToBuy.value = {
    _id: product.value._id,
    name: product.value.name,
    image: product.value.images[0],
    references: product.value?.references.map((reference) => ({
      name: reference.name,
      selectedOption: reference.selectedOption,
    })),
    quantity: quantity.value,
    priceUnit: product.value.salePrice,
    totalPrice: totalPrice,
  };

  showDrawer.value = true;
};

const goToPay = () => {
  carStore.addOrder(itemToBuy.value);
  $router.push({
    name: "PaymentPage",
    query: { type: "buy", time: Date.now() },
  });
};

const addCar = () => {
  const allReferencesSelected = product.value.references?.every(
    (reference) => reference.selectedOption != null
  );

  if (!allReferencesSelected) {
    Notify.create({
      type: "warning",
      message: "Debes seleccionar las referencias",
      progress: true,
      textColor: "white",
    });
    return;
  }

  itemToBuy.value = {
    _id: product.value._id,
    name: product.value.name,
    image: product.value.images[0],
    references: product.value?.references.map((reference) => ({
      name: reference.name,
      selectedOption: reference.selectedOption,
    })),
    quantity: quantity.value,
    wholesalePrice: product.value.wholesalePrice,
    wholesaleQuantity: product.value.wholesaleQuantity,
    isWholesaleMix: product.value.isWholesaleMix,
    buyWholesale: buyWholesale.value,
    priceUnit: product.value.salePrice,
    totalPrice: totalPrice,
  };

  carStore.addItem(itemToBuy.value);

  Notify.create({
    type: "positive",
    message: "Añadido a la cesta.",
    progress: true,
    textColor: "white",
  });
};

const updateReferenceOption = (reference) => {
  product.value.references[reference.referenceIndex].selectedOption =
    reference.selectedOption;
};

const updateQuantity = (newVal) => {
  quantity.value = newVal < 1 ? 1 : newVal;
};
</script>

<style lang="scss" scoped>
.product-detail-page {
  background: linear-gradient(180deg, #f6f7f9 0%, #ffffff 100%);
  min-height: 100vh;
  color: #151515;
}

.page-main {
  padding-bottom: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.page-header {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #ececec;
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  text-transform: none;
  background: #f5f5f5;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(-3px);
    background: #ebebeb;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumb-link {
  cursor: pointer;
  color: #444;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.breadcrumb-current {
  color: #111;
  font-weight: 500;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main layout */
.main-row {
  align-items: flex-start;
}

.image-section {
  position: sticky;
  top: 80px;
}

.image-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #ececec;
}

.info-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Detalles / tabs */
.details-section {
  .details-card {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.04);
  }
}

.details-tabs {
  padding: 0 8px;

  :deep(.q-tabs__content) {
    min-height: 48px;
  }

  :deep(.q-tab) {
    text-transform: none;
    font-weight: 500;
    font-size: 0.9rem;
    padding-inline: 10px;
  }
}

.description-panel {
  padding: 18px 20px 20px;
}

.description-text {
  white-space: pre-line;
  color: #444;
  line-height: 1.6;
  font-size: 0.95rem;
}

.description-empty {
  text-align: center;
  color: #777;
  padding: 30px 12px;
}

/* Shipping cards */
.shipping-info {
  padding: 18px 20px 20px;
  display: grid;
  gap: 12px;
}

.shipping-card {
  border-radius: 12px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
  }
}

.shipping-card-local {
  background: #f7f7f7;
  border: 1px solid #e2e2e2;
}

.shipping-card-national {
  background: #fafafa;
  border: 1px solid #e5e5e5;
}

.shipping-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.shipping-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shipping-icon-local {
  background: #ffffff;
  border: 1px solid #dedede;
}

.shipping-icon-national {
  background: #f2f2f2;
  border: 1px solid #dfdfdf;
}

.shipping-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 3px;
}

.shipping-text {
  font-size: 0.88rem;
  color: #666;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1023px) {
  .container {
    padding: 0 16px;
  }

  .image-section {
    position: static;
    margin-bottom: 18px;
  }

  .image-card {
    border-radius: 14px;
  }

  .details-section {
    margin-top: 32px !important;
  }
}

@media (max-width: 599px) {
  .product-detail-page {
    background: #ffffff;
  }

  .container {
    padding: 0 12px;
  }

  .page-header {
    padding: 10px 0;

    .container {
      padding: 0 12px;
    }
  }

  .page-header-inner {
    gap: 10px;
  }

  .breadcrumb-current {
    max-width: 140px;
  }

  .q-py-lg {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
  }

  .row.q-col-gutter-xl {
    margin: 0;

    > div {
      padding: 0;
    }
  }

  .image-section {
    margin-bottom: 12px;
  }

  .info-section {
    margin-top: 8px;
  }

  .details-section {
    margin-top: 24px !important;

    .details-card {
      border-radius: 10px;
    }
  }

  .shipping-card:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
