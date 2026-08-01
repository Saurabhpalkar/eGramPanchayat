<template>
  <div class="text-center py-5 px-3 eg-card border-dashed my-3">
    <div class="bg-light text-muted rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 64px; height: 64px;">
      <i :class="icon || 'bi-inbox'" class="fs-2 text-success"></i>
    </div>
    <h5 class="fw-bold text-dark mb-1">{{ title }}</h5>
    <p class="text-muted text-sm mx-auto mb-3" style="max-width: 420px;">
      {{ description }}
    </p>
    <button v-if="actionLabel" class="btn btn-eg-primary btn-sm rounded-pill" @click="$emit('action')">
      <i class="bi bi-plus-circle me-1"></i> {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
}>();

defineEmits(['action']);
</script>
