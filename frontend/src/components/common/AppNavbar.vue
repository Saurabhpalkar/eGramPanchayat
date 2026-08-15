<template>
  <header class="sticky-top bg-white border-bottom shadow-sm z-1030">
    <!-- Top Maharashtra State Government & Tenant Ribbon -->
    <div class="bg-dark text-white py-1 px-3 d-none d-md-block text-xs" style="background-color: #144718 !important; font-size: 0.82rem;">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <!-- Left State Gov Badge & Tenant Switcher -->
        <div class="d-flex align-items-center gap-3">
          <span><i class="bi bi-shield-fill-check me-1 text-warning"></i> महाराष्ट्र शासन - ग्रामविकास विभाग</span>
          <span class="opacity-75">|</span>
          
          <!-- Tenant Dropdown (Multi-Tenant Selector) -->
          <div class="position-relative">
            <button 
              class="btn btn-sm text-white dropdown-toggle p-0 font-sans fw-semibold d-inline-flex align-items-center gap-1"
              @click.stop="toggleTenantDropdown"
            >
              <i class="bi bi-building text-warning me-1"></i> {{ activePanchayat.nameMr }} (कोड: {{ activePanchayat.code }})
            </button>
            
            <ul v-if="isTenantDropdownOpen" class="dropdown-menu dropdown-menu-start shadow-lg show p-2 mt-1" style="min-width: 280px;">
              <li class="dropdown-header text-uppercase font-sans fw-bold text-muted text-xs">ग्रामपंचायत टेनंट निवडा (Multi-Tenant):</li>
              <li v-for="gp in availablePanchayats" :key="gp.id">
                <button 
                  class="dropdown-item rounded-2 py-2 d-flex align-items-center justify-content-between"
                  :class="{ active: activePanchayat.id === gp.id }"
                  @click="changeTenant(gp)"
                >
                  <div>
                    <div class="fw-bold">{{ gp.nameMr }}</div>
                    <small class="text-muted d-block" style="font-size: 0.72rem;">ता. {{ gp.taluka }}, जि. {{ gp.district }}</small>
                  </div>
                  <i v-if="activePanchayat.id === gp.id" class="bi bi-check-circle-fill text-success ms-2"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right Ribbon Links & Language Switcher -->
        <div class="d-flex align-items-center gap-3">
          <span><i class="bi bi-telephone-fill me-1 text-warning"></i> टोल फ्री: १८००-२३३-४५६७</span>
          <span class="opacity-75">|</span>
          
          <!-- Language Switcher in Ribbon -->
          <div class="position-relative">
            <button 
              class="btn btn-sm text-white dropdown-toggle p-0 font-sans d-inline-flex align-items-center gap-1" 
              @click.stop="toggleLangDropdown"
            >
              <i class="bi bi-translate text-warning me-1"></i> {{ currentLanguageLabel }}
            </button>
            <ul v-if="isLangDropdownOpen" class="dropdown-menu dropdown-menu-end shadow-lg show mt-1">
              <li>
                <button class="dropdown-item d-flex align-items-center justify-content-between" @click="changeLang('mr')">
                  <span>🚩 मराठी (Marathi)</span>
                  <i v-if="locale === 'mr'" class="bi bi-check text-success ms-2"></i>
                </button>
              </li>
              <li>
                <button class="dropdown-item d-flex align-items-center justify-content-between" @click="changeLang('en')">
                  <span>🇬🇧 English</span>
                  <i v-if="locale === 'en'" class="bi bi-check text-success ms-2"></i>
                </button>
              </li>
              <li>
                <button class="dropdown-item d-flex align-items-center justify-content-between" @click="changeLang('hi')">
                  <span>🇮🇳 हिंदी (Hindi)</span>
                  <i v-if="locale === 'hi'" class="bi bi-check text-success ms-2"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light py-2 px-3">
      <div class="container-fluid">
        <!-- Brand Logo & Title -->
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2" @click="closeAll">
          <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 44px; height: 44px; background: linear-gradient(135deg, #1B5E20, #43A047) !important;">
            <i class="bi bi-tree-fill fs-4 text-warning"></i>
          </div>
          <div>
            <div class="fw-bold text-success fs-5 lh-1" style="font-family: var(--font-marathi); color: #1B5E20 !important;">
              {{ t('appName') }}
            </div>
            <div class="text-muted text-uppercase tracking-wider font-sans" style="font-size: 0.68rem; font-weight: 600;">
              {{ activePanchayat.nameEn }}
            </div>
          </div>
        </router-link>

        <!-- Right Mobile Toggles & Demo Role Switcher -->
        <div class="d-flex align-items-center gap-2 ms-auto">
          <!-- Role Switcher (DEMO TOOLBAR) -->
          <div class="position-relative me-1 me-md-2">
            <button 
              class="btn btn-outline-success btn-sm dropdown-toggle d-flex align-items-center gap-1 py-1 px-2 rounded-pill fw-semibold" 
              style="font-size: 0.8rem;" 
              @click.stop="toggleRoleDropdown"
            >
              <i class="bi bi-person-workspace text-warning fs-6"></i>
              <span class="d-none d-sm-inline">{{ currentRoleName }}</span>
              <span class="d-inline d-sm-none">व्यू</span>
            </button>
            
            <ul v-if="isRoleDropdownOpen" class="dropdown-menu dropdown-menu-end shadow-lg p-2 show mt-1" style="min-width: 250px;">
              <li class="dropdown-header text-uppercase font-sans fw-bold text-muted text-xs">डॅशबोर्ड रोल निवडा (Demo Mode):</li>
              <li>
                <button class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" :class="{ active: activeRole === 'public' }" @click="selectRole('public')">
                  <i class="bi bi-globe text-primary fs-5"></i>
                  <div>
                    <div class="fw-semibold">१. सार्वजनिक पोर्टल (Public)</div>
                    <small class="text-muted d-block" style="font-size: 0.72rem;">मुख्य वेबसाईट व नागरिक सेवा</small>
                  </div>
                </button>
              </li>
              <li>
                <button class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" :class="{ active: activeRole === 'user' }" @click="selectRole('user')">
                  <i class="bi bi-person-circle text-success fs-5"></i>
                  <div>
                    <div class="fw-semibold">२. नागरिक (Citizen)</div>
                    <small class="text-muted d-block" style="font-size: 0.72rem;">माझे अर्ज, तक्रारी व प्रोफाईल</small>
                  </div>
                </button>
              </li>
              <li>
                <button class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" :class="{ active: activeRole === 'staff' }" @click="selectRole('staff')">
                  <i class="bi bi-person-badge text-warning fs-5"></i>
                  <div>
                    <div class="fw-semibold">३. ग्रामपंचायत कर्मचारी (Staff)</div>
                    <small class="text-muted d-block" style="font-size: 0.72rem;">अर्ज पडताळणी व तक्रार निवारण</small>
                  </div>
                </button>
              </li>
              <li>
                <button class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" :class="{ active: activeRole === 'admin' }" @click="selectRole('admin')">
                  <i class="bi bi-award-fill text-danger fs-5"></i>
                  <div>
                    <div class="fw-semibold">४. सरपंच / ग्रामसेवक (Admin)</div>
                    <small class="text-muted d-block" style="font-size: 0.72rem;">विकास कामे, निधी व ग्रामसभा</small>
                  </div>
                </button>
              </li>
              <li>
                <button class="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" :class="{ active: activeRole === 'super_admin' }" @click="selectRole('super_admin')">
                  <i class="bi bi-gear-fill text-dark fs-5"></i>
                  <div>
                    <div class="fw-semibold">५. SaaS सुपर ॲडमिन</div>
                    <small class="text-muted d-block" style="font-size: 0.72rem;">ग्रामपंचायत मॅनेजमेंट व सबस्क्रिप्शन</small>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          <!-- Language Selector Mobile -->
          <div class="position-relative d-md-none me-1">
            <button class="btn btn-light btn-sm p-1.5 rounded-circle border d-flex align-items-center justify-content-center" @click.stop="toggleLangDropdown">
              <i class="bi bi-translate fs-5 text-success"></i>
            </button>
            <ul v-if="isLangDropdownOpen" class="dropdown-menu dropdown-menu-end shadow-lg show mt-1">
              <li><button class="dropdown-item" @click="changeLang('mr')">🚩 मराठी</button></li>
              <li><button class="dropdown-item" @click="changeLang('en')">🇬🇧 English</button></li>
              <li><button class="dropdown-item" @click="changeLang('hi')">🇮🇳 हिंदी</button></li>
            </ul>
          </div>

          <!-- Hamburger Toggle -->
          <button 
            class="navbar-toggler border-0 p-1.5 focus-ring-none" 
            type="button" 
            @click="toggleMobileMenu"
            aria-label="Toggle navigation"
          >
            <i class="bi" :class="isMobileMenuOpen ? 'bi-x-lg text-danger fs-4' : 'bi-list text-success fs-3'"></i>
          </button>
        </div>

        <!-- Navigation Links -->
        <div class="collapse navbar-collapse" :class="{ show: isMobileMenuOpen }" id="mainNavbar">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 fw-medium font-sans py-2 py-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.home') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/services" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.services') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/track" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.track') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/raise-complaint" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.complaints') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/development-works" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.works') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/nidhi" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.nidhi') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/gram-sabha" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.sabha') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/notices" class="nav-link px-2" active-class="text-success fw-bold" @click="closeAll">
                {{ t('nav.notices') }}
              </router-link>
            </li>
          </ul>

          <!-- Action CTA / User Profile -->
          <div class="d-flex align-items-center gap-2 pt-2 pt-lg-0 border-top border-lg-0">
            <template v-if="activeRole === 'public'">
              <router-link to="/login" class="btn btn-outline-success btn-sm rounded-pill px-3 font-sans fw-semibold" @click="closeAll">
                <i class="bi bi-box-arrow-in-right me-1"></i> {{ t('nav.login') }}
              </router-link>
              <router-link to="/register" class="btn btn-eg-primary btn-sm rounded-pill px-3 font-sans fw-bold" @click="closeAll">
                <i class="bi bi-person-plus-fill me-1"></i> {{ t('nav.register') }}
              </router-link>
            </template>
            <template v-else>
              <div class="dropdown">
                <button class="btn btn-success bg-opacity-10 text-success border border-success border-opacity-25 btn-sm rounded-pill px-3 d-flex align-items-center gap-2 fw-bold" @click="goToDashboard">
                  <img :src="user.avatar" class="rounded-circle" width="22" height="22" />
                  <!-- <span> {{ user.name.split(' ')[0] }}</span> -->
                  <i class="bi bi-speedometer2"></i>
                </button>
              </div>
              <button class="btn btn-sm btn-outline-danger rounded-circle p-1.5" title="लॉगआउट करा" @click="handleLogout">
                <i class="bi bi-power fs-6"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n, type Locale } from '../../composables/useI18n';
