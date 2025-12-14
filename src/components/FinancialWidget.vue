<template>
  <div class="financial-widget">
    <!-- Header mejorado -->
    <div class="widget-header">
      <div class="header-content">
        <div class="header-icon">
          <q-icon name="analytics" />
        </div>
        <div class="header-text">
          <div class="header-title">Dashboard Ejecutivo</div>
          <div class="header-subtitle">Métricas en tiempo real</div>
        </div>
      </div>
      <div class="header-status">
        <q-chip
          size="sm"
          :color="getStatusColor()"
          text-color="white"
          :icon="getStatusIcon()"
        >
          {{ getStatusText() }}
        </q-chip>
      </div>
    </div>

    <!-- Loading state mejorado -->
    <div v-if="loading" class="loading-state">
      <div class="loading-animation">
        <q-spinner-dots color="primary" size="2em" />
      </div>
      <div class="loading-text">Cargando métricas financieras...</div>
    </div>

    <!-- Error state mejorado -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <q-icon name="error_outline" />
      </div>
      <div class="error-text">Error al cargar datos</div>
      <q-btn
        size="sm"
        color="primary"
        label="Reintentar"
        @click="loadData"
        outline
        no-caps
        class="retry-btn"
      />
    </div>

    <!-- Content mejorado -->
    <div v-else-if="data" class="widget-content">
      <!-- Métricas principales en formato compacto -->
      <div class="metrics-section">
        <div class="primary-metrics">
          <div class="metric-card revenue">
            <div class="metric-icon">
              <q-icon name="attach_money" />
            </div>
            <div class="metric-data">
              <div class="metric-value">{{ formatCurrency(data.overview?.totalRevenue) }}</div>
              <div class="metric-label">Ingresos</div>
            </div>
            <div class="metric-trend positive">
              <q-icon name="trending_up" size="xs" />
            </div>
          </div>

          <div class="metric-card profit">
            <div class="metric-icon">
              <q-icon name="savings" />
            </div>
            <div class="metric-data">
              <div class="metric-value">{{ formatCurrency(data.overview?.grossProfit) }}</div>
              <div class="metric-label">Ganancia</div>
            </div>
            <div class="metric-trend positive">
              <q-icon name="trending_up" size="xs" />
            </div>
          </div>
        </div>

        <div class="secondary-metrics">
          <div class="metric-item">
            <div class="metric-mini-icon margin">
              <q-icon name="percent" size="sm" />
            </div>
            <div class="metric-mini-data">
              <div class="metric-mini-value">{{ formatPercentage(data.overview?.profitMargin) }}</div>
              <div class="metric-mini-label">Margen</div>
            </div>
          </div>

          <div class="metric-item">
            <div class="metric-mini-icon orders">
              <q-icon name="shopping_cart" size="sm" />
            </div>
            <div class="metric-mini-data">
              <div class="metric-mini-value">{{ data.overview?.totalOrders || 0 }}</div>
              <div class="metric-mini-label">Pedidos</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicador de salud del negocio -->
      <div class="health-section">
        <div class="health-header">
          <span class="health-label">Salud del Negocio</span>
          <span class="health-score">{{ Math.round(getHealthScore() * 100) }}%</span>
        </div>
        <div class="health-bar">
          <q-linear-progress
            :value="getHealthScore()"
            size="6px"
            :color="getHealthColor()"
            rounded
          />
        </div>
        <div class="health-indicators">
          <div class="indicator" :class="{ active: getHealthScore() >= 0.8 }">
            <q-icon name="check_circle" size="xs" />
            <span>Excelente</span>
          </div>
          <div class="indicator" :class="{ active: getHealthScore() >= 0.6 && getHealthScore() < 0.8 }">
            <q-icon name="warning" size="xs" />
            <span>Bueno</span>
          </div>
          <div class="indicator" :class="{ active: getHealthScore() < 0.6 }">
            <q-icon name="error" size="xs" />
            <span>Crítico</span>
          </div>
        </div>
      </div>

      <!-- Alertas críticas compactas -->
      <div v-if="criticalAlerts.length > 0" class="alerts-section">
        <div class="alerts-header">
          <q-icon name="warning" class="alert-icon" />
          <span class="alerts-count">{{ criticalAlerts.length }} alerta(s)</span>
        </div>
        <div class="alerts-list">
          <div
            v-for="(alert, index) in criticalAlerts.slice(0, 2)"
            :key="index"
            class="alert-item"
            :class="`alert-${alert.severity}`"
          >
            <div class="alert-indicator"></div>
            <div class="alert-text">{{ truncateText(alert.message, 30) }}</div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas mejoradas -->
      <div class="actions-section">
        <q-btn
          color="primary"
          label="Ver Análisis Completo"
          @click="goToFullAnalysis"
          class="primary-action"
          no-caps
          icon="analytics"
        />

        <div class="secondary-actions">
          <q-btn
            size="sm"
            outline
            color="primary"
            icon="refresh"
            @click="loadData"
            round
            class="refresh-btn"
          >
            <q-tooltip>Actualizar datos</q-tooltip>
          </q-btn>

          <q-btn
            size="sm"
            outline
            color="primary"
            icon="notifications"
            round
            class="alerts-btn"
            :badge="criticalAlerts.length || undefined"
            badge-color="negative"
          >
            <q-tooltip>Ver todas las alertas</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Footer con timestamp -->
      <div class="widget-footer">
        <div class="update-info">
          <q-icon name="access_time" size="xs" />
          <span>{{ formatTime(lastUpdate) }}</span>
        </div>
        <div class="auto-refresh-indicator">
          <q-icon name="autorenew" size="xs" />
          <span>Auto-actualización</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice } from '../utils/utilsFunctions'
