<template>
  <div>
    <DashboardHeader title="सूचना व संदेश (Notifications)" subtitle="आपल्या अर्जाची प्रगती, कर भरणा स्मरणपत्रे व ग्रामसभा निमंत्रणे" />

    <!-- Action Bar -->
    <div class="eg-card p-3 my-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div class="btn-group font-sans">
        <button 
          class="btn btn-sm" 
          :class="filterType === 'ALL' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="filterType = 'ALL'"
        >
          सर्व सूचना ({{ notifications.length }})
        </button>
        <button 
          class="btn btn-sm" 
          :class="filterType === 'UNREAD' ? 'btn-success fw-bold' : 'btn-outline-secondary'"
          @click="filterType = 'UNREAD'"
        >
          नवीन ({{ unreadCount }})
        </button>
      </div>

      <button class="btn btn-outline-success btn-sm rounded-pill font-sans fw-semibold" @click="markAllAsRead">
        <i class="bi bi-check-all me-1"></i> सर्व वाचन केले (Mark as read)
      </button>
    </div>

    <!-- Notifications List -->
    <div class="d-flex flex-column gap-2 mb-4 font-sans">
      <div 
        v-for="notif in filteredNotifications" 
        :key="notif.id"
        class="eg-card p-3 border-start border-4 hover-shadow transition-all"
        :class="{
          'border-success bg-white': notif.isUnread && notif.type === 'SUCCESS',
          'border-warning bg-white': notif.isUnread && notif.type === 'ALERT',
          'border-secondary bg-light opacity-85': !notif.isUnread
        }"
      >
        <div class="d-flex align-items-start justify-content-between gap-3">
          <div class="d-flex align-items-start gap-3">
            <div 
              class="rounded-circle p-2.5 d-flex align-items-center justify-content-center text-white flex-shrink-0"
              :class="{
                'bg-success': notif.type === 'SUCCESS',
                'bg-warning text-dark': notif.type === 'ALERT',
                'bg-primary': notif.type === 'INFO'
              }"
              style="width: 40px; height: 40px;"
            >
              <i class="bi fs-5" :class="notif.icon || 'bi-bell'"></i>
            </div>

            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <h6 class="fw-bold text-dark mb-0 text-sm" style="font-family: var(--font-marathi);">{{ notif.titleMr }}</h6>
                <span v-if="notif.isUnread" class="badge bg-danger text-white text-xs">नवीन</span>
              </div>
              <p class="text-xs text-secondary mb-2">{{ notif.messageMr }}</p>
              <small class="text-muted text-xs"><i class="bi bi-clock me-1"></i>{{ notif.timeAgo }}</small>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <router-link v-if="notif.link" :to="notif.link" class="btn btn-sm btn-outline-success rounded-pill text-xs fw-bold px-3">
              पाहण्यासाठी क्लिक करा <i class="bi bi-arrow-right"></i>
            </router-link>
            <button class="btn btn-sm btn-light text-muted border rounded-circle p-1" @click="toggleRead(notif)" title="स्थिती बदला">
              <i class="bi" :class="notif.isUnread ? 'bi-circle' : 'bi-check-circle-fill text-success'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const filterType = ref<'ALL' | 'UNREAD'>('ALL');

const notifications = ref([
  {
    id: 'n1',
    titleMr: 'उत्पन्न दाखला मंजूर झाला!',
    messageMr: 'आपला उत्पन्न दाखला (APP-2026-4821) ग्रामपंचायतीकडून मंजूर झाला आहे. ऑनलाईन PDF डाऊनलोड करा.',
    timeAgo: '१० मिनिटांपूर्वी',
    type: 'SUCCESS',
    icon: 'bi-award-fill',
    link: '/citizen/applications',
    isUnread: true
  },
  {
    id: 'n2',
    titleMr: 'घरपट्टी कर सवलत अंतिम मुदत स्मरणपत्र',
    messageMr: 'घरपट्टी करावर ५% सवलत मिळवण्याची अंतिम तारीख १५ फेब्रुवारी आहे. ऑनलाईन कर भरणा करा.',
    timeAgo: '२ तासांपूर्वी',
    type: 'ALERT',
    icon: 'bi-exclamation-triangle-fill',
    link: '/citizen/nidhi',
    isUnread: true
  },
  {
    id: 'n3',
    titleMr: 'आगामी विशेष ग्रामसभा निमंत्रण',
    messageMr: '२६ जानेवारी रोजी सकाळी ११:०० वाजता ग्रामसभा सभागृहात विशेष ग्रामसभेचे आयोजन करण्यात आले आहे.',
    timeAgo: '१ दिवसापूर्वी',
    type: 'INFO',
    icon: 'bi-people-fill',
    link: '/citizen/gram-sabha',
    isUnread: false
  },
  {
    id: 'n4',
    titleMr: 'तक्रार निवारण अद्यतन',
    messageMr: 'आपल्या टिकीट क्र. SHV-2026-8912 (स्ट्रीट लाईट दुरुस्ती) वर कर्मचाऱ्याची नियुक्ती झाली आहे.',
    timeAgo: '२ दिवसांपूर्वी',
    type: 'SUCCESS',
    icon: 'bi-tools',
    link: '/citizen/complaints',
    isUnread: false
  }
]);

const unreadCount = computed(() => notifications.value.filter(n => n.isUnread).length);

const filteredNotifications = computed(() => {
  if (filterType.value === 'UNREAD') return notifications.value.filter(n => n.isUnread);
  return notifications.value;
});

function markAllAsRead() {
  notifications.value.forEach(n => n.isUnread = false);
}

function toggleRead(notif: any) {
  notif.isUnread = !notif.isUnread;
}
</script>
