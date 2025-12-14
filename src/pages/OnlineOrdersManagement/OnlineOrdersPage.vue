<template>
  <q-page class="online-orders-page q-pa-md">
    <div class="row q-gutter-md">
      <!-- Header -->
      <div class="col-12">
        <q-card class="header-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <h5 class="q-my-none">📦 Gestión de Pedidos Online</h5>
                <p class="text-grey-6 q-mb-none">
                  Confirma o rechaza pedidos realizados desde el carrito web
                </p>
              </div>
              <div class="col-auto">
                <q-btn
                  color="primary"
                  icon="refresh"
                  label="Actualizar"
                  @click="loadOrders(true)"
                  :loading="loading"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Filters and Tabs -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-tabs
              v-model="activeTab"
              @update:model-value="loadOrders"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="pending" icon="schedule" label="Pendientes" />
              <q-tab name="confirmed" icon="check_circle" label="Confirmados" />
              <q-tab name="preparing" icon="build" label="Preparando" />
              <q-tab name="shipped" icon="local_shipping" label="Enviados" />
              <q-tab name="delivered" icon="done_all" label="Entregados" />
              <q-tab name="rejected" icon="cancel" label="Rechazados" />
              <q-tab name="returned" icon="undo" label="Devoluciones" />
              <q-tab name="all" icon="list" label="Todos" />
            </q-tabs>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <div class="row q-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card pending">
              <q-card-section>
                <div class="stat-number">{{ pendingCount }}</div>
                <div class="stat-label">Pedidos Pendientes</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card confirmed">
              <q-card-section>
                <div class="stat-number">{{ confirmedToday }}</div>
                <div class="stat-label">Confirmados Hoy</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card revenue">
              <q-card-section>
                <div class="stat-number">{{ formatPrice(totalPendingValue) }}</div>
                <div class="stat-label">Valor Pendiente</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card rejected">
              <q-card-section>
                <div class="stat-number">{{ rejectedToday }}</div>
                <div class="stat-label">Rechazados Hoy</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ tabTitle }}</div>

            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner size="40px" />
              <div class="q-mt-md">Cargando pedidos...</div>
            </div>

            <div v-else-if="!orders.length" class="text-center q-pa-lg">
              <q-icon name="inbox" size="64px" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-6">No hay pedidos {{ getEmptyMessage() }}</div>
              <p class="text-grey-6">Los pedidos aparecerán aquí cuando cambien de estado</p>
            </div>

            <div v-else class="orders-list">
              <q-card
                v-for="order in orders"
                :key="order._id"
                class="order-card q-mb-md"
                bordered
              >
                <q-card-section>
                  <div class="row">
                    <!-- Order Info -->
                    <div class="col-12 col-md-8">
                      <div class="order-header">
                        <div class="order-number">
                          {{ order.orderNumber }}
                          <q-chip
                            :color="getStatusColor(order.status)"
                            text-color="white"
                            size="sm"
                          >
                            {{ getStatusLabel(order.status) }}
                          </q-chip>
                        </div>
                        <div class="order-date">
                          {{ formatDate(order.createdAt) }}
                        </div>
                      </div>

                      <div class="customer-info q-mt-md">
                        <div><strong>Cliente:</strong> {{ order.customer.name }}</div>
                        <div v-if="order.customer.phone">
                          <strong>Teléfono:</strong> {{ order.customer.phone }}
                        </div>
                        <div v-if="order.customer.email">
                          <strong>Email:</strong> {{ order.customer.email }}
                        </div>
                        <div><strong>Dirección:</strong> {{ order.customer.address }}, {{ order.customer.city }}</div>
                      </div>

                      <!-- Items -->
                      <div class="items-preview q-mt-md">
                        <div class="items-header">
                          <strong>Productos ({{ order.items.length }})</strong>
                        </div>
                        <div class="items-list">
                          <div
                            v-for="item in order.items"
                            :key="item._id"
                            class="item-row"
                          >
                            <div class="item-image">
                              <img
                                :src="item.productSnapshot?.image || item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMiAxNEgyOFYyNkgxMlYxNFoiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KPHA+PC9wPjwvc3ZnPgo='"
                                :alt="item.name"
                                @error="handleImageError"
                              />
                            </div>
                            <div class="item-details">
                              <div class="item-name">{{ item.name }}</div>
                              <div class="item-variants" v-if="item.selectedVariant?.selections">
                                <span
                                  v-for="(value, key) in item.selectedVariant.selections"
                                  :key="key"
                                  class="variant-chip"
                                >
                                  {{ key }}: {{ value }}
                                </span>
                              </div>
                              <div class="item-quantity-price">
                                {{ item.quantity }} x {{ formatPrice(item.price) }} = {{ formatPrice(item.price * item.quantity) }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Actions & Total -->
                    <div class="col-12 col-md-4">
                      <div class="order-actions">
                        <div class="total-section">
                          <div class="total-label">Total del Pedido</div>
                          <div class="total-amount">{{ formatPrice(order.total) }}</div>
                        </div>

                        <div class="action-buttons q-mt-md">
                          <!-- Botones para pedidos pendientes -->
                          <template v-if="order.status === 'pending_confirmation'">
                            <q-btn
                              color="positive"
                              icon="check_circle"
                              label="Confirmar Pedido"
                              @click="confirmOrder(order._id)"
                              :loading="processingOrders[order._id]"
                              class="full-width q-mb-sm"
                            >
                              <q-tooltip>Confirmar pedido y reducir stock</q-tooltip>
                            </q-btn>

                            <q-btn
                              color="negative"
                              icon="cancel"
                              label="Rechazar"
                              @click="showRejectDialog(order)"
                              :loading="processingOrders[order._id]"
                              class="full-width"
                              outline
                            >
                              <q-tooltip>Rechazar pedido por falta de stock</q-tooltip>
                            </q-btn>
                          </template>

                          <!-- Botones para pedidos confirmados -->
                          <template v-else-if="order.status === 'confirmed'">
                            <q-btn
                              color="info"
                              icon="build"
                              label="Marcar como Preparando"
                              @click="updateOrderStatus(order._id, 'preparing')"
                              :loading="processingOrders[order._id]"
                              class="full-width q-mb-sm"
                            />
                          </template>

                          <!-- Botones para pedidos en preparación -->
                          <template v-else-if="order.status === 'preparing'">
                            <q-btn
                              color="orange"
                              icon="local_shipping"
                              label="Marcar como Enviado"
                              @click="updateOrderStatus(order._id, 'shipped')"
                              :loading="processingOrders[order._id]"
                              class="full-width q-mb-sm"
                            />
                          </template>

                          <!-- Botones para pedidos enviados -->
                          <template v-else-if="order.status === 'shipped'">
                            <q-btn
                              color="positive"
                              icon="done_all"
                              label="Marcar como Entregado"
                              @click="updateOrderStatus(order._id, 'delivered')"
                              :loading="processingOrders[order._id]"
                              class="full-width q-mb-sm"
                            />
                          </template>

                          <!-- Botones para pedidos entregados -->
                          <template v-else-if="order.status === 'delivered'">
                            <q-btn
                              color="warning"
                              icon="undo"
                              label="Procesar Devolución"
                              @click="showReturnDialog(order)"
                              :loading="processingOrders[order._id]"
                              class="full-width q-mb-sm"
                              outline
                            />
                            <q-chip
                              color="positive"
                              text-color="white"
                              icon="done_all"
                              class="full-width"
                            >
                              Pedido Entregado
                            </q-chip>
                          </template>

                          <!-- Estado final - solo mostrar información -->
                          <template v-else>
                            <q-chip
                              :color="getStatusColor(order.status)"
                              text-color="white"
                              icon="info"
                              class="full-width"
                            >
                              {{ getStatusLabel(order.status) }}
                            </q-chip>
                          </template>
                        </div>

                        <div class="order-notes q-mt-md" v-if="order.notes || order.internalNotes">
                          <div class="notes-title">Notas:</div>
                          <div v-if="order.notes" class="note-item">
                            <strong>Cliente:</strong> {{ order.notes }}
                          </div>
                          <div v-if="order.internalNotes" class="note-item">
                            <strong>Interno:</strong> {{ order.internalNotes }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Reject Dialog -->
    <q-dialog v-model="rejectDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Rechazar Pedido</div>
        </q-card-section>

        <q-card-section>
          <p>¿Estás seguro que deseas rechazar el pedido <strong>{{ selectedOrder?.orderNumber }}</strong>?</p>
          <q-input
            v-model="rejectReason"
            label="Motivo del rechazo"
            placeholder="Ej: Sin stock disponible"
            outlined
            autogrow
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="negative"
            label="Confirmar Rechazo"
            @click="confirmReject"
            :loading="rejecting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Status Change Dialog -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ confirmDialogTitle }}</div>
        </q-card-section>

        <q-card-section>
          <p>{{ confirmDialogMessage }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="handleConfirmCancel" />
          <q-btn
            color="primary"
            label="Confirmar"
            @click="handleConfirmOk"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Return Dialog -->
    <q-dialog v-model="returnDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">🔄 Procesar Devolución</div>
          <p class="text-grey-6 q-mb-md">
            Gestionar devolución del pedido: {{ selectedOrder?.orderNumber }}
          </p>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="returnReason"
            :options="returnReasons"
            label="Motivo de la devolución"
            outlined
            :rules="[val => !!val || 'Seleccione un motivo']"
          />

          <q-select
            v-if="returnReason?.value === 'product_exchange'"
            v-model="exchangeProductId"
            :options="productsList"
            option-label="label"
            option-value="value"
            label="Producto para intercambio"
            outlined
            use-input
            input-debounce="0"
            @filter="filterProducts"
            clearable
            class="q-mt-md"
          />

          <q-input
            v-model="returnNotes"
            type="textarea"
            label="Notas adicionales (opcional)"
            outlined
            rows="3"
            class="q-mt-md"
          />

          <q-checkbox
            v-model="refundToCustomer"
            label="Procesar reembolso al cliente"
            color="primary"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            flat
            label="Procesar Devolución"
            color="warning"
            @click="processReturn"
            :loading="processingReturn"
            :disable="!returnReason"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { getPendingOrders, getAllOrders, getStats, confirmOrder as confirmOrderAPI, rejectOrder as rejectOrderAPI, updateOrderStatus as updateOrderStatusAPI, processReturn as processReturnAPI } from 'src/services/onlineOrderService'
import { getProducts } from 'src/services/productService'
import { Notify, useQuasar } from 'quasar'

// Quasar instance
const $q = useQuasar()

// State
const orders = ref([])
const loading = ref(false)
const processingOrders = ref({})
const rejectDialog = ref(false)
const selectedOrder = ref(null)
const rejectReason = ref('')
const rejecting = ref(false)

// Return dialog state
const returnDialog = ref(false)
const returnReason = ref(null)
const returnNotes = ref('')
const exchangeProductId = ref(null)
const refundToCustomer = ref(true)
const processingReturn = ref(false)
const productsList = ref([])
const allProductsList = ref([]) // Para mantener la lista completa para filtros

// Return reasons options
const returnReasons = [
  { label: 'Producto defectuoso', value: 'defective_product' },
  { label: 'Producto no coincide con descripción', value: 'wrong_description' },
  { label: 'Cliente cambió de opinión', value: 'customer_regret' },
  { label: 'Intercambio por otro producto', value: 'product_exchange' },
  { label: 'Daño durante envío', value: 'shipping_damage' },
  { label: 'Talla incorrecta', value: 'wrong_size' },
  { label: 'Otro motivo', value: 'other' }
]
const lastLoadTime = ref(0)
const activeTab = ref('pending')
const confirmDialog = ref(false)
const confirmDialogMessage = ref('')
const confirmDialogTitle = ref('')
const confirmResolve = ref(null)
const stats = ref({
  pendingCount: 0,
  confirmedToday: 0,
  rejectedToday: 0,
  totalPendingValue: 0,
  totalConfirmedTodayValue: 0
})

// Cleanup
let pollingInterval = null

// Computed
const pendingCount = computed(() => stats.value.pendingCount)
const confirmedToday = computed(() => stats.value.confirmedToday)
const rejectedToday = computed(() => stats.value.rejectedToday)

const totalPendingValue = computed(() => stats.value.totalPendingValue)

const avgOrderValue = computed(() => {
  return orders.value.length > 0 ? totalPendingValue.value / orders.value.length : 0
})

const tabTitle = computed(() => {
  switch (activeTab.value) {
    case 'pending': return 'Pedidos Pendientes de Confirmación'
    case 'confirmed': return 'Pedidos Confirmados'
    case 'preparing': return 'Pedidos en Preparación'
    case 'shipped': return 'Pedidos Enviados'
    case 'delivered': return 'Pedidos Entregados'
    case 'rejected': return 'Pedidos Rechazados'
    case 'all': return 'Todos los Pedidos'
    default: return 'Pedidos Online'
  }
})

// Methods
const loadStats = async () => {
  try {
    const response = await getStats()
    if (response && response.data) {
      stats.value = response.data
    }
  } catch (error) {
    // Handle error silently
  }
}

const loadOrders = async (force = false) => {
  // Evitar cargas demasiado frecuentes (menos de 2 segundos)
  const now = Date.now()
  if (!force && (now - lastLoadTime.value) < 2000) {
    return
  }

  if (loading.value) {
    return
  }

  loading.value = true
  lastLoadTime.value = now

  try {
    let response
    if (activeTab.value === 'pending') {
      response = await getPendingOrders()
    } else {
      const statusMap = {
        'confirmed': 'confirmed',
        'preparing': 'preparing',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'rejected': 'rejected',
        'returned': 'returned',
        'all': 'all'
      }
      response = await getAllOrders(statusMap[activeTab.value] || 'all')
    }

    if (response && response.data) {
      orders.value = response.data
    } else {
      orders.value = []
    }

    // Cargar estadísticas también
    await loadStats()

  } catch (error) {
    // Solo mostrar notificación si no es un error de autenticación
    if (error.response?.status !== 401) {
      Notify.create({
        type: 'negative',
        message: 'Error al cargar pedidos',
        position: 'top'
      })
    }
  } finally {
    loading.value = false
  }
}

// Mantener compatibilidad con función anterior
const loadPendingOrders = (force = false) => {
  activeTab.value = 'pending'
  return loadOrders(force)
}

const confirmOrder = async (orderId) => {
  processingOrders.value[orderId] = true
  try {
    const response = await confirmOrderAPI(orderId)

    // Remover el pedido de la lista si cambia de estado
    if (activeTab.value === 'pending') {
      orders.value = orders.value.filter(order => order._id !== orderId)
    } else {
      // Recargar para actualizar el estado
      loadOrders(true)
    }

    Notify.create({
      type: 'positive',
      message: 'Pedido confirmado exitosamente. Stock reducido.',
      position: 'top'
    })

    // Actualizar estadísticas
    await loadStats()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.message || 'Error al confirmar el pedido',
      position: 'top'
    })
  } finally {
    processingOrders.value[orderId] = false
  }
}

const showRejectDialog = (order) => {
  selectedOrder.value = order
  rejectReason.value = ''
  rejectDialog.value = true
}

const confirmReject = async () => {
  if (!selectedOrder.value) return

  rejecting.value = true
  try {
    await rejectOrderAPI(selectedOrder.value._id, rejectReason.value)

    // Remover el pedido de la lista si estamos en pendientes
    if (activeTab.value === 'pending') {
      orders.value = orders.value.filter(order => order._id !== selectedOrder.value._id)
    } else {
      // Recargar para actualizar el estado
      loadOrders(true)
    }

    Notify.create({
      type: 'warning',
      message: 'Pedido rechazado. Cliente será notificado.',
      position: 'top'
    })

    rejectDialog.value = false
    // Actualizar estadísticas
    await loadStats()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.message || 'Error al rechazar el pedido',
      position: 'top'
    })
  } finally {
    rejecting.value = false
  }
}