import { useAuth, type UserRole, type PanchayatTenant } from '../../composables/useAuth';

const { t, locale, setLocale } = useI18n();
const { user, activeRole, activePanchayat, availablePanchayats, switchRole, setPanchayat } = useAuth();
const router = useRouter();

const isMobileMenuOpen = ref(false);
const isLangDropdownOpen = ref(false);
const isRoleDropdownOpen = ref(false);
const isTenantDropdownOpen = ref(false);

const currentLanguageLabel = computed(() => {
  if (locale.value === 'mr') return 'मराठी';
  if (locale.value === 'en') return 'English';
  return 'हिंदी';
});

const currentRoleName = computed(() => {
  switch (activeRole.value) {
    case 'user': return 'नागरिक डॅशबोर्ड';
    case 'staff': return 'कर्मचारी डॅशबोर्ड';
    case 'admin': return 'सरपंच डॅशबोर्ड';
    case 'super_admin': return 'SaaS सुपर ॲडमिन';
    default: return 'सार्वजनिक व्ह्यू';
  }
});

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  isLangDropdownOpen.value = false;
  isRoleDropdownOpen.value = false;
  isTenantDropdownOpen.value = false;
}

function toggleLangDropdown() {
  isLangDropdownOpen.value = !isLangDropdownOpen.value;
  isRoleDropdownOpen.value = false;
  isTenantDropdownOpen.value = false;
}

