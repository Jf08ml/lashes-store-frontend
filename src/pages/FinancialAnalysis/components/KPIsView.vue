<template>
  <div class="kpis-view">
    <q-inner-loading :showing="loading" />

    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">⚡ Indicadores Clave de Rendimiento (KPIs)</div>
            <p class="text-grey-6">
              Métricas principales para evaluar el rendimiento del negocio.
              Esta funcionalidad se implementará completamente una vez que el backend esté operativo.
            </p>

            <div class="row q-gutter-md" v-if="data">
              <!-- KPI de Crecimiento -->
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-sm">📈 Crecimiento</div>
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-h5" :class="getGrowthColor(data.growth?.monthly)">
                          {{ formatPercentage(data.growth?.monthly) }}
                        </div>
                        <div class="text-caption">Mensual</div>
                      </div>
                      <div class="col-auto">
                        <q-circular-progress
                          :value="Math.min(100, (data.growth?.monthly / data.growth?.target) * 100)"
                          size="60px"
                          :thickness="0.2"
                          color="primary"
                          track-color="grey-3"
                          class="q-ma-md"
                        />
                      </div>
                    </div>
                    <div class="text-caption text-grey">Meta: {{ formatPercentage(data.growth?.target) }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- KPI de Clientes -->
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-sm">👥 Clientes</div>
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-h5 text-info">{{ formatPercentage(data.customer?.retention) }}</div>
                        <div class="text-caption">Retención</div>
                        <div class="text-body2">{{ formatCurrency(data.customer?.avgOrderValue) }} promedio</div>
                      </div>
                      <div class="col-auto">
                        <q-circular-progress
                          :value="(data.customer?.retention / data.customer?.target) * 100"
                          size="60px"
                          :thickness="0.2"
                          color="info"
                          track-color="grey-3"
                          class="q-ma-md"
                        />
                      </div>
                    </div>
                    <div class="text-caption text-grey">Meta: {{ formatPercentage(data.customer?.target) }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- KPI de Operaciones -->
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-sm">⚙️ Operaciones</div>
                    <div class="row q-gutter-sm">
                      <div class="col">
                        <div class="text-h6 text-primary">{{ formatPercentage(data.operations?.conversionRate) }}</div>
                        <div class="text-caption">Conversión</div>
                      </div>
                      <div class="col">
                        <div class="text-h6 text-warning">{{ data.operations?.inventoryTurnover?.toFixed(1) || '0.0' }}</div>
                        <div class="text-caption">Rotación</div>
                      </div>
                    </div>
                    <div class="text-caption text-grey q-mt-sm">Meta rotación: {{ data.operations?.target }}</div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- KPI de Rentabilidad -->
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2 q-mb-sm">💰 Rentabilidad</div>
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-h5 text-positive">{{ formatPercentage(data.profitability?.margin) }}</div>
                        <div class="text-caption">Margen</div>
                      </div>
                      <div class="col-auto">
                        <q-circular-progress
                          :value="(data.profitability?.margin / data.profitability?.target) * 100"
                          size="60px"
                          :thickness="0.2"
                          color="positive"
                          track-color="grey-3"
                          class="q-ma-md"
                        />
                      </div>
                    </div>
                    <div class="text-caption text-grey">Meta: {{ formatPercentage(data.profitability?.target) }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '../../../utils/utilsFunctions'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
})

const formatCurrency = (value) => formatPrice(value || 0)

const formatPercentage = (value) => {
  return `${value?.toFixed(1) || '0.0'}%`
}

const getGrowthColor = (value) => {
  if (value > 10) return 'text-positive'
  if (value > 0) return 'text-warning'
  return 'text-negative'
}
</script>
