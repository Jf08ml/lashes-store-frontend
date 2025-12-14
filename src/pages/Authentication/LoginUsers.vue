<template>
  <q-page class="login-page">
    <div class="login-container">
      <!-- Logo o título -->
      <div class="login-header">
        <h1 class="login-title">Galaxia Glamour Store</h1>
      </div>

      <!-- Formulario -->
      <div class="login-form">
        <q-form @submit.prevent="onSubmit" @reset="onReset" class="form-container">
          <!-- Campo de email -->
          <div class="input-group">
            <q-input
              v-model="loginInfo.email"
              label="Correo electrónico"
              type="email"
              outlined
              lazy-rules
              :rules="emailRules"
              class="login-input"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="mail" class="input-icon" />
              </template>
            </q-input>
          </div>

          <!-- Campo de contraseña -->
          <div class="input-group">
            <q-input
              v-model="loginInfo.password"
              :label="'Contraseña'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              lazy-rules
              :rules="passwordRules"
              class="login-input"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock" class="input-icon" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showPassword ? 'visibility_off' : 'visibility'"
                  @click="togglePasswordVisibility"
                  class="password-toggle"
                  tabindex="-1"
                />
              </template>
            </q-input>
          </div>

          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="error-message">
            <q-icon name="error" class="error-icon" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Botón de envío -->
          <div class="button-container">
            <q-btn
              label="Iniciar sesión"
              type="submit"
              class="login-btn"
              :loading="isLoading"
              no-caps
              unelevated
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Iniciando...
              </template>
            </q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { login } from "../../services/auth.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();
const $router = useRouter();
const loginInfo = ref({
  email: "",
  password: "",
});
const errorMessage = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

const emailRules = [
  (val) =>
    (val && val.length > 0) ||
    "Por favor ingrese su correo electrónico",
  (val) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(val) || "Ingrese un correo electrónico válido";
  }
];

const passwordRules = [
  (val) => (val && val.length > 0) || "Por favor ingrese su contraseña",
  (val) => (val && val.length >= 4) || "La contraseña debe tener al menos 6 caracteres"
];

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const response = await login(loginInfo.value);
    if (
      response.status === "success" &&
      authStore.$state.userRole === "Administrator"
    ) {
      $router.push({ name: "ManageProducts" });
    } else {
      $router.push({ name: "Catalogue" });
    }
  } catch (error) {
    errorMessage.value = error.message || "Error al iniciar sesión. Verifique sus credenciales.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const onReset = () => {
  loginInfo.value.email = "";
  loginInfo.value.password = "";
  errorMessage.value = "";
  showPassword.value = false;
};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  padding: 32px 28px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  position: relative;
}

.login-input {
  width: 100%;
}

.login-input :deep(.q-field__control) {
  border-radius: 8px;
  border: 2px solid #e5e5e5;
  background: #fafafa;
  transition: all 0.3s ease;
}

.login-input :deep(.q-field__control):hover {
  border-color: #d0d0d0;
  background: #ffffff;
}

.login-input :deep(.q-field--focused .q-field__control) {
  border-color: #000000;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.login-input :deep(.q-field__label) {
  color: #666;
  font-weight: 500;
}

.login-input :deep(.q-field--focused .q-field__label) {
  color: #000000;
}

.input-icon {
  color: #666;
  font-size: 20px;
}

.password-toggle {
  color: #666;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #000000;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e53e3e;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 16px;
  background: #fef5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  margin-top: -8px;
}

.error-icon {
  font-size: 18px;
}

.button-container {
  margin-top: 8px;
}

.login-btn {
  width: 100%;
  height: 44px;
  background: #000000;
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-transform: none;
}

.login-btn:hover {
  background: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.login-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 28px 20px;
    margin: 0 16px;
    max-width: 320px;
  }

  .login-title {
    font-size: 20px;
  }
}

/* Animaciones */
.login-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estados de focus mejorados */
.login-input :deep(.q-field__control) {
  position: relative;
}

.login-input :deep(.q-field__control)::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: linear-gradient(45deg, transparent, transparent);
  transition: all 0.3s ease;
}

.login-input :deep(.q-field--focused .q-field__control)::before {
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.05), transparent);
}
</style>