// Función para mostrar diálogo de confirmación
const showConfirmDialog = (newStatus) => {
  return new Promise((resolve) => {
    const statusLabels = {
      'preparing': 'preparación',
      'shipped': 'enviado',
      'delivered': 'entregado'
    }

    confirmDialogTitle.value = 'Confirmar cambio de estado'
    confirmDialogMessage.value = `¿Estás seguro que deseas marcar este pedido como "${statusLabels[newStatus] || newStatus}"?`
    confirmResolve.value = resolve
    confirmDialog.value = true
  })
}

// Funciones para el diálogo de confirmación
const handleConfirmOk = () => {
  if (confirmResolve.value) {
    confirmResolve.value(true)
  }
  confirmDialog.value = false
}

const handleConfirmCancel = () => {
  if (confirmResolve.value) {
    confirmResolve.value(false)
  }
  confirmDialog.value = false
}

const updateOrderStatus = async (orderId, newStatus) => {
  // Mostrar diálogo de confirmación para cambios importantes
  const shouldConfirm = await showConfirmDialog(newStatus)

  if (!shouldConfirm) return

  processingOrders.value[orderId] = true
  try {
    const response = await updateOrderStatusAPI(orderId, newStatus)

    // Actualizar el pedido en la lista o recargarlo según el contexto
    const orderIndex = orders.value.findIndex(order => order._id === orderId)
    if (orderIndex !== -1) {
      // Si estamos en la pestaña correcta para el nuevo estado, actualizar in-place
      const newStatusTab = getTabForStatus(newStatus)
      if (activeTab.value === newStatusTab || activeTab.value === 'all') {
        orders.value[orderIndex].status = newStatus
      } else {
        // Si cambió de pestaña, remover de la lista actual
        orders.value.splice(orderIndex, 1)
      }
    }

    // Actualizar estadísticas
    await loadStats()

    Notify.create({
      type: 'positive',
      message: `Pedido actualizado a estado "${getStatusLabel(newStatus)}" exitosamente`,
      position: 'top'
    })

  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al actualizar el estado del pedido',
      position: 'top'
    })
  } finally {
    processingOrders.value[orderId] = false
  }
}

