<template>
  <div>
    <DashboardHeader 
      title="विकास कामे क्षेत्र प्रगती (Development Works Field Operations)" 
      subtitle="ग्रामपंचायत हद्दीतील चालू विकास कामांची प्रत्यक्ष पाहणी, टक्का अद्ययावत व फोटो अपलोड" 
    />

    <!-- Summary Stats Row -->
    <div class="row g-3 my-3 font-sans">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-buildings-fill" label="चालू विकास कामे" :value="devWorks.length.toString()" variant="green" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-pie-chart-fill" label="सरासरी प्रगती" value="62%" variant="gold" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-person-workspace" label="फील्ड निरीक्षक" value="अमित मोरे" variant="blue" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-cash-stack" label="मंजूर निधी (एकूण)" value="₹115 लाख" variant="brown" />
      </div>
    </div>

    <!-- Active Development Works Cards -->
    <div class="eg-card p-4 my-3 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0">
          <i class="bi bi-hammer me-2"></i>असाईन केलेली विकास कामे यादी (Active Field Projects)
        </h6>
        <span class="badge bg-success bg-opacity-10 text-success text-xs">GPS लोकेशन टॅगिंग सक्रिय</span>
      </div>

      <div class="row g-3">
        <div v-for="work in devWorks" :key="work.id" class="col-lg-6">
          <div class="p-3 border rounded-3 bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <!-- Header -->
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 text-xs">
                  {{ work.category }}
                </span>
                <span class="badge bg-warning bg-opacity-25 text-dark text-xs font-sans fw-bold">
                  {{ work.statusMr }}
                </span>
              </div>

              <!-- Title & Budget -->
              <h6 class="fw-bold text-dark mb-1">{{ work.titleMr }}</h6>
              <div class="text-xs text-muted mb-2">
                <i class="bi bi-geo-alt text-success me-1"></i>स्थान: <strong>{{ work.location }}</strong> | ठेकेदार: <strong>{{ work.contractor }}</strong>
              </div>

              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="d-flex justify-content-between text-xs fw-bold mb-1">
                  <span>प्रत्यक्ष प्रगती (Progress):</span>
                  <span class="text-success">{{ work.progressPercent }}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div 
                    class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    :style="{ width: work.progressPercent + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Budget & Timeline Badges -->
              <div class="p-2 bg-light rounded-2 border text-xs mb-3 d-flex justify-content-between flex-wrap gap-2">
                <span>निधी मंजूर: <strong>₹{{ work.budgetLakhs }} लाख</strong> ({{ work.fundSource }})</span>
                <span>अंतिम मुदत: <strong class="text-danger">{{ work.expectedCompletion }}</strong></span>
              </div>

              <!-- Site Photo Preview -->
              <div class="mb-3">
                <span class="text-xs text-muted d-block mb-1"><i class="bi bi-camera me-1"></i>अद्ययावत साईट फोटो:</span>
                <img :src="work.photoUrl" class="rounded border img-fluid w-100" style="max-height: 130px; object-fit: cover;" alt="Site Photo" />
              </div>
            </div>

            <!-- Action Button -->
            <div class="pt-2 border-top d-flex justify-content-end">
              <button class="btn btn-sm btn-success rounded-pill px-3 text-xs fw-bold" @click="openWorkUpdateModal(work)">
                <i class="bi bi-pencil-square me-1"></i> प्रगती % व साईट फोटो अपडेट करा
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Work Progress Modal -->
    <div v-if="selectedWork" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <h5 class="fw-bold text-success mb-2">
            <i class="bi bi-pencil-square me-2"></i>विकास काम प्रगती अद्ययावत करा
          </h5>
          <p class="text-xs text-muted mb-3">{{ selectedWork.titleMr }} ({{ selectedWork.location }})</p>

          <form @submit.prevent="saveWorkUpdate">
            <!-- Progress Slider -->
            <div class="mb-3">
              <div class="d-flex justify-content-between text-xs fw-bold mb-1">
                <label>कामाचा टक्का निवडा (%) *</label>
                <span class="text-success fs-6">{{ newProgress }}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" v-model.number="newProgress" class="form-range" />
            </div>

            <!-- Material & Labor Status Grid -->
            <div class="row g-2 mb-3">
              <div class="col-6">
                <label class="form-label text-xs fw-bold">साहित्य स्थिती (Material) *</label>
                <select v-model="materialStatus" class="form-select text-xs">
                  <option value="Available">उपलब्ध (Available)</option>
                  <option value="Shortage">मटेरियल तुटवडा (Shortage)</option>
                  <option value="Delivered">नवीन स्टॉक प्राप्त (Delivered)</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label text-xs fw-bold">कामगार स्थिती (Labor) *</label>
                <select v-model="laborStatus" class="form-select text-xs">
                  <option value="Active">कामगार कार्यरत (Active)</option>
                  <option value="On Hold">काम तात्पुरते थांबवले (On Hold)</option>
                  <option value="Completed">काम पूर्ण (Completed)</option>
                </select>
              </div>
            </div>

            <!-- Site Photo Upload -->
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">प्रत्यक्ष कामाचा नवीन साईट फोटो अपलोड करा *</label>
              <div class="border rounded p-3 text-center bg-light">
                <input type="file" class="form-control text-xs mb-2" accept="image/*" @change="handleSitePhoto" />
                <small class="text-muted text-xs d-block">GPS व टाईमस्टॅम्पसह फोटो ऑटो-टॅग होईल.</small>
              </div>
            </div>

            <!-- Daily Work Log Note -->
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">दैनिक कामाचा अहवाल / प्रगती टीप *</label>
              <textarea 
                v-model="workNote" 
                rows="3" 
                class="form-control text-xs" 
                required 
                placeholder="उदा. आज सिमेंट काँक्रीटीकरणाचे ५० मीटरचे काम पूर्ण झाले. क्युअरिंग चे काम सुरू आहे."
              ></textarea>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-light rounded-pill px-3 text-xs" @click="selectedWork = null">रद्द करा</button>
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
import { ref } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';
import type { DevelopmentWork } from '../../data/mockData';

const { devWorks, updateWorkProgress } = useMockData();

const selectedWork = ref<DevelopmentWork | null>(null);
const newProgress = ref(50);
const materialStatus = ref('Available');
const laborStatus = ref('Active');
const workNote = ref('');
const newPhotoUrl = ref('');

function openWorkUpdateModal(work: DevelopmentWork) {
  selectedWork.value = work;
  newProgress.value = work.progressPercent;
  workNote.value = 'प्रत्यक्ष घटनास्थळी पाहणी करून कामाची प्रगती नोंदवली.';
}

function handleSitePhoto(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    newPhotoUrl.value = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80';
  }
}

function saveWorkUpdate() {
  if (selectedWork.value) {
    const status: DevelopmentWork['status'] = newProgress.value === 100 ? 'Completed' : 'In Progress';
    updateWorkProgress(selectedWork.value.id, newProgress.value, workNote.value, newPhotoUrl.value || undefined, status);
    
    alert(`विकास काम ${selectedWork.value.titleMr} ची प्रगती ${newProgress.value}% यशस्वीरित्या अपडेट केली.`);
    selectedWork.value = null;
  }
}
</script>
