<template>
  <div class="py-4 bg-light">
    <div class="container">
      <SectionTitle 
        title="ग्रामपंचायत सर्व ऑनलाईन दाखले व सेवा" 
        subtitle="पोलीस पाटील दाखला, उत्पन्न दाखला, घरपट्टी, पाणीपट्टी, ना हरकत प्रमाणपत्र (NOC) व व्यवसाय परवान्यासाठी ऑनलाईन अर्ज करा."
        tag="१२+ ऑनलाईन सेवा"
        align="center"
      />

      <!-- Search & Category Filters -->
      <div class="eg-card p-3 mb-4">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input 
                type="text" 
                v-model="searchQuery" 
                class="form-control border-start-0" 
                placeholder="सेवा किंवा दाखल्याचे नाव शोधा (उदा. रहिवास, दाखला, Tax)..." 
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex flex-wrap gap-2 justify-content-md-end font-sans">
              <button 
                v-for="cat in categories" 
                :key="cat" 
                class="btn btn-sm rounded-pill px-3"
                :class="selectedCategory === cat ? 'btn-eg-primary' : 'btn-outline-secondary'"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="row g-3">
        <div v-for="srv in filteredServices" :key="srv.id" class="col-12 col-sm-6 col-lg-3">
          <ServiceCard :service="srv" @apply="openApplyModal" />
        </div>
      </div>

      <!-- Application Form Modal -->
      <div v-if="activeModalService" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header bg-success text-white">
              <div>
                <h5 class="modal-title fw-bold">{{ activeModalService.nameMr }}</h5>
                <small class="text-white-50 font-sans">कोड: {{ activeModalService.code }} | कालावधी: {{ activeModalService.slaDays }} दिवस</small>
              </div>
              <button type="button" class="btn-close btn-close-white" @click="activeModalService = null"></button>
            </div>

            <div class="modal-body p-4 font-sans">
              <!-- Required Documents Checklist -->
              <div class="bg-light p-3 rounded-3 border mb-4">
                <h6 class="fw-bold text-success mb-2"><i class="bi bi-paperclip me-1"></i> आवश्यक कागदपत्रे (Required Documents):</h6>
                <ul class="mb-0 text-sm text-secondary ps-3">
                  <li v-for="(doc, idx) in activeModalService.requiredDocumentsMr" :key="idx" class="mb-1">
                    {{ doc }}
                  </li>
                </ul>
              </div>

              <!-- Application Inputs -->
              <form @submit.prevent="handleFormSubmit">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label text-xs fw-bold">अर्जदाराचे पूर्ण नाव (Applicant Name) *</label>
                    <input type="text" v-model="applicantName" required class="form-control" placeholder="उदा. संजय देशमुख" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-xs fw-bold">मोबाईल क्रमांक (Mobile Number) *</label>
                    <input type="tel" v-model="applicantPhone" required maxlength="10" class="form-control" placeholder="१० अंकी मोबाईल क्र." />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-xs fw-bold">आधार क्रमांक (Aadhaar Number) *</label>
                    <input type="text" v-model="applicantAadhaar" required class="form-control" placeholder="XXXX-XXXX-XXXX" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-xs fw-bold">वॉर्ड क्र. / गल्ली (Ward No) *</label>
                    <select class="form-select" v-model="applicantWard">
                      <option value="वॉर्ड १">वॉर्ड १ (मुख्य बसस्थानक)</option>
                      <option value="वॉर्ड २">वॉर्ड २ (मंदिर गल्ली)</option>
                      <option value="वॉर्ड ३">वॉर्ड ३ (शाळा रोड)</option>
                      <option value="वॉर्ड ४">वॉर्ड ४ (टेकडी परिसर)</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label text-xs fw-bold">कागदपत्र अपलोड (Aadhaar / Address Proof) *</label>
                    <FileUpload @file-selected="onFileSelected" />
                  </div>
                </div>

                <div class="alert alert-info text-xs mt-3 mb-0 d-flex align-items-center gap-2">
                  <i class="bi bi-shield-check fs-4"></i>
                  <div>
                    शासकीय शुल्क: <strong>{{ activeModalService.fee === 0 ? 'मोफत' : `₹${activeModalService.fee}` }}</strong> | डिजिटल सहीचा दाखला आपल्या प्रोफाईलवर व व्हॉट्सॲपवर पाठवला जाईल.
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" class="btn btn-light rounded-pill px-4" @click="activeModalService = null">रद्द करा</button>
                  <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold" :disabled="submitting">
                    <span v-if="submitting"><span class="spinner-border spinner-border-sm me-1"></span> प्रक्रिया सुरू आहे...</span>
                    <span v-else><i class="bi bi-check-circle-fill me-1"></i> अर्ज दाखल करा</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal Toast -->
      <div v-if="createdApplicationNo" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 border-0 p-4 text-center">
            <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-check-lg fs-1"></i>
            </div>
            <h4 class="fw-bold text-success mb-2">अर्ज यशस्वीरित्या दाखल झाला!</h4>
            <p class="text-muted text-xs mb-3 font-sans">आपला अर्ज ग्रामपंचायत कार्यालयात डिजिटल प्रक्रियेसाठी पाठवला आहे.</p>
            <div class="bg-light p-3 rounded-3 border mb-3 font-sans">
              <span class="text-xs text-muted d-block">अर्जाचा क्रमांक (Application ID):</span>
              <strong class="fs-5 text-success">{{ createdApplicationNo }}</strong>
            </div>
            <button class="btn btn-eg-primary rounded-pill w-100 fw-bold" @click="closeSuccessModal">
              अर्जाची स्थिती ट्रॅक करा
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockData } from '../../composables/useMockData';
import type { ServiceItem } from '../../data/mockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import ServiceCard from '../../components/cards/ServiceCard.vue';
import FileUpload from '../../components/common/FileUpload.vue';

const { services, submitServiceApplication } = useMockData();
const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const selectedCategory = ref('सर्व');
const categories = ['सर्व', 'दाखले (Certificates)', 'कर भरणा (Taxes)', 'परवाने (Permits)', 'इतर (Others)'];

const activeModalService = ref<ServiceItem | null>(null);
const applicantName = ref('');
const applicantPhone = ref('');
const applicantAadhaar = ref('');
const applicantWard = ref('वॉर्ड १');
const submitting = ref(false);
const createdApplicationNo = ref('');

const filteredServices = computed(() => {
  return services.value.filter(s => {
    const matchesSearch = s.nameMr.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.nameEn.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'सर्व' || s.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

onMounted(() => {
  if (route.query.applyId) {
    const srv = services.value.find(s => s.id === route.query.applyId);
    if (srv) activeModalService.value = srv;
  }
});

function openApplyModal(srv: ServiceItem) {
  activeModalService.value = srv;
}

function onFileSelected(file: File) {
  console.log('File selected:', file.name);
}

function handleFormSubmit() {
  if (!activeModalService.value) return;
  submitting.value = true;

  setTimeout(() => {
    const newApp = submitServiceApplication(
      activeModalService.value!.id,
      applicantName.value,
      applicantPhone.value,
      applicantAadhaar.value
    );
    submitting.value = false;
    createdApplicationNo.value = newApp.applicationNo;
    activeModalService.value = null;
  }, 800);
}

function closeSuccessModal() {
  const appNo = createdApplicationNo.value;
  createdApplicationNo.value = '';
  router.push({ path: '/track', query: { id: appNo } });
}
</script>
