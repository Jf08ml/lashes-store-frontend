<template>
  <q-card class="delivery-card">
    <q-expansion-item
      v-model="isExpanded"
      class="delivery-expansion"
      expand-separator
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-avatar color="black" text-color="white" icon="location_on" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="delivery-title">Dirección de entrega</q-item-label>
          <q-item-label caption class="delivery-caption">{{ viewAddress() }}</q-item-label>
        </q-item-section>
      </template>

      <q-card-section class="delivery-form-section">
        <q-form
          @submit.prevent="onSaveAddress"
          @reset="onReset"
          class="delivery-form"
        >
          <div class="form-section">
            <div class="section-label">
              <q-icon name="person" size="18px" />
              <span>Información de contacto</span>
            </div>
            <div class="form-grid">
              <q-input
                outlined
                v-model="deliveryAddress.contactName"
                label="Nombre completo *"
                class="text-capitalize"
                @update:model-value="capitalizeContactName"
                :rules="[val => !!val || 'Campo requerido']"
              />
              <q-input
                outlined
                v-model="deliveryAddress.email"
                label="Correo electrónico *"
                type="email"
                :rules="[val => !!val || 'Campo requerido']"
              />
              <q-input
                outlined
                v-model="deliveryAddress.phoneContact"
                label="Teléfono (WhatsApp) *"
                type="tel"
                hint="Debe tener WhatsApp"
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <q-icon name="map" size="18px" />
              <span>Ubicación</span>
            </div>
            <div class="form-grid">
              <q-select
                outlined
                v-model="deliveryAddress.department"
                :options="filteredDepartments"
                option-label="name"
                option-value="name"
                label="Departamento *"
                use-input
                @filter="filterDepartments"
                @update:model-value="updateDepartment"
                :rules="[val => !!val || 'Campo requerido']"
              />
              <q-select
                outlined
                v-model="deliveryAddress.city"
                :options="filteredCities"
                option-label="name"
                option-value="name"
                label="Ciudad *"
                use-input
                @filter="filterCities"
                @update:model-value="updateCity"
                :rules="[val => !!val || 'Campo requerido']"
              />
              <q-input
                outlined
                v-model="deliveryAddress.neighborhood"
                label="Barrio *"
                class="text-capitalize"
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <q-icon name="home" size="18px" />
              <span>Dirección detallada</span>
            </div>
            <div class="form-grid">
              <q-input
                outlined
                v-model="deliveryAddress.address"
                label="Dirección de entrega *"
                hint="Ejemplo: Calle 5 sur # 1a - 81"
                :rules="[val => !!val || 'Campo requerido']"
                class="full-width-input"
              />
              <q-input
                outlined
                v-model="deliveryAddress.indications"
                label="Indicaciones adicionales"
                hint="Ejemplo: Salón de Belleza Bellas Artes"
                class="full-width-input"
              />
            </div>
          </div>

          <div class="form-actions">
            <q-btn
              flat
              label="Limpiar campos"
              type="reset"
              color="grey-8"
              icon="refresh"
            />
            <q-btn
              unelevated
              label="Guardar dirección"
              type="submit"
              color="black"
              icon-right="check"
              class="save-btn"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const isExpanded = ref(true);

const deliveryAddress = ref({
  contactName: "",
  email:"",
  phoneContact: "",
  department: "",
  city: "",
  neighborhood: "",
  address: "",
  indications: "",
});

const departments = ref([]);
const filteredDepartments = ref([]);
const cities = ref([]);
const filteredCities = ref([]);

const emit = defineEmits(["updateDeliveryAddress"]);

const onSaveAddress = () => {
  if(!deliveryAddress.value.department || !deliveryAddress.value.city) {
    Notify.create({
      message: "Por favor, selecciona un departamento y una ciudad.",
      color: "negative",
    });
    return;
  } else {
    isExpanded.value = false;
    emit("updateDeliveryAddress", deliveryAddress.value);
  }
};

const viewAddress = () =>
  deliveryAddress.value.address ||
  "Por favor, completa la dirección de entrega.";

// Función para capitalizar el nombre (primera letra de cada palabra en mayúscula)
const capitalizeContactName = (val) => {
  if (!val) return;
  deliveryAddress.value.contactName = val
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const onReset = () => {
  Object.keys(deliveryAddress.value).forEach((key) => {
    deliveryAddress.value[key] = key === "phoneContact" ? 0 : "";
  });
  filteredDepartments.value = departments.value;
  filteredCities.value = cities.value;
};

const fetchDepartments = async () => {
  try {
    const response = await axios.get(
      "https://api-colombia.com/api/v1/Department"
    );
    departments.value = response.data;
    filteredDepartments.value = response.data;
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
  }
};

const updateDepartment = (val) => {
  const department = filteredDepartments.value.find(
    (dept) => dept.id === val.id
  );
  if (department) {
    deliveryAddress.value.department = department.name;
    fetchCities(department.id);
  }
};

const fetchCities = async (departmentId) => {
  try {
    const response = await axios.get(
      `https://api-colombia.com/api/v1/Department/${departmentId}/cities`
    );
    cities.value = response.data;
    filteredCities.value = response.data;
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
  }
};

const updateCity = (val) => {
  const city = filteredCities.value.find((city) => city.id === val.id);
  if (city) {
    deliveryAddress.value.city = city.name;
  }
};

const filterDepartments = (val, update) => {
  if (val === "") {
    update(() => {
      filteredDepartments.value = departments.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    const filtered = departments.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
    filteredDepartments.value = filtered.length
      ? filtered
      : [{ name: "No encontrado" }];
  });
};

const filterCities = (val, update) => {
  if (val === "") {
    update(() => {
      filteredCities.value = cities.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    const filtered = cities.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
    filteredCities.value = filtered.length
      ? filtered
      : [{ name: "No encontrado" }];
  });
};

// watch(
//   () => deliveryAddress.value.department,
//   () => {
//     if (deliveryAddress.value.department) {
//       const departmentId = filteredDepartments.value.find(
//         (dept) => dept.name === deliveryAddress.value.department
//       );

//       fetchCities(departmentId.id);
//     }
//   }
// );

onMounted(fetchDepartments);
</script>
<style scoped>
.delivery-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  background: white;
  margin-bottom: 16px;
}

.delivery-expansion :deep(.q-item) {
  padding: 16px 20px;
}

.delivery-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
}

.delivery-caption {
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
}

.delivery-form-section {
  background: #fafafa;
  padding: 20px;
}

.delivery-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.full-width-input {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

.save-btn {
  min-width: 160px;
}

@media (max-width: 600px) {
  .delivery-expansion :deep(.q-item) {
    padding: 14px 16px;
  }

  .delivery-form-section {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn {
    width: 100%;
  }
}
</style>
