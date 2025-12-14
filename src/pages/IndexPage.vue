<template>
  <q-page class="landing-page" padding>
    <!-- HERO -->
    <section class="hero-section" aria-labelledby="hero-title">
      <q-intersection once>
        <div class="hero-inner hero-animate-in">
          <div class="hero-content">
            <q-badge class="hero-badge q-mb-sm">
              Distribuidora oficial · Galaxia Glamour Lashes
            </q-badge>

            <h1 id="hero-title" class="hero-title">
              Insumos profesionales para
              <span class="accent accent-underline">
                servicios de pestañas que duran
              </span>
            </h1>

            <p class="hero-subtitle">
              Abastece tu estudio con productos
              <strong>probados en sets reales</strong>, soporte técnico cercano
              y <strong>reposiciones rápidas</strong> en toda Colombia.
            </p>

            <ul class="hero-bullets" aria-label="Principales ventajas">
              <li>
                <q-icon
                  name="bi-patch-check-fill"
                  class="bullet-icon q-mr-sm"
                />
                <span>Stock constante y controlado para tus agendas llenas</span>
              </li>
              <li>
                <q-icon name="bi-truck" class="bullet-icon q-mr-sm" />
                <span>Envíos a todo Colombia con seguimiento de guía</span>
              </li>
              <li>
                <q-icon name="bi-headset" class="bullet-icon q-mr-sm" />
                <span>Asesoría técnica según tu nivel y técnica actual</span>
              </li>
            </ul>

            <div class="cta-buttons">
              <q-btn
                rounded
                unelevated
                color="black"
                text-color="white"
                label="Ver catálogo Galaxia"
                aria-label="Ver catálogo Galaxia Glamour Lashes"
                @click="$router.push('/catalogo')"
                class="cta-primary cta-pulse"
              />
              <q-btn
                rounded
                outline
                color="black"
                label="Ver líneas de producto"
                aria-label="Ir a líneas de producto"
                @click="scrollToFeatures"
                class="cta-secondary"
              />
              <q-btn
                rounded
                flat
                color="black"
                icon="bi-whatsapp"
                label="Hablar con asesora"
                aria-label="Abrir WhatsApp para asesoría"
                :href="whatsHref"
                target="_blank"
                rel="noopener"
                class="cta-whatsapp"
              />
            </div>

            <p class="hero-footnote">
              Ideal para estudios que quieren dejar de improvisar insumos y
              trabajar siempre con la misma calidad de sets.
            </p>
          </div>

          <div class="hero-image">
            <div class="hero-image-orbit">
              <span class="hero-orb hero-orb-1"></span>
              <span class="hero-orb hero-orb-2"></span>
              <span class="hero-orb hero-orb-3"></span>
            </div>
            <div class="hero-image-frame hero-float">
              <img
                src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_ee8vtoee8vtoee8v.png?updatedAt=1761697218447"
                alt="Galaxia Glamour Lashes — Insumos profesionales para extensiones de pestañas"
                class="main-hero-img"
                width="620"
                height="520"
                loading="eager"
                fetchpriority="high"
              />
            </div>
          </div>
        </div>
      </q-intersection>
    </section>

    <!-- PRODUCT LINES / FEATURES -->
    <section
      class="features-section"
      ref="featuresSection"
      aria-labelledby="features-title"
    >
      <q-intersection once>
        <div class="section-header section-animate-in">
          <h2 id="features-title" class="section-title">
            Líneas de producto y técnicas
          </h2>
          <p class="section-subtitle">
            Todo lo que necesitas para técnicas
            <strong>clásica, híbrida, volumen</strong> y
            <strong>fibra tecnológica</strong> en un solo lugar.
          </p>
        </div>
      </q-intersection>

      <q-intersection once>
        <div class="features-grid">
          <article class="feature-card feature-animate-1" aria-labelledby="ft1">
            <div class="feature-image">
              <img
                src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_99zwvf99zwvf99zw.png?updatedAt=1761695731771"
                alt="Pestañas clásicas Galaxia Glamour"
                width="900"
                height="560"
                loading="lazy"
                class="feature-img"
              />
            </div>
            <div class="feature-content">
              <h3 id="ft1" class="feature-title">
                Pestañas para Técnica Clásica
              </h3>
              <p class="feature-description">
                Fibra PBT de alta pureza, grosor estable (0.10–0.15),
                curvaturas C/D y longitudes 7–14&nbsp;mm. Corte cónico para
                mejor adhesión, banda flexible y negro intenso que estiliza la
                mirada.
              </p>
              <div class="feature-chips">
                <q-chip outline icon="bi-scissors" dense>Corte cónico</q-chip>
                <q-chip outline icon="bi-circle-half" dense
                  >Negro profundo</q-chip
                >
                <q-chip outline icon="bi-bezier" dense>Curvas C/D</q-chip>
              </div>
            </div>
          </article>

          <article class="feature-card feature-animate-2" aria-labelledby="ft2">
            <div class="feature-image">
              <img
                src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_f2uprrf2uprrf2up.png?updatedAt=1761695663100"
                alt="Volumen con fibra tecnológica, YY y 4Dw"
                width="900"
                height="560"
                loading="lazy"
                class="feature-img"
              />
            </div>
            <div class="feature-content">
              <h3 id="ft2" class="feature-title">
                Volumen &amp; Fibra Tecnológica
              </h3>
              <p class="feature-description">
                Opciones 2D–6D, <strong>YY</strong>, <strong>4Dw</strong> y
                <strong>Comic/Spikes</strong> para efectos texturizados y
                wispy. Elasticidad controlada que facilita abanicos estables y
                mejor retención.
              </p>
              <div class="feature-chips">
                <q-chip outline icon="bi-stars" dense>2D–6D</q-chip>
                <q-chip outline icon="bi-sun" dense>YY / 4Dw</q-chip>
                <q-chip outline icon="bi-lightning-charge" dense
                  >Spikes / Wispy</q-chip
                >
              </div>
            </div>
          </article>

          <article class="feature-card feature-animate-3" aria-labelledby="ft3">
            <div class="feature-image">
              <img
                src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/Gemini_Generated_Image_f9c0cyf9c0cyf9c0.png?updatedAt=1761696969777"
                alt="Adhesivos, primer, bonder, removedor, parches de hidrogel"
                width="900"
                height="560"
                loading="lazy"
                class="feature-img"
              />
            </div>
            <div class="feature-content">
              <h3 id="ft3" class="feature-title">
                Adhesivos &amp; Preparación
              </h3>
              <p class="feature-description">
                Adhesivos de secado rápido (0.5–1s) para rangos de humedad
                controlados, <strong>primer</strong>, <strong>bonder</strong>,
                removedor en gel, microbrush y
                <strong>parches de hidrogel</strong> de uso profesional.
              </p>
              <div class="feature-chips">
                <q-chip outline icon="bi-droplet" dense
                  >Humedad ideal 40–70%</q-chip
                >
                <q-chip outline icon="bi-stopwatch" dense>Secado 0.5–1s</q-chip>
                <q-chip outline icon="bi-shield-check" dense
                  >Retención optimizada</q-chip
                >
              </div>
            </div>
          </article>
        </div>
      </q-intersection>
    </section>

    <!-- TRUST / SELLING POINTS -->
    <section class="trust-section" aria-labelledby="trust-title">
      <q-intersection once>
        <div class="trust-inner trust-animate-in">
          <div class="trust-header">
            <h2 id="trust-title" class="section-title">
              ¿Por qué comprar con nosotras?
            </h2>
            <p class="trust-subtitle">
              Reducimos la prueba y error en tus insumos: trabajamos solo con
              líneas que ya funcionan en estudios activos.
            </p>
          </div>

          <div class="trust-grid">
            <div class="trust-item trust-animate-1">
              <div class="trust-icon-wrapper">
                <q-icon name="bi-box-seam" class="trust-icon" />
              </div>
              <div>
                <h4>Distribuidora oficial</h4>
                <p>
                  Garantía de autenticidad y lotes recientes de Galaxia Glamour
                  Lashes.
                </p>
              </div>
            </div>
            <div class="trust-item trust-animate-2">
              <div class="trust-icon-wrapper">
                <q-icon name="bi-award" class="trust-icon" />
              </div>
              <div>
                <h4>Calidad auditada</h4>
                <p>
                  Revisamos curvatura, grosor y retención antes de cada
                  reposición.
                </p>
              </div>
            </div>
            <div class="trust-item trust-animate-3">
              <div class="trust-icon-wrapper">
                <q-icon name="bi-truck" class="trust-icon" />
              </div>
              <div>
                <h4>Logística ágil</h4>
                <p>Despachos el mismo día hábil y cobertura nacional.</p>
              </div>
            </div>
            <div class="trust-item trust-animate-4">
              <div class="trust-icon-wrapper">
                <q-icon name="bi-credit-card" class="trust-icon" />
              </div>
              <div>
                <h4>Pagos cómodos</h4>
                <p>
                  PSE, transferencias y contraentrega en ciudades seleccionadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </q-intersection>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section" aria-labelledby="cta-title">
      <q-intersection once>
        <div class="cta-content cta-animate-in">
          <h2 id="cta-title" class="section-title">
            Deja tus insumos en manos de una distribuidora aliada
          </h2>
          <p class="cta-description">
            Miles de sets se realizan cada mes con Galaxia Glamour Lashes. Pide
            tu reposición hoy y mantén la misma calidad en todos tus servicios.
          </p>
          <div class="cta-buttons cta-center">
            <q-btn
              rounded
              unelevated
              color="black"
              text-color="white"
              label="Explorar catálogo"
              @click="$router.push('/catalogo')"
              class="cta-button cta-primary cta-pulse"
            />
            <q-btn
              rounded
              outline
              color="black"
              icon="bi-whatsapp"
              label="Hablar por WhatsApp"
              :href="whatsHref"
              target="_blank"
              rel="noopener"
              class="cta-button-outlined cta-secondary"
            />
          </div>
          <p class="cta-footnote">
            Cuéntanos cuántos servicios haces al mes y te sugerimos una lista de
            insumos según tu técnica.
          </p>
        </div>
      </q-intersection>
    </section>

    <!-- FAQ -->
    <section class="faq-section" aria-labelledby="faq-title">
      <q-intersection once>
        <div class="faq-animate-in">
          <h2 id="faq-title" class="section-title">Preguntas frecuentes</h2>
          <q-list bordered class="faq-list">
            <q-expansion-item
              expand-icon="bi-chevron-down"
              label="¿Trabajan con principiantes y avanzadas?"
              icon="bi-question-circle"
              header-class="faq-header"
            >
              <div class="faq-a">
                Sí. Podemos sugerirte combos de inicio para clásica, y luego
                acompañarte cuando pases a volumen, YY o 4Dw.
              </div>
            </q-expansion-item>
            <q-expansion-item
              expand-icon="bi-chevron-down"
              label="¿Qué adhesivo me conviene según mi humedad?"
              icon="bi-droplet"
              header-class="faq-header"
            >
              <div class="faq-a">
                Trabajamos idealmente en 40–70% de humedad. Si tu espacio es más
                húmedo o más seco, ajustamos viscosidad y tiempos de secado
                contigo.
              </div>
            </q-expansion-item>
            <q-expansion-item
              expand-icon="bi-chevron-down"
              label="¿Hacen envíos a toda Colombia?"
              icon="bi-truck"
              header-class="faq-header"
            >
              <div class="faq-a">
                Sí, enviamos a todo el país con transportadoras aliadas. Hacemos
                cortes diarios y te compartimos guía y seguimiento.
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </q-intersection>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";

