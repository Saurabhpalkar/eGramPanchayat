<template>
  <div>
    <DashboardHeader title="तक्रार निवारण नियंत्रण कक्ष (Complaint Review)" subtitle="गावातील पाणी, रस्ते व स्वच्छतेच्या तक्रारींचा थेट आढावा" />

    <div class="row g-3 my-3">
      <div v-for="cmp in complaints" :key="cmp.id" class="col-md-6">
        <div class="eg-card p-3">
          <ComplaintCard :complaint="cmp" />
          <div class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center font-sans">
            <span class="text-xs text-muted">
              नियुक्त कर्मचारी: <strong>{{ cmp.assignedStaff || 'नियुक्त करा' }}</strong>
            </span>
            <button 
              v-if="cmp.status !== 'Resolved'" 
              class="btn btn-sm btn-eg-primary rounded-pill text-xs fw-bold"
              @click="resolveComplaint(cmp.id)"
            >
              <i class="bi bi-check-circle me-1"></i> निवारण पूर्ण मार्क करा
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import ComplaintCard from '../../components/cards/ComplaintCard.vue';

const { complaints, updateComplaintStatus } = useMockData();

function resolveComplaint(id: string) {
  updateComplaintStatus(id, 'Resolved', 'तक्रार निवारण पूर्ण', 'ग्रामसेवक', 'कर्मचाऱ्याने जागेवर जाऊन दुरुस्ती काम पूर्ण केले.');
}
</script>
