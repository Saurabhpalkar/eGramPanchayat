<template>
  <div>
    <DashboardHeader title="माझे ऑनलाईन अर्ज (My Applications)" subtitle="दाखल्यांची सद्यस्थिती, टाइमलाईन व ऑनलाईन डाऊनलोड" />

    <!-- Top Action Banner -->
    <div class="eg-card p-3 my-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div class="btn-group font-sans">
        <button 
          class="btn btn-sm" 
          :class="activeFilter === 'ALL' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeFilter = 'ALL'"
        >
          सर्व अर्ज ({{ myApps.length }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeFilter === 'Pending' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeFilter = 'Pending'"
        >
          प्रक्रियेत ({{ pendingCount }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeFilter === 'Generated' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeFilter = 'Generated'"
        >
          मंजूर / दाखला तयार ({{ generatedCount }})
        </button>
      </div>

      <div class="d-flex align-items-center gap-2">
        <div class="input-group input-group-sm" style="max-width: 220px;">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="अर्ज क्र. शोधा..." />
        </div>
        <router-link to="/citizen/apply" class="btn btn-eg-primary btn-sm rounded-pill font-sans fw-bold px-3">
          <i class="bi bi-plus-lg me-1"></i> नवीन अर्ज
        </router-link>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="eg-card p-4 mb-4">
      <ResponsiveTable>
        <template #head>
          <tr>
            <th>अर्ज क्रमांक</th>
            <th>दाखला / सेवेचे नाव</th>
            <th>दाखल तारीख</th>
            <th>मुदत तारीख</th>
            <th>शुल्क</th>
            <th>सद्यस्थिती</th>
            <th>ॲक्शन</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="app in filteredApps" :key="app.id">
            <td><strong class="text-dark">{{ app.applicationNo }}</strong></td>
            <td>{{ app.serviceNameMr }}</td>
            <td>{{ app.appliedDate }}</td>
            <td><span class="text-warning font-sans text-xs fw-bold">{{ app.dueDate }}</span></td>
            <td>₹{{ app.amount || 30 }}</td>
            <td><StatusBadge :status="app.status" :text="app.statusMr" /></td>
            <td>
              <div class="d-flex gap-1">
                <button class="btn btn-sm btn-outline-success rounded-pill text-xs font-sans px-2.5 py-1" @click="viewDetails(app)">
                  <i class="bi bi-eye me-1"></i> तपशील
                </button>
                <button 
                  v-if="app.status === 'Certificate Generated'" 
                  class="btn btn-sm btn-eg-gold rounded-pill text-xs font-sans px-2.5 py-1"
                  @click="downloadCertificate(app)"
                >
                  <i class="bi bi-download me-1"></i> दाखला PDF
                </button>
              </div>
            </td>
          </tr>
        </template>
      </ResponsiveTable>

      <div v-if="filteredApps.length === 0" class="p-4 text-center text-muted font-sans">
        <i class="bi bi-journal-x fs-1 d-block mb-2 text-secondary"></i>
        <h6>कोणतेही अर्ज सापडले नाहीत.</h6>
      </div>
    </div>

    <!-- Application Details & Timeline Modal -->
    <div v-if="selectedApp" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-journal-check me-2"></i>अर्जाचा तपशील व टाइमलाईन
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedApp = null"></button>
          </div>
          <div class="modal-body p-4 font-sans">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="bg-light p-3 rounded border text-xs d-flex flex-column gap-1">
                  <div><strong>अर्ज क्रमांक:</strong> {{ selectedApp.applicationNo }}</div>
                  <div><strong>सेवा:</strong> {{ selectedApp.serviceNameMr }}</div>
                  <div><strong>अर्जादार:</strong> {{ selectedApp.citizenName }}</div>
                  <div><strong>आधार:</strong> {{ selectedApp.citizenAadhaar }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="bg-light p-3 rounded border text-xs d-flex flex-column gap-1">
                  <div><strong>दाखल तारीख:</strong> {{ selectedApp.appliedDate }}</div>
                  <div><strong>अंतिम मुदत:</strong> {{ selectedApp.dueDate }}</div>
                  <div><strong>पेमेंट:</strong> <span class="badge bg-success">₹{{ selectedApp.amount }} ऑनलाईन प्राप्त</span></div>
                  <div><strong>स्थिती:</strong> <StatusBadge :status="selectedApp.status" :text="selectedApp.statusMr" /></div>
                </div>
              </div>
            </div>

            <!-- Workflow Progress Tracker -->
            <h6 class="fw-bold text-success mb-3">प्रक्रिया टाइमलाईन (Workflow Stages)</h6>
            <div class="position-relative ps-4 border-start border-2 border-success d-flex flex-column gap-3 ms-2 mb-4">
              <div class="position-relative">
                <div class="position-absolute top-0 start-0 translate-middle bg-success text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style="width:20px; height:20px;">
                  <i class="bi bi-check text-white" style="font-size: 0.7rem;"></i>
                </div>
                <strong class="text-xs text-dark d-block">१. ऑनलाईन अर्ज प्राप्त झाला</strong>
                <small class="text-muted d-block">{{ selectedApp.appliedDate }} - यशस्वीरीत्या दाखल</small>
              </div>

              <div class="position-relative">
                <div 
                  class="position-absolute top-0 start-0 translate-middle rounded-circle p-1 d-flex align-items-center justify-content-center"
                  :class="selectedApp.status !== 'Pending Verification' ? 'bg-success text-white' : 'bg-warning text-dark'"
                  style="width:20px; height:20px;"
                >
                  <i class="bi" :class="selectedApp.status !== 'Pending Verification' ? 'bi-check' : 'bi-clock'" style="font-size: 0.7rem;"></i>
                </div>
                <strong class="text-xs text-dark d-block">२. कागदपत्र पडताळणी (ग्रामसेवक / क्लर्क)</strong>
                <small class="text-muted d-block">
                  {{ selectedApp.verificationStaff ? selectedApp.verificationStaff + ' द्वारे तपासणी पूर्ण' : 'कागदपत्रे प्रक्रियेत आहेत' }}
                </small>
              </div>

              <div class="position-relative">
                <div 
                  class="position-absolute top-0 start-0 translate-middle rounded-circle p-1 d-flex align-items-center justify-content-center"
                  :class="selectedApp.status === 'Certificate Generated' ? 'bg-success text-white' : 'bg-secondary text-white'"
                  style="width:20px; height:20px;"
                >
                  <i class="bi" :class="selectedApp.status === 'Certificate Generated' ? 'bi-check' : 'bi-dash'" style="font-size: 0.7rem;"></i>
                </div>
                <strong class="text-xs text-dark d-block">३. डिजिटल स्वाक्षरी व दाखला निर्गमित</strong>
                <small class="text-muted d-block">
                  {{ selectedApp.status === 'Certificate Generated' ? 'डिजिटल QR कोड दाखला डाऊनलोडसाठी उपलब्ध' : 'अंतिम मंजुरीची प्रतीक्षा' }}
                </small>
              </div>
            </div>

            <!-- Download Button inside modal -->
            <div v-if="selectedApp.status === 'Certificate Generated'" class="p-3 bg-success bg-opacity-10 border border-success rounded-3 text-center">
              <i class="bi bi-award-fill fs-2 text-success d-block mb-1"></i>
              <strong class="text-sm text-success d-block mb-2">तुमचा अधिकृत दाखला तयार आहे!</strong>
              <button class="btn btn-eg-gold rounded-pill px-4 fw-bold font-sans btn-sm" @click="downloadCertificate(selectedApp)">
                <i class="bi bi-download me-1"></i> अधिकृत डिजिटल दाखला PDF डाऊनलोड करा
              </button>
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-4" @click="selectedApp = null">बंद करा</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { citizenApplications } = useMockData();

const activeFilter = ref('ALL');
const searchQuery = ref('');
const selectedApp = ref<any>(null);

const myApps = computed(() => citizenApplications.value);
const pendingCount = computed(() => myApps.value.filter(a => a.status === 'Pending Verification').length);
const generatedCount = computed(() => myApps.value.filter(a => a.status === 'Certificate Generated').length);

const filteredApps = computed(() => {
  return myApps.value.filter(a => {
    const matchesFilter = 
      activeFilter.value === 'ALL' ||
      (activeFilter.value === 'Pending' && a.status === 'Pending Verification') ||
      (activeFilter.value === 'Generated' && a.status === 'Certificate Generated');

    const matchesSearch = !searchQuery.value || 
      a.applicationNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.serviceNameMr.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchesFilter && matchesSearch;
  });
});

function viewDetails(app: any) {
  selectedApp.value = app;
}

function downloadCertificate(app: any) {
  alert(`ग्रामपंचायत अधिकृत डिजिटल दाखला (${app.applicationNo}) डाऊनलोड सुरू झाला आहे.`);
}
</script>