const featuresSection = ref(null);
const phone = "+573184345284";
const whatsMsg = encodeURIComponent(
  "Hola, vengo desde la web. Quiero asesoría de productos Galaxia Glamour Lashes."
);
const whatsHref = computed(
  () => `https://wa.me/${phone.replace(/\D/g, "")}?text=${whatsMsg}`
);

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
</script>

<style scoped>
/* Keyframes globales */
@keyframes badgeGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes floatSlow {
  0% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.01);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
}

@keyframes pulseSoft {
  0% {
    box-shadow: 0 0 0 0 rgba(17, 17, 17, 0.26);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(17, 17, 17, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(17, 17, 17, 0);
  }
}

@keyframes fadeUpIn {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes orbitFloat {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(6px, -8px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes gradientSweep {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Tokens básicos */
.landing-page {
  --accent: #1a73e8;
  --radius-lg: 20px;
  --radius-md: 16px;
  --shadow-soft: 0 18px 48px rgba(0, 0, 0, 0.12);
  --shadow-card: 0 12px 32px rgba(0, 0, 0, 0.08);
  background: radial-gradient(circle at top, #f7f7ff 0%, #ffffff 40%, #fafafa 100%);
  color: #111;
}

.accent {
  color: var(--accent);
}

/* HERO */
.hero-section {
  padding: 64px 0 56px;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
  gap: 56px;
  align-items: center;
}

.hero-inner.hero-animate-in {
  animation: fadeUpIn 1.2s ease-out both;
}

.hero-content {
  max-width: 640px;
}

.hero-badge {
  font-size: 0.75rem;
  padding: 6px 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.95;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(120deg, #000000, #1a73e8, #000000);
  background-size: 220% 220%;
  animation: badgeGradient 3s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.15;
  margin: 6px 0 12px;
}

/* Subrayado animado en el texto destacado */
.accent-underline {
  position: relative;
  display: inline-block;
  padding-bottom: 2px;
}

.accent-underline::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #1a73e8, #ff4081, #ffc107, #1a73e8);
  background-size: 200% 100%;
  animation: gradientSweep 6s linear infinite;
  opacity: 0.9;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: #444;
  margin: 0 0 22px;
  max-width: 520px;
}

.hero-bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 26px;
  color: #333;
}

.hero-bullets li {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.98rem;
}

.bullet-icon {
  font-size: 18px;
  color: var(--accent);
}

/* CTAs */
.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

/* Botón primario + pulso */
.cta-primary {
  padding: 8px 18px;
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: var(--shadow-soft);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    filter 0.18s ease;
}

.cta-pulse {
  animation: pulseSoft 2.8s ease-out infinite;
}

.cta-primary:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05);
}

.cta-primary:active {
  transform: translateY(0) scale(0.99);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Outline / WhatsApp / secundarios */
.cta-secondary,
.cta-whatsapp,
.cta-button,
.cta-button-outlined {
  padding: 8px 16px;
  font-size: 0.95rem;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

.cta-secondary:hover,
.cta-button-outlined:hover,
.cta-whatsapp:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
  border-color: #000;
}

/* Iconos */
.cta-whatsapp :deep(.q-icon),
.cta-button-outlined :deep(.q-icon) {
  font-size: 18px;
  transition: transform 0.18s ease;
}

.cta-whatsapp:hover :deep(.q-icon),
.cta-button-outlined:hover :deep(.q-icon) {
  transform: translateY(-1px) scale(1.07);
}

.hero-footnote {
  font-size: 0.85rem;
  color: #777;
  margin-top: 4px;
}

/* Focus accesible */
.q-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.28);
}

/* HERO IMAGE + orbes decorativos */
.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image-orbit {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.hero-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(14px);
  opacity: 0.55;
}

.hero-orb-1 {
  width: 120px;
  height: 120px;
  background: rgba(26, 115, 232, 0.5);
  top: 6%;
  left: 4%;
  animation: orbitFloat 9s ease-in-out infinite;
}

.hero-orb-2 {
  width: 80px;
  height: 80px;
  background: rgba(255, 64, 129, 0.45);
  bottom: 4%;
  right: 10%;
  animation: orbitFloat 11s ease-in-out infinite;
}

.hero-orb-3 {
  width: 70px;
  height: 70px;
  background: rgba(255, 193, 7, 0.5);
  bottom: 22%;
  left: 16%;
  animation: orbitFloat 10s ease-in-out infinite;
}

.hero-image-frame {
  max-width: 520px;
  width: 100%;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  background: radial-gradient(circle at top, #fdfbff 0%, #f4f4f4 50%, #ececec 100%);
  transform-origin: center center;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    background-position 0.35s ease;
}

/* Hero flotando siempre */
.hero-float {
  animation: floatSlow 7s ease-in-out infinite;
}

.hero-image-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.25), transparent 55%);
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.hero-image-frame:hover {
  transform: translateY(-6px) scale(1.02) rotateZ(-0.6deg);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.28);
  background-position: 20% 0%;
}

