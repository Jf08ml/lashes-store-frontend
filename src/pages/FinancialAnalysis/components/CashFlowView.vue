<template>
  <div class="cashflow-view">
    <q-inner-loading :showing="loading" />

    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">💰 Análisis de Flujo de Caja</div>
            <p class="text-grey-6">
              Análisis detallado del flujo de caja por períodos.
              Esta funcionalidad se implementará completamente una vez que el backend esté operativo.
            </p>
            <div class="row q-gutter-md">
              <div class="col-4">
                <q-card flat bordered>
                  <q-card-section class="text-center">
                    <div class="text-h5 text-primary">{{ formatCurrency(data?.summary?.totalIncome) }}</div>
                    <div class="text-caption">Ingresos Totales</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-4">
                <q-card flat bordered>
                  <q-card-section class="text-center">
                    <div class="text-h5 text-info">{{ data?.summary?.totalOrders || 0 }}</div>
                    <div class="text-caption">Total Órdenes</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-4">
                <q-card flat bordered>
                  <q-card-section class="text-center">
                    <div class="text-h5 text-positive">{{ formatCurrency(data?.summary?.avgDailyIncome) }}</div>
                    <div class="text-caption">Promedio Diario</div>
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
</script>
