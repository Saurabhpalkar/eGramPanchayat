<template>
  <div>
    <DashboardHeader title="माझी वैयक्तिक माहिती (Citizen Profile)" subtitle="माझी नागरिक ओळखपत्रे, वॉर्ड तपशील व डिजिटल दस्तऐवज" />

    <div class="row g-3 my-3 font-sans">
      <!-- Left Profile Column -->
      <div class="col-lg-4">
        <div class="eg-card p-4 text-center border">
          <div class="position-relative d-inline-block mb-3">
            <img :src="user.avatar" class="rounded-circle border border-3 border-success shadow-sm" width="90" height="90" alt="Profile" />
            <span class="position-absolute bottom-0 end-0 bg-success text-white p-1 rounded-circle border border-2 border-white">
              <i class="bi bi-shield-check fs-6"></i>
            </span>
          </div>

          <h5 class="fw-bold text-dark mb-1" style="font-family: var(--font-marathi);">{{ user.name }}</h5>
          <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-3">
            ई-ग्राम नोंदणीकृत नागरिक
          </span>

          <div class="bg-light p-3 rounded-3 border text-start text-xs d-flex flex-column gap-2">
            <div class="d-flex justify-content-between">
              <span class="text-muted">आधार क्रमांक:</span>
              <strong class="text-dark">{{ user.citizenAadhaar }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">ग्रामपंचायत:</span>
              <strong class="text-success">{{ user.panchayatName }}</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">वार्ड क्रमांक:</span>
              <strong class="text-dark">वार्ड क्र. ३</strong>
            </div>
            <div class="d-flex justify-content-between">
              <span class="text-muted">रेशन कार्ड क्र:</span>
              <strong class="text-dark">MH-18-MH-9812</strong>
            </div>
          </div>
        </div>

        <!-- Digital Locker / Saved Docs Card -->
        <div class="eg-card p-4 mt-3 border">
          <h6 class="fw-bold text-success mb-3"><i class="bi bi-folder-check me-2"></i>माझे डिजिटल लॉकर (Saved Documents)</h6>
          <div class="list-group list-group-flush text-xs">
            <div class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
              <span><i class="bi bi-card-image text-primary me-2"></i>आधार कार्ड (Aadhaar)</span>
              <span class="badge bg-success">पडताळलेले</span>
            </div>
            <div class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
              <span><i class="bi bi-house-door text-warning me-2"></i>रेशन कार्ड (Ration Card)</span>
              <span class="badge bg-success">पडताळलेले</span>
            </div>
            <div class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
              <span><i class="bi bi-receipt text-danger me-2"></i>८-अ मालमत्ता उतारा</span>
              <span class="badge bg-secondary">अपलोड करा</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Edit Form Column -->
      <div class="col-lg-8">
        <div class="eg-card p-4 border">
          <h5 class="fw-bold text-success mb-3" style="font-family: var(--font-marathi);">
            <i class="bi bi-person-gear me-2"></i>माहिती अद्ययावत करा (Edit Profile)
          </h5>

          <form @submit.prevent="saveProfile">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold text-dark">पूर्ण नाव (मराठी)</label>
                <input type="text" v-model="profileForm.name" class="form-control text-xs" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold text-dark">मोबाईल क्रमांक</label>
                <input type="tel" v-model="profileForm.mobile" class="form-control text-xs" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold text-dark">ईमेल पत्ता</label>
                <input type="email" v-model="profileForm.email" class="form-control text-xs" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-xs fw-bold text-dark">वार्ड / गल्ली</label>
                <input type="text" v-model="profileForm.ward" class="form-control text-xs" />
              </div>
              <div class="col-12">
                <label class="form-label text-xs fw-bold text-dark">पूर्ण रहवासी पत्ता</label>
                <textarea v-model="profileForm.address" class="form-control text-xs" rows="2"></textarea>
              </div>
            </div>

            <!-- Family Members Section -->
            <hr class="my-4" />
            <h6 class="fw-bold text-dark mb-3"><i class="bi bi-people me-2"></i>कुटुंबातील सदस्य (Family Members)</h6>
            <div class="bg-light p-3 rounded border text-xs mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <div><strong>१. सौ. सुनीता रामचंद्र पाटील</strong> (पत्नी)</div>
                <span class="text-muted">आधार: XXXX-XXXX-4521</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div><strong>२. चि. विकास रामचंद्र पाटील</strong> (मुलग)</div>
                <span class="text-muted">आधार: XXXX-XXXX-9821</span>
              </div>
            </div>

            <div v-if="saveSuccess" class="alert alert-success py-2 text-xs mb-3">
              <i class="bi bi-check-circle me-1"></i> तुमची माहिती यशस्वीरीत्या अद्ययावत झाली आहे!
            </div>

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-success btn-sm rounded-pill px-4 fw-bold">
                <i class="bi bi-save me-1"></i> बदल जतन करा (Save Profile)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '../../composables/useAuth';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const { user } = useAuth();

const saveSuccess = ref(false);

const profileForm = reactive({
  name: user.value.name || 'रामचंद्र मारुती पाटील',
  mobile: user.value.mobile || '9822334455',
  email: 'citizen@panchayat.gov.in',
  ward: 'वार्ड क्र. ३, मंदिर गल्ली',
  address: 'घर क्र. १५४, शिवारे ग्रामपंचायत हद्द'
});

function saveProfile() {
  saveSuccess.value = true;
  setTimeout(() => {
    saveSuccess.value = false;
  }, 2000);
}
</script>
