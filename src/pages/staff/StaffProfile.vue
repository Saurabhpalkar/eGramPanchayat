<template>
  <div>
    <DashboardHeader 
      title="कर्मचारी प्रोफाईल व सेटींग्ज (Staff Profile)" 
      subtitle="वैयक्तिक माहिती, ऑन-ड्यूटी स्थिती, वॉर्ड असाईनमेंट व सुरक्षा सेटींग्ज" 
    />

    <div class="row g-3 my-3 font-sans">
      <!-- Profile Summary Card -->
      <div class="col-lg-4">
        <div class="eg-card p-4 text-center h-100">
          <div class="position-relative d-inline-block mb-3">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" class="rounded-circle border border-3 border-success shadow" width="100" height="100" alt="Avatar" />
            <span class="position-absolute bottom-0 end-0 p-2 bg-success border border-light rounded-circle" title="On Duty Active"></span>
          </div>
          <h5 class="fw-bold text-success mb-1">अमित मारुती मोरे</h5>
          <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-2">वरिष्ठ लिपिक (Senior Clerk)</span>
          <p class="text-xs text-muted mb-3">कर्मचारी आयडी: <strong>STF-SHV-2026-902</strong></p>

          <!-- Duty Status Toggle -->
          <div class="p-3 bg-light rounded-3 border mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-xs fw-bold text-dark">ड्यूटी स्टेटस (Duty Status):</span>
              <div class="form-check form-switch mb-0">
                <input class="form-check-input" type="checkbox" v-model="isOnDuty" role="switch" id="dutySwitch" />
                <label class="form-check-label text-xs fw-bold" :class="isOnDuty ? 'text-success' : 'text-danger'" for="dutySwitch">
                  {{ isOnDuty ? 'ड्यूटीवर कार्यरत (On Duty)' : 'फील्ड सर्व्हेवर (Field Survey)' }}
                </label>
              </div>
            </div>
          </div>

          <div class="text-xs text-muted border-top pt-3">
            <div class="d-flex justify-content-between mb-1">
              <span>ग्रामपंचायत:</span>
              <strong class="text-dark">शिवणे ग्रामपंचायत</strong>
            </div>
            <div class="d-flex justify-content-between mb-1">
              <span>असाईन वॉर्ड:</span>
              <strong class="text-dark">वॉर्ड क्र. ३ व ४</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span>नियुक्ती तारीख:</span>
              <strong class="text-dark">१२ मार्च २०२१</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Details & Security Form -->
      <div class="col-lg-8">
        <div class="eg-card p-4 h-100">
          <h6 class="fw-bold text-success border-bottom pb-2 mb-3">
            <i class="bi bi-person-gear me-2"></i>माहिती व सुरक्षा सेटींग्ज (Profile Settings)
          </h6>

          <form @submit.prevent="saveProfile">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold">संपूर्ण नाव *</label>
                <input type="text" v-model="profile.name" class="form-control text-xs" required />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold">मोबाईल क्रमांक *</label>
                <input type="text" v-model="profile.phone" class="form-control text-xs" required />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold">ई-मेल पत्ता *</label>
                <input type="email" v-model="profile.email" class="form-control text-xs" required />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold">पद / हुद्दा (Designation) *</label>
                <input type="text" v-model="profile.designation" class="form-control text-xs" required readonly />
              </div>
            </div>

            <h6 class="fw-bold text-success border-bottom pb-2 mb-3 mt-4">
              <i class="bi bi-shield-lock me-2"></i>पासवर्ड व सुरक्षा (Security & Password)
            </h6>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold">सध्याचा पासवर्ड</label>
                <input type="password" v-model="passwords.current" class="form-control text-xs" placeholder="••••••••" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold">नवीन पासवर्ड</label>
                <input type="password" v-model="passwords.new" class="form-control text-xs" placeholder="••••••••" />
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="submit" class="btn btn-eg-primary rounded-pill px-4 text-xs fw-bold">
                <i class="bi bi-check-lg me-1"></i> बदला सेव्ह करा (Save Profile)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const isOnDuty = ref(true);

const profile = ref({
  name: 'अमित मारुती मोरे',
  phone: '9822001122',
  email: 'amit.more@egram.gov.in',
  designation: 'वरिष्ठ लिपिक (Senior Clerk)'
});

const passwords = ref({
  current: '',
  new: ''
});

function saveProfile() {
  alert('प्रोफाईल माहिती व सेटींग्ज यशस्वीरित्या अपडेट करण्यात आली.');
}
</script>
