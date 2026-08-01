<template>
  <div class="eg-card eg-card-hover overflow-hidden h-100 d-flex flex-column justify-content-between">
    <div class="position-relative" style="height: 160px;">
      <img :src="work.photoUrl" class="w-100 h-100 object-fit-cover" :alt="work.titleMr" />
      <div class="position-absolute top-0 end-0 p-2">
        <span class="badge bg-dark bg-opacity-75 text-white font-sans text-xs">
          <i class="bi bi-tag-fill me-1 text-warning"></i> {{ work.category }}
        </span>
      </div>
      <div class="position-absolute bottom-0 start-0 p-2 bg-gradient-dark text-white w-100" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
        <small class="font-sans text-xs text-warning"><i class="bi bi-geo-alt-fill me-1"></i> {{ work.location }}</small>
      </div>
    </div>

    <div class="p-3 flex-grow-1">
      <h6 class="fw-bold text-success mb-1" style="font-size: 0.98rem; color: #1B5E20 !important;">
        {{ work.titleMr }}
      </h6>
      <small class="text-muted d-block font-sans text-xs mb-3">{{ work.titleEn }}</small>

      <!-- Progress Bar -->
      <div class="mb-3">
        <div class="d-flex justify-content-between text-xs font-sans fw-bold mb-1">
          <span>काम प्रगती (Progress)</span>
          <span class="text-success">{{ work.progressPercent }}%</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div 
            class="progress-bar bg-success rounded-pill" 
            role="progressbar" 
            :style="{ width: `${work.progressPercent}%` }"
          ></div>
        </div>
      </div>

      <div class="row g-2 text-xs font-sans bg-light p-2 rounded-2 border">
        <div class="col-6">
          <span class="text-muted d-block">मंजूर निधी</span>
          <strong class="text-dark">₹{{ work.budgetLakhs }} लाख</strong>
        </div>
        <div class="col-6">
          <span class="text-muted d-block">निधी खर्च</span>
          <strong class="text-success">₹{{ work.fundsSpentLakhs }} लाख</strong>
        </div>
        <div class="col-12 border-top pt-1 mt-1 text-truncate">
          <span class="text-muted">कंत्राटदार: </span>
          <strong class="text-dark">{{ work.contractor }}</strong>
        </div>
      </div>
    </div>

    <div class="p-3 border-top bg-light d-flex align-items-center justify-content-between text-xs font-sans">
      <span class="text-muted"><i class="bi bi-bank me-1 text-success"></i> {{ work.fundSource }}</span>
      <StatusBadge :status="work.status" :text="work.statusMr" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '../common/StatusBadge.vue';
import type { DevelopmentWork } from '../../data/mockData';

defineProps<{
  work: DevelopmentWork;
}>();
</script>