.hero-image-frame:hover::after {
  opacity: 1;
}

.main-hero-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* FEATURES */
.features-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px 16px 80px;
}

.section-header.section-animate-in {
  text-align: center;
  margin-bottom: 44px;
  animation: fadeUpIn 1s ease-out both;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #555;
  font-size: 1rem;
  max-width: 560px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

/* Animaciones escalonadas de cards */
.feature-card {
  background: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: var(--radius-md);
  padding: 16px 16px 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
  animation: fadeUpIn 1s ease-out both;
}

.feature-animate-1 {
  animation-delay: 0.15s;
}
.feature-animate-2 {
  animation-delay: 0.35s;
}
.feature-animate-3 {
  animation-delay: 0.55s;
}

.feature-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-card);
  border-color: rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.feature-image {
  margin-bottom: 10px;
  border-radius: 12px;
  overflow: hidden;
}

.feature-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-img {
  transform: scale(1.04);
}

.feature-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 4px 0 6px;
}

.feature-description {
  color: #444;
  line-height: 1.55;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.feature-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.feature-chips :deep(.q-chip) {
  font-size: 0.78rem;
  border-radius: 999px;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease,
    transform 0.16s ease;
}

.feature-chips :deep(.q-chip:hover) {
  background-color: #111;
  color: #fff;
  border-color: #111;
  transform: translateY(-1px);
}

/* TRUST */
.trust-section {
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  padding: 70px 16px;
}

.trust-inner.trust-animate-in {
  max-width: 1100px;
  margin: 0 auto;
  animation: fadeUpIn 1s ease-out both;
}

.trust-header {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 28px;
}

.trust-subtitle {
  font-size: 0.98rem;
  color: #555;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 8px;
}

.trust-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  padding: 14px 14px 16px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
  animation: fadeUpIn 1s ease-out both;
}

