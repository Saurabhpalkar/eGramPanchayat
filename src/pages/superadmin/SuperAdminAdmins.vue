<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Admin Management (सरपंच व ग्रामसेवक खाती)" 
      subtitle="Super Admin Control — Manage Tenant Sarpanch & Gram Sevak Administrative Access" 
    />

    <!-- Header Actions & Search -->
    <div class="eg-card p-3.5 my-3">
      <div class="row g-3 align-items-center justify-content-between">
        <div class="col-md-5">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control bg-light border-start-0" 
              placeholder="ॲडमिन नाव, मोबाईल, ग्रामपंचायत शोधा..." 
            />
          </div>
        </div>

        <div class="col-md-3">
          <select v-model="roleFilter" class="form-select form-select-sm">
            <option value="">सर्व हुद्दे (All Roles)</option>
            <option value="सरपंच (Sarpanch)">सरपंच (Sarpanch)</option>
            <option value="ग्रामसेवक (Gram Sevak)">ग्रामसेवक (Gram Sevak)</option>
            <option value="उपसरपंच">उपसरपंच (Deputy Sarpanch)</option>
          </select>
        </div>

        <div class="col-md-3 text-end">
          <button class="btn btn-eg-primary btn-sm rounded-pill fw-bold px-3 py-1.5 w-100 w-md-auto" @click="showAddModal = true">
            <i class="bi bi-person-plus-fill me-1"></i> + नवीन ॲडमिन जोडा
          </button>
        </div>
      </div>
    </div>

    <!-- Admins Table -->
    <div class="eg-card p-4 my-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0"><i class="bi bi-person-badge-fill me-1"></i> नोंदणीकृत ॲडमिन प्रशासक ({{ filteredAdmins.length }})</h6>
        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs">Active Credentials</span>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>ॲडमिन आयडी</th>
            <th>नाव</th>
            <th>हुद्दा / पद</th>
            <th>नियुक्त ग्रामपंचायत</th>
            <th>मोबाईल</th>
            <th>युझरनेम / ईमेल</th>
            <th>लास्ट लॉगिन</th>
            <th>स्टेटस</th>
            <th class="text-end">ॲक्शन (Actions)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="admin in filteredAdmins" :key="admin.id">
            <td><strong class="font-mono text-xs text-muted">{{ admin.id }}</strong></td>
            <td>
              <div class="fw-bold text-dark" style="font-size: 0.9rem;">{{ admin.name }}</div>
              <small class="text-muted text-xs"><i class="bi bi-shield-check text-success me-1"></i>Verified Admin</small>
            </td>
            <td>
              <span class="badge" :class="admin.role.includes('सरपंच') ? 'bg-warning text-dark fw-bold' : 'bg-primary text-white'">
                {{ admin.role }}
              </span>
            </td>
            <td>
              <span class="fw-bold text-success text-xs"><i class="bi bi-building me-1"></i>{{ admin.gpName }}</span>
            </td>
            <td><span class="font-mono text-xs">{{ admin.mobile }}</span></td>
            <td>
              <div class="text-xs font-mono text-dark">{{ admin.username }}</div>
              <small class="text-muted d-block" style="font-size: 0.72rem;">{{ admin.email }}</small>
            </td>
            <td><small class="text-muted text-xs">{{ admin.lastLogin }}</small></td>
            <td>
              <span class="badge text-xs" :class="admin.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-danger bg-opacity-10 text-danger border border-danger'">
                {{ admin.status }}
              </span>
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-light border text-xs py-1 px-2" title="संपादित करा" @click="editAdmin(admin)">
                  <i class="bi bi-pencil text-warning"></i>
                </button>
                <button class="btn btn-light border text-xs py-1 px-2" title="पासवर्ड रिसेट" @click="resetPassword(admin)">
                  <i class="bi bi-key text-primary"></i>
                </button>
                <button 
                  class="btn btn-light border text-xs py-1 px-2" 
                  :title="admin.status === 'Active' ? 'खाते निष्क्रिय करा' : 'खाते सक्रिय करा'"
                  @click="toggleAdminStatus(admin)"
                >
                  <i :class="admin.status === 'Active' ? 'bi bi-pause-circle text-danger' : 'bi bi-play-circle text-success'"></i>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- Modal: Add New Admin -->
    <div v-if="showAddModal" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-success mb-0"><i class="bi bi-person-plus-fill me-2"></i>नवीन ॲडमिन जोडा (Create Admin)</h5>
            <button class="btn-close" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body pt-3">
            <form @submit.prevent="saveNewAdmin">
              <div class="mb-3">
                <label class="form-label text-xs fw-bold">ग्रामपंचायत निवडा (Assign Gram Panchayat) *</label>
                <select v-model="newAdmin.gpName" class="form-select text-xs" required>
                  <option value="" disabled>ग्रामपंचायत निवडा...</option>
                  <option v-for="gp in panchayats" :key="gp.id" :value="gp.nameMr">{{ gp.nameMr }} ({{ gp.district }})</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label text-xs fw-bold">ॲडमिन नाव (Full Name) *</label>
                <input type="text" v-model="newAdmin.name" class="form-control text-xs" placeholder="उदा. सौ. कविता संभाजी गायकवाड" required />
              </div>

              <div class="mb-3">
                <label class="form-label text-xs fw-bold">हुद्दा (Role) *</label>
                <select v-model="newAdmin.role" class="form-select text-xs" required>
                  <option value="सरपंच (Sarpanch)">सरपंच (Sarpanch)</option>
                  <option value="ग्रामसेवक (Gram Sevak)">ग्रामसेवक (Gram Sevak)</option>
                  <option value="उपसरपंच">उपसरपंच (Deputy Sarpanch)</option>
                </select>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label text-xs fw-bold">मोबाईल क्रमांक *</label>
                  <input type="tel" v-model="newAdmin.mobile" class="form-control text-xs font-mono" placeholder="9822112233" required />
                </div>
                <div class="col-6">
                  <label class="form-label text-xs fw-bold">युझरनेम *</label>
                  <input type="text" v-model="newAdmin.username" class="form-control text-xs font-mono" placeholder="admin_shirala" required />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label text-xs fw-bold">ईमेल पत्ता *</label>
                <input type="email" v-model="newAdmin.email" class="form-control text-xs" placeholder="sarpanch@shirala.egram.gov.in" required />
              </div>

              <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" class="btn btn-light rounded-pill px-3 text-xs" @click="showAddModal = false">रद्द करा</button>
                <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold text-xs">अकाऊंट तयार करा</button>
              </div>
            </form>
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
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { panchayats } = useMockData();

