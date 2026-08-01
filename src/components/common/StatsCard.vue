<template>
  <div class="eg-card p-3 h-100 d-flex align-items-center gap-3">
    <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" :class="bgClass" style="width: 52px; height: 52px;">
      <i :class="[icon, iconColor]" class="fs-3"></i>
    </div>
    <div class="overflow-hidden">
      <div class="text-xs text-muted text-uppercase fw-bold font-sans tracking-wide mb-1">{{ label }}</div>
      <div class="fw-bold fs-4 text-dark lh-1 mb-1 font-sans">{{ value }}</div>
      <div v-if="trend" class="text-xs fw-semibold" :class="trendUp ? 'text-success' : 'text-muted'">
        <i :class="trendUp ? 'bi bi-arrow-up-short' : 'bi bi-dash'" class="fs-6"></i> {{ trend }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  label: string;
  value: string | number;
  variant?: 'green' | 'gold' | 'brown' | 'blue' | 'red';
  trend?: string;
  trendUp?: boolean;
}>();

const bgClass = computed(() => {
  switch (props.variant) {
    case 'gold': return 'bg-warning bg-opacity-15';
    case 'brown': return 'bg-secondary bg-opacity-15';
    case 'blue': return 'bg-info bg-opacity-15';
    case 'red': return 'bg-danger bg-opacity-15';
    default: return 'bg-success bg-opacity-15';
  }
});

const iconColor = computed(() => {
  switch (props.variant) {
    case 'gold': return 'text-warning';
    case 'brown': return 'text-secondary';
    case 'blue': return 'text-info';
    case 'red': return 'text-danger';
    default: return 'text-success';
  }
});
</script>
