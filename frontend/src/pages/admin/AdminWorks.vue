<template>
  <div>
    <DashboardHeader title="ग्राम विकास कामे व्यवस्थापन (Development Works)" subtitle="गावातील रस्ते, पाणी व सौरऊर्जा प्रकल्पांचे मॉनिटरिंग" />

    <div class="d-flex justify-content-between align-items-center my-3 font-sans">
      <h6 class="fw-bold text-success mb-0">सुरू असलेल्या व पूर्ण झालेल्या विकास कामांची यादी</h6>
      <button class="btn btn-eg-primary btn-sm rounded-pill fw-bold" @click="showAddModal = true">
        <i class="bi bi-plus-circle me-1"></i> नवीन विकास काम जोडा
      </button>
    </div>

    <div class="row g-4">
      <div v-for="work in devWorks" :key="work.id" class="col-md-6 col-lg-4">
        <WorkCard :work="work" />
      </div>
    </div>

    <!-- Add Work Modal -->
    <div v-if="showAddModal" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <h5 class="fw-bold text-success mb-3">नवीन विकास काम जोडा</h5>
          <form @submit.prevent="handleAddWork">
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">कामाचे नाव (मराठी) *</label>
              <input type="text" v-model="newTitle" required class="form-control" placeholder="उदा. वॉर्ड ४ अंतर्गत काँक्रिट रस्ता बांधकाम" />
            </div>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">मंजूर अंदाजपत्रक (Budget in Lakhs) *</label>
              <input type="number" v-model="newBudget" required class="form-control" placeholder="उदा. १५.५" />
            </div>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">ठेकेदार / एजन्सी नाव *</label>
              <input type="text" v-model="newContractor" required class="form-control" placeholder="उदा. पाटील कन्स्ट्रक्शन्स" />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-light rounded-pill px-4" @click="showAddModal = false">रद्द करा</button>
              <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold">काम सेव्ह करा</button>
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
import WorkCard from '../../components/cards/WorkCard.vue';

const { devWorks, addDevWork } = useMockData();
const showAddModal = ref(false);

const newTitle = ref('');
const newBudget = ref<number | ''>('');
const newContractor = ref('');

function handleAddWork() {
  if (!newTitle.value || !newBudget.value) return;
  addDevWork({
    titleMr: newTitle.value,
    titleEn: newTitle.value,
    category: 'Infra',
    budgetLakhs: Number(newBudget.value),
    spentLakhs: 0,
    progressPercent: 10,
    status: 'In Progress',
    contractorName: newContractor.value,
    startDate: '२०२६-०८-०१',
    expectedCompletionDate: '२०२६-१२-३१',
    location: 'शिवणे गाव',
    fundSource: '१५ वा वित्त आयोग',
    images: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80']
  });
  showAddModal.value = false;
  newTitle.value = '';
  newBudget.value = '';
  newContractor.value = '';
}
</script>
