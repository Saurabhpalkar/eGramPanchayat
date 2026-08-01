<template>
  <div>
    <DashboardHeader 
      title="दाखले निर्गमित करणे व जनरेटर (Certificate Processing Engine)" 
      subtitle="डिजिटल सही, बारकोड व क्युआर कोडयुक्त अधिकृत ग्रामपंचायत दाखले जनरेट करा" 
    />

    <!-- Active Certificate Generator Split View -->
    <div class="row g-3 my-3 font-sans">
      <!-- Left Column: Certificate Selector & Form -->
      <div class="col-lg-5">
        <div class="eg-card p-4 h-100">
          <h6 class="fw-bold text-success mb-3">
            <i class="bi bi-file-earmark-diff me-2"></i>दाखल्याचा प्रकार निवडा (Select Certificate Type)
          </h6>

          <!-- Certificate Type Pills -->
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button 
              v-for="cert in certTypes" 
              :key="cert.id"
              class="btn btn-sm rounded-pill text-xs px-3"
              :class="selectedCertType === cert.id ? 'btn-success fw-bold' : 'btn-outline-success'"
              @click="selectCertType(cert.id)"
            >
              <i :class="cert.icon + ' me-1'"></i> {{ cert.nameMr }}
            </button>
          </div>

          <!-- Form Fields to Fill -->
          <form @submit.prevent="generatePreview" class="border-top pt-3">
            <div class="mb-2">
              <label class="form-label text-xs fw-bold">जावक क्रमांक (Outward No.) *</label>
              <input type="text" v-model="form.outwardNo" class="form-control text-xs" required />
            </div>

            <div class="mb-2">
              <label class="form-label text-xs fw-bold">अर्जाचा दाखलाधारकाचे नाव (Full Name) *</label>
              <input type="text" v-model="form.citizenName" class="form-control text-xs" required />
            </div>

            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label text-xs fw-bold">आधार क्रमांक *</label>
                <input type="text" v-model="form.aadhaar" class="form-control text-xs" required />
              </div>
              <div class="col-6">
                <label class="form-label text-xs fw-bold">मोबाईल क्रमांक *</label>
                <input type="text" v-model="form.phone" class="form-control text-xs" required />
              </div>
            </div>

            <div class="mb-2">
              <label class="form-label text-xs fw-bold">पत्ता / वॉर्ड *</label>
              <input type="text" v-model="form.address" class="form-control text-xs" required />
            </div>

            <div v-if="selectedCertType === 'income'" class="mb-2">
              <label class="form-label text-xs fw-bold">वार्षिक उत्पन्न (रुपयांमध्ये) *</label>
              <input type="number" v-model="form.annualIncome" class="form-control text-xs" placeholder="उदा. 75000" />
            </div>

            <div v-if="selectedCertType === 'gharpatti'" class="mb-2">
              <label class="form-label text-xs fw-bold">मालमत्ता / घर क्रमांक *</label>
              <input type="text" v-model="form.propertyNo" class="form-control text-xs" placeholder="उदा. 452/B" />
            </div>

            <div class="mb-3">
              <label class="form-label text-xs fw-bold">विशेष नोंद / कारण (Purpose) *</label>
              <textarea v-model="form.purpose" rows="2" class="form-control text-xs" placeholder="उदा. शैक्षणिक शिष्यवृत्ती व शासकीय योजनेसाठी"></textarea>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-eg-primary btn-sm w-100 rounded-pill fw-bold">
                <i class="bi bi-eye-fill me-1"></i> डिजिटल दाखला पूर्वदृश्य (Generate Preview)
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Column: Official Formatted Certificate Preview Card -->
      <div class="col-lg-7">
        <div class="eg-card p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-success mb-0">
                <i class="bi bi-award-fill me-2"></i>डिजिटल दाखला पूर्वदृश्य (Live Certificate Preview)
              </h6>
              <span class="badge bg-success text-white text-xs"><i class="bi bi-check-circle me-1"></i>QR Verified</span>
            </div>

            <!-- Authentic Government Certificate Layout Box -->
            <div id="printableCertificate" class="p-4 rounded-3 border bg-white shadow-sm position-relative font-sans" style="border: 3px double #1b5e20 !important;">
              <!-- Watermark -->
              <div class="position-absolute top-50 start-50 translate-middle opacity-10 pointer-events-none text-center">
                <i class="bi bi-building fs-1 text-success" style="font-size: 8rem !important;"></i>
                <div class="fw-bold text-uppercase fs-4">महाराष्ट्र शासन - ई-ग्राम</div>
              </div>

              <!-- Certificate Header -->
              <div class="text-center border-bottom border-2 border-success pb-3 mb-3">
                <div class="text-xs fw-bold text-uppercase text-muted mb-1">महाराष्ट्र शासन - ग्रामविकास विभाग</div>
                <h4 class="fw-bold text-success mb-1">शिवणे ग्रामपंचायत कार्यालय</h4>
                <div class="text-xs text-muted">तालुका: हवेली | जिल्हा: पुणे | ई-ग्राम कोड: 27250012</div>
              </div>

              <!-- Outward & Date Row -->
              <div class="d-flex justify-content-between text-xs fw-bold mb-3 border-bottom pb-2">
                <span>जावक क्रमांक: <span class="text-dark">{{ form.outwardNo }}</span></span>
                <span>दिनांक: <span class="text-dark">{{ todayDate }}</span></span>
              </div>

              <!-- Certificate Title -->
              <div class="text-center my-3">
                <h5 class="fw-bold text-dark text-decoration-underline d-inline-block px-3 py-1 bg-light rounded">
                  {{ activeCertName }}
                </h5>
              </div>

              <!-- Legal Marathi Wording Body -->
              <div class="text-xs lh-lg text-dark mb-4">
                <p class="mb-2">
                  प्रमाणित करण्यात येते की, श्री / श्रीमती <strong>{{ form.citizenName }}</strong> (आधार क्र: {{ form.aadhaar }}), 
                  रा. <strong>{{ form.address }}</strong>, ता. हवेली, जि. पुणे हे शिवणे ग्रामपंचायत हद्दीतील कायमस्वरूपी रहिवासी आहेत.
                </p>
                <p v-if="selectedCertType === 'income'" class="mb-2">
                  त्यांचे सर्व मार्गांनी मिळणारे एकत्रित कौटुंबिक वार्षिक उत्पन्न रु. <strong>{{ form.annualIncome || '७५,०००' }}/- (अक्षरी रुपये पंच्छ्यात्तर हजार फक्त)</strong> आहे.
                </p>
                <p v-if="selectedCertType === 'police_patil'" class="mb-2">
                  ग्रामपंचायत अभिलेखानुसार सदर इसमावर गावात कोणत्याही प्रकारचा गुन्हा किंवा आक्षेपार्ह नोंद नाही. त्यांची वर्तणूक व चारित्र्य उत्तम आहे.
                </p>
                <p v-if="selectedCertType === 'gharpatti'" class="mb-2">
                  त्यांच्या नावावर मिळकत / घर क्रमांक <strong>{{ form.propertyNo || '452/B' }}</strong> ची सन २०२६-२७ ची संपूर्ण घरपट्टी रक्कम जमा झालेली आहे.
                </p>
                <p class="mb-0">
                  सदरचा दाखला अर्जदाराच्या विनंतीवरून <strong>"{{ form.purpose }}"</strong> या कारणासाठी निर्गमित करण्यात येत आहे.
                </p>
              </div>

              <!-- Footer with Signatures & QR Code -->
              <div class="row align-items-end pt-3 border-top border-2 border-success mt-4">
                <div class="col-4 text-center">
                  <!-- QR Code Simulation -->
                  <div class="p-2 border rounded bg-light d-inline-block text-center">
                    <i class="bi bi-qr-code fs-2 text-dark"></i>
                    <div class="text-xs text-muted" style="font-size: 0.65rem;">QR Verified Digital Stamp</div>
                  </div>
                </div>

                <div class="col-4 text-center">
                  <div class="p-2 border rounded border-success bg-success bg-opacity-10 text-success text-xs">
                    <i class="bi bi-patch-check-fill d-block fs-5"></i>
                    <strong>ग्रामपंचायत शिवणे</strong><br />
                    डिजिटल शिक्का (Seal)
                  </div>
                </div>

                <div class="col-4 text-center">
                  <div class="text-xs text-muted mb-1">डिजिटल स्वाक्षरित</div>
                  <strong class="text-dark d-block text-xs">श्री. रमेश शिंदे</strong>
                  <small class="text-muted d-block" style="font-size: 0.7rem;">ग्रामविकास अधिकारी / ग्रामसेवक</small>
                  <small class="text-success fw-bold" style="font-size: 0.65rem;">शिवणे ग्रामपंचायत</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-3 border-top d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-outline-primary rounded-pill px-3 text-xs" @click="forwardForApproval">
              <i class="bi bi-send me-1"></i> ग्रामसेवकांकडे ई-सहीसाठी पाठवा
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-success rounded-pill px-3 text-xs" @click="printCertificate">
                <i class="bi bi-printer me-1"></i> प्रिंट करा (Print)
              </button>
              <button class="btn btn-eg-primary rounded-pill px-4 text-xs fw-bold" @click="downloadPdf">
                <i class="bi bi-download me-1"></i> दाखला डाऊनलोड करा (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const certTypes = [
  { id: 'police_patil', nameMr: 'पोलीस पाटील दाखला', icon: 'bi-shield-check' },
  { id: 'income', nameMr: 'उत्पन्न दाखला', icon: 'bi-cash-coin' },
  { id: 'residence', nameMr: 'रहवासी दाखला', icon: 'bi-house-check' },
  { id: 'birth', nameMr: 'जन्म दाखला', icon: 'bi-person-plus' },
  { id: 'death', nameMr: 'मृत्यू दाखला', icon: 'bi-file-earmark-x' },
  { id: 'gharpatti', nameMr: 'घरपट्टी कर दाखला', icon: 'bi-receipt' },
  { id: 'water_tax', nameMr: 'पाणीपट्टी NOC', icon: 'bi-droplet-half' },
  { id: 'noc', nameMr: 'सामान्य NOC', icon: 'bi-card-heading' }
];

const selectedCertType = ref('police_patil');
const todayDate = ref(new Date().toLocaleDateString('mr-IN'));

const form = ref({
  outwardNo: `GP/SHV/2026/${Math.floor(100 + Math.random() * 900)}`,
  citizenName: 'संजय बबनराव देशमुख',
  aadhaar: 'XXXX-XXXX-8921',
  phone: '9822123456',
  address: 'शिवणे गावठाण, वॉर्ड क्र. ३',
  annualIncome: 75000,
  propertyNo: '452/B',
  purpose: 'शैक्षणिक शिष्यवृत्ती व शासकीय योजनेसाठी'
});

const activeCertName = computed(() => {
  const match = certTypes.find(c => c.id === selectedCertType.value);
  return match ? match.nameMr : 'ग्रामपंचायत दाखला';
});

function selectCertType(id: string) {
  selectedCertType.value = id;
}

function generatePreview() {
  alert('डिजिटल दाखला पूर्वदृश्य यशस्वीरित्या जनरेट झाले.');
}

function printCertificate() {
  window.print();
}

function downloadPdf() {
  alert(`दाखला ${form.value.outwardNo} चे PDF डाऊनलोड यशस्वी झाले.`);
}

function forwardForApproval() {
  alert('दाखला ग्रामसेवकांच्या डिजिटल स्वाक्षरीसाठी पाठवला गेला आहे.');
}
</script>
