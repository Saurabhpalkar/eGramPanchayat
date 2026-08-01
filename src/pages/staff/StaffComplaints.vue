<template>
  <div>
    <DashboardHeader 
      title="तक्रार निवारण व फील्ड कामे (Complaint Management)" 
      subtitle="असाईन केलेल्या नागरिकांच्या तक्रारींवर कारवाई, घटनास्थळ पहाणी व स्टेटस अद्ययावत करणे" 
    />

    <!-- Filter & Search Bar -->
    <div class="eg-card p-3 my-3 font-sans">
      <div class="row g-2 align-items-center">
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              v-model="search" 
              class="form-control border-start-0" 
              placeholder="तक्रार आयडी, नाव किंवा वॉर्ड शोधा..." 
            />
          </div>
        </div>
        <div class="col-md-3">
          <select v-model="statusFilter" class="form-select">
            <option value="All">सर्व स्थिती (All Status)</option>
            <option value="Assigned">असाईन केलेली (Assigned)</option>
            <option value="In Process">प्रगतीपथावर (In Progress)</option>
            <option value="Waiting">प्रलंबित / मटेरियल बाकी (Waiting)</option>
            <option value="Resolved">निवारण झाले (Resolved)</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="categoryFilter" class="form-select">
            <option value="All">सर्व श्रेणी (All Categories)</option>
            <option value="गटार व स्वच्छता">गटार व स्वच्छता</option>
            <option value="रस्ते व खड्डे">रस्ते व खड्डे</option>
            <option value="रस्ते दिवे (Street Light)">रस्ते दिवे (Street Light)</option>
            <option value="पिण्याचे पाणी">पिण्याचे पाणी</option>
          </select>
        </div>
        <div class="col-md-2 text-end">
          <button class="btn btn-outline-secondary w-100 rounded-3 text-xs" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i> रिसेट
          </button>
        </div>
      </div>
    </div>

    <!-- Assigned Complaints Grid -->
    <div class="row g-3 my-3 font-sans">
      <div v-for="cmp in filteredComplaints" :key="cmp.id" class="col-md-6 col-lg-6">
        <div class="eg-card p-4 h-100 d-flex flex-column justify-content-between">
          <div>
            <!-- Header Badges -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 font-monospace">
                {{ cmp.ticketId }}
              </span>
              <StatusBadge :status="cmp.status" :text="cmp.statusMr" />
            </div>

            <!-- Title & Description -->
            <h6 class="fw-bold text-dark mb-1">{{ cmp.title }}</h6>
            <p class="text-xs text-muted mb-2">{{ cmp.description }}</p>

            <!-- Metadata Box -->
            <div class="p-2 bg-light rounded-3 border mb-3 text-xs">
              <div class="d-flex justify-content-between mb-1">
                <span><i class="bi bi-person me-1 text-success"></i>नागरिक: <strong>{{ cmp.citizenName }}</strong></span>
                <span><i class="bi bi-telephone me-1 text-success"></i><a :href="'tel:' + cmp.phone" class="text-dark text-decoration-none">{{ cmp.phone }}</a></span>
              </div>
              <div class="d-flex justify-content-between">
                <span><i class="bi bi-geo-alt me-1 text-success"></i>स्थान: <strong>{{ cmp.location }} ({{ cmp.wardNo }})</strong></span>
                <span><i class="bi bi-calendar3 me-1 text-success"></i>तारीख: {{ cmp.createdAt }}</span>
              </div>
            </div>

            <!-- Resolution Photo Preview if Available -->
            <div v-if="cmp.photoUrl" class="mb-3">
              <span class="text-xs text-muted d-block mb-1"><i class="bi bi-image me-1"></i>नागरिकाने पाठवलेला फोटो:</span>
              <img :src="cmp.photoUrl" class="rounded border img-fluid" style="max-height: 120px; object-fit: cover; width: 100%;" alt="Complaint Photo" />
            </div>

            <!-- Timeline Notes -->
            <div class="mb-3">
              <strong class="text-xs text-dark d-block mb-1">कारवाईची नोंद (Log):</strong>
              <div class="p-2 bg-white rounded border text-xs text-muted" style="max-height: 80px; overflow-y: auto;">
                <div v-for="(tl, tIdx) in cmp.timeline" :key="tIdx" class="mb-1">
                  <i class="bi bi-dot text-success"></i> <strong>{{ tl.date }}:</strong> {{ tl.title }}
                  <span v-if="tl.comment" class="d-block ms-2 italic text-dark">- "{{ tl.comment }}"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
            <button class="btn btn-sm btn-outline-warning text-dark rounded-pill px-3 text-xs" @click="escalateModal(cmp)">
              <i class="bi bi-box-arrow-up-right me-1"></i> सरपंचांकडे एस्केलेट करा
            </button>
            <button class="btn btn-sm btn-success rounded-pill px-3 text-xs fw-bold" @click="openStatusModal(cmp)">
              <i class="bi bi-pencil-square me-1"></i> स्टेटस व फोटो अद्ययावत करा
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredComplaints.length === 0" class="col-12 text-center py-5">
        <i class="bi bi-check-circle fs-1 text-success opacity-50 d-block mb-2"></i>
        <h6 class="fw-bold text-muted">कोणतीही प्रलंबित तक्रार सापडली नाही.</h6>
      </div>
    </div>

    <!-- Update Status & Photo Modal -->
    <div v-if="selectedComplaint" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <h5 class="fw-bold text-success mb-2">
            <i class="bi bi-tools me-2"></i>तक्रार निवारण अपडेट: {{ selectedComplaint.ticketId }}
          </h5>
          <p class="text-xs text-muted mb-3">{{ selectedComplaint.title }} ({{ selectedComplaint.location }})</p>

          <form @submit.prevent="saveStatusUpdate">
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">सद्य स्टेटस निवडा (Status) *</label>
              <select v-model="newStatus" class="form-select text-xs" required>
                <option value="In Process">In Progress (काम सुरू आहे)</option>
                <option value="Waiting">Waiting (साहित्य / पाइप्स येणे बाकी)</option>
                <option value="Resolved">Resolved (निवारण पूर्ण झाले)</option>
                <option value="Rejected">Rejected (अयोग्य तक्रार)</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label text-xs fw-bold">घटनास्थळ काम पूर्णतेचा फोटो जोडा (Resolution Photo) *</label>
              <div class="border rounded p-3 text-center bg-light">
                <input type="file" ref="fileInput" class="form-control text-xs mb-2" accept="image/*" @change="handlePhotoUpload" />
                <small class="text-muted text-xs d-block">घटनास्थळाची प्रत्यक्ष पाहणी व दुरुस्तीनंतरचा फोटो अपलोड करा.</small>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-xs fw-bold">कर्मचारी शेरा / कामाचा तपशील (Work Remarks) *</label>
              <textarea 
                v-model="workRemark" 
                rows="3" 
                class="form-control text-xs" 
                required 
                placeholder="उदा. आज सकाळी १० वाजता कर्मचाऱ्यांसह भेट देऊन चोक झालेली वाहिनी साफ करून दुरुस्त करण्यात आली."
              ></textarea>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-light rounded-pill px-3 text-xs" @click="selectedComplaint = null">रद्द करा</button>
              <button type="submit" class="btn btn-eg-primary rounded-pill px-4 text-xs fw-bold">
                <i class="bi bi-check-lg me-1"></i> सेव्ह करा व अपडेट करा
              </button>
            </div>
          </form>
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
import type { ComplaintItem } from '../../data/mockData';

