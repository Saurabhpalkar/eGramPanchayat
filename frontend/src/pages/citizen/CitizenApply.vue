<template>
  <div>
    <DashboardHeader title="नवीन दाखला व सेवेसाठी अर्ज" subtitle="ग्रामपंचायत ऑनलाईन ई-सेवा दालन" />

    <!-- Stepper Navigation Header -->
    <div class="eg-card p-3 my-3">
      <div class="d-flex justify-content-between align-items-center position-relative font-sans text-xs">
        <div class="d-flex align-items-center gap-2 z-1" :class="step >= 1 ? 'text-success fw-bold' : 'text-muted'">
          <span class="badge rounded-circle p-2 d-inline-flex align-items-center justify-content-center" :class="step >= 1 ? 'bg-success text-white' : 'bg-light text-muted border'">1</span>
          <span class="d-none d-sm-inline">सेवा निवडा</span>
        </div>
        <div class="flex-grow-1 mx-2 border-top" :class="step >= 2 ? 'border-success border-2' : 'border-secondary opacity-25'"></div>

        <div class="d-flex align-items-center gap-2 z-1" :class="step >= 2 ? 'text-success fw-bold' : 'text-muted'">
          <span class="badge rounded-circle p-2 d-inline-flex align-items-center justify-content-center" :class="step >= 2 ? 'bg-success text-white' : 'bg-light text-muted border'">2</span>
          <span class="d-none d-sm-inline">नागरिक माहिती</span>
        </div>
        <div class="flex-grow-1 mx-2 border-top" :class="step >= 3 ? 'border-success border-2' : 'border-secondary opacity-25'"></div>

        <div class="d-flex align-items-center gap-2 z-1" :class="step >= 3 ? 'text-success fw-bold' : 'text-muted'">
          <span class="badge rounded-circle p-2 d-inline-flex align-items-center justify-content-center" :class="step >= 3 ? 'bg-success text-white' : 'bg-light text-muted border'">3</span>
          <span class="d-none d-sm-inline">कागदपत्रे (Upload)</span>
        </div>
        <div class="flex-grow-1 mx-2 border-top" :class="step >= 4 ? 'border-success border-2' : 'border-secondary opacity-25'"></div>

        <div class="d-flex align-items-center gap-2 z-1" :class="step >= 4 ? 'text-success fw-bold' : 'text-muted'">
          <span class="badge rounded-circle p-2 d-inline-flex align-items-center justify-content-center" :class="step >= 4 ? 'bg-success text-white' : 'bg-light text-muted border'">4</span>
          <span class="d-none d-sm-inline">शुल्क भरणा व सबमिट</span>
        </div>
      </div>
    </div>

    <!-- STEP 1: Select Service -->
    <div v-if="step === 1" class="my-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-success mb-0" style="font-family: var(--font-marathi);">
          <i class="bi bi-grid-fill me-2"></i>आपल्याला आवश्यक असलेला दाखला निवडा
        </h5>
        <div class="input-group input-group-sm" style="max-width: 250px;">
          <input type="text" v-model="serviceSearch" class="form-control" placeholder="दाखल्याचे नाव शोधा..." />
        </div>
      </div>

      <div class="row g-3">
        <div v-for="srv in filteredServices" :key="srv.id" class="col-sm-6 col-lg-3">
          <div 
            class="eg-card h-100 p-3 d-flex flex-column justify-content-between border transition-all cursor-pointer hover-shadow"
            :class="selectedService?.id === srv.id ? 'border-2 border-success bg-success bg-opacity-10 shadow-sm' : ''"
            @click="selectService(srv)"
          >
            <div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                  <i class="bi bi-file-earmark-check fs-4"></i>
                </div>
                <span class="badge bg-light text-dark border font-sans text-xs">₹{{ srv.fee }} शुल्क</span>
              </div>
              <h6 class="fw-bold text-dark mb-1" style="font-family: var(--font-marathi);">{{ srv.nameMr }}</h6>
              <p class="text-xs text-muted font-sans mb-3">{{ srv.descriptionMr || 'ऑनलाईन अर्जासाठी पात्र' }}</p>
            </div>

            <div class="pt-2 border-top d-flex justify-content-between align-items-center text-xs font-sans text-success fw-bold">
              <span>SLA: {{ srv.slaDays }} दिवस</span>
              <button class="btn btn-sm btn-success rounded-pill px-3 py-1">
                निवडा <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 2: Applicant Details -->
    <div v-else-if="step === 2" class="eg-card p-4 my-3 font-sans">
      <div class="border-bottom pb-3 mb-3">
        <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-1">
          निवडलेली सेवा: {{ selectedService?.nameMr }}
        </span>
        <h5 class="fw-bold text-dark mb-0">अर्जादाराची वैयक्तिक माहिती (Applicant Details)</h5>
      </div>

      <form @submit.prevent="step = 3">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-xs fw-bold text-dark">पूर्ण नाव (मराठीत) <span class="text-danger">*</span></label>
            <input type="text" v-model="formData.applicantName" class="form-control text-xs" placeholder="उदा. रमेश मारुती पाटील" required />
          </div>
          <div class="col-md-6">
            <label class="form-label text-xs fw-bold text-dark">आधार क्रमांक (Aadhaar No) <span class="text-danger">*</span></label>
            <input type="text" v-model="formData.aadhaarNo" class="form-control text-xs" maxlength="12" placeholder="१२ अंकी आधार क्र." required />
          </div>
          <div class="col-md-6">
            <label class="form-label text-xs fw-bold text-dark">मोबाईल क्रमांक (OTP व SMS साठी) <span class="text-danger">*</span></label>
            <input type="tel" v-model="formData.mobile" class="form-control text-xs" maxlength="10" placeholder="१० अंकी मोबाईल क्र." required />
          </div>
          <div class="col-md-6">
            <label class="form-label text-xs fw-bold text-dark">ईमेल (पर्यायी)</label>
            <input type="email" v-model="formData.email" class="form-control text-xs" placeholder="email@example.com" />
          </div>
          <div class="col-md-4">
            <label class="form-label text-xs fw-bold text-dark">वार्ड क्रमांक <span class="text-danger">*</span></label>
            <select v-model="formData.wardNo" class="form-select text-xs" required>
              <option v-for="w in 6" :key="w" :value="w">वॉर्ड क्र. {{ w }}</option>
            </select>
          </div>
          <div class="col-md-8">
            <label class="form-label text-xs fw-bold text-dark">रहवासी पत्ता <span class="text-danger">*</span></label>
            <input type="text" v-model="formData.address" class="form-control text-xs" placeholder="गल्ली क्र. / घर क्र. / शिवारे" required />
          </div>
        </div>

        <div class="d-flex justify-content-between mt-4 pt-3 border-top">
          <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="step = 1">
            <i class="bi bi-arrow-left me-1"></i> मागे जा
          </button>
          <button type="submit" class="btn btn-success btn-sm rounded-pill px-4 fw-bold">
            पुढे जा (कागदपत्रे) <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- STEP 3: Document Uploads -->
    <div v-else-if="step === 3" class="eg-card p-4 my-3 font-sans">
      <div class="border-bottom pb-3 mb-3">
        <h5 class="fw-bold text-dark mb-0"><i class="bi bi-cloud-arrow-up text-success me-2"></i>आवश्यक कागदपत्रे अपलोड करा (Upload Documents)</h5>
        <small class="text-muted">स्वीकृत फॉरमॅट: JPG, PNG, PDF (जास्तीत जास्त आकार २ MB)</small>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <div class="border border-dashed p-3 rounded text-center bg-light">
            <i class="bi bi-card-image fs-2 text-success d-block mb-1"></i>
            <strong class="text-xs text-dark d-block mb-1">१. आधार कार्ड / ओळखपत्र <span class="text-danger">*</span></strong>
            <input type="file" ref="fileAadhaar" class="form-control form-control-sm text-xs mt-2" @change="onFileSelected('aadhaar', $event)" />
            <small v-if="files.aadhaar" class="text-success fw-bold d-block mt-1">✓ {{ files.aadhaar.name }} अपलोड झाले</small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="border border-dashed p-3 rounded text-center bg-light">
            <i class="bi bi-house-door fs-2 text-success d-block mb-1"></i>
            <strong class="text-xs text-dark d-block mb-1">२. रेशन कार्ड / वीज बिल (रहिवास पुरावा) <span class="text-danger">*</span></strong>
            <input type="file" ref="fileResidence" class="form-control form-control-sm text-xs mt-2" @change="onFileSelected('residence', $event)" />
            <small v-if="files.residence" class="text-success fw-bold d-block mt-1">✓ {{ files.residence.name }} अपलोड झाले</small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="border border-dashed p-3 rounded text-center bg-light">
            <i class="bi bi-file-earmark-text fs-2 text-success d-block mb-1"></i>
            <strong class="text-xs text-dark d-block mb-1">३. स्वयंघोषणा पत्र (Self Declaration)</strong>
            <input type="file" ref="fileSelf" class="form-control form-control-sm text-xs mt-2" @change="onFileSelected('self', $event)" />
            <small v-if="files.self" class="text-success fw-bold d-block mt-1">✓ {{ files.self.name }} अपलोड झाले</small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="border border-dashed p-3 rounded text-center bg-light">
            <i class="bi bi-receipt fs-2 text-success d-block mb-1"></i>
            <strong class="text-xs text-dark d-block mb-1">४. घरपट्टी / पाणीपट्टी पावती (जर लागू असेल)</strong>
            <input type="file" ref="fileTax" class="form-control form-control-sm text-xs mt-2" @change="onFileSelected('tax', $event)" />
            <small v-if="files.tax" class="text-success fw-bold d-block mt-1">✓ {{ files.tax.name }} अपलोड झाले</small>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-4 pt-3 border-top">
        <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="step = 2">
          <i class="bi bi-arrow-left me-1"></i> मागे जा
        </button>
        <button type="button" class="btn btn-success btn-sm rounded-pill px-4 fw-bold" @click="step = 4">
          पुढे जा (पेमेंट) <i class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>

    <!-- STEP 4: Review & Payment -->
    <div v-else-if="step === 4" class="eg-card p-4 my-3 font-sans">
      <div class="border-bottom pb-3 mb-3">
        <h5 class="fw-bold text-dark mb-0"><i class="bi bi-check2-square text-success me-2"></i>अर्जाचे पुनरावलोकन व ऑनलाईन शुल्क भरणा</h5>
      </div>

      <div class="row g-3">
        <div class="col-md-7">
          <div class="bg-light p-3 rounded border text-xs d-flex flex-column gap-2 mb-3">
            <div class="d-flex justify-content-between">
              <span class="text-muted">निवडलेला दाखला:</span>
              <strong class="text-dark">{{ selectedService?.nameMr }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">अर्जादाराचे नाव:</span>
              <strong class="text-dark">{{ formData.applicantName }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">आधार क्रमांक:</span>
              <strong class="text-dark">{{ formData.aadhaarNo }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">मोबाईल क्रमांक:</span>
              <strong class="text-dark">{{ formData.mobile }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">वार्ड क्रमांक:</span>
              <strong class="text-dark">वार्ड क्र. {{ formData.wardNo }}</strong>
            </div>
          </div>

          <!-- Payment Options -->
          <h6 class="fw-bold text-success mb-2">पेमेंट पद्धत निवडा (Payment Method)</h6>
          <div class="d-flex flex-column gap-2 mb-3">
            <label class="border p-2.5 rounded d-flex align-items-center gap-2 cursor-pointer bg-white">
              <input type="radio" v-model="paymentMethod" value="UPI" />
              <i class="bi bi-qr-code-scan text-success fs-5"></i>
              <div>
                <strong class="d-block text-xs text-dark">UPI / PhonePe / GooglePay / QR Code</strong>
                <small class="text-muted">झटपट ऑनलाईन पावती मिळवा</small>
              </div>
            </label>
            <label class="border p-2.5 rounded d-flex align-items-center gap-2 cursor-pointer bg-white">
              <input type="radio" v-model="paymentMethod" value="NETBANKING" />
              <i class="bi bi-bank text-primary fs-5"></i>
              <div>
                <strong class="d-block text-xs text-dark">नेटबँकिंग / डेबिट कार्ड</strong>
                <small class="text-muted">सर्व प्रमुख बँका उपलब्ध</small>
              </div>
            </label>
            <label class="border p-2.5 rounded d-flex align-items-center gap-2 cursor-pointer bg-white">
              <input type="radio" v-model="paymentMethod" value="OFFICE_CASH" />
              <i class="bi bi-cash-stack text-warning fs-5"></i>
              <div>
                <strong class="d-block text-xs text-dark">ग्रामपंचायत कार्यालयात रोख भरणे</strong>
                <small class="text-muted">अर्ज दाखल होईल, दाखला मिळताना शुल्क भरा</small>
              </div>
            </label>
          </div>
        </div>

        <div class="col-md-5">
          <div class="border rounded-3 p-3 bg-success bg-opacity-10">
            <h6 class="fw-bold text-success mb-3">शुल्क विवरण (Bill Summary)</h6>
            <div class="d-flex justify-content-between text-xs mb-2 font-sans">
              <span>सरकारी दाखला आकार:</span>
              <span>₹{{ selectedService?.fee || 30 }}</span>
            </div>
            <div class="d-flex justify-content-between text-xs mb-2 font-sans">
              <span>पोर्टल व ई-सुविधा शुल्क:</span>
              <span>₹१०</span>
            </div>
            <hr class="my-2" />
            <div class="d-flex justify-content-between text-sm font-sans fw-bold text-dark mb-3">
              <span>एकूण देय रक्कम:</span>
              <span class="text-success fs-5">₹{{ (selectedService?.fee || 30) + 10 }}</span>
            </div>

            <button class="btn btn-success w-100 rounded-pill py-2 font-sans fw-bold shadow-sm" @click="submitFinalApplication">
              <i class="bi bi-shield-check me-1"></i> ऑनलाईन अर्ज व शुल्क जमा करा
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Confirmation Modal -->
    <div v-if="submittedApp" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3 text-center p-4">
          <div class="mb-3 text-success">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 3.5rem;"></i>
          </div>
          <h4 class="fw-bold text-success mb-1" style="font-family: var(--font-marathi);">अर्ज यशस्वीरीत्या सादर झाला!</h4>
          <p class="text-xs text-muted font-sans mb-3">आपला अर्ज ग्रामपंचायत दाखला कक्षाकडे जमा झाला आहे.</p>

          <div class="bg-light p-3 rounded-3 border text-start text-xs font-sans mb-3">
            <div class="d-flex justify-content-between mb-1">
              <span class="text-muted">अर्ज क्रमांक (Reference ID):</span>
              <strong class="text-dark fs-6">{{ submittedApp.applicationNo }}</strong>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <span class="text-muted">दाखल्याचे नाव:</span>
              <span>{{ submittedApp.serviceNameMr }}</span>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <span class="text-muted">अपेक्षित अंतिम तारीख:</span>
              <strong class="text-warning">{{ submittedApp.dueDate }}</strong>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-success btn-sm w-100 rounded-pill font-sans" @click="downloadReceipt">
              <i class="bi bi-download me-1"></i> पावती PDF
            </button>
            <router-link to="/citizen/applications" class="btn btn-success btn-sm w-100 rounded-pill font-sans fw-bold">
              माझे अर्ज पाहा <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMockData } from '../../composables/useMockData';
import { useAuth } from '../../composables/useAuth';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const route = useRoute();
const router = useRouter();
const { services, submitServiceApplication } = useMockData();
const { user } = useAuth();

const step = ref(1);
const serviceSearch = ref('');
const selectedService = ref<any>(null);
const paymentMethod = ref('UPI');
const submittedApp = ref<any>(null);

const formData = reactive({
  applicantName: user.value.name || 'रामचंद्र पाटील',
  aadhaarNo: user.value.citizenAadhaar || '789012345678',
  mobile: user.value.mobile || '9822334455',
  email: 'citizen@panchayat.gov.in',
  wardNo: 3,
  address: 'वार्ड क्र. ३, मुख्य रस्ता'
});

const files = reactive<Record<string, File | null>>({
  aadhaar: null,
  residence: null,
  self: null,
  tax: null
});

const filteredServices = computed(() => {
  return services.value.filter(s => 
    !serviceSearch.value || s.nameMr.toLowerCase().includes(serviceSearch.value.toLowerCase())
  );
});

function selectService(srv: any) {
  selectedService.value = srv;
  step.value = 2;
}

function onFileSelected(key: string, e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    files[key] = target.files[0];
  }
}

function submitFinalApplication() {
  if (!selectedService.value) return;

  const app = submitServiceApplication(
    selectedService.value.id,
    formData.applicantName,
    formData.mobile,
    formData.aadhaarNo
  );

  submittedApp.value = app;
}

function downloadReceipt() {
  alert(`अर्ज क्रमांक ${submittedApp.value?.applicationNo} ची अधिकृत पावती डाऊनलोड झाली.`);
}

onMounted(() => {
  if (route.query.applyId) {
    const srv = services.value.find(s => s.id === route.query.applyId);
    if (srv) {
      selectedService.value = srv;
      step.value = 2;
    }
  }
});
</script>
