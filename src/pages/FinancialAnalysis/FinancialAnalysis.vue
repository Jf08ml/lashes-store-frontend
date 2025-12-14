<template>
  <q-page class="financial-analysis">
    <!-- Header mejorado con gradiente -->
    <div class="hero-header q-pa-xl">
      <div class="container">
        <div class="row items-center q-gutter-lg">
          <div class="col">
            <div class="hero-content">
              <div class="hero-badge">
                <q-icon name="analytics" size="1.2em" />
                <span>Business Intelligence</span>
              </div>
              <h3 class="hero-title">Análisis Financiero Integral</h3>
              <p class="hero-subtitle">
                Dashboard completo para la toma de decisiones empresariales estratégicas
              </p>
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              size="lg"
              color="white"
              text-color="primary"
              icon="refresh"
              label="Actualizar Datos"
              @click="loadAllData"
              :loading="loading.dashboard"
              class="hero-btn"
              no-caps
              unelevated
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación de tabs mejorada -->
    <div class="tabs-container">
      <div class="container">
        <q-tabs
          v-model="activeTab"
          class="financial-tabs"
          active-color="primary"
          indicator-color="primary"
          align="left"
          no-caps
        >
          <q-tab
            name="dashboard"
            class="tab-item"
            no-caps
          >
            <div class="tab-content">
              <q-icon name="dashboard" size="1.5em" />
              <div class="tab-text">
                <div class="tab-label">Dashboard</div>
                <div class="tab-desc">Vista general</div>
              </div>
            </div>
          </q-tab>

          <q-tab
            name="profitability"
            class="tab-item"
            no-caps
          >
            <div class="tab-content">
              <q-icon name="trending_up" size="1.5em" />
              <div class="tab-text">
                <div class="tab-label">Rentabilidad</div>
                <div class="tab-desc">Márgenes y beneficios</div>
              </div>
            </div>
          </q-tab>

          <q-tab
            name="inventory"
            class="tab-item"
            no-caps
          >
            <div class="tab-content">
              <q-icon name="inventory_2" size="1.5em" />
              <div class="tab-text">
                <div class="tab-label">Inventario</div>
                <div class="tab-desc">Stock y rotación</div>
              </div>
            </div>
          </q-tab>

          <q-tab
            name="cashflow"
            class="tab-item"
            no-caps
          >
            <div class="tab-content">
              <q-icon name="account_balance" size="1.5em" />
              <div class="tab-text">
                <div class="tab-label">Flujo de Caja</div>
                <div class="tab-desc">Ingresos y egresos</div>
              </div>
            </div>
          </q-tab>

          <q-tab
            name="forecast"
            class="tab-item"
            no-caps
          >
            <div class="tab-content">
              <q-icon name="analytics" size="1.5em" />
              <div class="tab-text">
                <div class="tab-label">Pronóstico</div>
                <div class="tab-desc">Proyecciones futuras</div>
              </div>
            </div>
          </q-tab>

          <q-tab
            name="kpis"
            class="tab-item"
            no-caps
          >
            <div class="tab-content">
              <q-icon name="speed" size="1.5em" />
              <div class="tab-text">
                <div class="tab-label">KPIs</div>
                <div class="tab-desc">Indicadores clave</div>
              </div>
            </div>
          </q-tab>
        </q-tabs>
      </div>
    </div>

    <!-- Contenido de las tabs -->
    <div class="tabs-content">
      <div class="container">
        <q-tab-panels v-model="activeTab" animated class="transparent-panels">
          <q-tab-panel name="dashboard" class="q-pa-none">
            <DashboardView
              :data="dashboardData"
              :loading="loading.dashboard"
              @refresh="loadDashboard"
            />
          </q-tab-panel>

          <q-tab-panel name="profitability" class="q-pa-none">
            <ProfitabilityView
              :data="profitabilityData"
              :loading="loading.profitability"
              @refresh="loadProfitability"
            />
          </q-tab-panel>

          <q-tab-panel name="inventory" class="q-pa-none">
            <InventoryView
              :data="inventoryData"
              :loading="loading.inventory"
              @refresh="loadInventory"
            />
          </q-tab-panel>

          <q-tab-panel name="cashflow" class="q-pa-none">
            <CashFlowView
              :data="cashFlowData"
              :loading="loading.cashflow"
              @refresh="loadCashFlow"
            />
          </q-tab-panel>

          <q-tab-panel name="forecast" class="q-pa-none">
            <ForecastView
              :data="forecastData"
              :loading="loading.forecast"
              @refresh="loadForecast"
            />
          </q-tab-panel>

          <q-tab-panel name="kpis" class="q-pa-none">
            <KPIsView
              :data="kpisData"
              :loading="loading.kpis"
              @refresh="loadKPIs"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- Panel de recomendaciones mejorado -->
    <div class="recommendations-section" v-if="recommendations.length > 0">
      <div class="container">
        <q-card class="recommendations-card" flat>
          <q-card-section class="recommendations-header">
            <div class="row items-center">
              <div class="col">
                <div class="recommendations-title">
                  <q-icon name="lightbulb" size="1.5em" color="warning" />
                  <span>Recomendaciones Estratégicas</span>
                </div>
                <p class="recommendations-subtitle">
                  Insights automatizados basados en el análisis de datos
                </p>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  round
                  icon="expand_less"
                  @click="showRecommendations = !showRecommendations"
                  :class="{ 'rotate-180': !showRecommendations }"
                  class="toggle-btn"
                />
              </div>
            </div>
          </q-card-section>

          <q-slide-transition>
            <div v-show="showRecommendations">
              <q-separator />
              <q-card-section class="recommendations-content">
                <div class="row q-gutter-lg">
                  <div
                    v-for="(rec, index) in recommendations.slice(0, 6)"
                    :key="index"
                    class="col-12 col-md-6 col-lg-4"
                  >
                    <q-card
                      class="recommendation-card"
                      :class="`recommendation-${rec.priority}`"
                      flat
                      bordered
                    >
                      <q-card-section>
                        <div class="rec-header">
                          <div class="rec-icon">
                            <q-icon :name="getRecommendationIcon(rec.type)" />
                          </div>
                          <q-chip
                            :color="getPriorityColor(rec.priority)"
                            text-color="white"
                            size="sm"
                            class="rec-priority"
                          >
                            {{ formatPriority(rec.priority) }}
                          </q-chip>
                        </div>

                        <h6 class="rec-title">{{ rec.title }}</h6>
                        <p class="rec-description">{{ rec.description }}</p>

                        <div class="rec-actions" v-if="rec.actions">
                          <div class="actions-label">Acciones sugeridas:</div>
                          <q-list dense class="action-list">
                            <q-item
                              v-for="action in rec.actions?.slice(0, 2)"
                              :key="action"
                              class="action-item"
                            >
                              <q-item-section avatar>
                                <q-icon name="check_circle" size="sm" color="positive" />
                              </q-item-section>
                              <q-item-section>
                                <q-item-label class="action-text">{{ action }}</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import financialService from '../../services/financialService'

