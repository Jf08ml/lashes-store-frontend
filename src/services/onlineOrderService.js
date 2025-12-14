import { apiOnlineOrder } from './api.js'

// Servicio específico para pedidos online (desde carrito)

export const createOnlineOrder = async (orderData) => {
  try {
    const response = await apiOnlineOrder.post('/', orderData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getPendingOrders = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.get('/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getAllOrders = async (status = 'all', page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.get('/all', {
      params: { status, page, limit },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getStats = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.get('/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const confirmOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.patch(`/${orderId}/confirm`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const rejectOrder = async (orderId, reason) => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.patch(`/${orderId}/reject`, { reason }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateOrderStatus = async (orderId, status, notes) => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.patch(`/${orderId}/status`, { status, notes }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const processReturn = async (orderId, returnData) => {
  try {
    const token = localStorage.getItem('token')
    const response = await apiOnlineOrder.patch(`/${orderId}/return`, returnData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
