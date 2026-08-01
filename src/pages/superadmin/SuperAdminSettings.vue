<template>
  <div class="font-sans">
    <DashboardHeader 
      title="System Settings & Languages (सिस्टम सेटिंग्ज व भाषा नियंत्रण)" 
      subtitle="Super Admin Configuration — Global SaaS Gateway Integrations, Multi-Language Dictionary & Platform Backups" 
    />

    <!-- Settings Navigation Tabs -->
    <div class="eg-card p-3 my-3">
      <ul class="nav nav-pills gap-2 text-xs font-sans">
        <li class="nav-item">
          <button 
            class="nav-link rounded-pill fw-bold px-3.5 py-2"
            :class="activeTab === 'general' ? 'active bg-success text-white' : 'text-dark hover-bg-gray'"
            @click="activeTab = 'general'"
          >
            <i class="bi bi-sliders me-1.5"></i> सामान्य सेटिंग्ज (General)
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link rounded-pill fw-bold px-3.5 py-2"
            :class="activeTab === 'language' ? 'active bg-success text-white' : 'text-dark hover-bg-gray'"
            @click="activeTab = 'language'"
          >
            <i class="bi bi-translate me-1.5"></i> भाषा व्यवस्थापन (Multi-Language)
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link rounded-pill fw-bold px-3.5 py-2"
            :class="activeTab === 'gateways' ? 'active bg-success text-white' : 'text-dark hover-bg-gray'"
            @click="activeTab = 'gateways'"
          >
            <i class="bi bi-credit-card me-1.5"></i> गेटवे व API कॉन्फिगरेशन (Gateways)
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link rounded-pill fw-bold px-3.5 py-2"
            :class="activeTab === 'backups' ? 'active bg-success text-white' : 'text-dark hover-bg-gray'"
            @click="activeTab = 'backups'"
          >
            <i class="bi bi-cloud-arrow-up me-1.5"></i> बॅकअप व सुरक्षा (Backups)
          </button>
        </li>
      </ul>
    </div>

    <!-- TAB 1: General Settings -->
    <div v-if="activeTab === 'general'" class="eg-card p-4 my-3 max-w-4xl">
      <h6 class="fw-bold text-success mb-3"><i class="bi bi-sliders me-2"></i> प्लॅटफॉर्म ब्रँडिंग व ग्लोबल सेटिंग्ज</h6>

      <form @submit.prevent="saveSettings">
        <div class="row g-3 text-xs">
          <div class="col-md-6">
            <label class="form-label fw-bold">SaaS Platform Name *</label>
            <input type="text" v-model="settings.platformName" class="form-control text-xs" required />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Support Helpline Number *</label>
            <input type="text" v-model="settings.supportPhone" class="form-control text-xs font-mono" required />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Support Official Email *</label>
            <input type="email" v-model="settings.supportEmail" class="form-control text-xs" required />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Default Currency *</label>
            <select v-model="settings.currency" class="form-select text-xs" required>
              <option value="INR">भारतीय रुपया (INR - ₹)</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label fw-bold">फूटलाईन्स व ब्रँडिंग मजकूर (Footer Text)</label>
            <textarea v-model="settings.footerText" class="form-control text-xs" rows="2"></textarea>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top text-end">
          <button type="submit" class="btn btn-eg-primary rounded-pill px-4 font-sans fw-bold text-xs">
            <i class="bi bi-check-circle me-1"></i> सेटिंग्ज सेव्ह करा
          </button>
        </div>
      </form>
    </div>

    <!-- TAB 2: Multi-Language Management -->
    <div v-else-if="activeTab === 'language'" class="eg-card p-4 my-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="fw-bold text-success mb-1"><i class="bi bi-translate me-2"></i> भाषा नियंत्रण व शब्दकोश (Language Dictionary)</h6>
          <p class="text-xs text-muted mb-0">मराठी, इंग्रजी व हिंदी भाषेत प्लॅटफॉर्म भाषांतरे व्यवस्थापित करा.</p>
        </div>
        <button class="btn btn-outline-success btn-sm rounded-pill font-sans fw-bold px-3" @click="saveLanguageDict">
          <i class="bi bi-save me-1"></i> भाषांतर शब्दकोश सेव्ह करा
        </button>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>Key (सिस्टम कोड)</th>
            <th>मराठी (Marathi - Default)</th>
            <th>English (इंग्रजी)</th>
            <th>हिंदी (Hindi)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="item in languageKeys" :key="item.key">
            <td><strong class="font-mono text-xs text-muted">{{ item.key }}</strong></td>
            <td><input type="text" v-model="item.mr" class="form-control form-control-sm text-xs" /></td>
            <td><input type="text" v-model="item.en" class="form-control form-control-sm text-xs" /></td>
            <td><input type="text" v-model="item.hi" class="form-control form-control-sm text-xs" /></td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- TAB 3: API & Gateway Integration Credentials -->
    <div v-else-if="activeTab === 'gateways'" class="eg-card p-4 my-3 max-w-4xl">
      <h6 class="fw-bold text-success mb-3"><i class="bi bi-plug-fill me-2"></i> पेमेंट, SMS व व्हॉट्सॲप एपीआय क्रिडेन्शियल्स (APIs)</h6>

      <form @submit.prevent="saveGateways">
        <div class="row g-3 text-xs">
          <!-- Razorpay -->
          <div class="col-12 p-3 bg-light rounded-3 border">
            <h6 class="fw-bold text-dark mb-2"><i class="bi bi-credit-card text-success me-1"></i> Razorpay Payment Gateway</h6>
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label fw-bold">Razorpay Key ID</label>

                <input type="text" v-model="gateways.razorpayKey" class="form-control text-xs font-mono" placeholder="rzp_live_xxxxxxxx" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Razorpay Key Secret</label>

                <input type="password" v-model="gateways.razorpaySecret" class="form-control text-xs font-mono" placeholder="••••••••••••••••" />
              </div>
            </div>
          </div>

          <!-- WhatsApp Business API -->
          <div class="col-12 p-3 bg-light rounded-3 border">
            <h6 class="fw-bold text-dark mb-2"><i class="bi bi-whatsapp text-success me-1"></i> WhatsApp Business Cloud API</h6>
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label fw-bold">Phone Number ID</label>

                <input type="text" v-model="gateways.waPhoneId" class="form-control text-xs font-mono" placeholder="1029384756" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Permanent Access Token</label>

                <input type="password" v-model="gateways.waToken" class="form-control text-xs font-mono" placeholder="••••••••••••••••" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-top text-end">
          <button type="submit" class="btn btn-eg-primary rounded-pill px-4 font-sans fw-bold text-xs">
            <i class="bi bi-check-circle me-1"></i> एपीआय क्रिडेन्शियल्स सेव्ह करा
          </button>
        </div>
      </form>
    </div>

    <!-- TAB 4: Backups & System Security -->
    <div v-else-if="activeTab === 'backups'" class="eg-card p-4 my-3 max-w-4xl">
      <h6 class="fw-bold text-success mb-3"><i class="bi bi-cloud-check-fill me-2"></i> क्लाउड बॅकअप व सिस्टिम ऑडिट लॉग्स</h6>

      <div class="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <strong class="text-success text-xs">शेवटचा ऑटोमॅटिक बॅकअप:</strong>
          <span class="text-xs text-dark ms-2 d-block d-md-inline">आज, सकाळी ०४:०० वाजता (AWS S3 Encrypted Vault)</span>
        </div>
        <button class="btn btn-success btn-sm rounded-pill text-xs fw-bold px-3" @click="triggerBackup">
          <i class="bi bi-cloud-arrow-up-fill me-1"></i> त्वरित बॅकअप घ्या
        </button>
      </div>

      <h6 class="fw-bold text-dark text-xs mb-2">अलीकडील सुपर ॲडमिन ॲक्टिव्हिटी लॉग (Security Audit Log):</h6>
      <div class="list-group list-group-flush border rounded-3 text-xs">
        <div class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong class="text-success">[Super Admin]</strong> नवीन ग्रामपंचायत 'शिराळा ग्रामपंचायत' ऑनबोर्ड केली.
          </div>
          <small class="text-muted font-mono">आज, 09:42 AM</small>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong class="text-success">[Super Admin]</strong> 'शिवणे ग्रामपंचायत' ची सबस्क्रिप्शन मुदत नूतनीकरण केली.
          </div>
          <small class="text-muted font-mono">काल, 04:15 PM</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const activeTab = ref<'general' | 'language' | 'gateways' | 'backups'>('general');

