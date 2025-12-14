<template>
  <q-page class="catalog-page">
    <!-- Header Section -->
    <section class="catalog-header">
      <div class="header-inner">
        <div class="header-content">
          <h1 class="catalog-title">
            Brilla con <span class="brand-accent">Galaxia Glamour Lashes</span>
          </h1>
          <p class="catalog-subtitle">
            Pestañas profesionales, insumos exclusivos y todo lo que necesitas
            para elevar tu arte a otro nivel.
          </p>
        </div>
      </div>
    </section>

    <!-- Search and Filters Section -->
    <section class="search-section">
      <div class="section-inner">
        <div class="search-wrapper">
          <q-input
            v-model="searchTerm"
            rounded
            outlined
            placeholder="Buscar productos..."
            class="search-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips-wrapper">
          <div class="filter-chips">
            <q-chip
              v-for="category in categories"
              :key="category.value"
              :selected="selectedCategory === category.value"
              @click="toggleCategory(category.value)"
              :color="selectedCategory === category.value ? 'black' : 'white'"
              :text-color="
                selectedCategory === category.value ? 'white' : 'grey-8'
              "
              clickable
              class="filter-chip"
            >
              <q-icon :name="category.icon" size="18px" class="q-mr-xs" />
              {{ category.label }}
            </q-chip>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Info -->
    <section class="results-info">
      <div class="section-inner results-container">
        <p class="results-text">
          <span class="results-count">{{ filteredProducts.length }}</span>
          producto{{ filteredProducts.length !== 1 ? "s" : "" }} encontrado{{
            filteredProducts.length !== 1 ? "s" : ""
          }}
        </p>
        <q-btn
          v-if="selectedCategory"
          flat
          dense
          @click="clearFilters"
          color="grey-8"
          icon="clear"
          label="Limpiar filtros"
          class="clear-btn"
        />
      </div>
    </section>

    <!-- Products Grid -->
    <section class="products-section">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <q-spinner-gears size="60px" color="black" />
        <p class="loading-text">Cargando productos...</p>
      </div>

      <!-- Products Grid -->
      <div
        v-else-if="filteredProducts.length > 0"
        class="products-grid section-inner"
      >
        <div
          v-for="product in filteredProducts"
          :key="product._id"
          class="product-item"
        >
          <ProductCard :product="product" class="product-card-enhanced" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state section-inner">
        <q-icon name="search_off" size="64px" color="grey-5" />
        <h3 class="empty-title">No se encontraron productos</h3>
        <p class="empty-subtitle">
          Intenta con otros términos de búsqueda o cambia los filtros
        </p>
        <q-btn
          v-if="searchTerm || selectedCategory"
          rounded
          unelevated
          color="black"
          label="Ver todos los productos"
          @click="clearAllFilters"
          class="q-mt-md"
        />
      </div>
    </section>

    <!-- Info Dialog -->
    <q-dialog v-model="showPopup">
      <q-card class="info-dialog">
        <!-- Close Button -->
        <q-btn
          flat
          round
          dense
          icon="close"
          class="close-dialog-btn"
          @click="showPopup = false"
        />

        <q-card-section class="dialog-header">
          <div class="dialog-icon">
            <q-icon name="info" size="28px" color="white" />
          </div>
          <h3 class="dialog-title">¡Bienvenida a Galaxia Glamour Store!</h3>
          <p class="dialog-subtitle">Tu distribuidora de confianza</p>
        </q-card-section>

        <q-card-section class="dialog-content">
          <div class="payment-info">
            <img
              src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/pago-contraentrega?updatedAt=1761766493364"
              class="payment-img"
            />
          </div>
          <div class="info-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Explora nuestros productos</h4>
                <p>Navega por nuestro catálogo especializado</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Añade al carrito</h4>
                <p>Selecciona los productos que necesitas</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Realiza tu pedido</h4>
                <p>Finaliza tu compra de forma segura</p>
              </div>
            </div>
          </div>

          <div class="contact-info">
            <p class="contact-text">
              <strong>¿Necesitas asesoría profesional?</strong><br />
              Contáctanos para precios al por mayor y soporte técnico
            </p>
          </div>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            unelevated
            rounded
            color="black"
            text-color="white"
            label="¡Entendido, empecemos!"
            @click="showPopup = false"
            class="dialog-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import { useCategoryStore } from "../../stores/categories";
import ProductCard from "./cards/ProductCard.vue";

const categoryStore = useCategoryStore();

