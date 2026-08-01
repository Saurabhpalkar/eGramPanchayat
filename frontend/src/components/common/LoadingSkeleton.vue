<template>
  <div class="row g-3">
    <div v-for="i in count || 3" :key="i" :class="colClass || 'col-md-4'">
      <div class="eg-card p-3 placeholder-glow">
        <div class="placeholder col-7 rounded mb-2"></div>
        <div class="placeholder col-4 rounded mb-3"></div>
        <div class="placeholder col-12 rounded mb-1"></div>
        <div class="placeholder col-9 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number;
  colClass?: string;
}>();
</script>
