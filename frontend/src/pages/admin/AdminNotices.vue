<template>
  <div>
    <DashboardHeader title="ग्रामपंचायत सूचना फलक व्यवस्थापन (Notices)" subtitle="नागरिकांसाठी जाहीर प्रकटन व महत्त्वाच्या सूचना जारी करा" />

    <div class="d-flex justify-content-between align-items-center my-3 font-sans">
      <h6 class="fw-bold text-success mb-0">सध्याचे प्रकाशित फलक</h6>
      <button class="btn btn-eg-primary btn-sm rounded-pill fw-bold" @click="showModal = true">
        <i class="bi bi-plus-circle me-1"></i> नवीन नोटीस काढा
      </button>
    </div>

    <div class="row g-3">
      <div v-for="ntc in notices" :key="ntc.id" class="col-md-6">
        <NoticeCard :notice="ntc" />
      </div>
    </div>

    <!-- Create Notice Modal -->
    <div v-if="showModal" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans">
          <h5 class="fw-bold text-success mb-3">नवीन सूचना प्रकाशित करा</h5>
          <form @submit.prevent="handlePublishNotice">
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">सूचनेचा मुख्य विषय *</label>
              <input type="text" v-model="title" required class="form-control" placeholder="उदा. घरपट्टी १०% सवलत मुदतवाढ" />
            </div>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold">सविस्तर तपशील *</label>
              <textarea v-model="desc" rows="3" required class="form-control" placeholder="सूचना मजकूर लिहा..."></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-light rounded-pill px-4" @click="showModal = false">रद्द करा</button>
              <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold">प्रकाशित करा</button>
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
import NoticeCard from '../../components/cards/NoticeCard.vue';

const { notices, addNotice } = useMockData();
const showModal = ref(false);
const title = ref('');
const desc = ref('');

function handlePublishNotice() {
  if (!title.value) return;
  addNotice({
    titleMr: title.value,
    descriptionMr: desc.value,
    category: 'General Notice',
    publishDate: '२०२६-०८-०१',
    isUrgent: true,
    issuedByMr: 'सौ. सुनीता पाटील (सरपंच)'
  });
  showModal.value = false;
  title.value = '';
  desc.value = '';
}
</script>