.trust-animate-1 {
  animation-delay: 0.15s;
}
.trust-animate-2 {
  animation-delay: 0.3s;
}
.trust-animate-3 {
  animation-delay: 0.45s;
}
.trust-animate-4 {
  animation-delay: 0.6s;
}

.trust-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.14);
  border-color: rgba(26, 115, 232, 0.3);
}

.trust-icon-wrapper {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(26, 115, 232, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background-color 0.18s ease,
    transform 0.18s ease;
}

.trust-item:hover .trust-icon-wrapper {
  background: rgba(26, 115, 232, 0.12);
  transform: translateY(-1px) scale(1.05);
}

.trust-icon {
  font-size: 18px;
  color: var(--accent);
}

.trust-item h4 {
  margin: 0 0 4px;
  font-weight: 700;
  font-size: 0.98rem;
}

.trust-item p {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}

/* CTA con gradiente animado */
.cta-section {
  padding: 80px 16px 76px;
  text-align: center;
  background: linear-gradient(135deg, #f8f8f8 0%, #eaeaea 100%);
}

.cta-content.cta-animate-in {
  max-width: 700px;
  margin: 0 auto;
  animation: fadeUpIn 1s ease-out both;
}

.cta-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 8px;
}

.cta-description {
  font-size: 1.02rem;
  color: #444;
  margin-bottom: 22px;
}

/* Fondo animado tipo highlight detrás del content */
.cta-section {
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at top center,
    rgba(26, 115, 232, 0.18),
    transparent 60%
  );
  mix-blend-mode: screen;
  opacity: 0.7;
  animation: floatSlow 10s ease-in-out infinite;
}

