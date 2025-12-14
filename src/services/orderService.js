import { apiOrder } from './api.js'

import axios from 'axios'

// Nueva instancia para pedidos online
const apiOnlineOrder = axios.create({
  baseURL: 'http://localhost:3000/api/online-orders'
})

// Servicio para gestión de órdenes POS y pedidos online
const orderService = {
  // Crear nueva orden POS (para punto de venta)
  async createPOSOrder(orderData) {
    try {
      const response = await apiOrder.post('', orderData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Crear pedido online (para clientes desde el carrito)
  async createOnlineOrder(orderData) {
    try {
      // Transformar datos del carrito al formato esperado por el backend
      const transformedData = {
        customer: {
          name: orderData.deliveryAddress?.contactName || '',
          email: orderData.deliveryAddress?.email || '',
          phone: orderData.deliveryAddress?.phoneContact || '',
          address: orderData.deliveryAddress?.address || '',
          city: orderData.deliveryAddress?.city || '',
          state: orderData.deliveryAddress?.department || 'Huila',
          notes: orderData.deliveryAddress?.notes || '',
        },
        items: orderData.items?.map(item => ({
          product: item._id || item.id,
          name: item.name || '',
          sku: item.sku || '',
          quantity: item.quantity || 1,
          price: item.priceUnit || item.price || 0,
          image: item.image || '',
          selectedVariant: item.references ? {
            selections: item.references.reduce((acc, ref) => {
              acc[ref.name] = ref.selectedOption
              return acc
            }, {})
          } : undefined
        })) || [],
        subtotal: orderData.totalToPay || 0,
        total: orderData.totalToPay || 0,
        discountAmount: 0,
        shippingCost: 0,
        deliveryType: orderData.deliveryType || 'normal',
        internalNotes: `Pedido online - Tipo de entrega: ${orderData.deliveryType || 'Entrega normal'}`
      }

      return response.data
    } catch (error) {
      throw error
    }
  },

  // Mantener createOrder para compatibilidad con POS (apunta a createPOSOrder)
  async createOrder(orderData) {
    return this.createPOSOrder(orderData)
  },

  // Obtener órdenes con filtros
  async getOrders(filters = {}) {
    try {
      const params = new URLSearchParams()

      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key])
        }
      })

      const response = await apiOrder.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener orden por ID
  async getOrder(orderId) {
    try {
      const response = await apiOrder.get(`/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching order:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener órdenes de hoy
  async getTodaysOrders() {
    try {
      const response = await apiOrder.get('/today')
      return response.data
    } catch (error) {
      console.error('Error fetching today orders:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener dashboard del POS
  async getPOSDashboard() {
    try {
      const response = await apiOrder.get('/dashboard')
      return response.data
    } catch (error) {
      console.error('Error fetching POS dashboard:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener estadísticas de ventas
  async getSalesStats(dateFrom, dateTo) {
    try {
      const response = await apiOrder.get('/stats', {
        params: { dateFrom, dateTo }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching sales stats:', error)
      throw this.handleApiError(error)
    }
  },

  // Actualizar estado de orden
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiOrder.patch(`/${orderId}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw this.handleApiError(error)
    }
  },

  // Cancelar orden
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await apiOrder.patch(`/${orderId}/cancel`, { reason })
      return response.data
    } catch (error) {
      console.error('Error cancelling order:', error)
      throw this.handleApiError(error)
    }
  },

  // Procesar devolución de orden
  async processReturn(orderId, returnData) {
    try {
      const response = await apiOrder.patch(`/${orderId}/return`, returnData)
      return response.data
    } catch (error) {
      console.error('Error processing return:', error)
      throw this.handleApiError(error)
    }
  },

  // Obtener órdenes online
  async getOnlineOrders(filters = {}) {
    try {
      const params = new URLSearchParams()

      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key])
        }
      })

      const response = await apiOnlineOrder.get(`?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching online orders:', error)
      throw this.handleApiError(error)
    }
  },

  // Actualizar estado de orden online
  async updateOnlineOrderStatus(orderId, status) {
    try {
      const response = await apiOnlineOrder.patch(`/${orderId}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating online order status:', error)
      throw this.handleApiError(error)
    }
  },

  // Manejar errores de la API
  handleApiError(error) {
    if (error.response) {
      // Error del servidor con respuesta
      const message = error.response.data?.message || 'Error del servidor'
      return new Error(message)
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifique su conexión a internet.')
    } else {
      // Error en la configuración de la petición
      return new Error('Error al procesar la solicitud.')
    }
  }
}

// Exportar como default y también como exportaciones con nombre
export default orderService
export const createOrder = orderService.createOrder.bind(orderService)
export const createPOSOrder = orderService.createPOSOrder.bind(orderService)
export const createOnlineOrder = orderService.createOnlineOrder.bind(orderService)
export const getOrders = orderService.getOrders.bind(orderService)
export const getOrder = orderService.getOrder.bind(orderService)
export const getTodaysOrders = orderService.getTodaysOrders.bind(orderService)
export const getPOSDashboard = orderService.getPOSDashboard.bind(orderService)
export const getSalesStats = orderService.getSalesStats.bind(orderService)
export const updateOrderStatus = orderService.updateOrderStatus.bind(orderService)
export const cancelOrder = orderService.cancelOrder.bind(orderService)
export const processReturn = orderService.processReturn.bind(orderService)
export const getOnlineOrders = orderService.getOnlineOrders.bind(orderService)
export const updateOnlineOrderStatus = orderService.updateOnlineOrderStatus.bind(orderService)
