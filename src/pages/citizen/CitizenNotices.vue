<template>
  <div>
    <DashboardHeader title="सूचना फलक व जाहिरनामे (Notices)" subtitle="ग्रामपंचायतीचे अधिकृत जाहीरनामे, टेंडर व महत्त्वाच्या सूचना" />

    <!-- Filter & Search Controls -->
    <div class="eg-card p-3 my-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div class="btn-group font-sans">
        <button 
          class="btn btn-sm" 
          :class="activeCategory === 'ALL' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeCategory = 'ALL'"
        >
          सर्व सूचना
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeCategory === 'Notice' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeCategory = 'Notice'"
        >
          जाहीर सूचना
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeCategory === 'Tender' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeCategory = 'Tender'"
        >
          निविदा (Tenders)
        </button>
        <button 
          class="btn btn-sm" 
          :class="activeCategory === 'Meeting' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="activeCategory = 'Meeting'"
        >
          बैठक / ग्रामसभा
        </button>
      </div>

      <div class="input-group input-group-sm" style="max-width: 280px;">
        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
        <input type="text" v-model="searchQuery" class="form-control border-start-0" placeholder="सूचना शोधा..." />
      </div>
    </div>

    <!-- Notices List -->
    <div class="row g-3">
      <div v-for="notice in filteredNotices" :key="notice.id" class="col-md-6">
        <div class="eg-card h-100 p-4 border hover-shadow transition-all d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span 
                class="badge font-sans text-xs"
                :class="{
                  'bg-danger text-white': notice.isUrgent,
                  'bg-success bg-opacity-10 text-success border border-success border-opacity-25': !notice.isUrgent
                }"
              >
                <i v-if="notice.isUrgent" class="bi bi-exclamation-circle-fill me-1"></i>
                {{ notice.categoryMr || notice.category || 'सूचना' }}
              </span>
              <span class="text-xs text-muted font-sans">
                <i class="bi bi-calendar3 me-1"></i>{{ notice.publishDate }}
              </span>
            </div>

            <h5 class="fw-bold text-dark mb-2" style="font-family: var(--font-marathi);">{{ notice.titleMr }}</h5>
            <p class="text-xs text-muted font-sans line-clamp-3 mb-3">{{ notice.contentMr }}</p>
          </div>

          <div class="pt-3 border-top d-flex justify-content-between align-items-center font-sans">
            <span class="text-xs text-muted">
              जारीकर्ता: <strong>{{ notice.issuedByMr || 'ग्रामपंचायत प्रशासन' }}</strong>
            </span>
            <button class="btn btn-sm btn-outline-success rounded-pill px-3 text-xs fw-bold" @click="viewNotice(notice)">
              <i class="bi bi-file-earmark-pdf me-1"></i> वाचा व डाऊनलोड
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredNotices.length === 0" class="col-12">
        <div class="eg-card p-5 text-center text-muted">
          <i class="bi bi-megaphone fs-1 d-block text-secondary mb-2"></i>
          <h5>कोणतीही सूचना सापडली नाही</h5>
        </div>
      </div>
    </div>

    <!-- Notice View Modal -->
    <div v-if="selectedNotice" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-megaphone-fill me-2"></i>अधिकृत जाहीरनामे
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedNotice = null"></button>
          </div>
          <div class="modal-body p-4 font-sans">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                {{ selectedNotice.categoryMr || 'सार्वजनिक सूचना' }}
              </span>
              <small class="text-muted">तारीख: {{ selectedNotice.publishDate }}</small>
            </div>

            <h5 class="fw-bold text-dark my-3" style="font-family: var(--font-marathi);">{{ selectedNotice.titleMr }}</h5>
            <p class="text-sm text-secondary bg-light p-3 rounded border mb-3" style="line-height: 1.7;">
              {{ selectedNotice.contentMr }}
            </p>

            <div class="text-xs text-muted border-top pt-2">
              <strong>ग्रामपंचायत आदेशानुसार:</strong> {{ selectedNotice.issuedByMr || 'सरपंच / ग्रामविकास अधिकारी' }}
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="selectedNotice = null">बंद करा</button>
            <button type="button" class="btn btn-sm btn-success rounded-pill px-4 fw-bold" @click="downloadNoticePdf">
              <i class="bi bi-download me-1"></i> PDF डाऊनलोड करा
            </button>
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

const { notices } = useMockData();

const activeCategory = ref('ALL');
const searchQuery = ref('');
const selectedNotice = ref<any>(null);

const filteredNotices = computed(() => {
  return notices.value.filter(n => {
    const matchesCat = activeCategory.value === 'ALL' || n.category === activeCategory.value;
    const matchesSearch = !searchQuery.value || n.titleMr.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCat && matchesSearch;
  });
});

function viewNotice(notice: any) {
  selectedNotice.value = notice;
}

function downloadNoticePdf() {
  alert('सूचना परिपत्रक (PDF) डाऊनलोड पूर्ण झाले.');
}
</script>