.cta-center {
  justify-content: center;
}

.cta-footnote {
  margin-top: 12px;
  font-size: 0.86rem;
  color: #666;
}

/* FAQ */
.faq-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 16px 72px;
}

.faq-animate-in {
  animation: fadeUpIn 1s ease-out both;
}

.faq-list {
  border-radius: 12px;
  overflow: hidden;
}

.faq-header {
  font-size: 0.95rem;
}

.faq-header :deep(.q-item__section--avatar .q-icon) {
  font-size: 18px;
  color: var(--accent);
}

.faq-header :deep(.q-item__label) {
  font-weight: 500;
}

.faq-a {
  padding: 12px 16px 16px;
  color: #444;
  font-size: 0.95rem;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 1180px) {
  .hero-inner {
    gap: 40px;
  }
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .trust-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-title {
    font-size: 2.2rem;
    line-height: 1.18;
    max-width: 20ch;
  }

  .section-title {
    font-size: 1.7rem;
    line-height: 1.22;
  }
}

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-image {
    order: -1;
  }

  .hero-section {
    padding-top: 48px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
    line-height: 1.18;
    margin-bottom: 8px;
    max-width: 19ch;
  }

  .hero-subtitle {
    font-size: 0.98rem;
    line-height: 1.5;
    margin-bottom: 18px;
  }

  .hero-bullets li {
    font-size: 0.92rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-buttons .q-btn {
    width: 100%;
    justify-content: center;
  }

  .section-title {
    font-size: 1.55rem;
    line-height: 1.22;
    margin-bottom: 6px;
  }

  .section-subtitle,
  .trust-subtitle {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .hero-section {
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .features-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .trust-section {
    padding-top: 56px;
    padding-bottom: 56px;
  }

  .cta-section {
    padding-top: 64px;
    padding-bottom: 60px;
  }
}

@media (max-width: 520px) {
  .hero-inner {
    padding-inline: 12px;
    gap: 28px;
  }

  .hero-title {
    font-size: 1.7rem;
    line-height: 1.16;
    max-width: 18ch;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  .hero-badge {
    font-size: 0.7rem;
    padding: 5px 8px;
  }

  .hero-section {
    padding-top: 32px;
    padding-bottom: 36px;
  }

  .section-title {
    font-size: 1.45rem;
    line-height: 1.2;
  }

  .features-section,
  .faq-section {
    padding-inline: 12px;
  }

  .trust-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
