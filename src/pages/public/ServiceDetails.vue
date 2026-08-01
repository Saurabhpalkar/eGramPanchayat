<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 900px;">
      <!-- Breadcrumb & Back button -->
      <div class="d-flex align-items-center justify-content-between mb-4 font-sans">
        <router-link to="/services" class="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i class="bi bi-arrow-left me-1"></i> सर्व दाखल्यांची यादी
        </router-link>
        <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
          कोड: {{ currentService.code }}
        </span>
      </div>

      <!-- Main Service Header Card -->
      <div class="eg-card p-4 p-md-5 mb-4 border-top border-4 border-success shadow-sm">
        <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
          <div>
            <span class="badge bg-success text-white font-sans text-xs mb-2">{{ currentService.category }}</span>
            <h2 class="fw-bold text-success mb-1">{{ currentService.nameMr }}</h2>
            <h5 class="text-muted font-sans fw-normal mb-0">{{ currentService.nameEn }}</h5>
          </div>
          <div class="text-md-end">
            <span class="text-xs text-muted d-block font-sans">शासकीय शुल्क (Government Fee)</span>
            <span class="fs-3 fw-bold text-success">
              {{ currentService.fee === 0 ? 'मोफत (Free)' : `₹${currentService.fee}` }}
            </span>
          </div>
        </div>

        <p class="text-secondary font-sans mb-4">
          {{ currentService.descriptionMr }}
        </p>

        <!-- Quick Info Pills -->
        <div class="row g-3 bg-light p-3 rounded-3 border mb-4 font-sans text-xs">
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block mb-1"><i class="bi bi-clock-history text-success me-1"></i> कालावधी (SLA)</span>
            <strong class="text-dark fs-6">{{ currentService.slaDays }} दिवस</strong>
          </div>
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block mb-1"><i class="bi bi-check-circle-fill text-success me-1"></i> पडताळणी अधिकारी</span>
            <strong class="text-dark fs-6">{{ currentService.officerMr }}</strong>
          </div>
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block mb-1"><i class="bi bi-qr-code-scan text-success me-1"></i> प्रमाणपत्र स्वरूप</span>
            <strong class="text-dark fs-6">डिजिटल सही + QR कोड</strong>
          </div>
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block mb-1"><i class="bi bi-shield-check text-success me-1"></i> वैधता</span>
            <strong class="text-dark fs-6">कायमस्वरूपी / १ वर्ष</strong>
          </div>
        </div>

        <!-- Required Documents Section -->
        <div class="mb-4 font-sans">
          <h5 class="fw-bold text-success mb-3"><i class="bi bi-paperclip me-1"></i> आवश्यक कागदपत्रे (Required Documents):</h5>
          <div class="row g-3">
            <div v-for="(doc, idx) in currentService.requiredDocumentsMr" :key="idx" class="col-md-6">
              <div class="p-3 bg-white rounded-3 border border-start border-3 border-success h-100 d-flex align-items-center gap-3">
                <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 36px; height: 36px;">
                  <span class="fw-bold text-xs">{{ idx + 1 }}</span>
                </div>
                <span class="text-sm fw-medium text-dark">{{ doc }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Procedure Steps -->
        <div class="mb-4 font-sans">
          <h5 class="fw-bold text-success mb-3"><i class="bi bi-diagram-3 me-1"></i> दाखला मिळवण्याची ऑनलाईन प्रक्रिया:</h5>
          <div class="p-3 bg-light rounded-3 border">
            <ol class="mb-0 text-sm text-secondary ps-3">
              <li class="mb-2"><strong>ऑनलाईन अर्ज:</strong> खालील 'ऑनलाईन अर्ज करा' बटनावर क्लिक करून वैयक्तिक व पत्त्याचा तपशील भरा.</li>
              <li class="mb-2"><strong>कागदपत्र अपलोड:</strong> आधार कार्ड व संबंधित रहिवास/उत्पन्न पुरावा अपलोड करा.</li>
              <li class="mb-2"><strong>लिपिक पडताळणी:</strong> ग्रामपंचायत लिपिक कागदपत्रांची अचूकता पडताळतील.</li>
              <li class="mb-0"><strong>डिजिटल सही व डाऊनलोड:</strong> ग्रामसेवक किंवा सरपंचांच्या डिजिटल सहीने दाखला तयार होईल व आपल्या मोबाईलवर मेसेज येईल.</li>
            </ol>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top">
          <span class="text-xs text-muted font-sans">
            <i class="bi bi-info-circle me-1 text-success"></i> काही अडचण असल्यास मदत रेषेवर संपर्क साधा: <strong>१८००-२३३-४५६७</strong>
          </span>
          <router-link :to="{ path: '/services', query: { applyId: currentService.id } }" class="btn btn-eg-primary rounded-pill px-4 py-2 font-sans fw-bold">
            <i class="bi bi-check-circle-fill me-1"></i> या दाखल्यासाठी ऑनलाईन अर्ज करा
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMockData } from '../../composables/useMockData';

const { services } = useMockData();
const route = useRoute();

const currentService = computed(() => {
  const serviceId = route.params.id || route.query.id || '1';
  return services.value.find(s => s.id === serviceId) || services.value[0];
});
</script>
