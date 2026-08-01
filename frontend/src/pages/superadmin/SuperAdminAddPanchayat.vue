<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Add New Gram Panchayat (नवीन ग्रामपंचायत नोंदणी)" 
      subtitle="Super Admin Wizard — Multi-Step Onboarding for New Tenant & Sarpanch Credentials" 
    />

    <!-- Wizard Container -->
    <div class="eg-card p-4 my-3 max-w-4xl mx-auto">
      <!-- Wizard Progress Header -->
      <div class="mb-4 pb-3 border-bottom">
        <div class="d-flex align-items-center justify-content-between mb-3 position-relative">
          <!-- Step 1 Indicator -->
          <div class="d-flex flex-column align-items-center z-1" style="width: 25%;">
            <div 
              class="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all"
              :class="currentStep >= 1 ? 'bg-success text-white shadow' : 'bg-light text-muted border'"
              style="width: 42px; height: 42px; font-size: 1.1rem;"
            >
              <i v-if="currentStep > 1" class="bi bi-check-lg"></i>
              <span v-else>१</span>
            </div>
            <span class="text-xs fw-bold mt-1 text-center" :class="currentStep >= 1 ? 'text-success' : 'text-muted'">मूलभूत माहिती</span>
          </div>

          <!-- Step 2 Indicator -->
          <div class="d-flex flex-column align-items-center z-1" style="width: 25%;">
            <div 
              class="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all"
              :class="currentStep >= 2 ? 'bg-success text-white shadow' : 'bg-light text-muted border'"
              style="width: 42px; height: 42px; font-size: 1.1rem;"
            >
              <i v-if="currentStep > 2" class="bi bi-check-lg"></i>
              <span v-else>२</span>
            </div>
            <span class="text-xs fw-bold mt-1 text-center" :class="currentStep >= 2 ? 'text-success' : 'text-muted'">सरपंच / ॲडमिन</span>
          </div>

          <!-- Step 3 Indicator -->
          <div class="d-flex flex-column align-items-center z-1" style="width: 25%;">
            <div 
              class="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all"
              :class="currentStep >= 3 ? 'bg-success text-white shadow' : 'bg-light text-muted border'"
              style="width: 42px; height: 42px; font-size: 1.1rem;"
            >
              <i v-if="currentStep > 3" class="bi bi-check-lg"></i>
              <span v-else>३</span>
            </div>
            <span class="text-xs fw-bold mt-1 text-center" :class="currentStep >= 3 ? 'text-success' : 'text-muted'">सबस्क्रिप्शन प्लॅन</span>
          </div>

          <!-- Step 4 Indicator -->
          <div class="d-flex flex-column align-items-center z-1" style="width: 25%;">
            <div 
              class="rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all"
              :class="currentStep >= 4 ? 'bg-success text-white shadow' : 'bg-light text-muted border'"
              style="width: 42px; height: 42px; font-size: 1.1rem;"
            >
              <i class="bi bi-award-fill"></i>
            </div>
            <span class="text-xs fw-bold mt-1 text-center" :class="currentStep >= 4 ? 'text-success' : 'text-muted'">पुष्टी व ऑनबोर्ड</span>
          </div>
        </div>
      </div>

      <!-- STEP 1: Basic Information -->
      <div v-if="currentStep === 1">
        <h5 class="fw-bold text-success mb-1"><i class="bi bi-building me-2"></i>टप्पा १: ग्रामपंचायत मूलभूत माहिती (Basic Information)</h5>
        <p class="text-xs text-muted mb-4">नवीन ग्रामपंचायतीचे नाव, कोड व भौगोलिक माहिती भरा.</p>

        <form @submit.prevent="nextStep">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Gram Panchayat Name (मराठी) *</label>
              <input type="text" v-model="formData.nameMr" required class="form-control" placeholder="उदा. शिराळा ग्रामपंचायत" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Gram Panchayat Name (English) *</label>
              <input type="text" v-model="formData.nameEn" required class="form-control" placeholder="e.g. Shirala Gram Panchayat" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Village (मुख्य गाव) *</label>
              <input type="text" v-model="formData.village" required class="form-control" placeholder="उदा. शिराळा" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Panchayat Code (LGD / Govt Code) *</label>
              <input type="text" v-model="formData.code" required class="form-control font-mono" placeholder="उदा. 27250189" />
            </div>

            <div class="col-md-4">
              <label class="form-label text-xs fw-bold">Taluka (तालुका) *</label>
              <input type="text" v-model="formData.taluka" required class="form-control" placeholder="उदा. शिराळा" />
            </div>

            <div class="col-md-4">
              <label class="form-label text-xs fw-bold">District (जिल्हा) *</label>
              <input type="text" v-model="formData.district" required class="form-control" placeholder="उदा. सांगली" />
            </div>

            <div class="col-md-4">
              <label class="form-label text-xs fw-bold">State (राज्य) *</label>
              <input type="text" v-model="formData.state" required class="form-control" readonly />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">PIN Code *</label>
              <input type="text" v-model="formData.pinCode" maxlength="6" required class="form-control font-mono" placeholder="415405" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">एकूण अंदाजित लोकसंख्या (Population)</label>
              <input type="number" v-model.number="formData.population" class="form-control" placeholder="12500" />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <router-link to="/superadmin/panchayats" class="btn btn-light rounded-pill px-4 text-xs">रद्द करा</router-link>
            <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold text-xs">
              पुढे जा (Step 2) <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- STEP 2: Admin Information -->
      <div v-else-if="currentStep === 2">
        <h5 class="fw-bold text-success mb-1"><i class="bi bi-person-badge me-2"></i>टप्पा २: ॲडमिन (सरपंच) माहिती (Admin Information)</h5>
        <p class="text-xs text-muted mb-4">ग्रामपंचायतीचे मुख्य प्रशासक (सरपंच / ग्रामसेवक) अकाऊंट तयार करा.</p>

        <form @submit.prevent="nextStep">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Sarpanch / Admin Name (पूर्ण नाव) *</label>
              <input type="text" v-model="formData.sarpanchName" required class="form-control" placeholder="उदा. सौ. कविता संभाजी कदम" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Mobile Number (मोबाईल क्र.) *</label>
              <input type="tel" v-model="formData.mobile" required maxlength="10" class="form-control font-mono" placeholder="9822112233" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Email Address *</label>
              <input type="email" v-model="formData.email" required class="form-control" placeholder="sarpanch@shirala.egram.gov.in" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">Username (लॉगिन युजरनेम) *</label>
              <div class="input-group">
                <span class="input-group-text bg-light text-muted text-xs">admin_</span>
                <input type="text" v-model="formData.username" required class="form-control font-mono" placeholder="shirala" />
              </div>
            </div>

            <div class="col-12">
              <div class="p-3 bg-light rounded-3 border">
                <div class="d-flex align-items-center gap-2 text-success fw-bold text-xs mb-1">
                  <i class="bi bi-shield-check fs-5"></i> सुरक्षा टिप :
                </div>
                <small class="text-muted text-xs">
                  ऑनबोर्डिंग पूर्ण झाल्यावर, ॲडमिनच्या मोबाईलवर आणि ईमेलवर पासवर्ड सेट करण्याची लिंक स्वयंचलितरित्या पाठवली जाईल.
                </small>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between gap-2 mt-4 pt-3 border-top">
            <button type="button" class="btn btn-outline-secondary rounded-pill px-4 text-xs" @click="currentStep--">
              <i class="bi bi-arrow-left me-1"></i> मागे
            </button>
            <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold text-xs">
              पुढे जा (Step 3) <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- STEP 3: Subscription Plan -->
      <div v-else-if="currentStep === 3">
        <h5 class="fw-bold text-success mb-1"><i class="bi bi-credit-card me-2"></i>टप्पा ३: सबस्क्रिप्शन प्लॅन निवडा (Subscription Plan)</h5>
        <p class="text-xs text-muted mb-4">ग्रामपंचायतीसाठी योग्य SaaS सबस्क्रिप्शन प्लॅन निवडा.</p>

        <div class="row g-3 mb-4">
          <!-- Free Trial -->
          <div class="col-md-6 col-lg-3">
            <div 
              class="border rounded-4 p-3 h-100 cursor-pointer transition-all hover-shadow"
              :class="formData.subscriptionPlan === 'Free' ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-white'"
              @click="formData.subscriptionPlan = 'Free'"
            >
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-secondary text-white text-xs">Free Trial</span>
                <input type="radio" name="plan" value="Free" v-model="formData.subscriptionPlan" />
              </div>
              <h6 class="fw-bold text-dark mb-1">मोफत ट्रायअल</h6>
              <div class="fs-4 fw-bold text-success mb-2">₹ ० <small class="fs-6 text-muted font-sans">/ ३० दिवस</small></div>
              <ul class="list-unstyled text-xs text-muted d-flex flex-column gap-1 mb-0">
                <li><i class="bi bi-check2 text-success me-1"></i> १० दाखले प्रकार</li>
                <li><i class="bi bi-check2 text-success me-1"></i> ५०० नागरिक मर्यादा</li>
                <li><i class="bi bi-check2 text-success me-1"></i> ई-तक्रार मॉड्यूल</li>
              </ul>
            </div>
          </div>

          <!-- Basic -->
          <div class="col-md-6 col-lg-3">
            <div 
              class="border rounded-4 p-3 h-100 cursor-pointer transition-all hover-shadow"
              :class="formData.subscriptionPlan === 'Basic' ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-white'"
              @click="formData.subscriptionPlan = 'Basic'"
            >
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-info text-white text-xs">Starter</span>
                <input type="radio" name="plan" value="Basic" v-model="formData.subscriptionPlan" />
              </div>
              <h6 class="fw-bold text-dark mb-1">बेसिक स्टार्टर</h6>
              <div class="fs-4 fw-bold text-success mb-2">₹ ९९९ <small class="fs-6 text-muted font-sans">/ महिना</small></div>
              <ul class="list-unstyled text-xs text-muted d-flex flex-column gap-1 mb-0">
                <li><i class="bi bi-check2 text-success me-1"></i> सर्व १२ डिजिटल दाखले</li>
                <li><i class="bi bi-check2 text-success me-1"></i> ५,००० नागरिक मर्यादा</li>
                <li><i class="bi bi-check2 text-success me-1"></i> SMS व WhatsApp अलर्ट</li>
              </ul>
            </div>
          </div>

          <!-- Standard -->
          <div class="col-md-6 col-lg-3">
            <div 
              class="border rounded-4 p-3 h-100 cursor-pointer transition-all hover-shadow"
              :class="formData.subscriptionPlan === 'Standard' ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-white'"
              @click="formData.subscriptionPlan = 'Standard'"
            >
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-success text-white text-xs">Standard Green</span>
                <input type="radio" name="plan" value="Standard" v-model="formData.subscriptionPlan" />
              </div>
              <h6 class="fw-bold text-dark mb-1">स्टँडर्ड ग्रीन</h6>
              <div class="fs-4 fw-bold text-success mb-2">₹ १,९९९ <small class="fs-6 text-muted font-sans">/ महिना</small></div>
              <ul class="list-unstyled text-xs text-muted d-flex flex-column gap-1 mb-0">
                <li><i class="bi bi-check2 text-success me-1"></i> अमर्याद नागरिक व अर्ज</li>
                <li><i class="bi bi-check2 text-success me-1"></i> विकास कामे मॉनिटरिंग</li>
                <li><i class="bi bi-check2 text-success me-1"></i> निधी व अर्थसंकल्प</li>
              </ul>
            </div>
          </div>

          <!-- Premium -->
          <div class="col-md-6 col-lg-3">
            <div 
              class="border rounded-4 p-3 h-100 cursor-pointer transition-all hover-shadow"
              :class="formData.subscriptionPlan === 'Premium' ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-white'"
              @click="formData.subscriptionPlan = 'Premium'"
            >
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-warning text-dark text-xs fw-bold">Enterprise Gold</span>
                <input type="radio" name="plan" value="Premium" v-model="formData.subscriptionPlan" />
              </div>
              <h6 class="fw-bold text-dark mb-1">प्रीमियम गोल्ड</h6>
              <div class="fs-4 fw-bold text-success mb-2">₹ २,९९९ <small class="fs-6 text-muted font-sans">/ महिना</small></div>
              <ul class="list-unstyled text-xs text-muted d-flex flex-column gap-1 mb-0">
                <li><i class="bi bi-check2 text-success me-1"></i> कस्टम डोमेन व ब्रँडिंग</li>
                <li><i class="bi bi-check2 text-success me-1"></i> २४x७ प्राधान्य सपोर्ट</li>
                <li><i class="bi bi-check2 text-success me-1"></i> AI ॲनालिटिक्स अहवाल</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between gap-2 mt-4 pt-3 border-top">
          <button type="button" class="btn btn-outline-secondary rounded-pill px-4 text-xs" @click="currentStep--">
            <i class="bi bi-arrow-left me-1"></i> मागे
          </button>
          <button type="button" class="btn btn-eg-primary rounded-pill px-4 fw-bold text-xs" @click="submitOnboarding">
            <i class="bi bi-check-circle me-1"></i> ऑनबोर्डिंग सबमिट करा
          </button>
        </div>
      </div>

      <!-- STEP 4: Confirmation Success Screen -->
      <div v-else-if="currentStep === 4" class="text-center py-4">
        <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style="width: 72px; height: 72px;">
          <i class="bi bi-check-lg fs-1"></i>
        </div>
        <h4 class="fw-bold text-success mb-2">ग्रामपंचायत ऑनबोर्डिंग यशस्वी पूर्ण!</h4>
        <p class="text-muted text-xs mb-4">नवीन ग्रामपंचायत SaaS प्लॅटफॉर्मवर नोंदणीकृत झाली आहे. लॉगिन तपशील खालीलप्रमाणे आहेत:</p>

        <div class="card bg-light border-0 p-3 rounded-4 max-w-lg mx-auto mb-4 text-start text-xs">
          <div class="row g-2">
            <div class="col-6"><strong class="text-muted">ग्रामपंचायत नाव:</strong></div>
            <div class="col-6 text-end fw-bold text-success">{{ formData.nameMr }}</div>

            <div class="col-6"><strong class="text-muted">Panchayat Code:</strong></div>
            <div class="col-6 text-end font-mono fw-bold">{{ formData.code }}</div>

            <div class="col-6"><strong class="text-muted">सरपंच / Admin:</strong></div>
            <div class="col-6 text-end fw-bold">{{ formData.sarpanchName }}</div>

            <div class="col-6"><strong class="text-muted">युजरनेम:</strong></div>
            <div class="col-6 text-end font-mono">admin_{{ formData.username || 'shirala' }}</div>

            <div class="col-6"><strong class="text-muted">सबस्क्रिप्शन प्लॅन:</strong></div>
            <div class="col-6 text-end"><span class="badge bg-success">{{ formData.subscriptionPlan }} Plan</span></div>
          </div>
        </div>

        <div class="d-flex justify-content-center gap-3">
          <router-link to="/superadmin/panchayats" class="btn btn-eg-primary rounded-pill px-4 fw-bold text-xs">
            <i class="bi bi-buildings me-1"></i> ग्रामपंचायत यादीकडे जा
          </router-link>
          <button class="btn btn-outline-success rounded-pill px-4 fw-bold text-xs" @click="resetForm">
            <i class="bi bi-plus-circle me-1"></i> अजून एक GP ऑनबोर्ड करा
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const { addPanchayat } = useMockData();
const currentStep = ref(1);

