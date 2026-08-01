<template>
  <div class="py-5 bg-light min-vh-100 d-flex align-items-center">
    <div class="container" style="max-width: 520px;">
      <div class="eg-card p-4 p-md-5 shadow-lg border-0 rounded-4">
        <div class="text-center mb-4">
          <h4 class="fw-bold text-success mb-1">नवीन नागरिक नोंदणी</h4>
          <p class="text-xs text-muted font-sans">ई-ग्रामपंचायत नागरिक डिजिटल आयडी नोंदणी</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row g-3 font-sans">
            <div class="col-12">
              <label class="form-label text-xs fw-bold">पूर्ण नाव (Aadhaar नूसार) *</label>
              <input type="text" required class="form-control" placeholder="उदा. संजय बबनराव देशमुख" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">आधार क्रमांक *</label>
              <input type="text" required class="form-control" placeholder="XXXX-XXXX-XXXX" />
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">मोबाईल क्रमांक *</label>
              <input type="tel" required maxlength="10" class="form-control" placeholder="१० अंकी मोबाईल क्र." />
            </div>
            <div class="col-12">
              <label class="form-label text-xs fw-bold">वॉर्ड / गल्ली निवडा *</label>
              <select class="form-select">
                <option>वॉर्ड १ (मुख्य बसस्थानक)</option>
                <option>वॉर्ड २ (मंदिर गल्ली)</option>
                <option>वॉर्ड ३ (शाळा रोड)</option>
                <option>वॉर्ड ४ (टेकडी परिसर)</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-eg-primary w-100 rounded-pill fw-bold mt-4">
            खाते तयार करा व लॉगिन करा
          </button>
        </form>

        <div class="text-center text-xs font-sans mt-3">
          <span class="text-muted">आधीच नोंदणी केली आहे? </span>
          <router-link to="/login" class="text-success fw-bold">इथे लॉगिन करा</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const { switchRole } = useAuth();
const router = useRouter();

function handleRegister() {
  switchRole('citizen');
  router.push('/citizen/dashboard');
}
</script>
