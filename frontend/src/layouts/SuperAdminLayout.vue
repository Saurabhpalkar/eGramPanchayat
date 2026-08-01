<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- Super Admin Dedicated Top Navbar -->
    <header class="sticky-top bg-dark text-white border-bottom border-success border-3 shadow-sm z-1030" style="background-color: #0F2E1E !important;">
      <div class="container-fluid py-2 px-3 d-flex align-items-center justify-content-between">
        <!-- Brand & Sidebar Collapsible Toggle -->
        <div class="d-flex align-items-center gap-2 gap-md-3">
          <button 
            class="btn btn-outline-light btn-sm rounded-circle p-1.5 focus-ring-none" 
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            title="सायडबार लहान / मोठा करा"
          >
            <i class="bi bi-layout-sidebar-inset fs-5"></i>
          </button>

          <router-link to="/superadmin/dashboard" class="text-white text-decoration-none d-flex align-items-center gap-2">
            <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 36px; height: 36px;">
              <i class="bi bi-shield-lock-fill fs-5"></i>
            </div>
            <div>
              <div class="fw-bold text-white lh-1 font-marathi" style="font-size: 1.1rem;">eGram SaaS ओव्हरलॉर्ड</div>
              <small class="text-warning text-uppercase tracking-wider font-sans" style="font-size: 0.68rem; font-weight: 700;">Super Admin Portal</small>
            </div>
          </router-link>
        </div>

        <!-- Search Bar Desktop -->
        <div class="input-group input-group-sm d-none d-md-flex mx-3" style="max-width: 380px;">
          <span class="input-group-text bg-white bg-opacity-10 text-white border-0"><i class="bi bi-search text-warning"></i></span>
          <input 
            type="text" 
            v-model="globalSearch" 
            class="form-control bg-white bg-opacity-10 text-white border-0 placeholder-white-50" 
            placeholder="ग्रामपंचायत, कोड किंवा ॲडमिन शोधा..." 
          />
        </div>

        <!-- Right Controls: Language, Notifications, Profile Menu, Mobile Hamburger -->
        <div class="d-flex align-items-center gap-2 gap-md-3">
          <!-- Language Switcher Dropdown -->
          <div class="position-relative">
            <button 
              class="btn btn-sm btn-outline-light d-flex align-items-center gap-1 font-sans text-xs px-2.5 py-1 rounded-pill"
              @click.stop="toggleLangDropdown"
            >
              <i class="bi bi-translate text-warning me-1"></i>
              <span class="d-none d-sm-inline">{{ currentLangLabel }}</span>
            </button>
            
            <ul v-if="isLangOpen" class="dropdown-menu dropdown-menu-end shadow-lg show mt-1">
              <li><button class="dropdown-item text-xs" @click="selectLang('mr')">🚩 मराठी (Marathi)</button></li>
              <li><button class="dropdown-item text-xs" @click="selectLang('en')">🇬🇧 English</button></li>
              <li><button class="dropdown-item text-xs" @click="selectLang('hi')">🇮🇳 हिंदी (Hindi)</button></li>
            </ul>
          </div>

          <!-- SaaS Notifications Dropdown -->
          <div class="position-relative">
            <button 
              class="btn btn-sm btn-outline-light rounded-circle p-1.5 position-relative"
              @click.stop="toggleNotifDropdown"
            >
              <i class="bi bi-bell-fill fs-6 text-warning"></i>
              <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span class="visually-hidden">नवीन सूचना</span>
              </span>
            </button>

            <div v-if="isNotifOpen" class="dropdown-menu dropdown-menu-end shadow-lg p-2 show mt-2" style="width: 320px;">
              <div class="d-flex align-items-center justify-content-between px-2 py-1 mb-1 border-bottom">
                <span class="fw-bold text-uppercase text-xs text-success"><i class="bi bi-bell-fill me-1"></i> SaaS सिस्टीम अलर्ट्स</span>
                <span class="badge bg-danger text-white rounded-pill text-xs">३ नवीन</span>
              </div>

              <div class="d-flex flex-column gap-1 text-xs">
                <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-success">
                  <div class="fw-bold text-success">नवीन ग्रामपंचायत नोंदणी</div>
                  <div class="text-dark">राहाता ग्रामपंचायत (अहिल्यानगर) ऑनबोर्ड झाली.</div>
                  <span class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-clock me-1"></i> १५ मिनिटांपूर्वी</span>
                </div>
                <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-warning">
                  <div class="fw-bold text-warning text-dark">सबस्क्रिप्शन रिन्युअल यशस्वी</div>
                  <div class="text-dark">सासवड ग्रामपंचायत ₹३,९९९/महिना रिन्यू झाले.</div>
                  <span class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-clock me-1"></i> १ तासापूर्वी</span>
                </div>
                <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-primary">
                  <div class="fw-bold text-primary">सिस्टीम अपडेट यशस्वित्या पूर्ण</div>
                  <div class="text-dark">eGram v2.4 पॅच सर्व २४ टेनंट्सवर रोलआऊट झाला.</div>
                  <span class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-clock me-1"></i> ३ तासांपूर्वी</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Super Admin Profile Dropdown -->
          <div class="position-relative">
            <button 
              class="btn btn-sm btn-success bg-opacity-20 border border-success border-opacity-50 text-white rounded-pill px-2.5 py-1 d-flex align-items-center gap-2"
              @click.stop="toggleProfileDropdown"
            >
              <img :src="user.avatar" class="rounded-circle border border-warning" width="26" height="26" />
              <span class="d-none d-md-inline fw-semibold text-xs">SaaS Owner</span>
              <i class="bi bi-chevron-down text-warning text-xs"></i>
            </button>

            <ul v-if="isProfileOpen" class="dropdown-menu dropdown-menu-end shadow-lg show mt-1 p-2" style="min-width: 220px;">
              <li class="px-2 py-1.5 border-bottom mb-1">
                <div class="fw-bold text-dark text-xs">{{ user.name }}</div>
                <small class="text-muted d-block" style="font-size: 0.72rem;">{{ user.email }}</small>
                <span class="badge bg-warning text-dark text-xs mt-1">Super Admin Role</span>
              </li>
              <li>
                <router-link to="/superadmin/settings" class="dropdown-item rounded py-1.5 text-xs d-flex align-items-center gap-2" @click="closeAll">
                  <i class="bi bi-gear-wide-connected text-primary"></i> प्लेटफॉर्म सेटींग्ज
                </router-link>
              </li>
              <li>
                <button class="dropdown-item rounded py-1.5 text-xs d-flex align-items-center gap-2 text-danger" @click="logout">
                  <i class="bi bi-power"></i> बाहेर पडा (Logout)
                </button>
              </li>
            </ul>
          </div>

          <!-- Mobile Sidebar Drawer Toggle -->
          <button 
            class="btn btn-outline-light btn-sm d-lg-none rounded-circle p-1.5"
            @click="isMobileSidebarOpen = !isMobileSidebarOpen"
          >
            <i class="bi bi-list fs-4"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container with Sidebar & Content -->
    <div class="d-flex flex-grow-1">
      <!-- Desktop Sidebar -->
      <div 
        class="d-none d-lg-block transition-all duration-300"
        :style="{ width: isSidebarCollapsed ? '80px' : '260px' }"
      >
        <Sidebar :collapsed="isSidebarCollapsed" />
      </div>

      <!-- Main Content View -->
      <main class="flex-grow-1 p-3 p-md-4 overflow-x-hidden">
        <router-view />
      </main>
    </div>

    <!-- Mobile Sidebar Drawer -->
    <div 
      v-if="isMobileSidebarOpen" 
      class="position-fixed top-0 start-0 bottom-0 end-0 bg-dark bg-opacity-60 z-1050 d-lg-none"
      @click="isMobileSidebarOpen = false"
    >
      <div 
        class="bg-white h-100 shadow-lg" 
        style="width: 280px;" 
        @click.stop
      >
        <div class="d-flex align-items-center justify-content-between p-3 border-bottom text-white" style="background-color: #0F2E1E;">
          <h6 class="mb-0 fw-bold"><i class="bi bi-shield-lock me-1 text-warning"></i> Super Admin Menu</h6>
          <button class="btn-close btn-close-white" @click="isMobileSidebarOpen = false"></button>
        </div>
        <div @click="isMobileSidebarOpen = false">
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useI18n, type Locale } from '../composables/useI18n';
import Sidebar from '../components/common/Sidebar.vue';

