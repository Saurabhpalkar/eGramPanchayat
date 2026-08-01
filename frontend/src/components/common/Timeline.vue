<template>
  <div class="timeline position-relative ps-4 py-2 font-sans">
    <div 
      v-for="(step, index) in steps" 
      :key="index" 
      class="timeline-item position-relative mb-4"
    >
      <!-- Indicator Circle -->
      <div 
        class="position-absolute start-0 top-0 translate-middle-x rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
        :class="step.completed ? 'bg-success' : 'bg-secondary bg-opacity-50'"
        style="width: 26px; height: 26px; left: -1rem !important; z-index: 2;"
      >
        <i v-if="step.completed" class="bi bi-check text-xs fw-bold"></i>
        <span v-else class="text-xs">{{ index + 1 }}</span>
      </div>

      <!-- Connecting Line -->
      <div 
        v-if="index < steps.length - 1"
        class="position-absolute"
        :class="step.completed ? 'bg-success' : 'bg-light border-start border-2'"
        style="left: -1rem !important; top: 26px; bottom: -16px; width: 2px; z-index: 1;"
      ></div>

      <!-- Step Content -->
      <div class="ms-2">
        <h6 class="mb-1 fw-bold text-xs" :class="step.completed ? 'text-success' : 'text-muted'">
          {{ step.title }}
        </h6>
        <p class="text-xs text-muted mb-0">{{ step.date }}</p>
        <p v-if="step.comment" class="text-xs bg-light p-2 rounded-2 border mt-1 mb-0 text-dark">
          <i class="bi bi-chat-left-text me-1 text-success"></i> {{ step.comment }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: {
    title: string;
    date: string;
    comment?: string;
    completed: boolean;
  }[];
}>();
</script>
