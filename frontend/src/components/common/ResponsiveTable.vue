<template>
  <div class="table-responsive bg-white rounded-3 border shadow-sm">
    <table class="table table-hover align-middle mb-0 font-sans">
      <thead class="table-light text-uppercase text-xs fw-bold text-muted border-bottom">
        <slot name="head"></slot>
      </thead>
      <tbody>
        <slot name="body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
</script>
