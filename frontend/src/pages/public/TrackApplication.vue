<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 800px;">
      <SectionTitle 
        title="अर्ज व तक्रार ऑनलाईन स्टेटस ट्रॅकिंग" 
        subtitle="आपला अर्ज क्रमांक (Application ID) किंवा तक्रार तिकीट क्रमांक प्रविष्ट करून सध्याची स्थिती पाहा."
        tag="पारदर्शक डिजिटल ट्रॅकिंग"
        align="center"
      />

      <!-- Search Box Card -->
      <div class="eg-card p-4 mb-4 shadow-sm">
        <form @submit.prevent="handleTrack">
          <label class="form-label font-sans fw-bold text-success mb-2">
            <i class="bi bi-upc-scan me-1"></i> अर्ज क्र. किंवा तक्रार तिकीट क्र. प्रविष्ट करा:
          </label>
          <div class="input-group input-group-lg">
            <input 
              type="text" 
              v-model="trackQuery" 
              class="form-control font-sans" 
              placeholder="उदा. APP-2026-9012 किंवा SHV-2026-0891" 
              required
            />
            <button type="submit" class="btn btn-eg-primary px-4 fw-bold">
              <i class="bi bi-search me-1"></i> स्थिती शोधा
            </button>
          </div>
          <small class="text-muted text-xs mt-2 d-block font-sans">
            टीप: चाचणीसाठी <strong>APP-2026-9012</strong> किंवा <strong>SHV-2026-0891</strong> वापरून पाहा.
          </small>
        </form>
      </div>

      <!-- Result Card: Citizen Application found -->
      <div v-if="foundApp" class="eg-card p-4 mb-4 border-start border-4 border-success">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
          <div>
            <span class="badge bg-success bg-opacity-10 text-success text-xs font-sans mb-1">ग्रामपंचायत अर्ज</span>
            <h4 class="fw-bold text-success mb-0">{{ foundApp.serviceNameMr }}</h4>
            <small class="text-muted font-sans">अर्जदार: {{ foundApp.citizenName }} | मो.: {{ foundApp.phone }}</small>
          </div>
          <StatusBadge :status="foundApp.status" :text="foundApp.statusMr" />
        </div>

        <div class="row g-3 font-sans bg-light p-3 rounded-3 border mb-4 text-xs">
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block">अर्ज क्रमांक</span>
            <strong class="text-dark">{{ foundApp.applicationNo }}</strong>
          </div>
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block">दाखल तारीख</span>
            <strong class="text-dark">{{ foundApp.appliedDate }}</strong>
          </div>
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block">मंजुरी अंतिम मुदत</span>
            <strong class="text-warning">{{ foundApp.dueDate }}</strong>
          </div>
          <div class="col-6 col-sm-3">
            <span class="text-muted d-block">शुल्क भरणा</span>
            <strong class="text-success">₹{{ foundApp.amount }} (Paid)</strong>
          </div>
        </div>

        <!-- Timeline Visualizer -->
        <h6 class="fw-bold text-success mb-3"><i class="bi bi-diagram-3-fill me-1"></i> अर्जाचा टप्प्याटप्प्याने प्रवास:</h6>
        <Timeline :steps="appTimelineSteps" />

        <div v-if="foundApp.downloadUrl" class="mt-4 pt-3 border-top text-center">
          <button class="btn btn-eg-primary rounded-pill px-4 fw-bold">
            <i class="bi bi-file-earmark-pdf-fill me-1"></i> डिजिटल सहीचा दाखला डाऊनलोड करा (PDF)
          </button>
        </div>
      </div>

      <!-- Result Card: Complaint Found -->
      <div v-else-if="foundComplaint" class="eg-card p-4 mb-4 border-start border-4 border-warning">
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
          <div>
            <span class="badge bg-warning bg-opacity-20 text-dark text-xs font-sans mb-1">तक्रार निवारण तिकीट</span>
            <h4 class="fw-bold text-dark mb-0">{{ foundComplaint.title }}</h4>
            <small class="text-muted font-sans">तक्रारदार: {{ foundComplaint.citizenName }} | ठिकाण: {{ foundComplaint.location }}</small>
          </div>
          <StatusBadge :status="foundComplaint.status" :text="foundComplaint.statusMr" />
        </div>

        <div class="bg-light p-3 rounded-3 border mb-4 text-xs font-sans">
          <span class="text-muted d-block mb-1">तक्रारीचा सविस्तर तपशील:</span>
          <p class="text-dark mb-2">{{ foundComplaint.description }}</p>
          <span class="text-success fw-bold"><i class="bi bi-person-badge me-1"></i> नियुक्त कर्मचारी: {{ foundComplaint.assignedStaff || 'तपासणी सुरू आहे' }}</span>
        </div>

        <h6 class="fw-bold text-dark mb-3"><i class="bi bi-tools me-1 text-warning"></i> निवारण प्रगती टाइमलाईन:</h6>
        <Timeline :steps="foundComplaint.timeline" />
      </div>

      <!-- Not Found State -->
      <EmptyState 
        v-else-if="searched && !foundApp && !foundComplaint"
        title="कोणताही रेकॉर्ड सापडला नाही"
        description="कृपया प्रविष्ट केलेला अर्ज क्रमांक किंवा तिकीट आयडी तपासून पुन्हा प्रयत्न करा."
        icon="bi-search text-danger"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMockData } from '../../composables/useMockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';
import Timeline from '../../components/common/Timeline.vue';
import EmptyState from '../../components/common/EmptyState.vue';

const { citizenApplications, complaints } = useMockData();
const route = useRoute();

const trackQuery = ref('');
const searched = ref(false);

onMounted(() => {
  if (route.query.id) {
    trackQuery.value = route.query.id as string;
    handleTrack();
  }
});

const foundApp = computed(() => {
  if (!searched.value || !trackQuery.value) return null;
  return citizenApplications.value.find(a => 
    a.applicationNo.toLowerCase() === trackQuery.value.trim().toLowerCase()
  );
});

const foundComplaint = computed(() => {
  if (!searched.value || !trackQuery.value) return null;
  return complaints.value.find(c => 
    c.ticketId.toLowerCase() === trackQuery.value.trim().toLowerCase()
  );
});

const appTimelineSteps = computed(() => {
  if (!foundApp.value) return [];
  const status = foundApp.value.status;
  return [
    { title: 'अर्ज ऑनलाईन दाखल केला', date: `${foundApp.value.appliedDate}, सकाळी ११:००`, completed: true },
    { title: 'ग्रामपंचायत लिपिकाद्वारे कागदपत्र पडताळणी', date: 'पडताळणी पूर्ण', completed: status !== 'Pending Verification' },
    { title: 'ग्रामसेवक / सरपंच डिजिटल सही', date: 'डिजिटल स्टँप', completed: status === 'Certificate Generated' },
    { title: 'दाखला मंजूर व डाऊनलोडसाठी तयार', date: foundApp.value.dueDate, completed: status === 'Certificate Generated' }
  ];
});

function handleTrack() {
  searched.value = true;
}
</script>
