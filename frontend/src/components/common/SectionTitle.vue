<template>
  <div class="mb-4" :class="[align === 'center' ? 'text-center' : 'text-start']">
    <div class="d-inline-flex align-items-center gap-2 mb-1">
      <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 font-sans fw-semibold" style="font-size: 0.82rem;">
        <i class="bi bi-tree-fill me-1 text-warning"></i> {{ tag || 'डिजिटल महाराष्ट्र' }}
      </span>
    </div>
    <h2 class="fw-bold mb-2 text-success" style="color: #1B5E20 !important; font-family: var(--font-marathi);">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-muted mb-0 mx-auto" style="max-width: 680px; font-size: 0.95rem;">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  tag?: string;
  align?: 'center' | 'left';
}>();
</script>