const getTabForStatus = (status) => {
  switch (status) {
    case 'pending_confirmation': return 'pending'
    case 'confirmed': return 'confirmed'
    case 'preparing': return 'preparing'
    case 'shipped': return 'shipped'
    case 'delivered': return 'delivered'
    case 'rejected': return 'rejected'
    default: return 'all'
  }
}

const getEmptyMessage = () => {
  switch (activeTab.value) {
    case 'pending': return 'pendientes'
    case 'confirmed': return 'confirmados'
    case 'preparing': return 'en preparación'
    case 'shipped': return 'enviados'
    case 'delivered': return 'entregados'
    case 'rejected': return 'rechazados'
    default: return 'en esta categoría'
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending_confirmation': return 'orange'
    case 'confirmed': return 'green'
    case 'preparing': return 'blue'
    case 'shipped': return 'purple'
    case 'delivered': return 'positive'
    case 'rejected': return 'negative'
    case 'cancelled': return 'grey'
    case 'returned': return 'warning'
    default: return 'grey'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending_confirmation': return 'Pendiente'
    case 'confirmed': return 'Confirmado'
    case 'preparing': return 'Preparando'
    case 'shipped': return 'Enviado'
    case 'delivered': return 'Entregado'
    case 'rejected': return 'Rechazado'
    case 'cancelled': return 'Cancelado'
    case 'returned': return 'Devuelto'
    default: return status
  }
}

