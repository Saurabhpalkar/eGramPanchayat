<template>
  <div 
    class="border border-2 border-dashed rounded-3 p-4 text-center cursor-pointer bg-light transition-all"
    :class="{ 'border-success bg-success bg-opacity-10': isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="triggerInput"
  >
    <input type="file" ref="fileInput" class="d-none" accept="image/*,application/pdf" @change="handleFileChange" />
    
    <div v-if="!filePreview" class="py-2">
      <i class="bi bi-cloud-arrow-up fs-1 text-success mb-2 d-block"></i>
      <h6 class="fw-bold mb-1">फोटो किंवा कागदपत्र अपलोड करा</h6>
      <p class="text-muted text-xs mb-0">ड्रॅग करा किंवा कॉम्प्युटरवरून फाईल निवडा (JPG, PNG, PDF)</p>
    </div>

    <div v-else class="d-flex align-items-center justify-content-between p-2 bg-white rounded border">
      <div class="d-flex align-items-center gap-2 overflow-hidden">
        <i class="bi bi-file-earmark-image fs-3 text-success"></i>
        <div class="text-start overflow-hidden">
          <div class="fw-semibold text-truncate text-xs">{{ fileName }}</div>
          <small class="text-muted text-xs">अपलोड झाले</small>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-danger border-0 p-1" @click.stop="clearFile">
        <i class="bi bi-x-circle-fill fs-5"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['file-selected']);

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const fileName = ref('');
const filePreview = ref<string | null>(null);

function triggerInput() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
}

function processFile(file: File) {
  fileName.value = file.name;
  filePreview.value = URL.createObjectURL(file);
  emit('file-selected', file);
}

function clearFile() {
  fileName.value = '';
  filePreview.value = null;
  if (fileInput.value) fileInput.value.value = '';
}
</script>