// Componentes de vista
import DashboardView from './components/DashboardView.vue'
import ProfitabilityView from './components/ProfitabilityView.vue'
import InventoryView from './components/InventoryView.vue'
import CashFlowView from './components/CashFlowView.vue'
import ForecastView from './components/ForecastView.vue'
import KPIsView from './components/KPIsView.vue'

// Estado reactivo
const activeTab = ref('dashboard')
const showRecommendations = ref(true)

// Estados de carga
const loading = ref({
  dashboard: false,
  profitability: false,
  inventory: false,
  cashflow: false,
  forecast: false,
  kpis: false
})

// Datos de cada análisis
const dashboardData = ref(null)
const profitabilityData = ref(null)
const inventoryData = ref(null)
const cashFlowData = ref(null)
const forecastData = ref(null)
const kpisData = ref(null)
const recommendations = ref([])

// Computed para obtener recomendaciones
const allRecommendations = computed(() => {
  const recs = []

  if (dashboardData.value?.alerts) {
    recs.push(...dashboardData.value.alerts.map(alert => ({
      type: alert.type,
      priority: alert.severity,
      title: alert.message,
      description: alert.action,
      actions: [alert.action]
    })))
  }

  if (inventoryData.value?.recommendations) {
    recs.push(...inventoryData.value.recommendations.map(rec => ({
      type: rec.type,
      priority: rec.priority,
      title: rec.message,
      description: `Producto: ${rec.product}`,
      actions: [rec.message]
    })))
  }

  return recs
})

// Métodos para cargar datos individuales
const loadDashboard = async () => {
  loading.value.dashboard = true
  try {
    const response = await financialService.getDashboard()
    dashboardData.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar el dashboard financiero',
      position: 'top'
    })
  } finally {
    loading.value.dashboard = false
  }
}

const loadProfitability = async () => {
  loading.value.profitability = true
  try {
    const response = await financialService.getProfitabilityAnalysis()
    profitabilityData.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar análisis de rentabilidad',
      position: 'top'
    })
  } finally {
    loading.value.profitability = false
  }
}

const loadInventory = async () => {
  loading.value.inventory = true
  try {
    const response = await financialService.getInventoryAnalysis()
    inventoryData.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar análisis de inventario',
      position: 'top'
    })
  } finally {
    loading.value.inventory = false
  }
}

const loadCashFlow = async () => {
  loading.value.cashflow = true
  try {
    const response = await financialService.getCashFlowAnalysis()
    cashFlowData.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar análisis de flujo de caja',
      position: 'top'
    })
  } finally {
    loading.value.cashflow = false
  }
}

