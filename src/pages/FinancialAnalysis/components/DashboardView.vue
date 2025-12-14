<template>
  <div class="dashboard-view">
    <q-inner-loading :showing="loading" color="primary" />

    <!-- Header del Dashboard -->
    <div class="dashboard-header q-mb-xl">
      <div class="row items-center">
        <div class="col">
          <h5 class="dashboard-title">Panel de Control Financiero</h5>
          <p class="dashboard-subtitle">Resumen ejecutivo de métricas clave del negocio</p>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="refresh"
            label="Actualizar"
            @click="emit('refresh')"
            outline
            no-caps
          />
        </div>
      </div>
    </div>

    <!-- Métricas principales mejoradas -->
    <div class="metrics-grid q-mb-xl">
      <div class="metric-card revenue-card">
        <div class="metric-content">
          <div class="metric-icon">
            <q-icon name="monetization_on" />
          </div>
          <div class="metric-data">
            <div class="metric-value">{{ formatCurrency(data?.overview?.totalRevenue || 0) }}</div>
            <div class="metric-label">Ingresos Totales</div>
            <div class="metric-trend positive">
              <q-icon name="trending_up" />
              <span>+12.5% vs mes anterior</span>
            </div>
          </div>
        </div>
      </div>

      <div class="metric-card profit-card">
        <div class="metric-content">
          <div class="metric-icon">
            <q-icon name="savings" />
          </div>
          <div class="metric-data">
            <div class="metric-value">{{ formatCurrency(data?.overview?.grossProfit || 0) }}</div>
            <div class="metric-label">Ganancia Bruta</div>
            <div class="metric-trend positive">
              <q-icon name="trending_up" />
              <span>+8.3% vs mes anterior</span>
            </div>
          </div>
        </div>
      </div>

      <div class="metric-card margin-card">
        <div class="metric-content">
          <div class="metric-icon">
            <q-icon name="percent" />
          </div>
          <div class="metric-data">
            <div class="metric-value">{{ formatPercentage(data?.overview?.profitMargin || 0) }}</div>
            <div class="metric-label">Margen de Ganancia</div>
            <div class="metric-trend neutral">
              <q-icon name="trending_flat" />
              <span>Estable</span>
            </div>
          </div>
        </div>
      </div>

      <div class="metric-card inventory-card">
        <div class="metric-content">
          <div class="metric-icon">
            <q-icon name="inventory" />
          </div>
          <div class="metric-data">
            <div class="metric-value">{{ formatCurrency(data?.overview?.inventoryValue || 0) }}</div>
            <div class="metric-label">Valor de Inventario</div>
            <div class="metric-trend negative">
              <q-icon name="trending_down" />
              <span>-2.1% rotación lenta</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de análisis detallado -->
    <div class="analysis-section">
      <div class="row q-gutter-lg">
        <!-- Canales de venta mejorado -->
        <div class="col-12 col-lg-6">
          <q-card class="analysis-card">
            <q-card-section class="card-header">
              <div class="card-title">
                <q-icon name="pie_chart" class="card-icon" />
                <span>Distribución de Ventas</span>
              </div>
            </q-card-section>
            <q-card-section class="card-content">
              <div class="sales-channels">
                <div class="channel-item pos-channel">
                  <div class="channel-header">
                    <div class="channel-icon">
                      <q-icon name="store" />
                    </div>
                    <div class="channel-info">
                      <div class="channel-name">Punto de Venta</div>
                      <div class="channel-percentage">{{ formatPercentage(data?.salesChannels?.posPercentage || 0) }}</div>
                    </div>
                  </div>
                  <div class="channel-progress">
                    <q-linear-progress
                      :value="(data?.salesChannels?.posPercentage || 0) / 100"
                      color="primary"
                      size="8px"
                      rounded
                    />
                  </div>
                  <div class="channel-amount">{{ formatCurrency(data?.salesChannels?.posRevenue || 0) }}</div>
                </div>

                <div class="channel-item online-channel">
                  <div class="channel-header">
                    <div class="channel-icon">
                      <q-icon name="shopping_cart" />
                    </div>
                    <div class="channel-info">
                      <div class="channel-name">Ventas Online</div>
                      <div class="channel-percentage">{{ formatPercentage(data?.salesChannels?.onlinePercentage || 0) }}</div>
                    </div>
                  </div>
                  <div class="channel-progress">
                    <q-linear-progress
                      :value="(data?.salesChannels?.onlinePercentage || 0) / 100"
                      color="secondary"
                      size="8px"
                      rounded
                    />
                  </div>
                  <div class="channel-amount">{{ formatCurrency(data?.salesChannels?.onlineRevenue || 0) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Estadísticas de clientes mejorado -->
        <div class="col-12 col-lg-6">
          <q-card class="analysis-card">
            <q-card-section class="card-header">
              <div class="card-title">
                <q-icon name="people" class="card-icon" />
                <span>Métricas de Clientes</span>
              </div>
            </q-card-section>
            <q-card-section class="card-content">
              <div class="customer-stats">
                <div class="stat-row">
                  <div class="stat-item">
                    <div class="stat-icon orders-icon">
                      <q-icon name="receipt_long" />
                    </div>
                    <div class="stat-data">
                      <div class="stat-value">{{ data?.overview?.totalOrders || 0 }}</div>
                      <div class="stat-label">Total Pedidos</div>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="stat-icon customers-icon">
                      <q-icon name="person" />
                    </div>
                    <div class="stat-data">
                      <div class="stat-value">{{ data?.overview?.uniqueCustomers || 0 }}</div>
                      <div class="stat-label">Clientes Únicos</div>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-lg" />

                <div class="avg-order-section">
                  <div class="avg-order-header">
                    <q-icon name="analytics" class="avg-icon" />
                    <span>Valor Promedio por Pedido</span>
                  </div>
                  <div class="avg-order-value">{{ formatCurrency(data?.overview?.avgOrderValue || 0) }}</div>
                  <div class="avg-order-insight">
                    <q-icon name="info" size="sm" />
                    <span>Objetivo: $50,000 COP</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Tendencias de crecimiento -->
    <div class="trends-section q-mt-xl" v-if="data?.trends">
      <q-card class="trends-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="trending_up" class="card-icon" />
            <span>Tendencias de Crecimiento</span>
          </div>
          <q-chip color="positive" text-color="white" size="sm">
            En crecimiento
          </q-chip>
        </q-card-section>
        <q-card-section class="card-content">
          <div class="trends-grid">
            <div class="trend-item daily">
              <div class="trend-period">Diario</div>
              <div class="trend-value" :class="getTrendClass(data.trends.dailyGrowth)">
                <q-icon :name="getTrendIcon(data.trends.dailyGrowth)" />
                {{ formatPercentage(data.trends.dailyGrowth) }}
              </div>
              <div class="trend-description">Últimas 24 horas</div>
            </div>

            <div class="trend-item weekly">
              <div class="trend-period">Semanal</div>
              <div class="trend-value" :class="getTrendClass(data.trends.weeklyGrowth)">
                <q-icon :name="getTrendIcon(data.trends.weeklyGrowth)" />
                {{ formatPercentage(data.trends.weeklyGrowth) }}
              </div>
              <div class="trend-description">Última semana</div>
            </div>

            <div class="trend-item monthly">
              <div class="trend-period">Mensual</div>
              <div class="trend-value" :class="getTrendClass(data.trends.monthlyGrowth)">
                <q-icon :name="getTrendIcon(data.trends.monthlyGrowth)" />
                {{ formatPercentage(data.trends.monthlyGrowth) }}
              </div>
              <div class="trend-description">Último mes</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Alertas del negocio mejoradas -->
    <div class="alerts-section q-mt-xl" v-if="data?.alerts && data.alerts.length > 0">
      <q-card class="alerts-card">
        <q-card-section class="card-header">
          <div class="card-title">
            <q-icon name="notification_important" class="card-icon" />
            <span>Alertas del Negocio</span>
          </div>
          <q-chip :color="getOverallAlertColor()" text-color="white" size="sm">
            {{ data.alerts.length }} alerta(s)
          </q-chip>
        </q-card-section>
        <q-card-section class="card-content">
          <div class="alerts-list">
            <div
              v-for="(alert, index) in data.alerts"
              :key="index"
              class="alert-item"
              :class="`alert-${alert.severity}`"
            >
              <div class="alert-icon">
                <q-icon :name="getAlertIcon(alert.severity)" />
              </div>
              <div class="alert-content">
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-action">{{ alert.action }}</div>
              </div>
              <div class="alert-badge">
                <q-chip
                  :color="getAlertColor(alert.severity)"
                  text-color="white"
                  size="sm"
                >
                  {{ formatSeverity(alert.severity) }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../../../utils/utilsFunctions'

// Props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['refresh'])

// Métodos de formateo
const formatCurrency = (value) => {
  return formatPrice(value)
}

const formatPercentage = (value) => {
  return `${value?.toFixed(1) || '0.0'}%`
}

const getTrendColor = (value) => {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-negative'
  return 'text-grey'
}

const getTrendClass = (value) => {
  if (value > 5) return 'trend-positive'
  if (value > 0) return 'trend-neutral'
  return 'trend-negative'
}

const getTrendIcon = (value) => {
  if (value > 5) return 'trending_up'
  if (value > 0) return 'trending_flat'
  return 'trending_down'
}

const getAlertColor = (severity) => {
  switch (severity) {
    case 'critical': return 'negative'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'grey'
  }
}

const getAlertIcon = (severity) => {
  switch (severity) {
    case 'critical': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'notifications'
  }
}

const formatSeverity = (severity) => {
  switch (severity) {
    case 'critical': return 'Crítico'
    case 'warning': return 'Alerta'
    case 'info': return 'Info'
    default: return severity
  }
}

const getOverallAlertColor = () => {
  if (!data?.alerts?.length) return 'grey'

  if (data.alerts.some(alert => alert.severity === 'critical')) return 'negative'
  if (data.alerts.some(alert => alert.severity === 'warning')) return 'warning'
  return 'info'
}
</script>

<style scoped>
.dashboard-view {
  position: relative;
}

/* Header del Dashboard */
.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  color: #1a1a1a;
  font-size: 1.5rem;
}

.dashboard-subtitle {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

/* Grid de métricas principales */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.revenue-card {
  --card-color: #667eea;
  --card-color-light: #764ba2;
}

.profit-card {
  --card-color: #4caf50;
  --card-color-light: #81c784;
}

.margin-card {
  --card-color: #2196f3;
  --card-color-light: #64b5f6;
}

.inventory-card {
  --card-color: #ff9800;
  --card-color-light: #ffb74d;
}

.metric-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--card-color), var(--card-color-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.metric-data {
  flex: 1;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.metric-label {
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  width: fit-content;
}

.metric-trend.positive {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.metric-trend.negative {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.metric-trend.neutral {
  color: #666;
  background: rgba(0, 0, 0, 0.05);
}

/* Sección de análisis */
.analysis-section {
  margin-bottom: 2rem;
}

.analysis-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  border-bottom: 1px solid #e0e0e0;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
}

.card-icon {
  color: #667eea;
}

.card-content {
  padding: 1.5rem;
}

/* Canales de venta */
.sales-channels {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.channel-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.channel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.channel-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pos-channel .channel-icon {
  color: #667eea;
}

.online-channel .channel-icon {
  color: #9c27b0;
}

.channel-info {
  flex: 1;
}

.channel-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.channel-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.channel-progress {
  margin-bottom: 0.5rem;
}

.channel-amount {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

/* Estadísticas de clientes */
.customer-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.orders-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.customers-icon {
  background: linear-gradient(135deg, #4caf50, #81c784);
}

.stat-data {
  flex: 1;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.125rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.avg-order-section {
  text-align: center;
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.avg-order-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #666;
}

.avg-icon {
  color: #667eea;
}

.avg-order-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.avg-order-insight {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #666;
}

/* Tendencias */
.trends-section {
  margin-bottom: 2rem;
}

.trends-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.trend-item {
  text-align: center;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.trend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.trend-period {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.75rem;
}

.trend-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.trend-positive {
  color: #4caf50;
}

.trend-neutral {
  color: #666;
}

.trend-negative {
  color: #f44336;
}

.trend-description {
  font-size: 0.75rem;
  color: #999;
}

/* Alertas */
.alerts-section {
  margin-bottom: 2rem;
}

.alerts-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.alert-item:hover {
  transform: translateX(4px);
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

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-message {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.alert-action {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.alert-badge {
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-row {
    grid-template-columns: 1fr;
  }

  .trends-grid {
    grid-template-columns: 1fr;
  }

  .metric-card {
    padding: 1rem;
  }

  .card-content {
    padding: 1rem;
  }
}
</style>