const settings = ref({
  platformName: 'eGram Panchayat Multi-Tenant SaaS Platform',
  supportPhone: '+91 1800-233-4567',
  supportEmail: 'support@egrampanchayat.gov.in',
  currency: 'INR',
  footerText: '© २०२६ eGram Panchayat SaaS Platform. सर्वाधिकार सुरक्षित.'
});

const languageKeys = ref([
  { key: 'app_title', mr: 'तुमची ग्रामपंचायत आता डिजिटल', en: 'Your Gram Panchayat is Now Digital', hi: 'आपकी ग्राम पंचायत अब डिजिटल' },
  { key: 'nav_dashboard', mr: 'डॅशबोर्ड', en: 'Dashboard', hi: 'डैशबोर्ड' },
  { key: 'btn_apply_certificate', mr: 'दाखल्यासाठी अर्ज करा', en: 'Apply for Certificate', hi: 'प्रमाणपत्र के लिए आवेदन करें' },
  { key: 'btn_pay_tax', mr: 'कर भरणा करा', en: 'Pay Taxes', hi: 'कर का भुगतान करें' },
  { key: 'label_complaints', mr: 'ई-तक्रार निवारण', en: 'E-Grievance Redressal', hi: 'ई-शिकायत निवारण' },
]);

const gateways = ref({
  razorpayKey: 'rzp_live_99218274102',
  razorpaySecret: '',
  waPhoneId: '1092837465',
  waToken: ''
});

function saveSettings() {
  alert('ग्लोबल सिस्टिम सेटिंग्ज सेव्ह झाल्या आहेत.');
}

function saveLanguageDict() {
  alert('भाषांतर शब्दकोश डेटाबेसमध्ये अपडेट झाला.');
}

function saveGateways() {
  alert('पेमेंट व व्हॉट्सॲप गेटवे API Keys सुरक्षितरित्या एनक्रिप्ट करून सेव्ह केल्या.');
}

function triggerBackup() {
  alert('पूर्ण सिस्टिम डेटाबेस व मीडिया फाईल्सचा एन्क्रिप्टेड बॅकअप यशस्वीरीत्या घेतला गेला.');
}
</script>
