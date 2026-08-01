<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 900px;">
      <SectionTitle 
        title="ग्रामसभा व सार्वजनिक बैठका" 
        subtitle="ग्रामसभेचे वेळापत्रक, विषय पत्रिका (Agenda), इतिवृत्त (Minutes) व उपस्थिती नोंदी."
        tag="लोकशाही व्यासपीठ"
        align="center"
      />

      <div class="d-flex flex-column gap-4">
        <div v-for="sabha in gramSabhaMeetings" :key="sabha.id" class="eg-card p-4">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 border-bottom pb-3">
            <div>
              <span class="badge bg-success text-white font-sans text-xs mb-1">{{ sabha.meetingNumber }}</span>
              <h4 class="fw-bold text-success mb-0">{{ sabha.titleMr }}</h4>
            </div>
            <StatusBadge :status="sabha.status === 'Upcoming' ? 'process' : 'resolved'" :text="sabha.status === 'Upcoming' ? 'आगामी सभा' : 'संपन्न झाली'" />
          </div>

          <div class="row g-3 font-sans bg-light p-3 rounded-3 border mb-3 text-xs">
            <div class="col-6 col-sm-3">
              <span class="text-muted d-block">दिनांक</span>
              <strong class="text-dark fs-6">{{ sabha.date }}</strong>
            </div>
            <div class="col-6 col-sm-3">
              <span class="text-muted d-block">वेळ</span>
              <strong class="text-dark fs-6">{{ sabha.time }}</strong>
            </div>
            <div class="col-12 col-sm-6">
              <span class="text-muted d-block">ठिकाण</span>
              <strong class="text-dark fs-6">{{ sabha.location }}</strong>
            </div>
          </div>

          <strong class="d-block text-xs font-sans text-uppercase text-muted mb-2">सभेची विषय पत्रिका (Agenda):</strong>
          <ul class="text-sm text-secondary ps-3 mb-3">
            <li v-for="(item, idx) in sabha.agendaMr" :key="idx" class="mb-1">{{ item }}</li>
          </ul>

          <div v-if="sabha.minutesSummaryMr" class="alert alert-success text-xs mb-0 font-sans">
            <strong><i class="bi bi-file-text me-1"></i> इतिवृत्त सारांश:</strong> {{ sabha.minutesSummaryMr }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';

const { gramSabhaMeetings } = useMockData();
</script>