const searchQuery = ref('');
const roleFilter = ref('');
const showAddModal = ref(false);

const admins = ref([
  { id: 'ADM-101', name: 'सौ. सुनीता पाटील', role: 'सरपंच (Sarpanch)', gpName: 'शिवणे ग्रामपंचायत', mobile: '9890112233', username: 'sarpanch_shivane', email: 'sarpanch.shivane@egram.gov.in', lastLogin: 'आज, सकाळी ०९:१५', status: 'Active' },
  { id: 'ADM-102', name: 'श्री. रमेश शिंदे', role: 'ग्रामसेवक (Gram Sevak)', gpName: 'शिवणे ग्रामपंचायत', mobile: '9822334455', username: 'gramsevak_shivane', email: 'gramsevak.shivane@egram.gov.in', lastLogin: 'काल, दुपारी ०३:३०', status: 'Active' },
  { id: 'ADM-103', name: 'श्री. मारुती जगताप', role: 'सरपंच (Sarpanch)', gpName: 'सासवड ग्रामपंचायत', mobile: '9822445566', username: 'sarpanch_saswad', email: 'sarpanch.saswad@egram.gov.in', lastLogin: '३१ जुलै २०२६', status: 'Active' },
  { id: 'ADM-104', name: 'श्री. संभाजीराव नाईक', role: 'सरपंच (Sarpanch)', gpName: 'शिराळा ग्रामपंचायत', mobile: '9422887711', username: 'sarpanch_shirala', email: 'sarpanch.shirala@egram.gov.in', lastLogin: '२८ जुलै २०२६', status: 'Active' },
  { id: 'ADM-105', name: 'सौ. सरिता ढमाले', role: 'सरपंच (Sarpanch)', gpName: 'कडूस ग्रामपंचायत', mobile: '9850332211', username: 'sarpanch_kadus', email: 'sarpanch.kadus@egram.gov.in', lastLogin: '२५ जुलै २०२६', status: 'Suspended' },
]);

const newAdmin = ref({
  gpName: '',
  name: '',
  role: 'सरपंच (Sarpanch)',
  mobile: '',
  username: '',
  email: ''
});

const filteredAdmins = computed(() => {
  return admins.value.filter(a => {
    const matchesSearch = 
      !searchQuery.value ||
      a.name.includes(searchQuery.value) ||
      a.mobile.includes(searchQuery.value) ||
      a.gpName.includes(searchQuery.value) ||
      a.username.includes(searchQuery.value);
    
    const matchesRole = !roleFilter.value || a.role === roleFilter.value;
    return matchesSearch && matchesRole;
  });
});

function saveNewAdmin() {
  admins.value.unshift({
    id: `ADM-${106 + admins.value.length}`,
    name: newAdmin.value.name,
    role: newAdmin.value.role,
    gpName: newAdmin.value.gpName,
    mobile: newAdmin.value.mobile,
    username: newAdmin.value.username,
    email: newAdmin.value.email,
    lastLogin: 'अजून नाही',
    status: 'Active'
  });

  showAddModal.value = false;
  newAdmin.value = { gpName: '', name: '', role: 'सरपंच (Sarpanch)', mobile: '', username: '', email: '' };
}

function editAdmin(admin: any) {
  alert(`ॲडमिन [${admin.name}] ची माहिती अपडेट करण्यासाठी एडिट फॉर्म उघडला.`);
}

function resetPassword(admin: any) {
  alert(`ॲडमिन [${admin.name}] यांच्या मोबाईलवर (${admin.mobile}) नवीन पासवर्ड रिसेट लिंक पाठवली गेली.`);
}

function toggleAdminStatus(admin: any) {
  admin.status = admin.status === 'Active' ? 'Suspended' : 'Active';
  alert(`ॲडमिन [${admin.name}] ची स्थिती [${admin.status}] करण्यात आली.`);
}
</script>
