<template>
  <div class="profitability-view">
    <q-inner-loading :showing="loading" />

    <!-- Resumen de rentabilidad -->
    <div class="row q-gutter-md q-mb-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">💰 Resumen de Rentabilidad</div>
            <div class="row q-gutter-md">
              <div class="col-3">
                <div class="text-center">
                  <div class="text-h4 text-positive">{{ formatPercentage(data?.summary?.avgMargin) }}</div>
                  <div class="text-caption">Margen Promedio</div>
                </div>
              </div>
              <div class="col-3">
                <div class="text-center">
                  <div class="text-h5 text-primary">{{ formatCurrency(data?.summary?.totalPotentialProfit) }}</div>
                  <div class="text-caption">Ganancia Potencial</div>
                </div>
              </div>
              <div class="col-3">
                <div class="text-center">
                  <div class="text-h6 text-info">{{ data?.summary?.bestMarginProduct?.product || 'N/A' }}</div>
                  <div class="text-caption">Mejor Margen</div>
                  <div class="text-body2">{{ formatPercentage(data?.summary?.bestMarginProduct?.margin) }}</div>
                </div>
              </div>
              <div class="col-3">
                <div class="text-center">
                  <div class="text-h6 text-warning">{{ data?.summary?.worstMarginProduct?.product || 'N/A' }}</div>
                  <div class="text-caption">Menor Margen</div>
                  <div class="text-body2">{{ formatPercentage(data?.summary?.worstMarginProduct?.margin) }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Rentabilidad por categoría -->
    <div class="row q-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">📂 Rentabilidad por Categoría</div>
            <q-list separator v-if="data?.byCategory">
              <q-item
                v-for="(category, index) in data.byCategory.slice(0, 10)"
                :key="index"
              >
                <q-item-section>
                  <q-item-label>{{ category.category }}</q-item-label>
                  <q-item-label caption>
                    {{ category.products }} productos - {{ category.quantity }} unidades
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <div class="text-right">
                    <div class="text-subtitle2">{{ formatCurrency(category.totalProfit) }}</div>
                    <div class="text-caption" :class="getMarginColor(category.avgMargin)">
                      {{ formatPercentage(category.avgMargin) }} margen
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">🎯 Productos Más Rentables</div>
            <q-list separator v-if="data?.byProduct">
              <q-item
                v-for="(product, index) in data.byProduct.slice(0, 10)"
                :key="index"
              >
                <q-item-section>
                  <q-item-label>{{ product.product }}</q-item-label>
                  <q-item-label caption>{{ product.category }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <div class="text-right">
                    <div class="text-subtitle2" :class="getMarginColor(product.margin)">
                      {{ formatPercentage(product.margin) }}
                    </div>
                    <div class="text-caption">
                      {{ formatCurrency(product.totalPotentialProfit) }}
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Análisis detallado de productos -->
    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">📊 Análisis Detallado de Productos</div>
            <q-table
              :rows="data?.byProduct || []"
              :columns="columns"
              row-key="product"
              :pagination="{ rowsPerPage: 10 }"
              flat
              bordered
            >
              <template #body-cell-margin="props">
                <q-td :props="props">
                  <q-chip
                    :color="getMarginChipColor(props.value)"
                    text-color="white"
                    size="sm"
                  >
                    {{ formatPercentage(props.value) }}
                  </q-chip>
                </q-td>
              </template>

              <template #body-cell-profit="props">
                <q-td :props="props">
                  <span :class="getProfitColor(props.value)">
                    {{ formatCurrency(props.value) }}
                  </span>
                </q-td>
              </template>

              <template #body-cell-basePrice="props">
                <q-td :props="props">
                  {{ formatCurrency(props.value) }}
                </q-td>
              </template>

              <template #body-cell-salePrice="props">
                <q-td :props="props">
                  {{ formatCurrency(props.value) }}
                </q-td>
              </template>

              <template #body-cell-totalPotentialProfit="props">
                <q-td :props="props">
                  <span class="text-weight-bold">
                    {{ formatCurrency(props.value) }}
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
    name: 'product',
    label: 'Producto',
    field: 'product',
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
    name: 'basePrice',
    label: 'Costo',
    field: 'basePrice',
    align: 'right',
    sortable: true
  },
  {
    name: 'salePrice',
    label: 'Precio Venta',
    field: 'salePrice',
    align: 'right',
    sortable: true
  },
  {
    name: 'profit',
    label: 'Ganancia Unitaria',
    field: 'profit',
    align: 'right',
    sortable: true
  },
  {
    name: 'margin',
    label: 'Margen',
    field: 'margin',
    align: 'center',
    sortable: true
  },
  {
    name: 'totalPotentialProfit',
    label: 'Ganancia Total',
    field: 'totalPotentialProfit',
    align: 'right',
    sortable: true
  }
]

// Métodos de formateo
const formatCurrency = (value) => {
  return formatPrice(value)
}

const formatPercentage = (value) => {
  return `${value?.toFixed(1) || '0.0'}%`
}

const getMarginColor = (margin) => {
  if (margin >= 50) return 'text-positive'
  if (margin >= 30) return 'text-primary'
  if (margin >= 15) return 'text-warning'
  return 'text-negative'
}

const getMarginChipColor = (margin) => {
  if (margin >= 50) return 'positive'
  if (margin >= 30) return 'primary'
  if (margin >= 15) return 'warning'
  return 'negative'
}

const getProfitColor = (profit) => {
  if (profit > 0) return 'text-positive'
  if (profit < 0) return 'text-negative'
  return 'text-grey'
}
</script>

<style scoped>
.profitability-view {
  position: relative;
}
</style>
