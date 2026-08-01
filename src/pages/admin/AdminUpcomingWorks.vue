<template>
  <div>
    <DashboardHeader title="प्रस्तावित व आगामी प्रकल्प नियोजन (Upcoming Works)" subtitle="ग्रामसभेत मंजूर पुढील ३ वर्षांचे नियोजित प्रकल्प" />

    <div class="eg-card p-4 my-3 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0">मंजूर आगामी प्रकल्पांची यादी</h6>
        <button class="btn btn-outline-success btn-sm rounded-pill fw-bold">
          <i class="bi bi-plus-circle me-1"></i> नवीन प्रस्ताव नोंदवा
        </button>
      </div>

      <div class="d-flex flex-column gap-3">
        <div v-for="upk in upcomingWorks" :key="upk.id" class="p-3 bg-light rounded-3 border border-start border-4 border-success">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="fw-bold text-success mb-0">{{ upk.titleMr }}</h6>
            <span class="badge bg-warning text-dark text-xs font-sans">{{ upk.approvalStatusMr }}</span>
          </div>
          <p class="text-xs text-muted mb-2 font-sans">प्रस्तावित कालावधी: {{ upk.proposedTimeline }} | प्रकार: {{ upk.category }}</p>
          <div class="d-flex gap-3 text-xs font-sans">
            <div>अंदाजित खर्च: <strong>₹{{ upk.estimatedBudgetLakhs }} लाख</strong></div>
            <div>लाभार्थी: <strong>{{ upk.benefitCitizens.toLocaleString('mr-IN') }}+ नागरिक</strong></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const { upcomingWorks } = useMockData();
</script>
