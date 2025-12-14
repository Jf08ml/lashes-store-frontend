<template>
  <q-card class="payment-method-card">
    <q-card-section class="payment-header">
      <div class="header-content">
        <q-avatar color="black" text-color="white" icon="payments" size="40px" />
        <div class="header-text">
          <div class="payment-title">Método de pago</div>
          <div class="payment-subtitle">Pago contraentrega</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="payment-content">
      <div class="info-box">
        <q-icon name="info" size="24px" color="black" class="info-icon" />
        <div class="info-text">
          <p class="info-paragraph">
            El pago del pedido se realiza <strong>contraentrega</strong>. Una vez hagas clic en
            <strong>"Realizar pedido"</strong>, nos comunicaremos contigo por
            <strong>WhatsApp</strong> o <strong>llamada</strong> al número registrado para confirmar el envío.
          </p>
          <div class="payment-features">
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" size="18px" />
              <span>Pago al recibir</span>
            </div>
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" size="18px" />
              <span>Confirmación por WhatsApp</span>
            </div>
            <div class="feature-item">
              <q-icon name="check_circle" color="positive" size="18px" />
              <span>Seguro y confiable</span>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup></script>

<style scoped>
.payment-method-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  background: white;
  margin-bottom: 16px;
}

.payment-header {
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-text {
  flex: 1;
}

.payment-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.payment-subtitle {
  font-size: 0.9rem;
  color: #666;
}

.payment-content {
  background: #fafafa;
  padding: 20px;
}

.info-box {
  display: flex;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
}

.info-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  flex: 1;
}

.info-paragraph {
  margin: 0 0 16px 0;
  color: #444;
  font-size: 0.95rem;
  line-height: 1.6;
}

.info-paragraph strong {
  color: #000;
  font-weight: 600;
}

.payment-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #555;
}

@media (max-width: 600px) {
  .payment-header {
    padding: 16px;
  }

  .payment-content {
    padding: 16px;
  }

  .info-box {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
