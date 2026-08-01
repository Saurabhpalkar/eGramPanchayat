<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 900px;">
      <SectionTitle 
        title="प्रस्तावित व आगामी विकास प्रकल्प" 
        subtitle="ग्रामसभेत मंजूर झालेले व आगामी वर्षात राबवले जाणारे पायाभूत सुविधांचे प्रकल्प."
        tag="भविष्यातील नियोजन"
        align="center"
      />

      <div class="d-flex flex-column gap-3 font-sans">
        <div v-for="upk in upcomingWorks" :key="upk.id" class="eg-card p-4 border-start border-4 border-success">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <span class="badge bg-success bg-opacity-10 text-success text-xs font-sans">
              <i class="bi bi-calendar3 me-1"></i> {{ upk.proposedTimeline }}
            </span>
            <span class="badge bg-warning bg-opacity-20 text-dark border border-warning text-xs font-sans">
              {{ upk.approvalStatusMr }}
            </span>
          </div>

          <h5 class="fw-bold text-success mb-1">{{ upk.titleMr }}</h5>
          <small class="text-muted d-block mb-3">{{ upk.titleEn }}</small>

          <div class="row g-2 bg-light p-3 rounded-3 border text-xs">
            <div class="col-6 col-sm-4">
              <span class="text-muted d-block">अंदाजित खर्च (Estimated)</span>
              <strong class="text-dark fs-6">₹{{ upk.estimatedBudgetLakhs }} लाख</strong>
            </div>
            <div class="col-6 col-sm-4">
              <span class="text-muted d-block">लाभार्थी नागरिक</span>
              <strong class="text-success fs-6">{{ upk.benefitCitizens.toLocaleString('mr-IN') }}+ नागरिक</strong>
            </div>
            <div class="col-12 col-sm-4">
              <span class="text-muted d-block">प्रकल्प प्रकार</span>
              <strong class="text-dark fs-6">{{ upk.category }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import SectionTitle from '../../components/common/SectionTitle.vue';

const { upcomingWorks } = useMockData();
</script>
