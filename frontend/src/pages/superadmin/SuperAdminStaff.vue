<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Staff Management (ग्रामपंचायत कर्मचारी व्यवस्थापन)" 
      subtitle="Super Admin Control — Multi-Tenant Staff Directory, Role Assignment & Permission Controls" 
    />

    <!-- Action & Search Bar -->
    <div class="eg-card p-3.5 my-3">
      <div class="row g-3 align-items-center justify-content-between">
        <div class="col-md-5">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control bg-light border-start-0" 
              placeholder="कर्मचारी नाव, मोबाईल, ग्रामपंचायत शोधा..." 
            />
          </div>
        </div>

        <div class="col-md-3">
          <select v-model="gpFilter" class="form-select form-select-sm">
            <option value="">सर्व ग्रामपंचायती (All GPs)</option>
            <option v-for="gp in panchayats" :key="gp.id" :value="gp.nameMr">{{ gp.nameMr }}</option>
          </select>
        </div>

        <div class="col-md-3 text-end">
          <button class="btn btn-eg-primary btn-sm rounded-pill fw-bold px-3 py-1.5 w-100 w-md-auto" @click="showAddModal = true">
            <i class="bi bi-person-plus me-1"></i> + नवीन कर्मचारी जोडा
          </button>
        </div>
      </div>
    </div>

    <!-- Staff Table -->
    <div class="eg-card p-4 my-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0"><i class="bi bi-person-workspace me-1"></i> नोंदणीकृत कर्मचारी ({{ filteredStaff.length }})</h6>
        <span class="badge bg-primary text-white text-xs">Multi-Tenant Staff Directory</span>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>कर्मचारी आयडी</th>
            <th>नाव</th>
            <th>नियुक्त ग्रामपंचायत</th>
            <th>पद / भूमिका</th>
            <th>मोबाईल</th>
            <th>परवानग्या (Permissions)</th>
            <th>स्टेटस</th>
            <th class="text-end">ॲक्शन</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="member in filteredStaff" :key="member.id">
            <td><strong class="font-mono text-xs text-muted">{{ member.id }}</strong></td>
            <td>
              <div class="fw-bold text-dark text-xs">{{ member.name }}</div>
              <small class="text-muted" style="font-size: 0.7rem;">{{ member.email }}</small>
            </td>
            <td><span class="fw-semibold text-success text-xs"><i class="bi bi-building me-1"></i>{{ member.gpName }}</span></td>
            <td><span class="badge bg-light text-dark border text-xs">{{ member.role }}</span></td>
            <td><span class="font-mono text-xs">{{ member.mobile }}</span></td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="(p, idx) in member.permissions" :key="idx" class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 text-xs">
                  {{ p }}
                </span>
              </div>
            </td>
            <td>
              <span class="badge text-xs" :class="member.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-danger bg-opacity-10 text-danger border border-danger'">
                {{ member.status }}
              </span>
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-light border text-xs py-1 px-2" @click="editStaff(member)"><i class="bi bi-pencil text-warning"></i></button>
                <button class="btn btn-light border text-xs py-1 px-2" @click="toggleStatus(member)">
                  <i :class="member.status === 'Active' ? 'bi bi-pause-circle text-danger' : 'bi bi-play-circle text-success'"></i>
                </button>
              </div>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- Modal: Add New Staff -->
    <div v-if="showAddModal" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans text-xs">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-success mb-0"><i class="bi bi-person-plus-fill me-2"></i>नवीन कर्मचारी जोडा (Add Staff)</h5>
            <button class="btn-close" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body pt-3">
            <form @submit.prevent="saveStaff">
              <div class="mb-2">
                <label class="form-label fw-bold">ग्रामपंचायत निवडा *</label>
                <select v-model="newStaff.gpName" class="form-select text-xs" required>
                  <option value="" disabled>ग्रामपंचायत निवडा...</option>
                  <option v-for="gp in panchayats" :key="gp.id" :value="gp.nameMr">{{ gp.nameMr }}</option>
                </select>
              </div>

              <div class="mb-2">
                <label class="form-label fw-bold">कर्मचारी नाव *</label>
                <input type="text" v-model="newStaff.name" class="form-control text-xs" placeholder="उदा. अमित बाळकृष्ण मोरे" required />
              </div>

              <div class="row g-2 mb-2">
                <div class="col-6">
                  <label class="form-label fw-bold">पद / रोल *</label>
                  <select v-model="newStaff.role" class="form-select text-xs" required>
                    <option value="वरिष्ठ लिपिक">वरिष्ठ लिपिक</option>
                    <option value="कनिष्ठ लिपिक">कनिष्ठ लिपिक</option>
                    <option value="पाणी पुरवठा कर्मचारी">पाणी पुरवठा कर्मचारी</option>
                    <option value="कर वसुली अधिकारी">कर वसुली अधिकारी</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold">मोबाईल *</label>
                  <input type="tel" v-model="newStaff.mobile" class="form-control text-xs font-mono" placeholder="9822112233" required />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold d-block mb-1">परवानग्या (Permissions):</label>
                <div class="d-flex flex-column gap-1 border rounded-3 p-2 bg-light">
                  <label class="form-check-label"><input type="checkbox" value="दाखले पडताळणी" v-model="newStaff.permissions" class="form-check-input me-1" /> दाखले पडताळणी (Certificates Verification)</label>
                  <label class="form-check-label"><input type="checkbox" value="तक्रार निवारण" v-model="newStaff.permissions" class="form-check-input me-1" /> तक्रार निवारण (Complaints Resolution)</label>
                  <label class="form-check-label"><input type="checkbox" value="कर पावती" v-model="newStaff.permissions" class="form-check-input me-1" /> कर पावती जनरेट करणे (Tax Receipts)</label>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                <button type="button" class="btn btn-light rounded-pill px-3" @click="showAddModal = false">रद्द करा</button>
                <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold">कर्मचारी जोडा</button>
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
const gpFilter = ref('');
const showAddModal = ref(false);

