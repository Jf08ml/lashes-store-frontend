<template>
  <q-page class="success-page flex flex-center">
    <q-card class="success-card">
      <!-- Header -->
      <q-card-section class="success-header" align="center">
        <div class="success-icon-wrap flex flex-center">
          <q-icon name="check_circle" color="white" size="52px" />
        </div>
        <div class="success-title">¡Gracias por tu compra!</div>
        <div class="success-subtitle">
          Hemos recibido tu pedido correctamente.
        </div>
      </q-card-section>

      <!-- Body -->
      <q-card-section class="success-body">
        <!-- Mensaje principal -->
        <div class="success-message">
          Tu pedido está en revisión. En los próximos minutos te contactaremos
          por WhatsApp para confirmar los datos y el método de envío.
        </div>

        <!-- Nota importante -->
        <div class="success-note">
          <q-icon name="info" size="18px" class="q-mr-sm note-icon" />
          <div>
            <span class="text-weight-bold">Importante:</span>
            <span>
              el envío solo se realizará cuando confirmes tu pedido en el mensaje
              que te enviaremos.
            </span>
          </div>
        </div>

        <!-- Pasos siguientes -->
        <div class="success-steps">
          <div class="success-steps-title">¿Qué sigue?</div>
          <div class="success-steps-list">
            <div class="success-step">
              <div class="step-badge">1</div>
              <div class="step-text">
                <span class="step-title">Revisa tu WhatsApp</span>
                <span class="step-desc">Te escribiremos desde Galaxia Glamour para confirmar tu pedido.</span>
              </div>
            </div>
            <div class="success-step">
              <div class="step-badge">2</div>
              <div class="step-text">
                <span class="step-title">Confirma tu pedido</span>
                <span class="step-desc">Responde el mensaje con tu confirmación y los datos de envío.</span>
              </div>
            </div>
            <div class="success-step">
              <div class="step-badge">3</div>
              <div class="step-text">
                <span class="step-title">Preparamos tu paquete</span>
                <span class="step-desc">Al confirmar, alistamos tu pedido y coordinamos el envío contigo.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Logo -->
        <div class="success-brand q-my-md">
          <q-img
            alt="Galaxia Glamour"
            src="icons/android-chrome-512x512.png"
            class="success-img"
          />
          <div class="brand-name">Galaxia Glamour</div>
        </div>

        <!-- Redes sociales -->
        <div class="success-social-block">
          <div class="success-social-title">Síguenos en redes</div>
          <div class="success-social-subtitle">
            Inspírate, mira resultados reales y no te pierdas nuestras promociones.
          </div>
          <div class="success-social-buttons q-mt-sm">
            <q-btn
              flat
              round
              @click="redirectToWhatsApp"
              class="social-btn"
              aria-label="WhatsApp"
            >
              <q-icon name="bi-whatsapp" size="md" />
            </q-btn>
            <q-btn
              flat
              round
              @click="redirectToInstagram"
              class="social-btn"
              aria-label="Instagram"
            >
              <q-icon name="bi-instagram" size="md" />
            </q-btn>
            <q-btn
              flat
              round
              @click="redirectToFacebook"
              class="social-btn"
              aria-label="Facebook"
            >
              <q-icon name="bi-facebook" size="md" />
            </q-btn>
          </div>
        </div>

        <!-- CTA inferior -->
        <div class="success-actions q-mt-md">
          <q-btn
            flat
            class="text-black underline-link"
            @click="$router.push('/catalogo')"
          >
            Volver al catálogo
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const redirectToWhatsApp = () => {
  window.open("https://wa.me/message/LRMCRWYN6JRNO1", "_blank");
};
const redirectToInstagram = () => {
  window.open("https://www.instagram.com/galaxiaglamour/", "_blank");
};
const redirectToFacebook = () => {
  window.open("https://www.facebook.com/galaxiaglamour/", "_blank");
};
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 16px;
}

.success-card {
  max-width: 420px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  background: #ffffff;
  border: 1.5px solid #111111;
}

.success-header {
  background: #111111;
  color: #ffffff;
  padding: 28px 24px 20px 24px;
  text-align: center;
}

.success-icon-wrap {
  width: 70px;
  height: 70px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  margin: 0 auto 10px auto;
}

.success-title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.success-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
}

.success-body {
  padding: 22px 20px 20px 20px;
}

.success-message {
  font-size: 1rem;
  color: #111111;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
}

.success-note {
  background: #f5f5f5;
  color: #111111;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.9rem;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  border: 1px solid #e0e0e0;
  gap: 8px;
}

.note-icon {
  color: #111111;
  margin-top: 2px;
}

.success-steps {
  margin-bottom: 18px;
}

.success-steps-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111111;
}

.success-steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.success-step {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.step-badge {
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111111;
}

.step-desc {
  font-size: 0.85rem;
  color: #333333;
}

.success-brand {
  text-align: center;
}

.success-img {
  width: 86px;
  height: 86px;
  border-radius: 18px;
  margin: 0 auto 6px auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  border: 1px solid #111111;
}

.brand-name {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #111111;
}

.success-social-block {
  margin-top: 6px;
  text-align: center;
}

.success-social-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111111;
}

.success-social-subtitle {
  font-size: 0.85rem;
  color: #555555;
  margin-top: 2px;
}

.success-social-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}

.social-btn {
  background: #f8f9fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: background 0.2s, transform 0.15s;
  border: 1px solid #111111;
}

.social-btn .q-icon {
  color: #111111;
}

.social-btn:hover {
  background: #111111;
  transform: translateY(-1px);
}

.social-btn:hover .q-icon {
  color: #ffffff;
}

.success-actions {
  display: flex;
  justify-content: center;
}

.underline-link {
  text-decoration: underline;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 500px) {
  .success-card {
    max-width: 100%;
  }
  .success-header {
    padding: 22px 16px 16px 16px;
  }
  .success-body {
    padding: 18px 14px 16px 14px;
  }
}

@media (min-width: 900px) {
  .success-page {
    padding: 32px;
  }
  .success-card {
    max-width: 480px;
  }
}
</style>
