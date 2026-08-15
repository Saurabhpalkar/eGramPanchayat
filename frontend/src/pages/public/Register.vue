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
              <input type="text" class="form-control" placeholder="तुमचे पूर्ण नाव" v-model="form.name" />
              <small v-if="errors.name" class="text-danger">
                {{ errors.name }}
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">आधार क्रमांक *</label>
              <input type="text" class="form-control" placeholder="XXXX-XXXX-XXXX" v-model="form.aadhaar_number" />
              <small v-if="errors.aadhaar_number" class="text-danger">
                {{ errors.aadhaar_number }}
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">मोबाईल क्रमांक *</label>
              <input type="tel" maxlength="10" class="form-control" placeholder="१० अंकी मोबाईल क्र."
                v-model="form.mobile" />
              <small v-if="errors.mobile" class="text-danger">
                {{ errors.mobile }}
              </small>
            </div>
            <div class="col-md-12">
              <label class="form-label text-xs fw-bold">ईमेल (ऐच्छिक)</label>
              <input type="email" class="form-control" placeholder="उदा. john.doe@example.com" v-model="form.email" />
              <small v-if="errors.email" class="text-danger">
                {{ errors.email }}
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">पासवर्ड *</label>
              <input type="password" class="form-control" placeholder="पासवर्ड" v-model="form.password" />
              <small v-if="errors.password" class="text-danger">
                {{ errors.password }}
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">पासवर्ड पुष्टीकरण *</label>
              <input type="password" class="form-control" placeholder="पासवर्ड पुन्हा टाका"
                v-model="form.password_confirmation" />
              <small v-if="errors.password_confirmation" class="text-danger">
                {{ errors.password_confirmation }}
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">जन्मतारीख *</label>
              <input type="date" class="form-control" v-model="form.dob" />
              <small v-if="errors.dob" class="text-danger">
                {{ errors.dob }}
              </small>
            </div>
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">लिंग *</label>
              <select class="form-select" v-model="form.gender">
                <option value="">लिंग निवडा</option>
                <option value="male">पुरुष</option>
                <option value="female">स्त्री</option>
                <option value="other">इतर</option>
              </select>
              <small v-if="errors.gender" class="text-danger">
                {{ errors.gender }}
              </small>
            </div>
            <div class="col-12">
              <label class="form-label text-xs fw-bold">वॉर्ड / गल्ली निवडा *</label>
              <select class="form-select" v-model="form.ward_id">
                <option value="">वॉर्ड निवडा</option>
                <option value="1">वॉर्ड १ (मुख्य बसस्थानक)</option>
                <option value="2">वॉर्ड २ (मंदिर गल्ली)</option>
                <option value="3">वॉर्ड ३ (शाळा रोड)</option>
                <option value="4">वॉर्ड ४ (टेकडी परिसर)</option>
              </select>
              <small v-if="errors.ward_id" class="text-danger">
                {{ errors.ward_id }}
              </small>
            </div>
          </div>

          <button type="submit" class="btn btn-eg-primary w-100 rounded-pill fw-bold mt-4" :disabled="!isFormValid">
            खाते तयार करा व लॉगिन करा
          </button>
        </form>

        <div class="text-center text-xs font-sans mt-3">
          <span class="text-muted">आधीच नोंदणी केली आहे? </span>
          <router-link to="/login" class="text-success fw-bold">इथे लॉगिन करा</router-link>
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive, computed, ref } from 'vue';
import { register } from '../../services/authService';
// import { useAuth } from '../../composables/useAuth';
import { Axios } from 'axios';
const form = reactive({
  name: '',
  mobile: '',
  aadhaar_number: '',
  ward_id: '',
  email: '',
  password: '',
  password_confirmation: '',
  gender: '',
  dob: '',
});

const errors = reactive({
  name: '',
  mobile: '',
  aadhaar_number: '',
  ward_id: '',
  email: '',
  password: '',
  password_confirmation: '',
  gender: '',
  dob: '',
});
const isFormValid = computed(() => {
  return (
    form.name.trim().length >= 3
    &&
    /^\d{10}$/.test(form.mobile) &&
    /^\d{12}$/.test(form.aadhaar_number) &&
    form.ward_id !== '' &&
    form.password.length >= 6 &&
    form.password === form.password_confirmation
  );
});
// const { switchRole } = useAuth();
const router = useRouter();
const successMessage = ref('');

async function handleRegister() {
  errors.name = '';
  errors.mobile = '';
  errors.aadhaar_number = '';
  errors.ward_id = '';
  errors.email = '';
  errors.password = '';
  errors.password_confirmation = '';
  errors.gender = '';
  errors.dob = '';

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = '';
  });

  let isValid = true;

  // Name validation
  if (form.name.trim().length < 3) {
    errors.name = 'पूर्ण नाव किमान 3 अक्षरे असावे';
    isValid = false;
  }

  // Mobile validation
  if (!/^\d{10}$/.test(form.mobile)) {
    errors.mobile = 'मोबाईल क्रमांक 10 अंकी असावा';
    isValid = false;
  }

  // Aadhaar validation
  if (!/^\d{12}$/.test(form.aadhaar_number)) {
    errors.aadhaar_number = 'आधार क्रमांक 12 अंकी असावा';
    isValid = false;
  }

  // Ward validation
  if (!form.ward_id) {
    errors.ward_id = 'वॉर्ड निवडणे आवश्यक आहे';
    isValid = false;
  }

  // Password validation
  if (form.password.length < 6) {
    errors.password = 'पासवर्ड किमान 6 अक्षरे असावा';
    isValid = false;
  }

  // Confirm password
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'पासवर्ड जुळत नाही';
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    const response = await register(form);

    successMessage.value = response.message;

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;

      // console.log(validationErrors);

      errors.name = validationErrors.name?.[0] || '';
      errors.email = validationErrors.email?.[0] || '';
      errors.mobile = validationErrors.mobile?.[0] || '';
      errors.aadhaar_number = validationErrors.aadhaar_number?.[0] || '';
      errors.password = validationErrors.password?.[0] || '';
    } else {
      console.error(error);
    }
  }
  // switchRole('citizen');
  // router.push('/citizen/dashboard');
}
</script>