const products = ref([]);
const searchTerm = ref("");
const showPopup = ref(false);
const selectedCategory = ref("");
const loading = ref(false);

const categories = computed(() => {
  const allCategories = [{ value: "", label: "Todos", icon: "apps" }];

  categoryStore.categories.forEach((cat) => {
    allCategories.push({
      value: cat._id,
      label: cat.name,
      icon: cat.icon || "category",
    });
  });

  return allCategories;
});

const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.namePublic?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.characteristics?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((product) => {
      if (product.category && typeof product.category === "object") {
        return product.category._id === selectedCategory.value;
      }
      return product.category === selectedCategory.value;
    });
  }

  return filtered;
});

onBeforeMount(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }
  await getAllProducts();
});

onMounted(() => {
  checkFirstVisit();
  window.addEventListener("beforeunload", clearLocalStorage);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", clearLocalStorage);
});

const checkFirstVisit = () => {
  if (!localStorage.getItem("catalogVisited")) {
    showPopup.value = true;
    localStorage.setItem("catalogVisited", "true");
  }
};

const clearLocalStorage = () => {
  localStorage.removeItem("catalogVisited");
};

const getAllProducts = async () => {
  loading.value = true;
  try {
    const response = await getProductsCatalog();
    const productsData = response.data?.data || response.data || [];

    products.value = productsData.map((product) => ({
      ...product,
      slideIndex: 0,
      rating: product.rating || 4.5,
    }));
  } catch (error) {
    console.error("Error al cargar productos del catálogo:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? "" : category;
};

const clearFilters = () => {
  selectedCategory.value = "";
};

const clearAllFilters = () => {
  searchTerm.value = "";
  selectedCategory.value = "";
};
</script>

<style scoped>
/* ---- Layout base ---- */
.catalog-page {
  --page-bg: #fafafa;
  --card-radius: 18px;
  --shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 10px 30px rgba(0, 0, 0, 0.12);
  --border-soft: 1px solid #e5e5e5;
  background: var(--page-bg);
  min-height: 100vh;
  color: #181818;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: 20px;
}

/* ---- Header ---- */
.catalog-header {
  background: radial-gradient(circle at top left, #1a1a1a, #000);
  color: white;
  padding: 80px 20px 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.catalog-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  color: white;
}

.brand-accent {
  background: linear-gradient(135deg, #FFD700 0%, #FFF 30%, #FFD700 60%, #FFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  display: inline-block;
  animation: shimmer 3s ease-in-out infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.catalog-subtitle {
  font-size: 1.05rem;
  opacity: 0.9;
  margin: 0 auto;
  max-width: 600px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
}

/* ---- Search ---- */
.search-section {
  padding-block: 18px 10px;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.search-wrapper {
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 520px;
  font-size: 14px;
}

.search-input :deep(.q-field__control) {
  border-radius: 999px;
  box-shadow: var(--shadow-soft);
  border: 1px solid #e3e3e3;
  transition: all 0.2s ease;
  background: #ffffff;
  min-height: 48px;
}

.search-input :deep(.q-field__control:hover) {
  box-shadow: var(--shadow-hover);
  border-color: #b5b5b5;
}

.search-input :deep(.q-field--focused .q-field__control) {
  border-color: #000000;
  box-shadow: 0 0 0 1px #000000;
}

.search-input :deep(.q-field__native) {
  font-weight: 500;
}

/* ---- Filter Chips ---- */
.filter-chips-wrapper {
  position: relative;
}

.filter-chips {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.filter-chips::-webkit-scrollbar {
  height: 4px;
}

.filter-chips::-webkit-scrollbar-thumb {
  background: #dddddd;
  border-radius: 999px;
}

.filter-chip {
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 12px;
  border-radius: 999px;
  padding: 6px 14px;
  border: 1px solid #e3e3e3;
}

.filter-chip:not(.q-chip--selected) {
  box-shadow: none;
}

.filter-chip.q-chip--selected {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.filter-chip:hover {
  transform: translateY(-1px);
}

/* ---- Results info ---- */
.results-info {
  padding-block: 8px 14px;
  background: #ffffff;
}

.results-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.results-text {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.results-count {
  font-weight: 600;
  color: #000;
}

.clear-btn {
  font-size: 0.8rem;
}

/* ---- Products ---- */
.products-section {
  padding-block: 18px 40px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block: 80px;
  gap: 16px;
}

.loading-text {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.product-item {
  display: flex;
}

.product-card-enhanced {
  width: 100%;
}

/* ---- Empty state ---- */
.empty-state {
  text-align: center;
  padding-block: 70px;
  max-width: 420px;
  margin-inline: auto;
}

.empty-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 16px 0 6px;
}

.empty-subtitle {
  color: #777;
  margin: 0 0 18px;
}

/* ---- Dialog ---- */
.info-dialog {
  max-width: 520px;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.32);
  position: relative;
}

.close-dialog-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  color: white;
  background: rgba(255, 255, 255, 0.16);
  transition: all 0.2s ease;
}

.close-dialog-btn:hover {
  background: rgba(255, 255, 255, 0.26);
  transform: rotate(90deg);
}

.dialog-header {
  background: radial-gradient(circle at top left, #2b2b2b 0%, #000000 65%);
  color: white;
  text-align: center;
  padding: 28px 20px 22px;
}

.dialog-icon {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  backdrop-filter: blur(10px);
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.dialog-subtitle {
  opacity: 0.9;
  margin: 0;
  font-size: 0.88rem;
}

.dialog-content {
  padding: 20px 20px 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.payment-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 14px;
  border: 1px solid #e4e4e4;
}

.payment-img {
  border-radius: 10px;
  width: 100%;
  height: auto;
  display: block;
}

.info-steps {
  margin-bottom: 14px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.step-item:nth-child(1) {
  animation-delay: 0.05s;
}
.step-item:nth-child(2) {
  animation-delay: 0.15s;
}
.step-item:nth-child(3) {
  animation-delay: 0.25s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-number {
  background: linear-gradient(135deg, #000000 0%, #404040 100%);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  margin-right: 10px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
}

.step-content h4 {
  margin: 0 0 2px;
  font-weight: 600;
  color: #222;
  font-size: 0.92rem;
}

.step-content p {
  margin: 0;
  color: #666;
  font-size: 0.82rem;
  line-height: 1.4;
}

.contact-info {
  background: linear-gradient(135deg, #f9f9f9 0%, #f1f1f1 100%);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  border: 1px solid #e4e4e4;
}

.contact-text {
  margin: 0;
  color: #333;
  font-size: 0.86rem;
  line-height: 1.5;
}

.dialog-actions {
  padding: 14px 20px 20px;
  justify-content: center;
  background: #fafafa;
}

.dialog-btn {
  padding: 9px 24px;
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s ease;
  min-width: 160px;
}

.dialog-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
}

/* ---- Responsive ---- */
@media (max-width: 900px) {
  .section-inner {
    padding-inline: 16px;
  }

  .results-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .products-grid {
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .catalog-header {
    padding-block: 34px 26px;
  }

  .header-inner {
    padding-inline: 16px;
  }

  .catalog-title {
    font-size: 1.7rem;
  }

  .catalog-subtitle {
    font-size: 0.9rem;
  }

  .search-section {
    padding-block: 14px 8px;
  }

  .search-wrapper {
    margin-bottom: 14px;
  }

  .search-input {
    max-width: 100%;
  }

  .products-section {
    padding-block: 14px 30px;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .empty-state {
    padding-block: 52px;
  }

  .info-dialog {
    max-width: calc(100vw - 24px);
    margin-inline: 12px;
  }

  .dialog-header {
    padding: 22px 16px 18px;
  }

  .dialog-title {
    font-size: 1.05rem;
    line-height: 1.3;
  }

  .dialog-subtitle {
    font-size: 0.8rem;
  }

  .dialog-icon {
    width: 48px;
    height: 48px;
  }

  .dialog-icon :deep(.q-icon) {
    font-size: 24px;
  }

  .dialog-content {
    padding: 16px 14px 12px;
    max-height: 56vh;
  }

  .payment-info {
    margin-bottom: 12px;
    padding: 8px;
  }

  .info-steps {
    margin-bottom: 12px;
  }

  .step-item {
    margin-bottom: 10px;
  }

  .step-number {
    width: 26px;
    height: 26px;
    font-size: 0.85rem;
    margin-right: 8px;
  }

  .step-content h4 {
    font-size: 0.88rem;
  }

  .step-content p {
    font-size: 0.78rem;
  }

  .contact-info {
    padding: 10px;
  }

  .contact-text {
    font-size: 0.8rem;
  }

  .dialog-actions {
    padding: 12px 14px 16px;
  }

  .dialog-btn {
    min-width: 100%;
    padding: 10px 20px;
    font-size: 0.88rem;
  }

  .close-dialog-btn {
    top: 8px;
    right: 8px;
  }
}
</style>