function toggleRoleDropdown() {
  isRoleDropdownOpen.value = !isRoleDropdownOpen.value;
  isLangDropdownOpen.value = false;
  isTenantDropdownOpen.value = false;
}

function toggleTenantDropdown() {
  isTenantDropdownOpen.value = !isTenantDropdownOpen.value;
  isRoleDropdownOpen.value = false;
  isLangDropdownOpen.value = false;
}

function closeAll() {
  isMobileMenuOpen.value = false;
  isLangDropdownOpen.value = false;
  isRoleDropdownOpen.value = false;
  isTenantDropdownOpen.value = false;
}

function changeLang(newLang: Locale) {
  setLocale(newLang);
  closeAll();
}

function changeTenant(tenant: PanchayatTenant) {
  setPanchayat(tenant);
  closeAll();
}

function selectRole(role: UserRole) {
  switchRole(role);
  closeAll();
  if (role === 'user') router.push('/citizen/dashboard');
  else if (role === 'staff') router.push('/staff/dashboard');
  else if (role === 'admin') router.push('/admin/dashboard');
  else if (role === 'super_admin') router.push('/superadmin/dashboard');
  else router.push('/');
}

function goToDashboard() {
  closeAll();
  if (activeRole.value === 'user') router.push('/citizen/dashboard');
  else if (activeRole.value === 'staff') router.push('/staff/dashboard');
  else if (activeRole.value === 'admin') router.push('/admin/dashboard');
  else if (activeRole.value === 'super_admin') router.push('/superadmin/dashboard');
  else router.push('/');
}

// function logout() {
//   switchRole('public');
//   closeAll();
//   router.push('/');
// }
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  router.replace('/');
};

// Click outside handler
function handleDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.dropdown') && !target.closest('.position-relative') && !target.closest('.navbar-toggler')) {
    closeAll();
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>
