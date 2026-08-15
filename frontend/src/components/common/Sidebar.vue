<template>
  <aside 
    class="bg-white border-end h-100 d-flex flex-column py-3 transition-all duration-300" 
    :style="{ width: collapsed ? '80px' : '260px', minHeight: 'calc(100vh - 60px)' }"
  >
    <!-- Role Header Card -->
    <div class="px-3 mb-3" v-if="!collapsed">
      <div class="p-3 rounded-3 border" style="background: linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%);">
        <div class="d-flex align-items-center gap-2 mb-2">
          <img :src="user.avatar" class="rounded-circle border border-2 border-success" width="42" height="42" alt="Avatar" />
          <div class="overflow-hidden">
            <h6 class="mb-0 text-truncate fw-bold text-success" style="font-size: 0.92rem;">{{ user.name }}</h6>
            <span class="badge bg-success bg-opacity-10 text-success text-xs border border-success border-opacity-25">{{ userRoleBadge }}</span>
          </div>
        </div>
        <div class="text-xs text-muted font-sans border-top pt-2 mt-1">
          <i class="bi bi-building me-1"></i> {{ user.panchayatName }}
        </div>
      </div>
    </div>
    <div class="text-center mb-3 px-2" v-else>
      <img :src="user.avatar" class="rounded-circle border border-2 border-success" width="40" height="40" alt="Avatar" :title="user.name" />
    </div>

    <!-- Role-Based Navigation Links -->
    <div class="flex-grow-1 px-2 overflow-y-auto">
      <!-- Citizen Links -->
      <div v-if="activeRole === 'user'" class="nav flex-column gap-1 font-sans">
        <div class="px-3 text-uppercase text-xs fw-bold text-muted mb-1">नागरिक पोर्टल (Citizen)</div>
        <router-link to="/citizen/dashboard" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-speedometer2 fs-5"></i> डॅशबोर्ड (Overview)
        </router-link>
        <router-link to="/citizen/apply" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-file-earmark-plus fs-5"></i> नवीन दाखला / अर्ज
        </router-link>
        <router-link to="/citizen/applications" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-journal-check fs-5"></i> माझे अर्ज (Applications)
        </router-link>
        <router-link to="/citizen/track" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-search fs-5"></i> अर्जाची स्थिती ट्रॅक करा
        </router-link>
        <router-link to="/citizen/complaints" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-exclamation-triangle fs-5"></i> माझ्या तक्रारी (Complaints)
        </router-link>
        <router-link to="/citizen/works" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-buildings fs-5"></i> विकास कामे (Dev Works)
        </router-link>
        <router-link to="/citizen/upcoming-works" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-calendar-event fs-5"></i> प्रस्तावित कामे (Upcoming)
        </router-link>
        <router-link to="/citizen/nidhi" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-bank2 fs-5"></i> ग्रामपंचायत निधी (Nidhi)
        </router-link>
        <router-link to="/citizen/notices" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-megaphone fs-5"></i> सूचना फलक (Notices)
        </router-link>
        <router-link to="/citizen/gram-sabha" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-people fs-5"></i> ग्रामसभा (Gram Sabha)
        </router-link>
        <router-link to="/citizen/notifications" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-bell fs-5"></i> सूचना व संदेश
        </router-link>
        <router-link to="/citizen/profile" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-person-gear fs-5"></i> माझी माहिती (Profile)
        </router-link>
      </div>

      <!-- Staff Links -->
      <div v-else-if="activeRole === 'staff'" class="nav flex-column gap-1 font-sans">
        <div class="px-3 text-uppercase text-xs fw-bold text-muted mb-1">कर्मचारी पोर्टल (Staff)</div>
        <router-link to="/staff/dashboard" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-speedometer2 fs-5"></i> वर्कस्पेस डॅशबोर्ड
        </router-link>
        <router-link to="/staff/applications" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-inbox-fill fs-5"></i> प्रलंबित अर्ज (Applications)
        </router-link>
        <router-link to="/staff/verification" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-file-earmark-check fs-5"></i> कागदपत्र पडताळणी
        </router-link>
        <router-link to="/staff/complaints" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-tools fs-5"></i> तक्रार निवारण कक्ष
        </router-link>
        <router-link to="/staff/works" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-buildings-fill fs-5"></i> विकास कामे प्रगती
        </router-link>
        <router-link to="/staff/certificates" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-award-fill fs-5"></i> दाखले निर्गमित करणे
        </router-link>
        <router-link to="/staff/citizens" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-person-search fs-5"></i> नागरिक शोध व नोंदवही
        </router-link>
        <router-link to="/staff/reports" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-bar-chart-line-fill fs-5"></i> दैनिक रिपोर्ट्स
        </router-link>
        <router-link to="/staff/notifications" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-bell-fill fs-5"></i> सूचना व अलर्ट्स
        </router-link>
        <router-link to="/staff/profile" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-person-badge fs-5"></i> माझी प्रोफाईल
        </router-link>
      </div>

      <!-- Admin Links (Sarpanch / Gram Sevak) -->
      <div v-else-if="activeRole === 'admin'" class="nav flex-column gap-1 font-sans">
        <div class="px-3 text-uppercase text-xs fw-bold text-muted mb-1">सरपंच / ग्रामसेवक Admin</div>
        <router-link to="/admin/dashboard" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-speedometer2 fs-5"></i> मुख्य डॅशबोर्ड
        </router-link>
        <router-link to="/admin/applications" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-clipboard-data fs-5"></i> सर्व अर्ज व्यवस्थापन
        </router-link>
        <router-link to="/admin/complaints" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-exclamation-square-fill fs-5"></i> तक्रार आढावा
        </router-link>
        <router-link to="/admin/works" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-buildings-fill fs-5"></i> विकास कामे मॉनिटरिंग
        </router-link>
        <router-link to="/admin/nidhi" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-bank2 fs-5"></i> निधी व अर्थसंकल्प (Nidhi)
        </router-link>
        <router-link to="/admin/notices" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-megaphone-fill fs-5"></i> सूचना फलक व जाहिरनामा
        </router-link>
        <router-link to="/admin/gram-sabha" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-people-fill fs-5"></i> ग्रामसभा नियोजन
        </router-link>
        <router-link to="/admin/staff" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-person-workspace fs-5"></i> कर्मचारी व्यवस्थापन
        </router-link>
        <router-link to="/admin/reports" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-graph-up-arrow fs-5"></i> अहवाल व रिपोर्ट्स
        </router-link>
      </div>

      <!-- Super Admin Links -->
      <div v-else-if="activeRole === 'super_admin'" class="nav flex-column gap-1 font-sans">
        <div class="px-3 text-uppercase text-xs fw-bold text-muted mb-1">SaaS Owner Super Admin</div>
        <router-link to="/superadmin/dashboard" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-speedometer2 fs-5"></i> डॅशबोर्ड (Dashboard)
        </router-link>
        <router-link to="/superadmin/panchayats" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-buildings fs-5"></i> ग्रामपंचायत व्यवस्थापन
        </router-link>
        <router-link to="/superadmin/add-panchayat" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-plus-circle-fill fs-5"></i> नवीन GP जोडा
        </router-link>
        <router-link to="/superadmin/admins" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-person-badge-fill fs-5"></i> ॲडमिन (सरपंच)
        </router-link>
        <router-link to="/superadmin/staff" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-person-workspace fs-5"></i> सर्व कर्मचारी (Staff)
        </router-link>
        <router-link to="/superadmin/users" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-people-fill fs-5"></i> नोंदणीकृत नागरिक (Users)
        </router-link>
        <router-link to="/superadmin/subscriptions" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-credit-card-2-front-fill fs-5"></i> सबस्क्रिप्शन प्लॅन्स
        </router-link>
        <router-link to="/superadmin/payments" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-cash-stack fs-5"></i> पेमेंट व इनव्हॉईस
        </router-link>
        <router-link to="/superadmin/analytics" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-bar-chart-line-fill fs-5"></i> ॲनालिटिक्स (Growth)
        </router-link>
        <router-link to="/superadmin/reports" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-file-earmark-bar-graph-fill fs-5"></i> रिपोर्ट्स व ऑडिट
        </router-link>
        <router-link to="/superadmin/settings" class="nav-link rounded-2 text-dark py-2 px-3 d-flex align-items-center gap-2" active-class="bg-success text-white fw-bold shadow-sm">
          <i class="bi bi-gear-wide-connected fs-5"></i> सिस्टीम सेटींग्ज
        </router-link>
      </div>
    </div>

    <!-- Back to Public Site -->
    <div class="p-3 border-top mt-auto">
      <router-link to="/" class="btn btn-outline-success btn-sm w-100 rounded-pill d-flex align-items-center justify-content-center gap-2">
        <i class="bi bi-globe"></i> सार्वजनिक संकेतस्थळ
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '../../composables/useAuth';
// console.log('useAuth:', useAuth());
defineProps<{
  collapsed?: boolean;
}>();

const { user, activeRole } = useAuth();

const userRoleBadge = computed(() => {
  switch (activeRole.value) {
    case 'user': return 'नागरिक';
    case 'staff': return 'ग्रामपंचायत कर्मचारी';
    case 'admin': return 'सरपंच / Gram Sevak';
    case 'super_admin': return 'SaaS Owner';
    default: return 'पाहुणे';
  }
});
</script>
