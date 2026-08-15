<template>
  <div class="py-5 bg-light min-vh-100 d-flex align-items-center">
    <div class="container" style="max-width: 460px;">
      <div class="eg-card p-4 p-md-5 shadow-lg border-0 rounded-4">
        <div class="text-center mb-4">
          <div
            class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow"
            style="width: 54px; height: 54px; background: linear-gradient(135deg, #1B5E20, #43A047) !important;">
            <i class="bi bi-tree-fill fs-3 text-warning"></i>
          </div>
          <h4 class="fw-bold text-success mb-1">ई-ग्रामपंचायत पोर्टल लॉगिन</h4>
          <p class="text-xs text-muted font-sans">नागरिक, कर्मचारी व सरपंच लॉगिन सुविधा</p>
        </div>

        <!-- Role Select Tabs -->
        <div class="btn-group w-100 mb-4 font-sans p-1 bg-light rounded-pill border" role="group">
          <button type="button" class="btn btn-sm rounded-pill font-sans text-xs fw-semibold"
            :class="selectedLoginRole === 'citizen' ? 'btn-success text-white' : 'btn-light text-muted'"
            @click="selectedLoginRole = 'citizen'">
            नागरिक (Citizen)
          </button>
          <button type="button" class="btn btn-sm rounded-pill font-sans text-xs fw-semibold"
            :class="selectedLoginRole === 'staff' ? 'btn-success text-white' : 'btn-light text-muted'"
            @click="selectedLoginRole = 'staff'">
            कर्मचारी / Admin
          </button>
        </div>

        <!-- Citizen OTP Login Form -->
        <form v-if="selectedLoginRole === 'citizen'" @submit.prevent="handleCitizenLogin">
          <div class="mb-3 font-sans">
            <label class="form-label text-xs fw-bold">आधार क्रमांक किंवा नोंदणीकृत मोबाईल *</label>
            <input type="text" v-model="citizenInput" class="form-control" placeholder="उदा. 9822123456" required />
          </div>

          <div v-if="otpSent" class="mb-3 font-sans">
            <label class="form-label text-xs fw-bold">मोबाईलवर प्राप्त OTP (४ अंकी) *</label>
            <input type="text" v-model="otpInput" maxlength="4" class="form-control text-center fs-5 tracking-widest"
              placeholder="1 2 3 4" required />
            <span class="text-xs text-success d-block mt-1"><i class="bi bi-check-circle me-1"></i> OTP पाठवला आहे
              (Simulated: 1234)</span>
          </div>

          <button v-if="!otpSent" type="button" class="btn btn-eg-primary w-100 rounded-pill fw-bold"
            @click="handleSendOtp">
            OTP पाठवा (Send OTP)
          </button>

          <button v-else type="submit" class="btn btn-eg-primary w-100 rounded-pill fw-bold">
            लॉगिन पूर्ण करा (Verify & Login)
          </button>
        </form>

        <!-- Staff / Admin Password Login -->
        <form v-else @submit.prevent="handleStaffLogin">
          <div class="mb-3 font-sans">
            <label class="form-label text-xs fw-bold">युझर आयडी / ईमेल *</label>
            <input type="email" v-model="staffEmail" class="form-control" placeholder="sarpanch.shivane@egram.gov.in"
              required />
          </div>
          <div class="mb-3 font-sans">
            <label class="form-label text-xs fw-bold">पासवर्ड *</label>
            <input type="password" v-model="staffPass" class="form-control" value="password" required />
          </div>
          <button type="submit" class="btn btn-eg-primary w-100 rounded-pill fw-bold">
            डॅशबोर्डमध्ये प्रवेश करा
          </button>
          <div class="mb-3 font-sans">
          </div>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

        <hr class="my-4" />

        <div class="text-center text-xs font-sans">
          <span class="text-muted">नवीन नागरिक आहात? </span>
          <router-link to="/register" class="text-success fw-bold">इथे नोंदणी करा</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, sendOtp, verifyOtp } from '../../services/authService';

const router = useRouter();
const selectedLoginRole = ref<'citizen' | 'staff'>('citizen');

// Citizen OTP login
const citizenInput = ref('');
const otpSent = ref(false);
const otpInput = ref('');

// Staff/Admin login
const staffEmail = ref('');
const staffPass = ref('');

const loading = ref(false);
const error = ref('');

async function handleCitizenLogin() {
  error.value = '';
  if (!citizenInput.value) {
    error.value = 'कृपया आधार क्रमांक किंवा मोबाईल नंबर प्रविष्ट करा.';
    return;
  }
  if (!otpInput.value) {
    error.value = 'कृपया OTP प्रविष्ट करा.';
    return;
  }
  try {
    loading.value = true;
    const data = await verifyOtp({
      mobile_or_aadhaar: citizenInput.value,
      otp: otpInput.value
    });
    console.log('OTP verified successfully:', data);
    const auth = data.data;

    localStorage.setItem('token', auth.token);
    localStorage.setItem('roles', JSON.stringify(auth.roles));
    localStorage.setItem('user', JSON.stringify(auth.user));
    router.push('/citizen/dashboard');
  } catch (err: any) {
    error.value =
      err.response?.data?.message || 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.';
  } finally {
    loading.value = false;
  }

  // if(otpInput.lenght){}
  // Citizen OTP login (temporary mock)
  // if (otpInput.value === '1234') {
  //   alert('OTP verified! Redirecting to citizen dashboard...');
  //   router.push('/citizen/dashboard');
  // } else {
  //   error.value = 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.';
  // } 
}
async function handleSendOtp() {
  error.value = '';
  if (!citizenInput.value) {
    error.value = 'कृपया आधार क्रमांक किंवा मोबाईल नंबर प्रविष्ट करा.';
    return;
  }
  loading.value = true;
  try {
    const data = await sendOtp({
      mobile_or_aadhaar: citizenInput.value,
    })
    // alert(`OTP पाठवला आहे (Simulated): 1234`); // Simulate sending OTP
    otpSent.value = true;
    alert(`OTP पाठवला आहे (Simulated): ${data.data.otp}`); // Simulate sending OTP
    console.log('OTP sent successfully:', `${data.data.otp}`);
  } catch (err: any) {
    // console.error('Login error:', err.response?.data);
    error.value =
      err.response?.data?.message || 'Login failed.';
  } finally {
    loading.value = false;
  }
  // Simulate sending OTP
}


async function handleStaffLogin() {
  loading.value = true;
  error.value = '';
  // console.log('Attempting staff login with:', staffEmail.value, staffPass.value);
  try {
    const data = await login({
      email: staffEmail.value,
      password: staffPass.value,
    });
    // console.log('Login successful, response data:', data);
    const role = data.roles[0];
    //  console.log('Logged in user role:', role);
    switch (role) {
      case 'super_admin':
        router.push('/superadmin/dashboard');
        break;

      case 'admin':
        router.push('/admin/dashboard');
        break;

      case 'staff':
        router.push('/staff/dashboard');
        break;

      default:
        router.push('/citizen/dashboard');
    }
  } catch (err: any) {
    // console.error('Login error:', err.response?.data);
    error.value =
      err.response?.data?.message || 'Login failed.';
  } finally {
    loading.value = false;
  }
}
</script>
