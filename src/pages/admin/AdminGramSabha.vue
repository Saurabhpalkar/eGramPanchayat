<template>
  <div>
    <DashboardHeader title="ग्रामसभा व बैठका नियोजन (Gram Sabha Admin)" subtitle="ग्रामसभा नोटीस जारी करणे व इतिवृत्त अपडेट करणे" />

    <div class="eg-card p-4 my-3 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0">आयोजित ग्रामसभा व इतिवृत्त (Gram Sabha Meetings)</h6>
        <button class="btn btn-eg-primary btn-sm rounded-pill fw-bold" @click="showModal = true">
          <i class="bi bi-calendar-plus me-1"></i> नवीन ग्रामसभा जाहीर करा
        </button>
      </div>

      <div class="d-flex flex-column gap-3">
        <div v-for="sabha in gramSabhaMeetings" :key="sabha.id" class="p-3 bg-light rounded-3 border">
          <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
            <h6 class="fw-bold text-success mb-0">{{ sabha.titleMr }} ({{ sabha.meetingNumber }})</h6>
            <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">{{ sabha.status }}</span>
          </div>
          <div class="text-xs text-muted mb-2 d-flex flex-wrap gap-3">
            <span><i class="bi bi-calendar3 me-1 text-success"></i>दिनांक: <strong>{{ sabha.date }}</strong></span>
            <span><i class="bi bi-clock me-1 text-success"></i>वेळ: <strong>{{ sabha.time }}</strong></span>
            <span><i class="bi bi-geo-alt me-1 text-success"></i>ठिकाण: <strong>{{ sabha.location }}</strong></span>
          </div>
          <div class="text-xs mb-3">
            <strong class="d-block mb-1 text-dark">विषय पत्रिका (Agenda):</strong>
            <ul class="mb-0 ps-3">
              <li v-for="(item, idx) in sabha.agendaMr" :key="idx" class="text-muted">{{ item }}</li>
            </ul>
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-2">
            <button class="btn btn-sm btn-outline-success rounded-pill text-xs px-3">
              <i class="bi bi-file-earmark-pdf me-1"></i> इतिवृत्त डाउनलोड (Minutes PDF)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Gram Sabha Modal -->
    <div v-if="showModal" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <h5 class="fw-bold text-success mb-3"><i class="bi bi-calendar-check me-2"></i>नवीन ग्रामसभा जाहीर करा</h5>
          <form @submit.prevent="handleScheduleSabha">
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">ग्रामसभेचे नाव / प्रकार *</label>
              <input type="text" v-model="title" required class="form-control" placeholder="उदा. स्वातंत्र्य दिन विशेष ग्रामसभा" />
            </div>
            <div class="row g-2 mb-3">
              <div class="col-6">
                <label class="form-label text-xs fw-bold">दिनांक *</label>
                <input type="date" v-model="date" required class="form-control" />
              </div>
              <div class="col-6">
                <label class="form-label text-xs fw-bold">वेळ *</label>
                <input type="time" v-model="time" required class="form-control" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">स्थान / ठिकाण *</label>
              <input type="text" v-model="location" required class="form-control" placeholder="उदा. ग्रामपंचायत सभागृह, शिवणे" />
            </div>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">मुख्य विषय (कॉमा देवून लिहा) *</label>
              <textarea v-model="agenda" rows="3" required class="form-control" placeholder="उदा. १. मागील सभेचे इतिवृत्त वाचन, २. वार्षिक अंदाजपत्रक मंजुरी"></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-light rounded-pill px-4" @click="showModal = false">रद्द करा</button>
              <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold">सभानियोजन सेव्ह करा</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const { gramSabhaMeetings, addGramSabha } = useMockData();

const showModal = ref(false);
const title = ref('');
const date = ref('');
const time = ref('');
const location = ref('');
const agenda = ref('');

function handleScheduleSabha() {
  if (!title.value || !date.value) return;
  const agendaList = agenda.value.split(',').map(item => item.trim()).filter(Boolean);
  
  addGramSabha({
    meetingNumber: `GS-2026-0${gramSabhaMeetings.value.length + 1}`,
    titleMr: title.value,
    titleEn: title.value,
    date: date.value,
    time: time.value || 'सकाळी १०:०० वाजता',
    location: location.value || 'ग्रामपंचायत कार्यालय सभागृह',
    status: 'Scheduled',
    agendaMr: agendaList.length ? agendaList : ['मागील सभेच्या इतिवृत्ताला मंजुरी देणे', 'ग्रामविकास निधी खर्च आढावा'],
    resolutionsPassed: []
  });

  showModal.value = false;
  title.value = '';
  date.value = '';
  time.value = '';
  location.value = '';
  agenda.value = '';
}
</script>
