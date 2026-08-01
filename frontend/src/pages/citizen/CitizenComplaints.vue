<template>
  <div>
    <DashboardHeader title="माझ्या तक्रारी (My Complaints)" subtitle="ग्रामपंचायत ऑनलाईन तक्रार निवारण कक्ष" />

    <!-- Action Bar -->
    <div class="eg-card p-3 my-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div class="btn-group font-sans">
        <button 
          class="btn btn-sm" 
          :class="activeFilter === 'ALL' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeFilter = 'ALL'"
        >
          सर्व तक्रारी ({{ complaints.length }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeFilter === 'In Progress' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeFilter = 'In Progress'"
        >
          प्रक्रियेत ({{ inProgressCount }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeFilter === 'Resolved' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeFilter = 'Resolved'"
        >
          निवारण झालेल्या ({{ resolvedCount }})
        </button>
      </div>

      <button class="btn btn-warning btn-sm rounded-pill font-sans fw-bold text-dark px-3 shadow-sm" @click="showRaiseModal = true">
        <i class="bi bi-exclamation-triangle-fill me-1"></i> नवीन तक्रार नोंदवा
      </button>
    </div>

    <!-- Complaints Grid -->
    <div class="row g-3 my-2">
      <div v-for="cmp in filteredComplaints" :key="cmp.id" class="col-md-6">
        <div class="eg-card h-100 p-4 border hover-shadow transition-all d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-light text-dark border font-sans text-xs">
                टिकीट क्र: <strong>{{ cmp.ticketId }}</strong>
              </span>
              <StatusBadge :status="cmp.status" :text="cmp.statusMr" />
            </div>

            <h5 class="fw-bold text-dark mb-1" style="font-family: var(--font-marathi);">{{ cmp.categoryMr }}</h5>
            <div class="text-xs text-muted font-sans mb-2">
              <i class="bi bi-geo-alt text-success me-1"></i>स्थान: {{ cmp.locationMr || 'वार्ड क्र. ३' }} | <i class="bi bi-calendar3 me-1"></i>{{ cmp.createdAt }}
            </div>
            <p class="text-xs text-secondary font-sans line-clamp-2 mb-3">{{ cmp.descriptionMr }}</p>
          </div>

          <div class="pt-2 border-top d-flex justify-content-between align-items-center font-sans">
            <span class="text-xs text-muted">
              कर्मचारी: <strong>{{ cmp.assignedStaff || 'नियुक्त प्रक्रियेत' }}</strong>
            </span>
            <button class="btn btn-sm btn-outline-success rounded-pill px-3 text-xs fw-bold" @click="selectedCmp = cmp">
              निवारण स्थिती पाहा <i class="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredComplaints.length === 0" class="col-12">
        <div class="eg-card p-5 text-center text-muted font-sans">
          <i class="bi bi-check-circle fs-1 text-success d-block mb-2"></i>
          <h5>कोणतीही प्रलंबित तक्रार नाही</h5>
        </div>
      </div>
    </div>

    <!-- Raise Complaint Modal -->
    <div v-if="showRaiseModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-exclamation-triangle me-2"></i>नवीन ऑनलाईन तक्रार नोंदवा
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showRaiseModal = false"></button>
          </div>
          <div class="modal-body p-4 font-sans">
            <form @submit.prevent="submitNewComplaint">
              <div class="mb-3">
                <label class="form-label text-xs fw-bold text-dark">तक्रारीचा प्रकार (Category) <span class="text-danger">*</span></label>
                <select v-model="newComplaint.category" class="form-select text-xs" required>
                  <option value="पिण्याचे पाणी अशुद्ध / अपुरे">पिण्याचे पाणी अशुद्ध / अपुरे</option>
                  <option value="स्ट्रीट लाईट बंद आहे">स्ट्रीट लाईट बंद आहे</option>
                  <option value="कचरा / स्वच्छता अडचण">कचरा / स्वच्छता अडचण</option>
                  <option value="रस्ता खराब / खड्डे">रस्ता खराब / खड्डे</option>
                  <option value="गटार तुंबले आहे">गटार तुंबले आहे</option>
                  <option value="इतर समस्या">इतर समस्या</option>
                </select>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label text-xs fw-bold text-dark">वार्ड क्र. <span class="text-danger">*</span></label>
                  <select v-model="newComplaint.wardNo" class="form-select text-xs" required>
                    <option v-for="w in 6" :key="w" :value="w">वार्ड क्र. {{ w }}</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label text-xs fw-bold text-dark">स्थान / लँडमार्क</label>
                  <input type="text" v-model="newComplaint.location" class="form-control text-xs" placeholder="उदा. मंदिराजवळ, मुख्य गल्ली" required />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label text-xs fw-bold text-dark">तक्रारीचे सविस्तर वर्णन <span class="text-danger">*</span></label>
                <textarea v-model="newComplaint.description" class="form-control text-xs" rows="3" placeholder="समस्येचे सविस्तर वर्णन लिहा..." required></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label text-xs fw-bold text-dark">समस्येचा फोटो (Photo Upload)</label>
                <input type="file" class="form-control form-control-sm text-xs" accept="image/*" />
              </div>

              <div v-if="raiseSuccess" class="alert alert-success py-2 text-xs mb-3">
                <i class="bi bi-check-circle me-1"></i> तक्रार यशस्वीरीत्या दाखल झाली! टिकीट क्रमांक पाठवला आहे.
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showRaiseModal = false">रद्द करा</button>
                <button type="submit" class="btn btn-sm btn-success rounded-pill px-4 fw-bold">तक्रार सबमिट करा</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Complaint Detail & Timeline Modal -->
    <div v-if="selectedCmp" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-card-checklist me-2"></i>तक्रार निवारण तपशील
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedCmp = null"></button>
          </div>
          <div class="modal-body p-4 font-sans">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge bg-light text-dark border">टिकीट क्र: {{ selectedCmp.ticketId }}</span>
              <StatusBadge :status="selectedCmp.status" :text="selectedCmp.statusMr" />
            </div>

            <h5 class="fw-bold text-dark mb-2" style="font-family: var(--font-marathi);">{{ selectedCmp.categoryMr }}</h5>
            <p class="text-xs text-muted mb-3 bg-light p-2.5 rounded border">{{ selectedCmp.descriptionMr }}</p>

            <h6 class="fw-bold text-success mb-2">निवारण टाइमलाईन</h6>
            <div class="list-group list-group-flush text-xs mb-3">
              <div v-for="(tl, idx) in selectedCmp.timeline" :key="idx" class="list-group-item px-0 py-2 d-flex align-items-start gap-2">
                <i class="bi" :class="tl.completed ? 'bi-check-circle-fill text-success' : 'bi-clock text-warning'"></i>
                <div>
                  <strong class="d-block text-dark">{{ tl.title }}</strong>
                  <small class="text-muted">{{ tl.date }}</small>
                  <small v-if="tl.comment" class="d-block text-secondary fst-italic">{{ tl.comment }}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-4" @click="selectedCmp = null">बंद करा</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useMockData } from '../../composables/useMockData';
import { useAuth } from '../../composables/useAuth';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';

const { complaints, addComplaint } = useMockData();
const { user } = useAuth();

const activeFilter = ref('ALL');
const showRaiseModal = ref(false);
const selectedCmp = ref<any>(null);
const raiseSuccess = ref(false);

const inProgressCount = computed(() => complaints.value.filter(c => c.status !== 'Resolved').length);
const resolvedCount = computed(() => complaints.value.filter(c => c.status === 'Resolved').length);

const filteredComplaints = computed(() => {
  return complaints.value.filter(c => {
    if (activeFilter.value === 'In Progress') return c.status !== 'Resolved';
    if (activeFilter.value === 'Resolved') return c.status === 'Resolved';
    return true;
  });
});

const newComplaint = reactive({
  category: 'पिण्याचे पाणी अशुद्ध / अपुरे',
  wardNo: 3,
  location: '',
  description: ''
});

function submitNewComplaint() {
  addComplaint({
    categoryMr: newComplaint.category,
    citizenName: user.value.name || 'रामचंद्र पाटील',
    citizenPhone: user.value.mobile || '9822334455',
    locationMr: `वार्ड क्र. ${newComplaint.wardNo}, ${newComplaint.location}`,
    descriptionMr: newComplaint.description
  });

  raiseSuccess.value = true;
  setTimeout(() => {
    raiseSuccess.value = false;
    showRaiseModal.value = false;
    newComplaint.location = '';
    newComplaint.description = '';
  }, 1500);
}
</script>