const formData = ref({
  nameMr: '',
  nameEn: '',
  village: '',
  code: '',
  taluka: '',
  district: '',
  state: 'महाराष्ट्र (Maharashtra)',
  pinCode: '',
  population: 12500,
  sarpanchName: '',
  mobile: '',
  email: '',
  username: '',
  subscriptionPlan: 'Standard' as 'Free' | 'Basic' | 'Standard' | 'Premium'
});

function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
}

function submitOnboarding() {
  const planMap: Record<string, 'Starter' | 'Standard Green' | 'Enterprise Gold'> = {
    Free: 'Starter',
    Basic: 'Starter',
    Standard: 'Standard Green',
    Premium: 'Enterprise Gold'
  };

  addPanchayat({
    nameMr: formData.value.nameMr || 'शिराळा ग्रामपंचायत',
    nameEn: formData.value.nameEn || 'Shirala Gram Panchayat',
    village: formData.value.village || 'शिराळा',
    code: formData.value.code || '27250189',
    taluka: formData.value.taluka || 'शिराळा',
    district: formData.value.district || 'सांगली',
    state: formData.value.state,
    adminName: formData.value.sarpanchName || 'सौ. कविता कदम',
    mobile: formData.value.mobile || '9822112233',
    email: formData.value.email || 'sarpanch@shirala.egram.gov.in',
    activePlan: planMap[formData.value.subscriptionPlan] || 'Standard Green',
    sarpanchName: formData.value.sarpanchName || 'सौ. कविता कदम',
    contactNo: formData.value.mobile || '9822112233'
  });

  currentStep.value = 4;
}

function resetForm() {
  currentStep.value = 1;
  formData.value = {
    nameMr: '',
    nameEn: '',
    village: '',
    code: '',
    taluka: '',
    district: '',
    state: 'महाराष्ट्र (Maharashtra)',
    pinCode: '',
    population: 12500,
    sarpanchName: '',
    mobile: '',
    email: '',
    username: '',
    subscriptionPlan: 'Standard'
  };
}
</script>
