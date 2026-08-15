<template>
  <div 
    class="eg-card p-4 h-100 d-flex flex-column justify-content-between"
    :class="service.popular ? 'eg-card-accent' : 'eg-card-accent'"
  >
    <div>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div 
          class="rounded-3 d-flex align-items-center justify-content-center"
          :class="service.popular ? 'bg-success bg-opacity-10 text-success' : 'bg-success bg-opacity-10 text-success'"
          style="width: 48px; height: 48px; flex-shrink: 0;"
        >
          <i :class="service.icon" class="fs-4"></i>
        </div>
        <span 
          v-if="service.popular" 
          class="badge bg-warning text-dark font-sans px-2.5 py-1 fw-bold text-xs shadow-sm"
        >
          <i class="bi bi-star-fill me-1"></i> महत्त्वाचे
        </span>
        <span v-else class="badge bg-light text-success border border-success border-opacity-25 font-sans text-xs px-2.5 py-1">
          <i class="bi bi-clock me-1"></i> {{ service.slaDays }} दिवस
        </span>
      </div>

      <h5 class="fw-bold mb-1 text-success" style="font-size: 1.08rem; line-height: 1.35;">
        {{ service.nameMr }}
      </h5>
      <p class="text-xs text-muted text-uppercase tracking-wider font-sans mb-2 fw-semibold">
        {{ service.nameEn }}
      </p>
      <p class="text-xs text-secondary mb-3 lh-base" style="min-height: 2.5rem;">
        {{ service.descriptionMr }}
      </p>
    </div>

    <div class="border-top pt-3 d-flex align-items-center justify-content-between mt-auto">
      <div>
        <small class="text-xs text-muted d-block font-sans">शासकीय फी</small>
        <span class="fw-bold text-dark font-sans" style="font-size: 0.95rem;">
          {{ service.fee === 0 ? 'मोफत (Free)' : `₹${service.fee}` }}
        </span>
      </div>
      <button 
        class="btn btn-sm rounded-pill px-3 text-xs fw-bold font-sans"
        :class="service.popular ? 'btn-eg-primary' : 'btn-eg-primary'"
        @click="$emit('apply', service)"
      >
        अर्ज करा <i class="bi bi-arrow-right ms-1"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceItem } from '../../data/mockData';

defineProps<{
  service: ServiceItem;
}>();

defineEmits(['apply']);
</script>
