<template>
  <span class="badge rounded-pill font-sans fw-semibold px-2.5 py-1 text-xs border" :class="badgeClasses">
    <i :class="iconClass" class="me-1"></i> {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status: string;
  text: string;
}>();

const badgeClasses = computed(() => {
  const s = props.status.toLowerCase();
  if (s.includes('resolved') || s.includes('completed') || s.includes('generated') || s.includes('approved') || s.includes('paid')) {
    return 'bg-success bg-opacity-10 text-success border-success border-opacity-25';
  }
  if (s.includes('process') || s.includes('progress') || s.includes('assigned')) {
    return 'bg-warning bg-opacity-10 text-success border-warning border-opacity-50';
  }
  if (s.includes('pending') || s.includes('verification') || s.includes('received')) {
    return 'bg-info bg-opacity-10 text-info border-info border-opacity-25';
  }
  if (s.includes('rejected') || s.includes('suspended')) {
    return 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25';
  }
  return 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25';
});

const iconClass = computed(() => {
  const s = props.status.toLowerCase();
  if (s.includes('resolved') || s.includes('completed') || s.includes('generated') || s.includes('approved') || s.includes('paid')) {
    return 'bi bi-check-circle-fill';
  }
  if (s.includes('process') || s.includes('progress') || s.includes('assigned')) {
    return 'bi bi-hourglass-split';
  }
  if (s.includes('pending') || s.includes('verification') || s.includes('received')) {
    return 'bi bi-clock-history';
  }
  if (s.includes('rejected') || s.includes('suspended')) {
    return 'bi bi-x-circle-fill';
  }
  return 'bi bi-info-circle';
});
</script>
