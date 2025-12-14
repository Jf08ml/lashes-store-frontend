<template>
  <div class="inventory-view">
    <q-inner-loading :showing="loading" />

    <!-- Resumen de inventario -->
    <div class="row q-gutter-md q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">📦 Resumen de Inventario</div>
            <div class="row q-gutter-md">
              <div class="col-2">
                <div class="text-center">
                  <div class="text-h4 text-primary">{{ data?.summary?.totalItems || 0 }}</div>
                  <div class="text-caption">Total Productos</div>
                </div>
              </div>
              <div class="col-2">
                <div class="text-center">
                  <div class="text-h5 text-positive">{{ formatCurrency(data?.summary?.totalValue) }}</div>
                  <div class="text-caption">Valor Inventario</div>
                </div>
              </div>
              <div class="col-2">
                <div class="text-center">
                  <div class="text-h5 text-info">{{ formatCurrency(data?.summary?.totalPotentialValue) }}</div>
                  <div class="text-caption">Valor Potencial</div>
                </div>
              </div>
              <div class="col-2">
                <div class="text-center">
                  <div class="text-h5 text-warning">{{ data?.summary?.lowStock || 0 }}</div>
                  <div class="text-caption">Stock Bajo</div>
                </div>
              </div>
              <div class="col-2">
                <div class="text-center">
                  <div class="text-h5 text-negative">{{ data?.summary?.outOfStock || 0 }}</div>
                  <div class="text-caption">Sin Stock</div>
                </div>
              </div>
              <div class="col-2">
                <div class="text-center">
                  <div class="text-h6 text-grey">{{ data?.summary?.avgDaysOfStock?.toFixed(1) || '0.0' }}</div>
                  <div class="text-caption">Días Promedio</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lista de productos con alertas -->
    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">📋 Estado del Inventario</div>
            <q-table
              :rows="data?.items || []"
              :columns="columns"
              row-key="id"
              :pagination="{ rowsPerPage: 15 }"
              flat
              bordered
            >
              <template #body-cell-stockStatus="props">
                <q-td :props="props">
                  <q-chip
                    :color="getStatusColor(props.value)"
                    text-color="white"
                    size="sm"
                  >
                    {{ getStatusLabel(props.value) }}
                  </q-chip>
                </q-td>
              </template>

              <template #body-cell-value="props">
                <q-td :props="props">
                  {{ formatCurrency(props.value) }}
                </q-td>
              </template>

              <template #body-cell-potentialValue="props">
                <q-td :props="props">
                  <span class="text-weight-bold">
                    {{ formatCurrency(props.value) }}
                  </span>
                </q-td>
              </template>

              <template #body-cell-quantity="props">
                <q-td :props="props">
                  <span :class="getQuantityColor(props.row.stockStatus)">
                    {{ props.value }}
                  </span>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
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

// Columnas de la tabla
const columns = [
  {
    name: 'name',
    label: 'Producto',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'category',
    label: 'Categoría',
    field: 'category',
    align: 'left',
    sortable: true
  },
  {
    name: 'quantity',
    label: 'Cantidad',
    field: 'quantity',
    align: 'center',
    sortable: true
  },
  {
    name: 'stockStatus',
    label: 'Estado',
    field: 'stockStatus',
    align: 'center',
    sortable: true
  },
  {
    name: 'value',
    label: 'Valor Inventario',
    field: 'value',
    align: 'right',
    sortable: true
  },
  {
    name: 'potentialValue',
    label: 'Valor Potencial',
    field: 'potentialValue',
    align: 'right',
    sortable: true
  },
  {
    name: 'daysOfStock',
    label: 'Días de Stock',
    field: 'daysOfStock',
    align: 'center',
    sortable: true,
    format: (val) => `${val.toFixed(0)} días`
  }
]

// Métodos de formateo y utilidades
const formatCurrency = (value) => {
  return formatPrice(value)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'out': return 'negative'
    case 'low': return 'warning'
    case 'normal': return 'positive'
    case 'overstock': return 'info'
    default: return 'grey'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'out': return 'Sin Stock'
    case 'low': return 'Stock Bajo'
    case 'normal': return 'Normal'
    case 'overstock': return 'Exceso'
    default: return 'N/A'
  }
}

const getQuantityColor = (status) => {
  switch (status) {
    case 'out': return 'text-negative'
    case 'low': return 'text-warning'
    case 'normal': return 'text-positive'
    case 'overstock': return 'text-info'
    default: return 'text-grey'
  }
}
</script>

<style scoped>
.inventory-view {
  position: relative;
}
</style>
