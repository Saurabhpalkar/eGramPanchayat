<template>
  <div class="fixed-bottom bg-white border-top shadow-lg d-lg-none py-1 px-2 z-1030">
    <div class="d-flex justify-content-around align-items-center text-center">
      <router-link to="/" class="text-decoration-none text-muted py-1 flex-fill" active-class="text-success fw-bold">
        <i class="bi bi-house-door-fill fs-5 d-block"></i>
        <span class="d-block" style="font-size: 0.68rem;">मुख्य पृष्ठ</span>
      </router-link>

      <router-link to="/services" class="text-decoration-none text-muted py-1 flex-fill" active-class="text-success fw-bold">
        <i class="bi bi-grid-fill fs-5 d-block"></i>
        <span class="d-block" style="font-size: 0.68rem;">सेवा व दाखले</span>
      </router-link>

      <!-- Center Floating Action Button -->
      <router-link to="/raise-complaint" class="text-decoration-none text-white py-1" active-class="opacity-90">
        <div class="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm" style="width: 46px; height: 46px; margin-top: -18px; background: linear-gradient(135deg, #1B5E20, #43A047) !important;">
          <i class="bi bi-exclamation-triangle-fill fs-5 text-warning"></i>
        </div>
        <span class="d-block text-success fw-bold" style="font-size: 0.65rem;">तक्रार नोंदवा</span>
      </router-link>

      <router-link to="/track" class="text-decoration-none text-muted py-1 flex-fill" active-class="text-success fw-bold">
        <i class="bi bi-search fs-5 d-block"></i>
        <span class="d-block" style="font-size: 0.68rem;">अर्जाची स्थिती</span>
      </router-link>

      <button class="btn p-0 text-muted border-0 py-1 flex-fill" @click="toggleRoleDashboard">
        <i class="bi bi-speedometer2 fs-5 d-block text-success"></i>
        <span class="d-block fw-semibold text-success" style="font-size: 0.68rem;">डॅशबोर्ड</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { activeRole } = useAuth();

function toggleRoleDashboard() {
  if (activeRole.value === 'citizen') router.push('/citizen/dashboard');
  else if (activeRole.value === 'staff') router.push('/staff/dashboard');
  else if (activeRole.value === 'admin') router.push('/admin/dashboard');
  else if (activeRole.value === 'superadmin') router.push('/superadmin/dashboard');
  else router.push('/login');
}
</script>
