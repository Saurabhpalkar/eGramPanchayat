<template>
  <div>
    <DashboardHeader 
      title="नागरिक शोध व नोंदवही (Citizen Search & Profiles)" 
      subtitle="ग्रामपंचायत हद्दीतील नोंदणीकृत नागरिकांची माहिती, अर्जांचा इतिहास व तक्रारी शोध कंसोल" 
    />

    <!-- Multi-criteria Search Bar -->
    <div class="eg-card p-4 my-3 font-sans">
      <h6 class="fw-bold text-success mb-3"><i class="bi bi-search me-2"></i>नागरिक शोधा (Search Citizen Records)</h6>
      <div class="row g-2">
        <div class="col-md-3">
          <label class="form-label text-xs fw-bold text-muted">नागरिकाचे नाव / Surname</label>
          <input type="text" v-model="searchName" class="form-control text-xs" placeholder="उदा. संजय देशमुख" />
        </div>
        <div class="col-md-3">
          <label class="form-label text-xs fw-bold text-muted">मोबाईल क्रमांक</label>
          <input type="text" v-model="searchPhone" class="form-control text-xs" placeholder="उदा. 9822123456" />
        </div>
        <div class="col-md-3">
          <label class="form-label text-xs fw-bold text-muted">आधार क्रमांक / App ID</label>
          <input type="text" v-model="searchAadhaar" class="form-control text-xs" placeholder="8921 किंवा APP-2026" />
        </div>
        <div class="col-md-3 d-flex align-items-end gap-2">
          <button class="btn btn-eg-primary btn-sm w-100 rounded-pill fw-bold" @click="performSearch">
            <i class="bi bi-search me-1"></i> शोधा (Search)
          </button>
          <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="resetSearch">
            रिसेट
          </button>
        </div>
      </div>
    </div>

    <!-- Citizen Search Results & Selected Profile Split View -->
    <div class="row g-3 my-3 font-sans">
      <!-- Left Column: Citizen Cards Grid -->
      <div class="col-lg-5">
        <div class="eg-card p-3 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-success mb-0">
              <i class="bi bi-people-fill me-1"></i>नागरिक यादी ({{ filteredCitizens.length }})
            </h6>
            <span class="badge bg-success bg-opacity-10 text-success text-xs">आधार पडताळलेले</span>
          </div>

          <div class="d-flex flex-column gap-2">
            <div 
              v-for="cit in filteredCitizens" 
              :key="cit.id" 
              class="p-3 rounded-3 border cursor-pointer transition-all"
              :class="selectedCitizen?.id === cit.id ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-white hover-shadow'"
              @click="selectedCitizen = cit"
            >
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong class="text-xs text-success">{{ cit.id }}</strong>
                <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 text-xs">Verified</span>
              </div>
              <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.95rem;">{{ cit.name }}</h6>
              <div class="text-xs text-muted d-flex justify-content-between">
                <span><i class="bi bi-phone me-1"></i>{{ cit.phone }}</span>
                <span><i class="bi bi-geo-alt me-1"></i>{{ cit.ward }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Comprehensive Citizen Record Drawer -->
      <div class="col-lg-7" v-if="selectedCitizen">
        <div class="eg-card p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <!-- Header Card -->
            <div class="p-3 bg-light rounded-3 border mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style="width: 50px; height: 50px;">
                  {{ selectedCitizen.name.charAt(0) }}
                </div>
                <div>
                  <h5 class="fw-bold text-success mb-0">{{ selectedCitizen.name }}</h5>
                  <small class="text-muted d-block">ग्रामपंचायत नागरिक नोंदवही आयडी: {{ selectedCitizen.id }}</small>
                  <div class="d-flex gap-2 text-xs mt-1">
                    <span><i class="bi bi-telephone text-success me-1"></i><strong>{{ selectedCitizen.phone }}</strong></span>
                    <span><i class="bi bi-credit-card text-success me-1"></i>आधार: <strong>{{ selectedCitizen.aadhaar }}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Details Grid -->
            <div class="row g-2 text-xs border-bottom pb-3 mb-3">
              <div class="col-6">
                <span class="text-muted d-block">पत्ता / गावठाण:</span>
                <strong>{{ selectedCitizen.address }}</strong>
              </div>
              <div class="col-6">
                <span class="text-muted d-block">वॉर्ड / गट क्रमांक:</span>
                <strong>{{ selectedCitizen.ward }}</strong>
              </div>
              <div class="col-6">
                <span class="text-muted d-block">मालमत्ता / घर क्रमांक:</span>
                <strong>{{ selectedCitizen.houseNo }}</strong>
              </div>
              <div class="col-6">
                <span class="text-muted d-block">कर भरणा स्थिती:</span>
                <span class="badge bg-success bg-opacity-10 text-success">नियमित करदाता</span>
              </div>
            </div>

            <!-- History Tabs: Applications & Complaints -->
            <div class="mb-3">
              <ul class="nav nav-pills nav-fill mb-2 text-xs bg-light p-1 rounded-pill border">
                <li class="nav-item">
                  <button 
                    class="nav-link rounded-pill py-1 text-xs" 
                    :class="{ 'active bg-success text-white fw-bold': activeTab === 'apps' }" 
                    @click="activeTab = 'apps'"
                  >
                    <i class="bi bi-journal-text me-1"></i> दाखल केलेले अर्ज ({{ selectedCitizen.apps.length }})
                  </button>
                </li>
                <li class="nav-item">
                  <button 
                    class="nav-link rounded-pill py-1 text-xs" 
                    :class="{ 'active bg-success text-white fw-bold': activeTab === 'cmps' }" 
                    @click="activeTab = 'cmps'"
                  >
                    <i class="bi bi-tools me-1"></i> नोंदवलेल्या तक्रारी ({{ selectedCitizen.cmps.length }})
                  </button>
                </li>
                <li class="nav-item">
                  <button 
                    class="nav-link rounded-pill py-1 text-xs" 
                    :class="{ 'active bg-success text-white fw-bold': activeTab === 'certs' }" 
                    @click="activeTab = 'certs'"
                  >
                    <i class="bi bi-award me-1"></i> मिळालेले दाखले ({{ selectedCitizen.certs.length }})
                  </button>
                </li>
              </ul>

              <!-- Applications Tab -->
              <div v-if="activeTab === 'apps'" class="d-flex flex-column gap-2">
                <div v-for="app in selectedCitizen.apps" :key="app.appNo" class="p-2 border rounded bg-white text-xs d-flex justify-content-between align-items-center">
                  <div>
                    <strong class="text-success">{{ app.appNo }}</strong> - {{ app.service }}
                    <small class="text-muted d-block">तारीख: {{ app.date }}</small>
                  </div>
                  <span class="badge bg-success bg-opacity-10 text-success">{{ app.status }}</span>
                </div>
              </div>

              <!-- Complaints Tab -->
              <div v-if="activeTab === 'cmps'" class="d-flex flex-column gap-2">
                <div v-for="cmp in selectedCitizen.cmps" :key="cmp.ticket" class="p-2 border rounded bg-white text-xs d-flex justify-content-between align-items-center">
                  <div>
                    <strong class="text-danger">{{ cmp.ticket }}</strong> - {{ cmp.title }}
                    <small class="text-muted d-block">स्थान: {{ cmp.location }}</small>
                  </div>
                  <span class="badge bg-success bg-opacity-10 text-success">{{ cmp.status }}</span>
                </div>
              </div>

              <!-- Certificates Tab -->
              <div v-if="activeTab === 'certs'" class="d-flex flex-column gap-2">
                <div v-for="cert in selectedCitizen.certs" :key="cert.outward" class="p-2 border rounded bg-white text-xs d-flex justify-content-between align-items-center">
                  <div>
                    <strong class="text-dark">{{ cert.title }}</strong> (जावक क्र. {{ cert.outward }})
                    <small class="text-muted d-block">तारीख: {{ cert.date }}</small>
                  </div>
                  <button class="btn btn-sm btn-outline-success rounded-pill py-0 px-2 text-xs" @click="reDownload(cert.outward)">
                    <i class="bi bi-download me-1"></i> पुन्हा डाऊनलोड
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-2 border-top d-flex justify-content-end gap-2">
            <button class="btn btn-outline-secondary rounded-pill px-3 text-xs" @click="callCitizen">
              <i class="bi bi-telephone me-1"></i> नागरिकाशी संपर्क करा
            </button>
            <router-link to="/staff/certificates" class="btn btn-eg-primary rounded-pill px-3 text-xs fw-bold">
              <i class="bi bi-file-earmark-plus me-1"></i> नवीन दाखला जनरेट करा
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

interface CitizenRecord {
  id: string;
  name: string;
  phone: string;
  aadhaar: string;
  ward: string;
  address: string;
  houseNo: string;
  apps: { appNo: string; service: string; date: string; status: string }[];
  cmps: { ticket: string; title: string; location: string; status: string }[];
  certs: { title: string; outward: string; date: string }[];
}

const searchName = ref('');
const searchPhone = ref('');
const searchAadhaar = ref('');
const activeTab = ref<'apps' | 'cmps' | 'certs'>('apps');

const citizensList = ref<CitizenRecord[]>([
  {
    id: 'CIT-101',
    name: 'संजय बबनराव देशमुख',
    phone: '9822123456',
    aadhaar: 'XXXX-XXXX-8921',
    ward: 'वॉर्ड क्र. ३ (शिवणे गावठाण)',
    address: 'घर क्र. ४५२, मारुती मंदिराजवळ, शिवणे',
    houseNo: '452/B',
    apps: [
      { appNo: 'APP-2026-9012', service: 'पोलीस पाटील दाखला', date: '28 जुलै 2026', status: 'Certificate Generated' },
      { appNo: 'APP-2026-9045', service: 'उत्पन्न दाखला', date: '30 जुलै 2026', status: 'Pending Verification' }
    ],
    cmps: [
      { ticket: 'SHV-2026-4421', title: 'गटार तुंबले व पाणी रस्त्यावर आले', location: 'मारुती मंदिराजवळ', status: 'Resolved' }
    ],
    certs: [
      { title: 'पोलीस पाटील दाखला', outward: 'GP/SHV/2026/884', date: '29 जुलै 2026' }
    ]
  },
  {
    id: 'CIT-102',
    name: 'रमेश तुकाराम साळुंखे',
    phone: '9822114455',
    aadhaar: 'XXXX-XXXX-4422',
    ward: 'वॉर्ड क्र. ३',
    address: 'शिवणे गावठाण, गल्ली क्र. २',
    houseNo: '112/A',
    apps: [
      { appNo: 'APP-2026-9078', service: 'पोलीस पाटील दाखला', date: '31 जुलै 2026', status: 'Pending Verification' }
    ],
    cmps: [],
    certs: []
  },
  {
    id: 'CIT-103',
    name: 'सौ. सविता प्रकाश जगताप',
    phone: '9422556677',
    aadhaar: 'XXXX-XXXX-9011',
    ward: 'वॉर्ड क्र. २',
    address: 'कुंभार गल्ली, शिवणे',
    houseNo: '204',
    apps: [
      { appNo: 'APP-2026-9102', service: 'रहवासी दाखला', date: '01 ऑगस्ट 2026', status: 'Pending Verification' }
    ],
    cmps: [
      { ticket: 'SHV-2026-4489', title: 'स्ट्रीट लाईट बंद आहे', location: 'कुंभार गल्ली', status: 'In Process' }
    ],
    certs: []
  }
]);

const selectedCitizen = ref<CitizenRecord | null>(citizensList.value[0]);

const filteredCitizens = computed(() => {
  return citizensList.value.filter(c => {
    const matchName = !searchName.value || c.name.toLowerCase().includes(searchName.value.toLowerCase());
    const matchPhone = !searchPhone.value || c.phone.includes(searchPhone.value);
    const matchAadhaar = !searchAadhaar.value || c.aadhaar.includes(searchAadhaar.value) || c.apps.some(a => a.appNo.includes(searchAadhaar.value));

    return matchName && matchPhone && matchAadhaar;
  });
});

function performSearch() {
  if (filteredCitizens.value.length > 0) {
    selectedCitizen.value = filteredCitizens.value[0];
  }
}

function resetSearch() {
  searchName.value = '';
  searchPhone.value = '';
  searchAadhaar.value = '';
  selectedCitizen.value = citizensList.value[0];
}

function reDownload(outward: string) {
  alert(`दाखला जावक क्र. ${outward} डाऊनलोड प्रक्रिया सुरू झाली.`);
}

function callCitizen() {
  if (selectedCitizen.value) {
    window.location.href = `tel:${selectedCitizen.value.phone}`;
  }
}
</script>
