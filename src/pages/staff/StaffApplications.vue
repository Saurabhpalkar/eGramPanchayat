<template>
  <div>
    <DashboardHeader 
      title="प्रलंबित अर्ज प्रक्रिया (Pending Applications)" 
      subtitle="ग्रामपंचायत नागरिकांचे दाखले, अर्ज पडताळणी व मंजुरी प्रक्रिया" 
    />

    <!-- Filter & Search Bar -->
    <div class="eg-card p-3 my-3 font-sans">
      <div class="row g-2 align-items-center">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control border-start-0" 
              placeholder="अर्ज क्र, नागरिक नाव किंवा मोबाईल..." 
            />
          </div>
        </div>
        <div class="col-md-3">
          <select v-model="filterStatus" class="form-select">
            <option value="All">सर्व स्थिती (All Status)</option>
            <option value="Pending Verification">कागदपत्र तपासणी प्रक्रियेत</option>
            <option value="Document Approved">कागदपत्रे मंजूर</option>
            <option value="Certificate Generated">दाखला मंजूर व तयार</option>
            <option value="Rejected">नाकारलेले अर्ज</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filterService" class="form-select">
            <option value="All">सर्व दाखले / सेवा</option>
            <option v-for="srv in services" :key="srv.id" :value="srv.nameMr">{{ srv.nameMr }}</option>
          </select>
        </div>
        <div class="col-md-2 text-end">
          <button class="btn btn-outline-secondary w-100 rounded-3 text-xs" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i> रिसेट
          </button>
        </div>
      </div>
    </div>

    <!-- Processing Table -->
    <div class="eg-card p-4 my-3 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0">
          <i class="bi bi-journal-check me-2"></i>एकूण प्राप्त अर्ज ({{ filteredApps.length }})
        </h6>
        <span class="badge bg-success bg-opacity-10 text-success text-xs">SLA ट्रॅकिंग सुरू</span>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>अर्ज आयडी</th>
            <th>नागरिक व मोबाईल</th>
            <th>मागणी केलेला दाखला</th>
            <th>गाव / वॉर्ड</th>
            <th>दाखल तारीख</th>
            <th>प्राधान्य (Priority)</th>
            <th>स्थिती</th>
            <th>क्रिया (Actions)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="app in filteredApps" :key="app.id">
            <td>
              <strong class="text-success">{{ app.applicationNo }}</strong>
            </td>
            <td>
              <div class="fw-bold">{{ app.citizenName }}</div>
              <small class="text-muted text-xs"><i class="bi bi-telephone me-1"></i>{{ app.phone }}</small>
            </td>
            <td>
              <div class="fw-bold text-xs">{{ app.serviceNameMr }}</div>
              <small class="text-muted text-xs">शुल्क: ₹{{ app.amount }} ({{ app.paymentStatus }})</small>
            </td>
            <td>शिवणे (वॉर्ड ३)</td>
            <td>
              <div>{{ app.appliedDate }}</div>
              <small class="text-danger fw-bold text-xs">Due: {{ app.dueDate }}</small>
            </td>
            <td>
              <span class="badge bg-warning bg-opacity-10 text-dark border border-warning border-opacity-25 text-xs">
                उच्च प्राधान्य (High)
              </span>
            </td>
            <td>
              <StatusBadge :status="app.status" :text="app.statusMr" />
            </td>
            <td>
              <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-sm btn-outline-success rounded-pill text-xs px-2" @click="openDetailModal(app)">
                  <i class="bi bi-eye me-1"></i> पहा
                </button>
                <button class="btn btn-sm btn-success rounded-pill text-xs px-2" @click="openDetailModal(app)">
                  <i class="bi bi-file-earmark-check me-1"></i> पडताळणी
                </button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill text-xs px-2" @click="forwardToAdminModal(app)">
                  <i class="bi bi-send me-1"></i> फॉरवर्ड
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredApps.length === 0">
            <td colspan="8" class="text-center py-4 text-muted">
              कोणतेही अर्ज सापडले नाहीत.
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- Application Details & Processing Modal -->
    <div v-if="selectedApp" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="fw-bold text-success mb-0">
                <i class="bi bi-file-earmark-text me-2"></i>अर्ज तपशील व प्रक्रिया: {{ selectedApp.applicationNo }}
              </h5>
              <small class="text-muted">दाखला / सेवा: {{ selectedApp.serviceNameMr }}</small>
            </div>
            <button type="button" class="btn-close" @click="selectedApp = null"></button>
          </div>

          <div class="modal-body py-3">
            <!-- Applicant Info Card -->
            <div class="p-3 bg-light rounded-3 border mb-3">
              <h6 class="fw-bold text-success border-bottom pb-2 mb-2 text-xs">१. अर्जदाराची माहिती (Applicant Information)</h6>
              <div class="row g-2 text-xs">
                <div class="col-md-4">
                  <span class="text-muted d-block">नागरिकाचे नाव:</span>
                  <strong>{{ selectedApp.citizenName }}</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block">मोबाईल क्रमांक:</span>
                  <strong>{{ selectedApp.phone }}</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block">आधार क्रमांक:</span>
                  <strong>{{ selectedApp.citizenAadhaar }}</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block">ग्रामपंचायत:</span>
                  <strong>शिवणे ग्रामपंचायत (हवेली, पुणे)</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block">अर्जाची तारीख:</span>
                  <strong>{{ selectedApp.appliedDate }}</strong>
                </div>
                <div class="col-md-4">
                  <span class="text-muted d-block">अपेक्षित अंतिम मुदत (SLA):</span>
                  <strong class="text-danger">{{ selectedApp.dueDate }}</strong>
                </div>
              </div>
            </div>

            <!-- Uploaded Documents Preview & Verification Checklist -->
            <div class="p-3 bg-light rounded-3 border mb-3">
              <h6 class="fw-bold text-success border-bottom pb-2 mb-2 text-xs">२. अपलोड केलेली कागदपत्रे व पडताळणी (Uploaded Documents)</h6>
              
              <div class="d-flex flex-column gap-2">
                <div class="p-2 bg-white rounded border d-flex justify-content-between align-items-center text-xs">
                  <div>
                    <i class="bi bi-file-earmark-person text-success me-2 fs-6"></i>
                    <strong>१. आधार कार्ड (Identity Proof)</strong>
                    <small class="text-muted d-block ms-4">File: citizen_aadhaar_card.pdf (Verified)</small>
                  </div>
                  <div class="d-flex gap-2 align-items-center">
                    <span class="badge bg-success bg-opacity-10 text-success">Verified</span>
                    <button class="btn btn-sm btn-outline-success rounded-pill px-2 py-0 text-xs">पहा</button>
                  </div>
                </div>

                <div class="p-2 bg-white rounded border d-flex justify-content-between align-items-center text-xs">
                  <div>
                    <i class="bi bi-file-earmark-text text-success me-2 fs-6"></i>
                    <strong>२. ७/१२ उतारा किंवा कर पावती (Land / Property Tax)</strong>
                    <small class="text-muted d-block ms-4">File: 7_12_extract_2026.pdf</small>
                  </div>
                  <div class="d-flex gap-2 align-items-center">
                    <span class="badge bg-warning bg-opacity-10 text-dark">तपासणी बाकी</span>
                    <button class="btn btn-sm btn-outline-success rounded-pill px-2 py-0 text-xs">पहा</button>
                  </div>
                </div>

                <div class="p-2 bg-white rounded border d-flex justify-content-between align-items-center text-xs">
                  <div>
                    <i class="bi bi-file-earmark-medical text-success me-2 fs-6"></i>
                    <strong>३. स्वयंघोषणा पत्र (Income Self Declaration Form)</strong>
                    <small class="text-muted d-block ms-4">File: self_declaration_signed.pdf</small>
                  </div>
                  <div class="d-flex gap-2 align-items-center">
                    <span class="badge bg-success bg-opacity-10 text-success">Verified</span>
                    <button class="btn btn-sm btn-outline-success rounded-pill px-2 py-0 text-xs">पहा</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Internal Staff Notes & Action Form -->
            <div class="p-3 bg-light rounded-3 border mb-3">
              <h6 class="fw-bold text-success border-bottom pb-2 mb-2 text-xs">३. कर्मचाऱ्यांचा अभिप्राय व टीप (Internal Verification Notes)</h6>
              <textarea 
                v-model="internalNote" 
                rows="3" 
                class="form-control text-xs mb-2" 
                placeholder="उदा. सर्व कागदपत्रे व ७/१२ उतारा पडताळणीमध्ये बरोबर आढळले आहेत. दाखला मंजूर करण्यास हरकत नाही."
              ></textarea>
            </div>

            <!-- Timeline History -->
            <div class="p-3 bg-light rounded-3 border">
              <h6 class="fw-bold text-success border-bottom pb-2 mb-2 text-xs">४. अर्ज इतिहास (Timeline History)</h6>
              <div class="text-xs text-muted d-flex flex-column gap-1">
                <div><i class="bi bi-check-circle-fill text-success me-1"></i> <strong>{{ selectedApp.appliedDate }}:</strong> अर्जाची नोंदणी व पेमेंट ऑनलाईन प्राप्त (₹{{ selectedApp.amount }})</div>
                <div><i class="bi bi-clock-history me-1 text-primary"></i> <strong>२९ जुलै २०२६:</strong> कर्मचाऱ्यांकडे कागदपत्र पडताळणीसाठी वर्ग असाईन केले.</div>
              </div>
            </div>
          </div>

          <div class="modal-footer border-0 pt-0 d-flex justify-content-between">
            <button type="button" class="btn btn-outline-danger rounded-pill px-3 text-xs" @click="handleReject(selectedApp.id)">
              <i class="bi bi-x-circle me-1"></i> अर्ज नाकारा (Reject)
            </button>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-warning text-dark rounded-pill px-3 text-xs" @click="handleRequestDocs">
                <i class="bi bi-arrow-repeat me-1"></i> कागदपत्रे पुन्हा मागवा
              </button>
              <button type="button" class="btn btn-primary rounded-pill px-3 text-xs" @click="handleForwardGramSevak(selectedApp.id)">
                <i class="bi bi-send me-1"></i> ग्रामसेवकांकडे फॉरवर्ड करा
              </button>
              <button type="button" class="btn btn-eg-primary rounded-pill px-4 text-xs fw-bold" @click="handleApprove(selectedApp.id)">
                <i class="bi bi-check-lg me-1"></i> दाखला मंजूर व जनरेट करा
              </button>
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
import StatusBadge from '../../components/common/StatusBadge.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';
import type { CitizenApplication } from '../../data/mockData';

