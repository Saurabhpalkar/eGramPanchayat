<template>
  <header class="bg-white border-bottom py-2.5 px-3 d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center gap-2 gap-md-3">
      <!-- Mobile Sidebar Drawer Button -->
      <button 
        class="btn btn-light btn-sm d-lg-none rounded-circle border p-1.5" 
        @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        title="नेव्हिगेशन मेनू उघडा"
      >
        <i class="bi bi-layout-sidebar text-success fs-5"></i>
      </button>

      <div>
        <h5 class="mb-0 fw-bold text-success d-flex align-items-center gap-2" style="font-size: 1.15rem;">
          <span>{{ title }}</span>
        </h5>
        <span v-if="subtitle" class="text-muted d-none d-md-inline text-xs">{{ subtitle }}</span>
      </div>
    </div>

    <div class="d-flex align-items-center gap-2 gap-md-3 font-sans">
      <!-- Quick Search -->
      <div class="input-group input-group-sm d-none d-sm-flex" style="width: 220px;">
        <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
        <input 
          type="text" 
          v-model="searchQuery" 
          class="form-control bg-light border-start-0" 
          placeholder="शोधा / Search..." 
          @input="$emit('search', searchQuery)"
        />
      </div>

      <!-- Notifications Dropdown -->
      <div class="position-relative">
        <button 
          class="btn btn-light btn-sm rounded-circle position-relative p-2 border" 
          type="button" 
          @click.stop="isNotifOpen = !isNotifOpen"
        >
          <i class="bi bi-bell fs-5 text-dark"></i>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span class="visually-hidden">नवीन सूचना</span>
          </span>
        </button>

        <div v-if="isNotifOpen" class="dropdown-menu dropdown-menu-end shadow-lg p-2 show mt-2" style="width: 310px; right: 0; left: auto;">
          <div class="d-flex align-items-center justify-content-between px-2 py-1 mb-1 border-bottom">
            <span class="fw-bold text-uppercase text-xs text-success"><i class="bi bi-bell-fill me-1"></i> सूचना व अलर्ट्स</span>
            <span class="badge bg-danger text-white rounded-pill text-xs">२ नवीन</span>
          </div>

          <div class="d-flex flex-column gap-1">
            <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-primary" style="cursor: pointer;">
              <div class="fw-semibold text-xs text-primary">नवीन अर्ज प्राप्त</div>
              <small class="text-dark text-xs d-block">पोलीस पाटील दाखल्यासाठी १ नवीन अर्ज प्राप्त झाला.</small>
              <span class="text-muted text-xs"><i class="bi bi-clock me-1"></i> १० मिनिटांपूर्वी</span>
            </div>

            <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-success" style="cursor: pointer;">
              <div class="fw-semibold text-xs text-success">तक्रार निवारण पूर्ण</div>
              <small class="text-dark text-xs d-block">वॉर्ड ३ मधील पाणी पुरवठा समस्येची तक्रार निराकरण झाली.</small>
              <span class="text-muted text-xs"><i class="bi bi-clock me-1"></i> १ तासापूर्वी</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile Badge -->
      <div class="d-flex align-items-center gap-2 border-start ps-2 ps-md-3">
        <img :src="user.avatar" class="rounded-circle border border-2 border-success" width="36" height="36" alt="Profile" />
        <div class="d-none d-md-block text-start lh-sm">
          <div class="fw-bold text-xs text-dark">{{ user.name }}</div>
          <div class="text-muted text-xs" style="font-size: 0.7rem;">{{ user.panchayatName }}</div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Offcanvas Drawer -->
    <div 
      v-if="isMobileSidebarOpen" 
      class="position-fixed top-0 start-0 bottom-0 end-0 bg-dark bg-opacity-50 z-1050 d-lg-none"
      @click="isMobileSidebarOpen = false"
    >
      <div 
        class="bg-white h-100 shadow-lg p-0" 
        style="width: 280px;" 
        @click.stop
      >
        <div class="d-flex align-items-center justify-content-between p-3 border-bottom bg-success text-white">
          <h6 class="mb-0 fw-bold"><i class="bi bi-menu-button-wide me-1"></i> नेव्हिगेशन मेनू</h6>
          <button class="btn-close btn-close-white" @click="isMobileSidebarOpen = false"></button>
        </div>
        <div class="p-2" @click="isMobileSidebarOpen = false">
          <Sidebar />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
import Sidebar from './Sidebar.vue';

defineProps<{
  title: string;
  subtitle?: string;
}>();

defineEmits(['search']);

const { user } = useAuth();
const searchQuery = ref('');
const isNotifOpen = ref(false);
const isMobileSidebarOpen = ref(false);

function handleDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.position-relative')) {
    isNotifOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocClick);
});
</script>
