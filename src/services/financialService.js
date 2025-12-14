import api from './api'

// Servicio para análisis financiero completo
export const financialService = {

  // Dashboard principal con métricas generales
  async getDashboard() {
    try {
      const response = await api.get('/financial/dashboard')
      return response.data
    } catch (error) {
      console.error('Error obteniendo dashboard financiero:', error)
      throw error
    }
  },

  // Análisis detallado por período
  async getDetailedAnalysis(period = 'month') {
    try {
      const response = await api.get('/financial/detailed', {
        params: { period }
      })
      return response.data
    } catch (error) {
      console.error('Error obteniendo análisis detallado:', error)
      throw error
    }
  },

  // Análisis de productos
  async getProductAnalysis() {
    try {
      const response = await api.get('/financial/products')
      return response.data
    } catch (error) {
      console.error('Error obteniendo análisis de productos:', error)
      throw error
    }
  },

  // Análisis de flujo de caja
  async getCashFlowAnalysis(startDate, endDate) {
    try {
      const params = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await api.get('/financial/cashflow', { params })
      return response.data
    } catch (error) {
      console.error('Error obteniendo análisis de flujo de caja:', error)
      throw error
    }
  },

  // KPIs del negocio
  async getKPIs() {
    try {
      const response = await api.get('/financial/kpis')
      return response.data
    } catch (error) {
      console.error('Error obteniendo KPIs:', error)
      throw error
    }
  },

  // Análisis de rentabilidad
  async getProfitabilityAnalysis() {
    try {
      const response = await api.get('/financial/profitability')
      return response.data
    } catch (error) {
      console.error('Error obteniendo análisis de rentabilidad:', error)
      throw error
    }
  },

  // Análisis de inventario
  async getInventoryAnalysis() {
    try {
      const response = await api.get('/financial/inventory')
      return response.data
    } catch (error) {
      console.error('Error obteniendo análisis de inventario:', error)
      throw error
    }
  },

  // Pronóstico financiero
  async getForecastAnalysis(months = 3) {
    try {
      const response = await api.get('/financial/forecast', {
        params: { months }
      })
      return response.data
    } catch (error) {
      console.error('Error obteniendo pronóstico financiero:', error)
      throw error
    }
  },

  // Análisis comparativo de períodos
  async getComparativeAnalysis(currentPeriod, previousPeriod) {
    try {
      const [current, previous] = await Promise.all([
        this.getDetailedAnalysis(currentPeriod),
        this.getDetailedAnalysis(previousPeriod)
      ])

      return {
        current: current.data,
        previous: previous.data,
        comparison: {
          salesGrowth: this.calculateGrowth(current.data.financial.sales, previous.data.financial.sales),
          profitGrowth: this.calculateGrowth(current.data.financial.profit, previous.data.financial.profit),
          expensesGrowth: this.calculateGrowth(current.data.financial.expenses, previous.data.financial.expenses)
        }
      }
    } catch (error) {
      console.error('Error obteniendo análisis comparativo:', error)
      throw error
    }
  },

  // Resumen ejecutivo para toma de decisiones
  async getExecutiveSummary() {
    try {
      const response = await api.get('/financial/executive-summary')
      return response.data
    } catch (error) {
      console.error('Error obteniendo resumen ejecutivo:', error)
      throw error
    }
  },

  // Métodos auxiliares
  calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  },

  generateRecommendations(data) {
    const recommendations = []

    // Recomendaciones basadas en rentabilidad
    if (data.profitability.summary.avgMargin < 30) {
      recommendations.push({
        type: 'profitability',
        priority: 'high',
        title: 'Margen de ganancia bajo',
        description: 'El margen promedio está por debajo del 30%. Considera revisar precios o costos.',
        actions: [
          'Revisar precios de productos de baja rentabilidad',
          'Negociar mejores costos con proveedores',
          'Optimizar procesos para reducir costos operativos'
        ]
      })
    }

    // Recomendaciones basadas en inventario
    if (data.inventory.summary.lowStock > 0) {
      recommendations.push({
        type: 'inventory',
        priority: 'medium',
        title: 'Productos con stock bajo',
        description: `${data.inventory.summary.lowStock} productos requieren reposición.`,
        actions: [
          'Crear orden de compra para productos con stock bajo',
          'Implementar sistema de alertas automáticas',
          'Revisar políticas de inventario mínimo'
        ]
      })
    }

    // Recomendaciones basadas en KPIs
    if (data.kpis.growth.monthly < data.kpis.growth.target) {
      recommendations.push({
        type: 'growth',
        priority: 'high',
        title: 'Crecimiento por debajo de la meta',
        description: 'El crecimiento mensual está por debajo del objetivo.',
        actions: [
          'Implementar estrategias de marketing digital',
          'Ampliar canales de venta',
          'Mejorar la experiencia del cliente'
        ]
      })
    }

    // Recomendaciones basadas en flujo de caja
    if (data.dashboard.overview.grossProfit < 0) {
      recommendations.push({
        type: 'cashflow',
        priority: 'critical',
        title: 'Flujo de caja negativo',
        description: 'Los gastos superan los ingresos. Acción inmediata requerida.',
        actions: [
          'Revisar y reducir gastos no esenciales',
          'Acelerar la cobranza de cuentas pendientes',
          'Considerar línea de crédito temporal'
        ]
      })
    }

    return recommendations
  },

  // Análisis de tendencias
  async getTrendAnalysis(months = 6) {
    try {
      const periods = ['week', 'month', 'quarter']
      const trendData = await Promise.all(
        periods.map(period => this.getDetailedAnalysis(period))
      )

      return {
        weekly: trendData[0].data,
        monthly: trendData[1].data,
        quarterly: trendData[2].data,
        trends: {
          sales: this.calculateTrend(trendData.map(d => d.data.financial.sales)),
          profit: this.calculateTrend(trendData.map(d => d.data.financial.profit)),
          expenses: this.calculateTrend(trendData.map(d => d.data.financial.expenses))
        }
      }
    } catch (error) {
      console.error('Error obteniendo análisis de tendencias:', error)
      throw error
    }
  },

  calculateTrend(data) {
    if (data.length < 2) return 0

    // Cálculo simple de tendencia (pendiente)
    const n = data.length
    const sumX = (n * (n + 1)) / 2
    const sumY = data.reduce((sum, val) => sum + val, 0)
    const sumXY = data.reduce((sum, val, index) => sum + val * (index + 1), 0)
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    return slope
  }
}

export default financialService
