<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container">
      <SectionTitle 
        title="ग्रामपंचायत विकास कामे व पायाभूत सुविधा" 
        subtitle="गावातील रस्ते, पाणीपुरवठा योजना, सौरऊर्जा प्रकल्प, शाळा व आरोग्य केंद्र इमारतींच्या कामाची पारदर्शक माहिती."
        tag="विकास कामे मॉनिटरिंग"
        align="center"
      />

      <!-- Filter Bar -->
      <div class="eg-card p-3 mb-4 font-sans">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div class="d-flex gap-2">
            <button 
              v-for="st in ['सर्व कामे', 'प्रगतीपथावर', 'पूर्ण झाले']" 
              :key="st" 
              class="btn btn-sm rounded-pill px-3"
              :class="selectedStatus === st ? 'btn-eg-primary' : 'btn-outline-secondary'"
              @click="selectedStatus = st"
            >
              {{ st }}
            </button>
          </div>
          <div class="text-xs text-muted">
            एकूण विकास कामे: <strong>{{ filteredWorks.length }}</strong>
          </div>
        </div>
      </div>

      <!-- Development Works Grid -->
      <div class="row g-4">
        <div v-for="work in filteredWorks" :key="work.id" class="col-md-6 col-lg-4">
          <WorkCard :work="work" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockData } from '../../composables/useMockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import WorkCard from '../../components/cards/WorkCard.vue';

const { devWorks } = useMockData();
const selectedStatus = ref('सर्व कामे');

const filteredWorks = computed(() => {
  return devWorks.value.filter(w => {
    if (selectedStatus.value === 'प्रगतीपथावर') return w.status === 'In Progress';
    if (selectedStatus.value === 'पूर्ण झाले') return w.status === 'Completed';
    return true;
  });
});
</script>