const handleImageError = (event) => {
  // Evitar bucle infinito al cambiar la imagen
  if (event.target.src.includes('placeholder') || event.target.dataset.errorHandled) {
    return
  }

  // Marcar que ya se manejó el error para esta imagen
  event.target.dataset.errorHandled = 'true'

  // Usar una imagen base64 simple como placeholder o URL absoluta
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMiAxNEgyOFYyNkgxMlYxNFoiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz4KPHA+PC9wPjwvc3ZnPgo='
}

// Return functionality
const showReturnDialog = (order) => {
  selectedOrder.value = order
  returnDialog.value = true
  loadProductsList()
}

const loadProductsList = async () => {
  try {
    const response = await getProducts()

    // El backend responde con { status: "success", data: [...], message: "..." }
    const products = response.data || response || []

    if (Array.isArray(products)) {
      const mappedProducts = products.map(product => ({
        label: product.name,
        value: product._id
      }))
      productsList.value = mappedProducts
      allProductsList.value = mappedProducts // Guardar copia completa
    } else {
      productsList.value = []
      allProductsList.value = []
    }
  } catch (error) {
    productsList.value = []
    allProductsList.value = []
    Notify.create({
      type: 'negative',
      message: 'Error al cargar lista de productos'
    })
  }
}

const filterProducts = (val, update) => {
  update(() => {
    if (val === '') {
      // Restore full list when search is empty
      productsList.value = allProductsList.value
    } else {
      const needle = val.toLowerCase()
      productsList.value = allProductsList.value.filter(
        product => product.label.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

const processReturn = async () => {
  if (!returnReason.value || !selectedOrder.value) return

  processingReturn.value = true

  try {
    const returnData = {
      reason: returnReason.value.value,
      notes: returnNotes.value,
      refundRequested: refundToCustomer.value,
      exchangeProductId: returnReason.value.value === 'product_exchange' ? exchangeProductId.value : null
    }

    await processReturnAPI(selectedOrder.value._id, returnData)

    Notify.create({
      type: 'positive',
      message: `Devolución procesada exitosamente para pedido ${selectedOrder.value.orderNumber}`,
      position: 'top'
    })

    // Reset form
    returnDialog.value = false
    returnReason.value = null
    returnNotes.value = ''
    exchangeProductId.value = null
    refundToCustomer.value = true
    selectedOrder.value = null

    // Reload orders
    await loadOrders(true)

  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.message || 'Error al procesar la devolución',
      position: 'top'
    })
  } finally {
    processingReturn.value = false
  }
}

// Watchers
watch(activeTab, () => {
  loadOrders(true)
})

// Lifecycle
onMounted(() => {
  loadOrders(true) // Force load on mount

  // Opcional: Auto-refresh cada 30 segundos (comentado para evitar bucles)
  // pollingInterval = setInterval(() => {
  //   loadOrders()
  // }, 30000)
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
})
</script>

<style scoped>
.online-orders-page {
  max-width: 1400px;
  margin: 0 auto;
}

.header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card {
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.pending {
  border-left: 4px solid #ff9800;
}

.stat-card.confirmed {
  border-left: 4px solid #4caf50;
}

.stat-card.rejected {
  border-left: 4px solid #f44336;
}

.stat-card.revenue {
  border-left: 4px solid #2196f3;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 4px;
}

.order-card {
  transition: all 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-number {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-date {
  color: #666;
  font-size: 14px;
}

.customer-info div {
  margin-bottom: 4px;
}

.items-preview {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.items-header {
  margin-bottom: 8px;
  font-size: 14px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.item-image {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 500;
  font-size: 14px;
}

.item-variants {
  margin: 2px 0;
}

.variant-chip {
  background: #e3f2fd;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 11px;
  color: #1565c0;
  margin-right: 4px;
}

.item-quantity-price {
  font-size: 12px;
  color: #666;
}

.order-actions {
  border-left: 1px solid #eee;
  padding-left: 16px;
  height: 100%;
}

.total-section {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.total-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.order-notes {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
}

.notes-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.note-item {
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .order-actions {
    border-left: none;
    border-top: 1px solid #eee;
    padding-left: 0;
    padding-top: 16px;
    margin-top: 16px;
  }
}
</style>