import financialService from '../services/financialService'

const router = useRouter()

// Estado reactivo
const data = ref(null)
const loading = ref(false)
const error = ref(false)
const lastUpdate = ref(new Date())

// Computed
const criticalAlerts = computed(() => {
  if (!data.value?.alerts) return []
  return data.value.alerts.filter(alert =>
    alert.severity === 'critical' || alert.severity === 'warning'
  )
})

// Métodos
const loadData = async () => {
  loading.value = true
  error.value = false

  try {
    const response = await financialService.getDashboard()
    data.value = response.data
    lastUpdate.value = new Date()
  } catch (err) {
    console.error('Error loading financial widget data:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  if (!value) return '$0'

  // Formatear en miles (K) o millones (M) para espacios pequeños
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  } else {
    return formatPrice(value)
  }
}

const formatPercentage = (value) => {
  return `${(value || 0).toFixed(1)}%`
}

const formatTime = (date) => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getHealthScore = () => {
  if (!data.value) return 0

  let score = 0
  const overview = data.value.overview || {}

  // Factores de salud del negocio
  if (overview.profitMargin > 30) score += 0.3
  else if (overview.profitMargin > 15) score += 0.2
  else if (overview.profitMargin > 0) score += 0.1

  if (overview.totalRevenue > 0) score += 0.2
  if (overview.grossProfit > 0) score += 0.2
  if (overview.totalOrders > 0) score += 0.1

  // Penalizar por alertas críticas
  const criticalCount = criticalAlerts.value.length
  if (criticalCount === 0) score += 0.2
  else score -= (criticalCount * 0.1)

  return Math.max(0, Math.min(1, score))
}

const getHealthColor = () => {
  const score = getHealthScore()
  if (score >= 0.8) return 'positive'
  if (score >= 0.6) return 'warning'
  return 'negative'
}

const goToFullAnalysis = () => {
  router.push('/financial-analysis')
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

const getStatusColor = () => {
  if (error.value) return 'negative'
  if (loading.value) return 'warning'
  const score = getHealthScore()
  if (score >= 0.8) return 'positive'
  if (score >= 0.6) return 'warning'
  return 'negative'
}

const getStatusIcon = () => {
  if (error.value) return 'error'
  if (loading.value) return 'sync'
  const score = getHealthScore()
  if (score >= 0.8) return 'check_circle'
  if (score >= 0.6) return 'warning'
  return 'error'
}

const getStatusText = () => {
  if (error.value) return 'Error'
  if (loading.value) return 'Cargando'
  const score = getHealthScore()
  if (score >= 0.8) return 'Excelente'
  if (score >= 0.6) return 'Bueno'
  return 'Crítico'
}

// Auto-actualización cada 5 minutos
let autoRefresh = null

onMounted(() => {
  loadData()

  // Auto refresh cada 5 minutos
  autoRefresh = setInterval(() => {
    if (!loading.value) {
      loadData()
    }
  }, 5 * 60 * 1000)
})

// Cleanup
onUnmounted(() => {
  if (autoRefresh) {
    clearInterval(autoRefresh)
  }
})
</script>

<style scoped>
.financial-widget {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  min-height: 320px;
  max-width: 340px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.financial-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Header */
.widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.header-status {
  flex-shrink: 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-animation {
  margin-bottom: 1rem;
}

.loading-text {
  color: #666;
  font-size: 0.875rem;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.error-icon {
  color: #f44336;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-text {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.retry-btn {
  min-width: 100px;
}

/* Widget Content */
.widget-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Metrics Section */
.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.primary-metrics {
  display: flex;
  gap: 0.75rem;
}

.metric-card {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.metric-card.revenue {
  border-left: 3px solid #4caf50;
}

.metric-card.profit {
  border-left: 3px solid #2196f3;
}

.metric-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.revenue .metric-icon {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
}

.profit .metric-icon {
  background: linear-gradient(135deg, #2196f3, #64b5f6);
  color: white;
}

.metric-data {
  flex: 1;
  min-width: 0;
}

.metric-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  margin-bottom: 2px;
}

.metric-label {
  font-size: 0.6875rem;
  color: #666;
  font-weight: 500;
}

.metric-trend {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-trend.positive {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

/* Secondary Metrics */
.secondary-metrics {
  display: flex;
  gap: 0.5rem;
}

.metric-item {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-mini-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-mini-icon.margin {
  background: linear-gradient(135deg, #ff9800, #ffb74d);
  color: white;
}

.metric-mini-icon.orders {
  background: linear-gradient(135deg, #9c27b0, #ba68c8);
  color: white;
}

.metric-mini-data {
  flex: 1;
  min-width: 0;
}

.metric-mini-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
}

.metric-mini-label {
  font-size: 0.625rem;
  color: #666;
  font-weight: 500;
}

/* Health Section */
.health-section {
  background: linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 100%);
  border: 1px solid #e3f2fd;
  border-radius: 12px;
  padding: 0.75rem;
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.health-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
}

.health-score {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1a1a1a;
}

.health-bar {
  margin-bottom: 0.5rem;
}

.health-indicators {
  display: flex;
  justify-content: space-between;
  gap: 0.25rem;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  color: #999;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.indicator.active {
  opacity: 1;
  font-weight: 600;
}

.indicator.active:nth-child(1) {
  color: #4caf50;
}

.indicator.active:nth-child(2) {
  color: #ff9800;
}

.indicator.active:nth-child(3) {
  color: #f44336;
}

/* Alerts Section */
.alerts-section {
  background: linear-gradient(135deg, #fff3e0 0%, #ffebee 100%);
  border: 1px solid #ffcc02;
  border-radius: 12px;
  padding: 0.75rem;
}

.alerts-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.alert-icon {
  color: #ff9800;
  font-size: 1rem;
}

.alerts-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7);
}

.alert-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-critical .alert-indicator {
  background: #f44336;
}

.alert-warning .alert-indicator {
  background: #ff9800;
}

.alert-text {
  font-size: 0.6875rem;
  color: #666;
  line-height: 1.3;
}

/* Actions Section */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.primary-action {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.secondary-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.refresh-btn,
.alerts-btn {
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.refresh-btn:hover,
.alerts-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Widget Footer */
.widget-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
}

.update-info,
.auto-refresh-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  color: #999;
}

.auto-refresh-indicator {
  opacity: 0.7;
}

/* Animations */
.widget-content {
  animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .financial-widget {
    max-width: 100%;
    min-height: 280px;
  }

  .primary-metrics {
    flex-direction: column;
  }

  .metric-card {
    padding: 0.5rem;
  }
}
</style>