const { citizenApplications, services, updateApplicationStatus } = useMockData();

const searchQuery = ref('');
const filterStatus = ref('All');
const filterService = ref('All');
const selectedApp = ref<CitizenApplication | null>(null);
const internalNote = ref('');

const filteredApps = computed(() => {
  return citizenApplications.value.filter(app => {
    const matchesSearch = 
      app.applicationNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.citizenName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.phone.includes(searchQuery.value);

    const matchesStatus = filterStatus.value === 'All' || app.status === filterStatus.value;
    const matchesService = filterService.value === 'All' || app.serviceNameMr === filterService.value;

    return matchesSearch && matchesStatus && matchesService;
  });
});

function resetFilters() {
  searchQuery.value = '';
  filterStatus.value = 'All';
  filterService.value = 'All';
}

function openDetailModal(app: CitizenApplication) {
  selectedApp.value = app;
  internalNote.value = 'सर्व कागदपत्रे बरोबर असून दाखला देण्यास योग्य.';
}

function forwardToAdminModal(app: CitizenApplication) {
  alert(`अर्ज ${app.applicationNo} ग्रामसेवक / सरपंचांच्या मंजुरीसाठी यशस्वीरित्या पाठवला गेला आहे.`);
  updateApplicationStatus(app.id, 'Pending Verification', 'ग्रामसेवक मंजुरीसाठी वर्ग', 'अमित मोरे (लिपिक)');
}

function handleApprove(id: string) {
  updateApplicationStatus(id, 'Certificate Generated', 'दाखला मंजूर व तयार', 'अमित मोरे (लिपिक)');
  alert('दाखला यशस्वीरित्या मंजूर झाला असून नागरिकाच्या खात्यावर उपलब्ध केला आहे.');
  selectedApp.value = null;
}

function handleReject(id: string) {
  updateApplicationStatus(id, 'Rejected', 'अर्ज नाकारण्यात आला', 'अमित मोरे (लिपिक)');
  alert('अर्ज नाकारल्याची नोंद करण्यात आली आहे.');
  selectedApp.value = null;
}

function handleRequestDocs() {
  alert('नागरिकाला कागदपत्र पुन्हा अपलोड करण्यासाठी SMS व WhatsApp संदेश पाठवला.');
}

function handleForwardGramSevak(id: string) {
  updateApplicationStatus(id, 'Pending Verification', 'ग्रामसेवक मंजुरीसाठी वर्ग', 'अमित मोरे (लिपिक)');
  alert('ग्रामसेवकांकडे मंजुरीसाठी अर्ज पाठवला गेला.');
  selectedApp.value = null;
}
</script>