const loadForecast = async () => {
  loading.value.forecast = true
  try {
    const response = await financialService.getForecastAnalysis()
    forecastData.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar pronóstico financiero',
      position: 'top'
    })
  } finally {
    loading.value.forecast = false
  }
}

const loadKPIs = async () => {
  loading.value.kpis = true
  try {
    const response = await financialService.getKPIs()
    kpisData.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Error al cargar KPIs',
      position: 'top'
    })
  } finally {
    loading.value.kpis = false
  }
}

// Cargar todos los datos
const loadAllData = async () => {
  await Promise.all([
    loadDashboard(),
    loadProfitability(),
    loadInventory(),
    loadCashFlow(),
    loadForecast(),
    loadKPIs()
  ])

  // Generar recomendaciones
  try {
    const executiveSummary = await financialService.getExecutiveSummary()
    recommendations.value = executiveSummary.data.recommendations
  } catch (error) {
    console.error('Error generando recomendaciones:', error)
  }
}

// Métodos auxiliares
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical': return 'negative'
    case 'high': return 'warning'
    case 'medium': return 'info'
    case 'low': return 'positive'
    default: return 'grey'
  }
}

const getRecommendationIcon = (type) => {
  switch (type) {
    case 'warning': return 'warning'
    case 'success': return 'check_circle'
    case 'error': return 'error'
    case 'profitability': return 'trending_up'
    case 'inventory': return 'inventory_2'
    case 'growth': return 'analytics'
    case 'cashflow': return 'account_balance'
    default: return 'info'
  }
}

const formatPriority = (priority) => {
  switch (priority) {
    case 'critical': return 'Crítico'
    case 'high': return 'Alto'
    case 'medium': return 'Medio'
    case 'low': return 'Bajo'
    default: return priority
  }
}

// Inicialización
onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
/* Variables CSS para consistencia */
:root {
  --primary-color: #1f2937;
  --card-radius: 16px;
  --shadow-light: 0 2px 12px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 24px rgba(0, 0, 0, 0.12);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.financial-analysis {
  background: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header Hero Section */
.hero-header {
  background:black;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.8;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.25);
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.2;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.95;
  margin: 0;
  max-width: 500px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.hero-btn {
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: var(--transition);
  background: white !important;
  color: #1f2937 !important;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 0.95) !important;
  color: #111827 !important;
}

/* Tabs Container */
.tabs-container {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-light);
}

.financial-tabs {
  .q-tab {
    min-height: 80px;
    padding: 16px 24px;
    border-radius: 0;
    transition: var(--transition);
  }
}

.tab-item {
  opacity: 0.7;
  transition: var(--transition);
}

.tab-item:hover {
  opacity: 1;
  background: rgba(102, 126, 234, 0.05);
}

.tab-item.q-tab--active {
  opacity: 1;
  background: rgba(102, 126, 234, 0.1);
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tab-text {
  text-align: left;
}

.tab-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: inherit;
}

.tab-desc {
  font-size: 0.75rem;
  opacity: 0.7;
  color: inherit;
}

/* Content Area */
.tabs-content {
  padding: 32px 0;
}

.transparent-panels {
  background: transparent;
}

/* Recommendations Section */
.recommendations-section {
  background: #f1f5f9;
  padding: 48px 0;
  margin-top: 32px;
}

.recommendations-card {
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-medium);
  background: white;
  overflow: hidden;
}

.recommendations-header {
  background: #fff8f0;
  border-bottom: 1px solid #e0e0e0;
}

.recommendations-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.recommendations-subtitle {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.toggle-btn {
  transition: var(--transition);
}

.rotate-180 {
  transform: rotate(180deg);
}

.recommendations-content {
  padding: 32px;
}

/* Individual Recommendation Cards */
.recommendation-card {
  border-radius: 12px;
  transition: var(--transition);
  border: 2px solid transparent;
  height: 100%;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.recommendation-critical {
  background: #fef2f2;
  border-color: #f44336;
}

.recommendation-high {
  background: #fffbeb;
  border-color: #ff9800;
}

.recommendation-medium {
  background: #eff6ff;
  border-color: #2196f3;
}

.recommendation-low {
  background: #f0fdf4;
  border-color: #4caf50;
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rec-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.rec-priority {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rec-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  line-height: 1.3;
}

.rec-description {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.rec-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 16px;
}

.actions-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.action-list {
  padding: 0;
}

.action-item {
  padding: 4px 0;
  min-height: auto;
}

.action-text {
  font-size: 0.8rem;
  color: #555;
  line-height: 1.3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .tab-content {
    flex-direction: column;
    gap: 4px;
  }

  .tab-text {
    text-align: center;
  }

  .recommendations-content {
    padding: 16px;
  }
}

/* Animation utilities */
.q-slide-transition-enter-active,
.q-slide-transition-leave-active {
  transition: var(--transition);
}

/* Loading states */
.q-spinner {
  color: var(--q-primary) !important;
}
</style>
