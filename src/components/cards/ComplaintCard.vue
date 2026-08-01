<template>
  <div class="eg-card eg-card-hover p-3 h-100 d-flex flex-column justify-content-between">
    <div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="badge bg-light text-dark font-sans text-xs border">
          <i class="bi bi-ticket-perforated me-1 text-success"></i> {{ complaint.ticketId }}
        </span>
        <StatusBadge :status="complaint.status" :text="complaint.statusMr" />
      </div>

      <h6 class="fw-bold text-dark mb-1 lh-sm">
        {{ complaint.title }}
      </h6>
      <p class="text-xs text-muted mb-2 font-sans">
        <i class="bi bi-geo-alt text-danger me-1"></i> {{ complaint.location }}
      </p>

      <p class="text-xs text-secondary mb-3 line-clamp-2">
        {{ complaint.description }}
      </p>

      <div v-if="complaint.photoUrl" class="mb-3 rounded overflow-hidden border" style="height: 120px;">
        <img :src="complaint.photoUrl" class="w-100 h-100 object-fit-cover" alt="Complaint Photo" />
      </div>
    </div>

    <div class="border-top pt-2 d-flex align-items-center justify-content-between font-sans text-xs">
      <span class="text-muted"><i class="bi bi-calendar3 me-1"></i> {{ complaint.createdAt }}</span>
      <button class="btn btn-sm btn-link text-success p-0 fw-bold text-decoration-none" @click="$emit('view', complaint)">
        स्थिती पाहा <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '../common/StatusBadge.vue';
import type { ComplaintItem } from '../../data/mockData';

defineProps<{
  complaint: ComplaintItem;
}>();

defineEmits(['view']);
</script>
