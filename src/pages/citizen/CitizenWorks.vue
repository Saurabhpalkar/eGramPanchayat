<template>
  <div>
    <DashboardHeader title="विकास कामे (Development Works)" subtitle="आपल्या गावातील प्रगतीपथावर आणि पूर्ण झालेली विकास कामे" />

    <!-- Summary Banner -->
    <div class="row g-3 my-3">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-buildings" label="एकूण विकास कामे" :value="devWorks.length" variant="green" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-clock-history" label="प्रगतीपथावर कामे" :value="inProgressCount" variant="blue" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-check-circle-fill" label="पूर्ण झालेली कामे" :value="completedCount" variant="gold" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-cash-stack" label="एकूण मंजूर बजेट" :value="'₹' + (totalBudget / 100000).toFixed(1) + ' लाख'" variant="red" />
      </div>
    </div>

    <!-- Filter Buttons -->
    <div class="eg-card p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div class="btn-group font-sans">
        <button 
          class="btn btn-sm" 
          :class="filterStatus === 'ALL' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="filterStatus = 'ALL'"
        >
          सर्व कामे ({{ devWorks.length }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="filterStatus === 'In Progress' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="filterStatus = 'In Progress'"
        >
          प्रगतीपथावर ({{ inProgressCount }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="filterStatus === 'Completed' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="filterStatus = 'Completed'"
        >
          पूर्ण झालेले ({{ completedCount }})
        </button>
      </div>

      <!-- Search Input -->
      <div class="input-group input-group-sm" style="max-width: 280px;">
        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="form-control border-start-0" 
          placeholder="कामाचे नाव किंवा वॉर्ड शोधा..." 
        />
      </div>
    </div>

    <!-- Works Grid -->
    <div class="row g-3">
      <div v-for="work in filteredWorks" :key="work.id" class="col-md-6 col-lg-4">
        <div class="eg-card h-100 p-0 overflow-hidden d-flex flex-column border hover-shadow transition-all">
          <!-- Work Photo Header -->
          <div class="position-relative bg-light" style="height: 180px; overflow: hidden;">
            <img 
              :src="work.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80'" 
              class="w-100 h-100 object-fit-cover" 
              :alt="work.titleMr"
            />
            <div class="position-absolute top-0 start-0 m-2">
              <span class="badge bg-dark bg-opacity-75 text-white font-sans text-xs">
                <i class="bi bi-geo-alt-fill text-warning me-1"></i>वॉर्ड नं. {{ work.wardNo }}
              </span>
            </div>
            <div class="position-absolute top-0 end-0 m-2">
              <span 
                class="badge text-xs font-sans fw-bold px-2 py-1 shadow-sm"
                :class="{
                  'bg-success': work.status === 'Completed',
                  'bg-warning text-dark': work.status === 'In Progress',
                  'bg-info text-dark': work.status === 'Sanctioned'
                }"
              >
                {{ work.statusMr || work.status }}
              </span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-3 d-flex flex-column flex-grow-1">
            <h6 class="fw-bold text-dark mb-2 lh-sm" style="font-family: var(--font-marathi);">{{ work.titleMr }}</h6>
            <p class="text-xs text-muted mb-3 line-clamp-2 font-sans">{{ work.descriptionMr }}</p>

            <!-- Progress Bar -->
            <div class="mb-3 bg-light p-2 rounded border">
              <div class="d-flex justify-content-between text-xs fw-bold font-sans mb-1">
                <span>प्रगती (Progress):</span>
                <span :class="work.progressPercent === 100 ? 'text-success' : 'text-primary'">{{ work.progressPercent }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar progress-bar-striped progress-bar-animated" 
                  :class="work.progressPercent === 100 ? 'bg-success' : 'bg-success bg-gradient'"
                  role="progressbar" 
                  :style="{ width: work.progressPercent + '%' }"
                ></div>
              </div>
            </div>

            <!-- Details Table -->
            <div class="text-xs font-sans text-muted border-top pt-2 mt-auto d-flex flex-column gap-1">
              <div class="d-flex justify-content-between">
                <span>मंजूर निधी:</span>
                <strong class="text-dark">₹{{ work.estimatedCost?.toLocaleString('en-IN') }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span>कंत्राटदार / संस्था:</span>
                <span class="text-dark">{{ work.contractorName || 'ग्रामपंचायत विभाग' }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>अपेक्षित पूर्णता:</span>
                <span class="text-dark">{{ work.completionDate }}</span>
              </div>
            </div>

            <!-- Citizen Interaction / Feedback -->
            <div class="mt-3 pt-2 border-top d-flex gap-2">
              <button 
                class="btn btn-sm btn-outline-success w-100 rounded-pill text-xs font-sans fw-semibold"
                @click="openDetailModal(work)"
              >
                <i class="bi bi-info-circle me-1"></i> सविस्तर माहिती व अभिप्राय
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredWorks.length === 0" class="col-12">
        <div class="eg-card p-5 text-center text-muted">
          <i class="bi bi-inbox fs-1 d-block text-secondary mb-2"></i>
          <h5>कोणतीही विकास कामे सापडली नाहीत</h5>
          <p class="text-xs">कृपया शोधशब्द बदलून प्रयत्न करा.</p>
        </div>
      </div>
    </div>

    <!-- Detail & Feedback Modal -->
    <div v-if="selectedWork" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-buildings me-2"></i>{{ selectedWork.titleMr }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedWork = null"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <img :src="selectedWork.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80'" class="img-fluid rounded-3 border w-100 object-fit-cover" style="max-height: 220px;" />
              </div>
              <div class="col-md-6 font-sans">
                <div class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-2">
                  वार्ड क्र. {{ selectedWork.wardNo }}
                </div>
                <p class="text-sm text-dark mb-3">{{ selectedWork.descriptionMr }}</p>
                
                <ul class="list-group list-group-flush text-xs">
                  <li class="list-group-item d-flex justify-content-between px-0">
                    <span class="text-muted">कामाची सद्यस्थिती:</span>
                    <strong class="text-success">{{ selectedWork.statusMr }} ({{ selectedWork.progressPercent }}%)</strong>
                  </li>
                  <li class="list-group-item d-flex justify-content-between px-0">
                    <span class="text-muted">मंजूर खर्च (Budget):</span>
                    <strong class="text-dark">₹{{ selectedWork.estimatedCost?.toLocaleString('en-IN') }}</strong>
                  </li>
                  <li class="list-group-item d-flex justify-content-between px-0">
                    <span class="text-muted">कामाची योजना/निधी:</span>
                    <span>१५ वा वित्त आयोग / Gram Nidhi</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between px-0">
                    <span class="text-muted">सुरुवात तारीख:</span>
                    <span>{{ selectedWork.startDate || '01 Jan 2026' }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between px-0">
                    <span class="text-muted">अपेक्षित पूर्णता:</span>
                    <span>{{ selectedWork.completionDate }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Citizen Feedback Input -->
            <div class="bg-light p-3 rounded-3 border mt-3 font-sans">
              <h6 class="fw-bold text-success mb-2"><i class="bi bi-chat-left-text me-1"></i> या कामावर तुमचा अभिप्राय द्या (Citizen Feedback)</h6>
              <div class="mb-2">
                <textarea v-model="feedbackText" class="form-control text-xs" rows="2" placeholder="कामांविषयी तुमचे मत, गुणवत्ता किंवा काही अडचण असल्यास लिहा..."></textarea>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-1 text-xs text-muted">
                  <span>गुणवत्ता रेटिंग:</span>
                  <i 
                    v-for="star in 5" 
                    :key="star" 
                    class="bi fs-6 cursor-pointer"
                    :class="star <= rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                    @click="rating = star"
                  ></i>
                </div>
                <button class="btn btn-sm btn-success rounded-pill px-3 font-sans" @click="submitFeedback">
                  अभिप्राय सबमिट करा
                </button>
              </div>
              <div v-if="feedbackSubmitted" class="alert alert-success mt-2 py-1 px-2 text-xs mb-0">
                <i class="bi bi-check-circle me-1"></i> धन्यवाद! तुमचा अभिप्राय ग्रामपंचायतीकडे नोंदवला गेला आहे.
              </div>
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-4" @click="selectedWork = null">बंद करा</button>
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
import StatsCard from '../../components/common/StatsCard.vue';

const { devWorks } = useMockData();

const filterStatus = ref<'ALL' | 'In Progress' | 'Completed'>('ALL');
const searchQuery = ref('');
const selectedWork = ref<any>(null);
const feedbackText = ref('');
const rating = ref(5);
const feedbackSubmitted = ref(false);

const inProgressCount = computed(() => devWorks.value.filter(w => w.status === 'In Progress').length);
const completedCount = computed(() => devWorks.value.filter(w => w.status === 'Completed').length);
const totalBudget = computed(() => devWorks.value.reduce((acc, w) => acc + (w.estimatedCost || 0), 0));

const filteredWorks = computed(() => {
  return devWorks.value.filter(w => {
    const matchesStatus = filterStatus.value === 'ALL' || w.status === filterStatus.value;
    const matchesSearch = !searchQuery.value || 
      w.titleMr.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      w.wardNo.toString().includes(searchQuery.value);
    return matchesStatus && matchesSearch;
  });
});

function openDetailModal(work: any) {
  selectedWork.value = work;
  feedbackText.value = '';
  rating.value = 5;
  feedbackSubmitted.value = false;
}

function submitFeedback() {
  if (!feedbackText.value.trim()) return;
  feedbackSubmitted.value = true;
  setTimeout(() => {
    feedbackSubmitted.value = false;
    feedbackText.value = '';
  }, 2500);
}
</script>
