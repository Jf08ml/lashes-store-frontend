<template>
  <div class="forecast-view">
    <q-inner-loading :showing="loading" />

    <div class="row q-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">🔮 Pronóstico Financiero</div>
            <p class="text-grey-6">
              Proyecciones financieras basadas en tendencias históricas y algoritmos de predicción.
              Esta funcionalidad se implementará completamente una vez que el backend esté operativo.
            </p>
            <div v-if="data?.forecast">
              <q-list separator>
                <q-item v-for="(item, index) in data.forecast.slice(0, 3)" :key="index">
                  <q-item-section>
                    <q-item-label>{{ item.month }}</q-item-label>
                    <q-item-label caption>
                      Confianza: {{ (item.confidence * 100).toFixed(0) }}%
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-right">
                      <div class="text-subtitle2">{{ formatCurrency(item.projectedSales) }}</div>
                      <div class="text-caption text-positive">{{ formatCurrency(item.projectedProfit) }} ganancia</div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
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
