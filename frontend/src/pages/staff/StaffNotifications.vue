<template>
  <div>
    <DashboardHeader 
      title="सूचना व अलर्ट्स (Staff Notification Center)" 
      subtitle="असाईन केलेले नवीन अर्ज, तक्रारी, नागरिक अपडेट्स व ग्रामसेवक कमेंट्स" 
    />

    <div class="eg-card p-4 my-3 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0">
          <i class="bi bi-bell-fill me-2"></i>सर्व सूचना व अलर्ट्स ({{ notifications.length }})
        </h6>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-success rounded-pill text-xs" @click="markAllRead">
            <i class="bi bi-check-all me-1"></i> सर्व वाचल्या म्हणून मार्क करा
          </button>
        </div>
      </div>

      <div class="d-flex flex-column gap-2">
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="p-3 rounded-3 border transition-all d-flex justify-content-between align-items-center"
          :class="notif.read ? 'bg-light text-muted' : 'bg-white border-success shadow-sm'"
        >
          <div class="d-flex align-items-start gap-3">
            <div :class="['rounded-circle p-2 text-white d-flex align-items-center justify-content-center', notif.iconBg]" style="width: 38px; height: 38px;">
              <i :class="['bi', notif.icon]"></i>
            </div>
            <div>
              <div class="fw-bold text-dark text-xs mb-1">{{ notif.title }}</div>
              <p class="text-xs mb-1" :class="notif.read ? 'text-muted' : 'text-dark'">{{ notif.message }}</p>
              <small class="text-muted text-xs"><i class="bi bi-clock me-1"></i>{{ notif.time }}</small>
            </div>
          </div>

          <div>
            <span v-if="!notif.read" class="badge bg-danger rounded-pill text-xs">नवीन</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const notifications = ref([
  {
    id: 1,
    title: 'नवीन अर्ज पडताळणी असाईन झाली',
    message: 'संजय बबनराव देशमुख यांनी उत्पन्न दाखल्यासाठी ऑनलाईन अर्ज APP-2026-9045 सादर केला आहे.',
    time: '१० मिनिटांपूर्वी',
    icon: 'bi-inbox-fill',
    iconBg: 'bg-primary',
    read: false
  },
  {
    id: 2,
    title: 'SLA इशारा - डेडलाईन जवळ आली आहे',
    message: 'पोलीस पाटील दाखला अर्ज APP-2026-9012 ची अंतिम मुदत आज सायंकाळी ५ वाजता संपत आहे.',
    time: '१ तासापूर्वी',
    icon: 'bi-exclamation-triangle-fill',
    iconBg: 'bg-warning text-dark',
    read: false
  },
  {
    id: 3,
    title: 'नवीन तक्रार असाईन केली',
    message: 'सरपंचांनी मारुती मंदिराशेजारील गटार तुंबल्याबाबतची तक्रार #SHV-2026-4421 तुमच्याकडे असाईन केली.',
    time: '२ तासांपूर्वी',
    icon: 'bi-tools',
    iconBg: 'bg-danger',
    read: false
  },
  {
    id: 4,
    title: 'कागदपत्र पुन्हा अपलोड केले',
    message: 'नागरिक रमेश साळुंखे यांनी सुधारित ७/१२ उतारा फाईल पुन्हा अपलोड केली आहे.',
    time: 'काल दुपारी ०३:०० वाजता',
    icon: 'bi-file-earmark-check',
    iconBg: 'bg-success',
    read: true
  }
]);

function markAllRead() {
  notifications.value.forEach(n => n.read = true);
}
</script>
