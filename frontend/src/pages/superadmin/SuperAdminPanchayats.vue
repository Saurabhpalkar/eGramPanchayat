<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Gram Panchayat Management (ग्रामपंचायत व्यवस्थापन)" 
      subtitle="SaaS Tenants Control Center — Onboarded Panchayats, Subscription Plans & Tenant Lifecycle" 
    />

    <!-- Filter & Search Controls Bar -->
    <div class="eg-card p-3.5 my-3">
      <div class="row g-3 align-items-center">
        <!-- Search Input -->
        <div class="col-md-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control bg-light border-start-0" 
              placeholder="शोधा (नाव, कोड, गाव, तालुका)..." 
            />
            <button v-if="searchQuery" class="btn btn-outline-secondary btn-sm" @click="searchQuery = ''">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>

        <!-- District Filter -->
        <div class="col-6 col-md-2.5">
          <select v-model="selectedDistrict" class="form-select form-select-sm">
            <option value="">सर्व जिल्हे (All Districts)</option>
            <option value="पुणे">पुणे (Pune)</option>
            <option value="सांगली">सांगली (Sangli)</option>
            <option value="अहिल्यानगर">अहिल्यानगर (Ahilyanagar)</option>
            <option value="नाशिक">नाशिक (Nashik)</option>
            <option value="सातारा">सातारा (Satara)</option>
          </select>
        </div>

        <!-- Subscription Filter -->
        <div class="col-6 col-md-2.5">
          <select v-model="selectedPlan" class="form-select form-select-sm">
            <option value="">सर्व सबस्क्रिप्शन (All Plans)</option>
            <option value="Enterprise Gold">Enterprise Gold</option>
            <option value="Standard Green">Standard Green</option>
            <option value="Starter">Starter</option>
            <option value="Free">Free Trial</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="col-6 col-md-2">
          <select v-model="selectedStatus" class="form-select form-select-sm">
            <option value="">सर्व स्टेटस (All Status)</option>
            <option value="Active">Active (सक्रिय)</option>
            <option value="Suspended">Suspended (निष्क्रिय)</option>
          </select>
        </div>

        <!-- Add GP Button -->
        <div class="col-12 col-md-12 col-lg-1 text-md-end">
          <router-link to="/superadmin/add-panchayat" class="btn btn-eg-primary btn-sm rounded-pill font-sans fw-bold text-nowrap px-3 py-1.5 w-100">
            <i class="bi bi-plus-circle me-1"></i> + नवीन GP
          </router-link>
        </div>
      </div>
    </div>

    <!-- Gram Panchayats Table -->
    <div class="eg-card p-4 my-3">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div class="d-flex align-items-center gap-2">
          <h6 class="fw-bold text-success mb-0"><i class="bi bi-buildings-fill me-1"></i> नोंदणीकृत ग्रामपंचायती</h6>
          <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs">
            एकूण {{ filteredPanchayats.length }} पैकी {{ paginatedPanchayats.length }} दर्शवले
          </span>
        </div>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>लोगो</th>
            <th>ग्रामपंचायत नाव</th>
            <th>गाव</th>
            <th>तालुका</th>
            <th>जिल्हा</th>
            <th>Panchayat Code</th>
            <th>Admin Name (सरपंच)</th>
            <th>Mobile</th>
            <th>Subscription</th>
            <th>Status</th>
            <th class="text-end">Actions</th>
          </tr>
        </template>
        <template #body>
          <tr v-if="paginatedPanchayats.length === 0">
            <td colspan="11" class="text-center py-4 text-muted">
              <i class="bi bi-inbox fs-2 d-block mb-1 text-secondary"></i>
              कोणतीही ग्रामपंचायत सापडली नाही. शोध निकष तपासा.
            </td>
          </tr>
          <tr v-for="gp in paginatedPanchayats" :key="gp.id">
            <!-- Logo -->
            <td>
              <div class="bg-success text-white rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm" style="width: 38px; height: 38px; font-size: 0.75rem;">
                {{ gp.nameMr.substring(0, 2) }}
              </div>
            </td>
            <!-- GP Name -->
            <td>
              <div class="fw-bold text-success" style="font-size: 0.92rem;">{{ gp.nameMr }}</div>
              <small class="text-xs text-muted font-mono d-block">{{ gp.nameEn }}</small>
            </td>
            <!-- Village -->
            <td><span class="fw-semibold text-dark text-xs">{{ gp.nameMr.replace('ग्रामपंचायत', '').trim() }}</span></td>
            <!-- Taluka -->
            <td><span class="text-xs">{{ gp.taluka }}</span></td>
            <!-- District -->
            <td><span class="badge bg-light text-dark border text-xs">{{ gp.district }}</span></td>
            <!-- Code -->
            <td><strong class="font-mono text-xs text-secondary">{{ gp.code }}</strong></td>
            <!-- Admin Name -->
            <td>
              <div class="fw-semibold text-xs text-dark">{{ gp.sarpanchName }}</div>
              <small class="text-muted text-xs">सरपंच / Admin</small>
            </td>
            <!-- Mobile -->
            <td>
              <span class="text-xs font-mono"><i class="bi bi-telephone text-success me-1"></i>{{ gp.contactNo }}</span>
            </td>
            <!-- Subscription -->
            <td>
              <span class="badge text-xs" :class="{
                'bg-warning text-dark fw-bold': gp.activePlan === 'Enterprise Gold',
                'bg-success text-white': gp.activePlan === 'Standard Green',
                'bg-info text-white': gp.activePlan === 'Starter'
              }">
                {{ gp.activePlan }}
              </span>
            </td>
            <!-- Status -->
            <td>
              <span class="badge text-xs" :class="gp.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success' : 'bg-danger bg-opacity-10 text-danger border border-danger'">
                <i :class="gp.status === 'Active' ? 'bi bi-check-circle-fill' : 'bi bi-pause-circle-fill'" class="me-1"></i>
                {{ gp.status }}
              </span>
            </td>
            <!-- Actions -->
            <td class="text-end text-nowrap">
              <div class="dropdown d-inline-block">
                <button class="btn btn-sm btn-light border rounded-pill px-2 py-1 text-xs dropdown-toggle" type="button" @click="toggleActionMenu(gp.id)">
                  कार्रवाई
                </button>
                <ul v-if="activeActionMenuId === gp.id" class="dropdown-menu dropdown-menu-end shadow-lg show mt-1 p-1 text-xs" style="min-width: 140px;">
                  <li>
                    <button class="dropdown-item rounded py-1.5" @click="viewDetails(gp)">
                      <i class="bi bi-eye text-primary me-1.5"></i> View Details
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item rounded py-1.5" @click="editGP(gp)">
                      <i class="bi bi-pencil text-warning me-1.5"></i> Edit Details
                    </button>
                  </li>
                  <li v-if="gp.status === 'Suspended'">
                    <button class="dropdown-item rounded py-1.5 text-success" @click="toggleStatus(gp, 'Active')">
                      <i class="bi bi-play-circle me-1.5"></i> Activate GP
                    </button>
                  </li>
                  <li v-else>
                    <button class="dropdown-item rounded py-1.5 text-warning" @click="toggleStatus(gp, 'Suspended')">
                      <i class="bi bi-pause-circle me-1.5"></i> Deactivate GP
                    </button>
                  </li>
                  <li><hr class="dropdown-divider my-1"></li>
                  <li>
                    <button class="dropdown-item rounded py-1.5 text-danger" @click="confirmDelete(gp.id)">
                      <i class="bi bi-trash me-1.5"></i> Delete GP
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </template>
      </ResponsiveTable>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-wrap gap-2 text-xs">
        <span class="text-muted">
          पृष्ठ {{ currentPage }} पैकी {{ totalPages }} (एकूण {{ filteredPanchayats.length }} नोंदी)
        </span>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" :disabled="currentPage === 1" @click="currentPage--">
            <i class="bi bi-chevron-left me-1"></i> मागील
          </button>
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" :disabled="currentPage >= totalPages" @click="currentPage++">
            पुढील <i class="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- View GP Modal -->
    <div v-if="viewingGP" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-success mb-0"><i class="bi bi-building me-2"></i>{{ viewingGP.nameMr }}</h5>
            <button class="btn-close" @click="viewingGP = null"></button>
          </div>
          <div class="modal-body pt-3 text-xs">
            <div class="p-3 bg-light rounded-3 mb-3 border">
              <div class="row g-2">
                <div class="col-6"><strong>LGD Code:</strong> {{ viewingGP.code }}</div>
                <div class="col-6"><strong>जिल्हा:</strong> {{ viewingGP.district }}</div>
                <div class="col-6"><strong>तालुका:</strong> {{ viewingGP.taluka }}</div>
                <div class="col-6"><strong>लोकसंख्या:</strong> {{ viewingGP.population }}</div>
              </div>
            </div>

            <h6 class="fw-bold text-dark mb-2">ॲडमिन व सबस्क्रिप्शन:</h6>
            <ul class="list-group list-group-flush border-top border-bottom mb-3">
              <li class="list-group-item d-flex justify-content-between px-0">
                <span class="text-muted">सरपंच नाव:</span>
                <span class="fw-bold text-dark">{{ viewingGP.sarpanchName }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between px-0">
                <span class="text-muted">संपर्क क्रमांक:</span>
                <span class="fw-bold text-dark">{{ viewingGP.contactNo }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between px-0">
                <span class="text-muted">चालू प्लॅन:</span>
                <span class="badge bg-warning text-dark">{{ viewingGP.activePlan }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between px-0">
                <span class="text-muted">मासिक शुल्क:</span>
                <span class="fw-bold text-success">₹{{ viewingGP.monthlyFee }}/महिना</span>
              </li>
            </ul>

            <div class="text-end">
              <button class="btn btn-secondary btn-sm rounded-pill px-4" @click="viewingGP = null">बंद करा</button>
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

const { panchayats, deletePanchayat } = useMockData();

const searchQuery = ref('');
const selectedDistrict = ref('');
const selectedPlan = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;
const activeActionMenuId = ref<string | null>(null);
const viewingGP = ref<any>(null);

const filteredPanchayats = computed(() => {
  return panchayats.value.filter(gp => {
    const matchesSearch = 
      !searchQuery.value ||
      gp.nameMr.includes(searchQuery.value) ||
      gp.nameEn.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      gp.code.includes(searchQuery.value) ||
      gp.taluka.includes(searchQuery.value) ||
      gp.sarpanchName.includes(searchQuery.value);

    const matchesDistrict = !selectedDistrict.value || gp.district === selectedDistrict.value;
    const matchesPlan = !selectedPlan.value || gp.activePlan === selectedPlan.value;
    const matchesStatus = !selectedStatus.value || gp.status === selectedStatus.value;

    return matchesSearch && matchesDistrict && matchesPlan && matchesStatus;
  });
});

const totalPages = computed(() => Math.ceil(filteredPanchayats.value.length / itemsPerPage) || 1);

const paginatedPanchayats = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPanchayats.value.slice(start, start + itemsPerPage);
});

function toggleActionMenu(id: string) {
  activeActionMenuId.value = activeActionMenuId.value === id ? null : id;
}

function viewDetails(gp: any) {
  viewingGP.value = gp;
  activeActionMenuId.value = null;
}

function editGP(gp: any) {
  alert(`ग्रामपंचायत [${gp.nameMr}] संपादन फॉर्म उघडला.`);
  activeActionMenuId.value = null;
}

function toggleStatus(gp: any, newStatus: 'Active' | 'Suspended') {
  gp.status = newStatus;
  alert(`ग्रामपंचायत [${gp.nameMr}] ची स्थिती [${newStatus}] करण्यात आली.`);
  activeActionMenuId.value = null;
}

function confirmDelete(id: string) {
  if (confirm('नक्की ही ग्रामपंचायत हटवायची आहे का?')) {
    deletePanchayat(id);
  }
  activeActionMenuId.value = null;
}
</script>