const { complaints, updateComplaintStatus } = useMockData();

const search = ref('');
const statusFilter = ref('All');
const categoryFilter = ref('All');

const selectedComplaint = ref<ComplaintItem | null>(null);
const newStatus = ref<ComplaintItem['status']>('Resolved');
const workRemark = ref('');
const photoFile = ref<string | null>(null);

const filteredComplaints = computed(() => {
  return complaints.value.filter(c => {
    const matchesSearch = 
      c.ticketId.toLowerCase().includes(search.value.toLowerCase()) ||
      c.title.toLowerCase().includes(search.value.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(search.value.toLowerCase()) ||
      c.wardNo.toLowerCase().includes(search.value.toLowerCase());

    const matchesStatus = statusFilter.value === 'All' || c.status === statusFilter.value;
    const matchesCategory = categoryFilter.value === 'All' || c.categoryMr === categoryFilter.value;

    return matchesSearch && matchesStatus && matchesCategory;
  });
});

function resetFilters() {
  search.value = '';
  statusFilter.value = 'All';
  categoryFilter.value = 'All';
}

function openStatusModal(cmp: ComplaintItem) {
  selectedComplaint.value = cmp;
  newStatus.value = cmp.status === 'Resolved' ? 'Resolved' : 'In Process';
  workRemark.value = 'घटनास्थळी पाहणी करून काम पूर्ण करण्यात आले आहे.';
}

function handlePhotoUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    photoFile.value = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80';
  }
}

function saveStatusUpdate() {
  if (selectedComplaint.value) {
    const statusMr = newStatus.value === 'Resolved' ? 'तक्रार निवारण पूर्ण' : newStatus.value === 'In Process' ? 'काम प्रगतीपथावर आहे' : 'साहित्य प्रलंबित';
    updateComplaintStatus(selectedComplaint.value.id, newStatus.value, statusMr, 'अमित मोरे (लिपिक)', workRemark.value);
    
    alert(`तक्रार ${selectedComplaint.value.ticketId} चा स्टेटस यशस्वरित्या अद्ययावत केला गेला.`);
    selectedComplaint.value = null;
  }
}

function escalateModal(cmp: ComplaintItem) {
  alert(`तक्रार ${cmp.ticketId} सरपंच व ग्रामसेवकांकडे विशेष निधी / मंजुरीसाठी एस्केलेट केली.`);
  updateComplaintStatus(cmp.id, 'In Process', 'सरपंच / ग्रामसेवक कक्ष वर्ग', 'अमित मोरे', 'सरपंच मंजुरीसाठी पाठवले.');
}
</script>
