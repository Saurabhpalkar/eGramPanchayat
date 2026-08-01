<template>
  <div class="font-sans">
    <DashboardHeader 
      title="User Management (नागरिक युजर्स व्यवस्थापन)" 
      subtitle="Super Admin Platform Directory — All Citizen Registrations, Applications & Complaints History" 
    />

    <!-- Filter & Search Controls -->
    <div class="eg-card p-3.5 my-3">
      <div class="row g-3 align-items-center">
        <div class="col-md-5">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control bg-light border-start-0" 
              placeholder="नागरिक नाव, आधार, मोबाईल शोधा..." 
            />
          </div>
        </div>

        <div class="col-6 col-md-3">
          <select v-model="gpFilter" class="form-select form-select-sm">
            <option value="">सर्व ग्रामपंचायती (All Gram Panchayats)</option>
            <option v-for="gp in panchayats" :key="gp.id" :value="gp.nameMr">{{ gp.nameMr }}</option>
          </select>
        </div>

        <div class="col-6 col-md-4">
          <select v-model="statusFilter" class="form-select form-select-sm">
            <option value="">सर्व स्टेटस (All Status)</option>
            <option value="Active">Active (सक्रिय)</option>
            <option value="Blocked">Blocked (ब्लॉक केलेले)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="eg-card p-4 my-3">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div class="d-flex align-items-center gap-2">
          <h6 class="fw-bold text-success mb-0"><i class="bi bi-people-fill me-1"></i> नोंदणीकृत नागरिक खातेदार</h6>
          <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs">
            एकूण {{ filteredUsers.length }} नागरिक
          </span>
        </div>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>नागरिक आयडी</th>
            <th>नागरिक नाव</th>
            <th>आधार क्रमांक</th>
            <th>मोबाईल</th>
            <th>ग्रामपंचायत</th>
            <th>अर्ज (Apps)</th>
            <th>तक्रारी (Complaints)</th>
            <th>नोंदणी तारीख</th>
            <th>स्टेटस</th>
            <th class="text-end">ॲक्शन (Actions)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td><strong class="font-mono text-xs text-muted">{{ user.id }}</strong></td>
            <td>
              <div class="fw-bold text-dark text-xs">{{ user.name }}</div>
              <small class="text-muted" style="font-size: 0.72rem;"><i class="bi bi-geo-alt me-1"></i>{{ user.address }}</small>
            </td>
            <td><span class="font-mono text-xs text-dark">{{ user.aadhaar }}</span></td>
            <td><span class="font-mono text-xs"><i class="bi bi-telephone text-success me-1"></i>{{ user.phone }}</span></td>
            <td><span class="fw-bold text-success text-xs">{{ user.gpName }}</span></td>
            <td>
              <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 text-xs fw-bold">
                {{ user.appCount }} अर्ज
              </span>
            </td>
            <td>
              <span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 text-xs fw-bold">
                {{ user.complaintCount }} तक्रारी
              </span>
            </td>
            <td><span class="text-xs text-muted">{{ user.registeredDate }}</span></td>
            <td>
              <span class="badge text-xs" :class="user.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-danger bg-opacity-10 text-danger border border-danger'">
                {{ user.status }}
              </span>
            </td>
            <td class="text-end">
              <div class="dropdown d-inline-block">
                <button class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-xs dropdown-toggle" @click="toggleUserMenu(user.id)">
                  पर्याय
                </button>
                <ul v-if="activeUserMenuId === user.id" class="dropdown-menu dropdown-menu-end shadow-lg show mt-1 p-1 text-xs" style="min-width: 150px;">
                  <li>
                    <button class="dropdown-item rounded py-1.5" @click="viewUserApps(user)">
                      <i class="bi bi-journal-text text-primary me-1.5"></i> View Applications
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item rounded py-1.5" @click="viewUserComplaints(user)">
                      <i class="bi bi-exclamation-square text-danger me-1.5"></i> View Complaints
                    </button>
                  </li>
                  <li><hr class="dropdown-divider my-1"></li>
                  <li>
                    <button 
                      class="dropdown-item rounded py-1.5" 
                      :class="user.status === 'Active' ? 'text-danger' : 'text-success'"
                      @click="toggleUserBlockStatus(user)"
                    >
                      <i :class="user.status === 'Active' ? 'bi bi-slash-circle me-1.5' : 'bi bi-check-circle me-1.5'"></i>
                      {{ user.status === 'Active' ? 'Block Citizen' : 'Activate Citizen' }}
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- Modal: View Citizen Applications -->
    <div v-if="selectedUserForApps" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans text-xs">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-success mb-0">
              <i class="bi bi-file-earmark-text me-2"></i>[ {{ selectedUserForApps.name }} ] यांचे सर्व अर्ज
            </h5>
            <button class="btn-close" @click="selectedUserForApps = null"></button>
          </div>
          <div class="modal-body pt-3">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>अर्ज क्र.</th>
                    <th>दाखला / सेवा</th>
                    <th>तारीख</th>
                    <th>रक्कम</th>
                    <th>स्टेटस</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="app in citizenApplications" :key="app.id">
                    <td class="fw-bold font-mono">{{ app.applicationNo }}</td>
                    <td class="fw-bold text-success">{{ app.serviceNameMr }}</td>
                    <td>{{ app.appliedDate }}</td>
                    <td class="fw-mono">₹{{ app.amount }}</td>
                    <td><span class="badge bg-success bg-opacity-10 text-success border border-success">{{ app.statusMr }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-end pt-2">
              <button class="btn btn-secondary btn-sm rounded-pill px-4" @click="selectedUserForApps = null">बंद करा</button>
            </div>
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

const { panchayats, citizenApplications } = useMockData();

const searchQuery = ref('');
const gpFilter = ref('');
const statusFilter = ref('');
const activeUserMenuId = ref<string | null>(null);
const selectedUserForApps = ref<any>(null);

const users = ref([
  { id: 'CIT-1001', name: 'संजय बबनराव देशमुख', aadhaar: 'XXXX-XXXX-8921', phone: '9822123456', gpName: 'शिवणे ग्रामपंचायत', address: 'वॉर्ड क्र. २, शिवणे', appCount: 3, complaintCount: 1, registeredDate: '15 मे 2025', status: 'Active' },
  { id: 'CIT-1002', name: 'रमेश तुकाराम साळुंखे', aadhaar: 'XXXX-XXXX-3344', phone: '9822114455', gpName: 'शिवणे ग्रामपंचायत', address: 'मारुती मंदिर गल्ली', appCount: 1, complaintCount: 2, registeredDate: '10 जून 2025', status: 'Active' },
  { id: 'CIT-1003', name: 'सुप्रिया अजय निकम', aadhaar: 'XXXX-XXXX-7788', phone: '9423998877', gpName: 'सासवड ग्रामपंचायत', address: 'बसस्थानक चौक', appCount: 4, complaintCount: 1, registeredDate: '01 जानेवारी 2026', status: 'Active' },
  { id: 'CIT-1004', name: 'प्रमोद सीताराम केदारी', aadhaar: 'XXXX-XXXX-1122', phone: '9422001122', gpName: 'शिराळा ग्रामपंचायत', address: 'मुख्य रस्ता', appCount: 2, complaintCount: 0, registeredDate: '20 मार्च 2026', status: 'Active' },
  { id: 'CIT-1005', name: 'ज्ञानेश्वर तुकाराम मोर', aadhaar: 'XXXX-XXXX-9900', phone: '9850119900', gpName: 'कडूस ग्रामपंचायत', address: 'पेठ गल्ली', appCount: 0, complaintCount: 3, registeredDate: '12 एप्रिल 2026', status: 'Blocked' },
]);

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch = 
      !searchQuery.value ||
      u.name.includes(searchQuery.value) ||
      u.phone.includes(searchQuery.value) ||
      u.aadhaar.includes(searchQuery.value);
    
    const matchesGP = !gpFilter.value || u.gpName === gpFilter.value;
    const matchesStatus = !statusFilter.value || u.status === statusFilter.value;

    return matchesSearch && matchesGP && matchesStatus;
  });
});

function toggleUserMenu(id: string) {
  activeUserMenuId.value = activeUserMenuId.value === id ? null : id;
}

function viewUserApps(user: any) {
  selectedUserForApps.value = user;
  activeUserMenuId.value = null;
}

function viewUserComplaints(user: any) {
  alert(`नागरिक [${user.name}] यांच्या सर्व तक्रारींची हिस्टरी उघडली.`);
  activeUserMenuId.value = null;
}

function toggleUserBlockStatus(user: any) {
  user.status = user.status === 'Active' ? 'Blocked' : 'Active';
  alert(`नागरिक [${user.name}] ची खात्याची स्थिती [${user.status}] केली गेली.`);
  activeUserMenuId.value = null;
}
</script>