const staffList = ref([
  { id: 'STF-901', name: 'अमित बाळकृष्ण मोरे', gpName: 'शिवणे ग्रामपंचायत', role: 'वरिष्ठ लिपिक', mobile: '9822112233', email: 'amit.more@shivane.egram.gov.in', permissions: ['दाखले पडताळणी', 'तक्रार निवारण'], status: 'Active' },
  { id: 'STF-902', name: 'गणेश रामराव पाटील', gpName: 'सासवड ग्रामपंचायत', role: 'कनिष्ठ लिपिक', mobile: '9822445566', email: 'ganesh.patil@saswad.egram.gov.in', permissions: ['दाखले पडताळणी'], status: 'Active' },
  { id: 'STF-903', name: 'महेश प्रकाश गावंडे', gpName: 'शिवणे ग्रामपंचायत', role: 'पाणी पुरवठा कर्मचारी', mobile: '9423998877', email: 'mahesh.g@shivane.egram.gov.in', permissions: ['तक्रार निवारण'], status: 'Active' },
  { id: 'STF-904', name: 'बाळकृष्ण संभाजी केदारी', gpName: 'शिराळा ग्रामपंचायत', role: 'कर वसुली अधिकारी', mobile: '9890556677', email: 'kedari@shirala.egram.gov.in', permissions: ['कर पावती'], status: 'Active' },
]);

const newStaff = ref({
  gpName: '',
  name: '',
  role: 'वरिष्ठ लिपिक',
  mobile: '',
  permissions: ['दाखले पडताळणी']
});

const filteredStaff = computed(() => {
  return staffList.value.filter(s => {
    const matchesSearch = 
      !searchQuery.value ||
      s.name.includes(searchQuery.value) ||
      s.mobile.includes(searchQuery.value) ||
      s.gpName.includes(searchQuery.value);
    
    const matchesGP = !gpFilter.value || s.gpName === gpFilter.value;
    return matchesSearch && matchesGP;
  });
});

function saveStaff() {
  staffList.value.unshift({
    id: `STF-${905 + staffList.value.length}`,
    name: newStaff.value.name,
    gpName: newStaff.value.gpName,
    role: newStaff.value.role,
    mobile: newStaff.value.mobile,
    email: 'staff@egram.gov.in',
    permissions: [...newStaff.value.permissions],
    status: 'Active'
  });

  showAddModal.value = false;
  newStaff.value = { gpName: '', name: '', role: 'वरिष्ठ लिपिक', mobile: '', permissions: ['दाखले पडताळणी'] };
}

function editStaff(member: any) {
  alert(`कर्मचारी [${member.name}] ची माहिती अपडेट करण्यासाठी संपादन विंडो उघडली.`);
}

function toggleStatus(member: any) {
  member.status = member.status === 'Active' ? 'Suspended' : 'Active';
  alert(`कर्मचारी [${member.name}] ची स्थिती [${member.status}] करण्यात आली.`);
}
</script>
