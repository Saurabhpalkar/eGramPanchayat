<template>
  <div>
    <DashboardHeader title="सर्व नागरिक अर्ज व्यवस्थापन (All Applications)" subtitle="ग्रामपंचायत दाखले, परवाने व कर भरणा अर्ज मॉनिटरिंग" />

    <!-- Filters & Search -->
    <div class="eg-card p-3 my-3 font-sans">
      <div class="row g-2 align-items-center">
        <div class="col-md-5">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
            <input type="text" v-model="searchQuery" class="form-control" placeholder="अर्ज क्र. किंवा नागरिकाचे नाव शोधा..." />
          </div>
        </div>
        <div class="col-md-4">
          <select class="form-select form-select-sm" v-model="statusFilter">
            <option value="ALL">सर्व स्थिती (All Status)</option>
            <option value="Pending Verification">पडताळणी प्रलंबित (Pending)</option>
            <option value="Certificate Generated">मंजूर / दाखला तयार (Approved)</option>
            <option value="Rejected">नामंजूर (Rejected)</option>
          </select>
        </div>
        <div class="col-md-3 text-md-end">
          <span class="text-xs text-muted">एकूण अर्ज: <strong>{{ filteredApps.length }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="eg-card p-4 mb-4">
      <ResponsiveTable>
        <template #head>
          <tr>
            <th>अर्ज क्रमांक</th>
            <th>नागरिक नाव</th>
            <th>दाखला / सेवा</th>
            <th>दाखल तारीख</th>
            <th>अंतिम मुदत</th>
            <th>शुल्क</th>
            <th>सद्यस्थिती</th>
            <th>कार्रवाई (Action)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="app in filteredApps" :key="app.id">
            <td><strong class="text-dark">{{ app.applicationNo }}</strong></td>
            <td>
              <div>{{ app.citizenName }}</div>
              <small class="text-muted d-block text-xs">मो: {{ app.phone }}</small>
            </td>
            <td>{{ app.serviceNameMr }}</td>
            <td>{{ app.appliedDate }}</td>
            <td><span class="text-warning">{{ app.dueDate }}</span></td>
            <td>₹{{ app.amount }}</td>
            <td><StatusBadge :status="app.status" :text="app.statusMr" /></td>
            <td>
              <div class="d-flex gap-1">
                <button 
                  v-if="app.status === 'Pending Verification'" 
                  class="btn btn-sm btn-success rounded-pill text-xs px-2 py-0.5"
                  @click="approveApp(app.id)"
                >
                  डिजिटल सही व मंजूर
                </button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill text-xs px-2 py-0.5">
                  तपशील
                </button>
              </div>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { citizenApplications, updateApplicationStatus } = useMockData();

const searchQuery = ref('');
const statusFilter = ref('ALL');

const filteredApps = computed(() => {
  return citizenApplications.value.filter(app => {
    const matchesSearch = app.applicationNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          app.citizenName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          app.serviceNameMr.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'ALL' || app.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

function approveApp(id: string) {
  updateApplicationStatus(id, 'Certificate Generated', 'डिजिटल सहीचा दाखला तयार', 'सौ. सुनीता पाटील (सरपंच)');
}
</script>
