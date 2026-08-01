<template>
  <div class="eg-card p-3.5 h-100 d-flex flex-column justify-content-between">
    <div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="badge bg-warning bg-opacity-20 text-dark border border-warning font-sans text-xs">
          <i class="bi bi-bank2 me-1 text-warning"></i> {{ fund.category }}
        </span>
        <span class="text-xs text-muted font-sans">वर्ष: {{ fund.financialYear }}</span>
      </div>

      <h5 class="fw-bold text-success mb-2" style="font-size: 1.05rem;">
        {{ fund.fundNameMr }}
      </h5>
      <p class="text-xs text-muted font-sans mb-3">{{ fund.fundNameEn }}</p>

      <!-- Funding Numbers Grid -->
      <div class="row g-2 font-sans mb-3">
        <div class="col-4">
          <div class="bg-light p-2 rounded text-center border">
            <span class="text-muted d-block text-xs">एकूण प्राप्त</span>
            <strong class="text-dark fs-6">₹{{ (fund.totalAllocated / 100000).toFixed(1) }}L</strong>
          </div>
        </div>
        <div class="col-4">
          <div class="bg-success bg-opacity-10 p-2 rounded text-center border border-success border-opacity-25">
            <span class="text-success d-block text-xs fw-bold">वापरलेला निधी</span>
            <strong class="text-success fs-6">₹{{ (fund.utilized / 100000).toFixed(1) }}L</strong>
          </div>
        </div>
        <div class="col-4">
          <div class="bg-light p-2 rounded text-center border">
            <span class="text-muted d-block text-xs">शिल्लक निधी</span>
            <strong class="text-muted fs-6">₹{{ (fund.remaining / 100000).toFixed(1) }}L</strong>
          </div>
        </div>
      </div>

      <!-- Utilization Progress Bar -->
      <div class="mb-2 font-sans">
        <div class="d-flex justify-content-between text-xs fw-semibold mb-1">
          <span>निधी वापर (Utilization)</span>
          <span class="text-success">{{ Math.round((fund.utilized / fund.totalAllocated) * 100) }}%</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div 
            class="progress-bar bg-success" 
            role="progressbar" 
            :style="{ width: `${(fund.utilized / fund.totalAllocated) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center text-xs font-sans text-muted">
      <span><i class="bi bi-briefcase me-1 text-success"></i> {{ fund.projectCount }} मंजूर योजना/कामे</span>
      <span class="text-success fw-bold">100% पारदर्शकता</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NidhiFund } from '../../data/mockData';

defineProps<{
  fund: NidhiFund;
}>();
</script>
