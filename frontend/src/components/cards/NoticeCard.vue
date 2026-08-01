<template>
  <div class="eg-card p-3 h-100 d-flex flex-column justify-content-between border-start border-4" :class="borderAccentClass">
    <div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="badge rounded-pill font-sans text-xs" :class="badgeClass">
          {{ notice.categoryMr }}
        </span>
        <span class="text-xs text-muted font-sans"><i class="bi bi-calendar3 me-1"></i> {{ notice.date }}</span>
      </div>

      <h6 class="fw-bold text-dark mb-2 lh-sm">
        {{ notice.titleMr }}
      </h6>
      <p class="text-xs text-secondary mb-3">
        {{ notice.descriptionMr }}
      </p>
    </div>

    <div class="border-top pt-2 d-flex align-items-center justify-content-between text-xs font-sans">
      <span class="text-muted">जावक क्र: <strong>{{ notice.noticeNo }}</strong></span>
      <button class="btn btn-sm btn-outline-success rounded-pill px-2.5 py-0.5 text-xs">
        <i class="bi bi-download me-1"></i> PDF डाऊनलोड
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NoticeItem } from '../../data/mockData';

const props = defineProps<{
  notice: NoticeItem;
}>();

const borderAccentClass = computed(() => {
  if (props.notice.importance === 'Urgent') return 'border-danger';
  if (props.notice.importance === 'Important') return 'border-warning';
  return 'border-success';
});

const badgeClass = computed(() => {
  if (props.notice.importance === 'Urgent') return 'bg-danger text-white';
  if (props.notice.importance === 'Important') return 'bg-warning text-dark';
  return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
});
</script>