const { user, switchRole } = useAuth();
const { locale, setLocale } = useI18n();
const router = useRouter();

const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);
const isLangOpen = ref(false);
const isNotifOpen = ref(false);
const isProfileOpen = ref(false);
const globalSearch = ref('');

const currentLangLabel = computed(() => {
  if (locale.value === 'mr') return 'मराठी';
  if (locale.value === 'en') return 'English';
  return 'हिंदी';
});

function toggleLangDropdown() {
  isLangOpen.value = !isLangOpen.value;
  isNotifOpen.value = false;
  isProfileOpen.value = false;
}

function toggleNotifDropdown() {
  isNotifOpen.value = !isNotifOpen.value;
  isLangOpen.value = false;
  isProfileOpen.value = false;
}

function toggleProfileDropdown() {
  isProfileOpen.value = !isProfileOpen.value;
  isLangOpen.value = false;
  isNotifOpen.value = false;
}

function closeAll() {
  isLangOpen.value = false;
  isNotifOpen.value = false;
  isProfileOpen.value = false;
  isMobileSidebarOpen.value = false;
}

function selectLang(lang: Locale) {
  setLocale(lang);
  closeAll();
}

function logout() {
  switchRole('public');
  closeAll();
  router.push('/');
}

function handleDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.position-relative')) {
    closeAll();
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocClick);
});
</script>
