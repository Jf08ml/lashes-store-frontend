<template>
  <q-card class="decision-helper">
    <!-- Header mejorado -->
    <q-card-section class="helper-header">
      <div class="header-content">
        <div class="header-icon">
          <q-icon name="psychology" />
        </div>
        <div class="header-text">
          <div class="header-title">Centro de Decisiones</div>
          <div class="header-subtitle">IA para decisiones inteligentes</div>
        </div>
      </div>
      <div class="notification-badge" v-if="totalNotifications > 0">
        {{ totalNotifications }}
      </div>
    </q-card-section>

    <!-- Navegación de tabs mejorada -->
    <div class="tabs-navigation">
      <q-tabs
        v-model="activeTab"
        class="decision-tabs"
        active-color="primary"
        indicator-color="primary"
        dense
      >
        <q-tab
          name="alerts"
          class="tab-button"
          :class="{ 'has-notifications': alertCount > 0 }"
        >
          <div class="tab-content">
            <q-icon name="warning" />
            <span>Alertas</span>
            <q-badge
              v-if="alertCount > 0"
              color="negative"
              floating
              rounded
            >
              {{ alertCount }}
            </q-badge>
          </div>
        </q-tab>

        <q-tab
          name="recommendations"
          class="tab-button"
          :class="{ 'has-notifications': recommendationCount > 0 }"
        >
          <div class="tab-content">
            <q-icon name="lightbulb" />
            <span>Tips</span>
            <q-badge
              v-if="recommendationCount > 0"
              color="warning"
              floating
              rounded
            >
              {{ recommendationCount }}
            </q-badge>
          </div>
        </q-tab>

        <q-tab name="insights" class="tab-button">
          <div class="tab-content">
            <q-icon name="analytics" />
            <span>Insights</span>
          </div>
        </q-tab>
      </q-tabs>
    </div>

    <!-- Contenido de tabs -->
    <q-card-section class="tabs-content">
      <q-tab-panels v-model="activeTab" animated class="transparent-panels">
        <!-- Panel de Alertas -->
        <q-tab-panel name="alerts" class="panel-content">
          <div v-if="loading" class="loading-state">
            <q-spinner-dots color="primary" size="1.5em" />
            <div class="loading-text">Analizando alertas...</div>
          </div>

          <div v-else-if="alerts.length === 0" class="empty-state">
            <div class="empty-icon">
              <q-icon name="check_circle" />
            </div>
            <div class="empty-title">¡Excelente!</div>
            <div class="empty-subtitle">No hay alertas críticas</div>
          </div>

          <div v-else class="alerts-list">
            <div
              v-for="(alert, index) in alerts.slice(0, 3)"
              :key="index"
              class="alert-card"
              :class="`alert-${alert.severity}`"
            >
              <div class="alert-indicator">
                <q-icon :name="getAlertIcon(alert.severity)" />
              </div>
              <div class="alert-content">
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-action">{{ alert.action }}</div>
              </div>
              <div class="alert-priority">
                <q-chip
                  :color="getAlertColor(alert.severity)"
                  text-color="white"
                  size="sm"
                  dense
                >
                  {{ formatSeverity(alert.severity) }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- Panel de Recomendaciones -->
        <q-tab-panel name="recommendations" class="panel-content">
          <div v-if="loading" class="loading-state">
            <q-spinner-dots color="primary" size="1.5em" />
            <div class="loading-text">Generando recomendaciones...</div>
          </div>

          <div v-else-if="recommendations.length === 0" class="empty-state">
            <div class="empty-icon">
              <q-icon name="lightbulb" />
            </div>
            <div class="empty-title">Todo optimizado</div>
            <div class="empty-subtitle">Sin recomendaciones nuevas</div>
          </div>

          <div v-else class="recommendations-list">
            <div
              v-for="(rec, index) in recommendations.slice(0, 3)"
              :key="index"
              class="recommendation-card"
              :class="`rec-${rec.priority}`"
            >
              <div class="rec-header">
                <div class="rec-icon">
                  <q-icon :name="getRecIcon(rec.type)" />
                </div>
                <div class="rec-priority">
                  <q-chip
                    :color="getPriorityColor(rec.priority)"
                    text-color="white"
                    size="sm"
                    dense
                  >
                    {{ formatPriority(rec.priority) }}
                  </q-chip>
                </div>
              </div>
              <div class="rec-content">
                <div class="rec-title">{{ rec.title }}</div>
                <div class="rec-description">{{ rec.description }}</div>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- Panel de Insights -->
        <q-tab-panel name="insights" class="panel-content">
          <div v-if="loading" class="loading-state">
            <q-spinner-dots color="primary" size="1.5em" />
            <div class="loading-text">Analizando datos...</div>
          </div>

          <div v-else class="insights-grid">
            <div class="insight-card trending">
              <div class="insight-header">
                <div class="insight-icon">
                  <q-icon name="trending_up" />
                </div>
                <div class="insight-label">Mejor Producto</div>
              </div>
              <div class="insight-value">{{ topProduct?.name || 'Pestañas Premium' }}</div>
              <div class="insight-change positive">
                <q-icon name="trending_up" size="xs" />
                <span>+15% ventas</span>
              </div>
            </div>

            <div class="insight-card channel">
              <div class="insight-header">
                <div class="insight-icon">
                  <q-icon name="storefront" />
                </div>
                <div class="insight-label">Canal Principal</div>
              </div>
              <div class="insight-value">{{ primaryChannel }}</div>
              <div class="insight-change neutral">
                <q-icon name="trending_flat" size="xs" />
                <span>Estable</span>
              </div>
            </div>

            <div class="insight-card growth">
              <div class="insight-header">
                <div class="insight-icon">
                  <q-icon name="analytics" />
                </div>
                <div class="insight-label">Tendencia</div>
              </div>
              <div class="insight-value">{{ trendMessage }}</div>
              <div class="insight-change" :class="getTrendChangeClass()">
                <q-icon :name="getTrendIcon()" size="xs" />
                <span>{{ getTrendPercentage() }}</span>
              </div>
            </div>

            <div class="insight-card performance">
              <div class="insight-header">
                <div class="insight-icon">
                  <q-icon name="speed" />
                </div>
                <div class="insight-label">Rendimiento</div>
              </div>
              <div class="insight-value">{{ getPerformanceScore() }}%</div>
              <div class="insight-change positive">
                <q-icon name="check_circle" size="xs" />
                <span>Óptimo</span>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>

    <!-- Footer con acciones -->
    <q-card-section class="helper-footer">
      <div class="footer-actions">
        <q-btn
          color="primary"
          label="Análisis Completo"
          @click="goToFullAnalysis"
          class="main-action"
          no-caps
          icon="analytics"
          size="sm"
        />

        <div class="secondary-actions">
          <q-btn
            outline
            color="primary"
            icon="refresh"
            @click="loadData"
            round
            size="sm"
            class="refresh-btn"
          >
            <q-tooltip>Actualizar</q-tooltip>
          </q-btn>

          <q-btn
            outline
            color="primary"
            icon="settings"
            round
            size="sm"
            class="settings-btn"
          >
            <q-tooltip>Configurar alertas</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="update-indicator">
        <q-icon name="access_time" size="xs" />
        <span>Actualizado hace {{ getUpdateTime() }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import financialService from '../services/financialService'

const router = useRouter()

// Estado reactivo
const activeTab = ref('alerts')
const data = ref(null)
const loading = ref(false)
const alerts = ref([])
const recommendations = ref([])

// Computed properties
const alertCount = computed(() => alerts.value.length)
const recommendationCount = computed(() => recommendations.value.length)
const totalNotifications = computed(() => alertCount.value + recommendationCount.value)

const topProduct = computed(() => {
  // Simulación - en el futuro vendrá del análisis de productos
  return { name: 'Pestañas Premium' }
})

const primaryChannel = computed(() => {
  if (!data.value?.salesChannels) return 'N/A'

  const { posPercentage, onlinePercentage } = data.value.salesChannels
  if (posPercentage > onlinePercentage) return 'Tienda física'
  return 'Ventas online'
})

const trendMessage = computed(() => {
  if (!data.value?.trends) return 'Sin datos'

  const growth = data.value.trends.monthlyGrowth || 0
  if (growth > 10) return 'Crecimiento excelente'
  if (growth > 0) return 'Crecimiento positivo'
  if (growth > -5) return 'Estable'
  return 'Requiere atención'
})

// Métodos
const loadData = async () => {
  loading.value = true

  try {
    const [dashboardResponse, executiveResponse] = await Promise.all([
      financialService.getDashboard(),
      financialService.getExecutiveSummary()
    ])

    data.value = dashboardResponse.data

    // Extraer alertas
    if (data.value.alerts) {
      alerts.value = data.value.alerts.filter(alert =>
        alert.severity === 'critical' || alert.severity === 'warning'
      )
    }

    // Extraer recomendaciones del nuevo endpoint
    console.log('Executive Summary Response:', executiveResponse) // Debug

    if (executiveResponse.data && executiveResponse.data.recommendations) {
      recommendations.value = executiveResponse.data.recommendations.filter(rec =>
        rec.priority === 'high' || rec.priority === 'critical'
      )
    }

  } catch (error) {
    console.error('Error generando recomendaciones:', error)
  } finally {
    loading.value = false
  }
}

const getAlertIcon = (severity) => {
  switch (severity) {
    case 'critical': return 'error'
    case 'warning': return 'warning'
    default: return 'info'
  }
}

const getAlertColor = (severity) => {
  switch (severity) {
    case 'critical': return 'negative'
    case 'warning': return 'warning'
    default: return 'info'
  }
}

const getTrendClass = () => {
  const growth = data.value?.trends?.monthlyGrowth || 0
  if (growth > 5) return 'text-positive'
  if (growth > 0) return 'text-warning'
  return 'text-negative'
}

const getTrendIcon = () => {
  const growth = data.value?.trends?.monthlyGrowth || 0
  if (growth > 5) return 'trending_up'
  if (growth > 0) return 'trending_flat'
  return 'trending_down'
}

const getTrendColor = () => {
  const growth = data.value?.trends?.monthlyGrowth || 0
  if (growth > 5) return 'positive'
  if (growth > 0) return 'warning'
  return 'negative'
}

const goToFullAnalysis = () => {
  router.push('/financial-analysis')
}

// Métodos adicionales para el nuevo diseño
const formatSeverity = (severity) => {
  switch (severity) {
    case 'critical': return 'Crítico'
    case 'warning': return 'Alerta'
    case 'info': return 'Info'
    default: return severity
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

const getRecIcon = (type) => {
  switch (type) {
    case 'warning': return 'warning'
    case 'success': return 'check_circle'
    case 'error': return 'error'
    case 'profitability': return 'trending_up'
    case 'inventory': return 'inventory_2'
    case 'growth': return 'analytics'
    case 'cashflow': return 'account_balance'
    default: return 'lightbulb'
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical': return 'negative'
    case 'high': return 'warning'
    case 'medium': return 'info'
    case 'low': return 'positive'
    default: return 'grey'
  }
}

const getTrendChangeClass = () => {
  const growth = data.value?.trends?.monthlyGrowth || 0
  if (growth > 5) return 'positive'
  if (growth > 0) return 'neutral'
  return 'negative'
}

const getTrendPercentage = () => {
  const growth = data.value?.trends?.monthlyGrowth || 0
  return `${Math.abs(growth).toFixed(1)}%`
}

const getPerformanceScore = () => {
  // Simulación de score de rendimiento basado en datos
  if (!data.value) return 0

  let score = 70 // Base score

  if (data.value.overview?.profitMargin > 30) score += 15
  if (data.value.trends?.monthlyGrowth > 5) score += 10
  if (alerts.value.length === 0) score += 5

  return Math.min(100, score)
}

const getUpdateTime = () => {
  const now = new Date()
  const diff = Math.floor((now - new Date()) / (1000 * 60))

  if (diff < 1) return '1 min'
  if (diff < 60) return `${diff} min`

  const hours = Math.floor(diff / 60)
  return `${hours}h`
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.decision-helper {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 320px;
  min-height: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.decision-helper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Header */
.helper-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.header-text {
  flex: 1;
}

.header-title {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 2px;
}

.header-subtitle {
  font-size: 0.75rem;
  opacity: 0.8;
}

.notification-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ff4757;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
}

/* Tabs Navigation */
.tabs-navigation {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.decision-tabs {
  .q-tab {
    min-height: 48px;
    padding: 0.5rem;
  }
}

.tab-button {
  position: relative;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.tab-button:hover {
  opacity: 1;
  background: rgba(102, 126, 234, 0.05);
}

.tab-button.q-tab--active {
  opacity: 1;
  background: rgba(102, 126, 234, 0.1);
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  position: relative;
}

.tab-content span {
  font-size: 0.6875rem;
  font-weight: 600;
}

.has-notifications .tab-content {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Content */
.tabs-content {
  padding: 1rem;
  flex: 1;
}

.transparent-panels {
  background: transparent;
}

.panel-content {
  padding: 0;
  min-height: 180px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  text-align: center;
}

.loading-text {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #666;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  text-align: center;
}

.empty-icon {
  color: #4caf50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.empty-title {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.empty-subtitle {
  font-size: 0.75rem;
  color: #666;
}

/* Alerts List */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.alert-card:hover {
  transform: translateX(2px);
}

.alert-critical {
  background: linear-gradient(135deg, #ffebee, #fce4ec);
  border-color: #f44336;
}

.alert-warning {
  background: linear-gradient(135deg, #fff8e1, #fff3e0);
  border-color: #ff9800;
}

.alert-info {
  background: linear-gradient(135deg, #e3f2fd, #e1f5fe);
  border-color: #2196f3;
}

.alert-indicator {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-message {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.alert-action {
  font-size: 0.75rem;
  color: #666;
  line-height: 1.3;
}

.alert-priority {
  flex-shrink: 0;
}

/* Recommendations List */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-card {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.rec-critical {
  border-left: 3px solid #f44336;
}

.rec-high {
  border-left: 3px solid #ff9800;
}

.rec-medium {
  border-left: 3px solid #2196f3;
}

.rec-low {
  border-left: 3px solid #4caf50;
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rec-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rec-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.rec-description {
  font-size: 0.75rem;
  color: #666;
  line-height: 1.3;
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.insight-card {
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.insight-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--insight-color);
}

.insight-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.insight-card.trending {
  --insight-color: linear-gradient(90deg, #4caf50, #81c784);
}

.insight-card.channel {
  --insight-color: linear-gradient(90deg, #2196f3, #64b5f6);
}

.insight-card.growth {
  --insight-color: linear-gradient(90deg, #ff9800, #ffb74d);
}

.insight-card.performance {
  --insight-color: linear-gradient(90deg, #9c27b0, #ba68c8);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.insight-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.insight-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.insight-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  width: fit-content;
}

.insight-change.positive {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.insight-change.negative {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.insight-change.neutral {
  color: #666;
  background: rgba(0, 0, 0, 0.05);
}

/* Footer */
.helper-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.main-action {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.main-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.secondary-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.refresh-btn,
.settings-btn {
  width: 32px;
  height: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.refresh-btn:hover,
.settings-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.update-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  color: #999;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .decision-helper {
    max-width: 100%;
    min-height: 350px;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
