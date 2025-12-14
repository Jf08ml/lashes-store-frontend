<template>
  <q-page class="register-page">
    <div class="register-container">
      <!-- Logo o título -->
      <div class="register-header">
        <h1 class="register-title">Galaxia Glamour Store</h1>
        <p class="register-subtitle">Crear cuenta</p>
      </div>

      <!-- Formulario -->
      <div class="register-form">
        <q-form @submit.prevent="onSubmit" @reset="onReset" class="form-container">
          <!-- Campo de email -->
          <div class="input-group">
            <q-input
              v-model="registerInfo.email"
              label="Correo electrónico"
              type="email"
              outlined
              lazy-rules
              :rules="emailRules"
              class="register-input"
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
              v-model="registerInfo.password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              outlined
              lazy-rules
              :rules="passwordRules"
              class="register-input"
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

          <!-- Campo de confirmar contraseña -->
          <div class="input-group">
            <q-input
              v-model="registerInfo.confirmPassword"
              label="Confirmar contraseña"
              :type="showConfirmPassword ? 'text' : 'password'"
              outlined
              lazy-rules
              :rules="confirmPasswordRules"
              class="register-input"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" class="input-icon" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  @click="toggleConfirmPasswordVisibility"
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

          <!-- Mensaje de éxito -->
          <div v-if="successMessage" class="success-message">
            <q-icon name="check_circle" class="success-icon" />
            <span>{{ successMessage }}</span>
          </div>

          <!-- Botón de envío -->
          <div class="button-container">
            <q-btn
              label="Crear cuenta"
              type="submit"
              class="register-btn"
              :loading="isLoading"
              no-caps
              unelevated
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Creando cuenta...
              </template>
            </q-btn>
          </div>

          <!-- Link a login -->
          <div class="login-link">
            <span>¿Ya tienes cuenta?</span>
            <q-btn
              flat
              no-caps
              color="black"
              label="Iniciar sesión"
              @click="goToLogin"
              class="link-btn"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

  <script setup>
import { ref } from "vue";
import { signup } from "../../services/auth.js";
import { useRouter } from "vue-router";

const $router = useRouter();
const registerInfo = ref({
  email: "",
  password: "",
  confirmPassword: "",
});
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
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
  (val) => (val && val.length >= 6) || "La contraseña debe tener al menos 6 caracteres",
  (val) => /[A-Z]/.test(val) || "La contraseña debe tener al menos una mayúscula",
  (val) => /[0-9]/.test(val) || "La contraseña debe tener al menos un número"
];

const confirmPasswordRules = [
  (val) => (val && val.length > 0) || "Por favor confirme su contraseña",
  (val) => val === registerInfo.value.password || "Las contraseñas no coinciden"
];

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const goToLogin = () => {
  $router.push({ name: "LoginUsers" });
};

const onSubmit = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    // Validación adicional
    if (registerInfo.value.password !== registerInfo.value.confirmPassword) {
      errorMessage.value = "Las contraseñas no coinciden";
      return;
    }

    console.log("Submitting registration for:", registerInfo.value.email);

    const response = await signup({
      email: registerInfo.value.email,
      password: registerInfo.value.password
    });

    console.log("Registration response:", response);

    if (response && response.status === "success") {
      successMessage.value = "¡Cuenta creada exitosamente! Redirigiendo...";

      // Limpiar formulario
      onReset();

      // Redireccionar después de un breve delay
      setTimeout(() => {
        $router.push({ name: "Catalogue" });
      }, 1500);
    } else {
      errorMessage.value = "Error inesperado al crear la cuenta";
    }
  } catch (error) {
    console.error("Registration error caught:", error);

    // Manejar diferentes tipos de errores
    if (typeof error === 'string') {
      errorMessage.value = error;
    } else if (error && error.message) {
      errorMessage.value = error.message;
    } else if (error && typeof error === 'object') {
      errorMessage.value = error.error || error.msg || "Error al crear la cuenta. Intente nuevamente.";
    } else {
      errorMessage.value = "Error al crear la cuenta. Intente nuevamente.";
    }
  } finally {
    isLoading.value = false;
  }
};

const onReset = () => {
  registerInfo.value.email = "";
  registerInfo.value.password = "";
  registerInfo.value.confirmPassword = "";
  errorMessage.value = "";
  successMessage.value = "";
  showPassword.value = false;
  showConfirmPassword.value = false;
};
</script>

  <style scoped>
.register-page {
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  padding: 32px 28px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.register-header {
  text-align: center;
  margin-bottom: 28px;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0 0 8px 0;
}

.register-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  position: relative;
}

.register-input {
  width: 100%;
}

.register-input :deep(.q-field__control) {
  border-radius: 8px;
  border: 2px solid #e5e5e5;
  background: #fafafa;
  transition: all 0.3s ease;
}

.register-input :deep(.q-field__control):hover {
  border-color: #d0d0d0;
  background: #ffffff;
}

.register-input :deep(.q-field--focused .q-field__control) {
  border-color: #000000;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.register-input :deep(.q-field__label) {
  color: #666;
  font-weight: 500;
}

.register-input :deep(.q-field--focused .q-field__label) {
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

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #38a169;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 16px;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  margin-top: -8px;
}

.error-icon,
.success-icon {
  font-size: 18px;
}

.button-container {
  margin-top: 8px;
}

.register-btn {
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

.register-btn:hover {
  background: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.register-btn:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.link-btn {
  margin-left: 4px;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
}

.link-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 480px) {
  .register-container {
    padding: 28px 20px;
    margin: 0 16px;
    max-width: 320px;
  }

  .register-title {
    font-size: 20px;
  }

  .register-subtitle {
    font-size: 14px;
  }
}

/* Animaciones */
.register-container {
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
.register-input :deep(.q-field__control) {
  position: relative;
}

.register-input :deep(.q-field__control)::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: linear-gradient(45deg, transparent, transparent);
  transition: all 0.3s ease;
}

.register-input :deep(.q-field--focused .q-field__control)::before {
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.05), transparent);
}
</style>
