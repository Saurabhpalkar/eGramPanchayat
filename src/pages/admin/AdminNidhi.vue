<template>
  <div>
    <DashboardHeader title="ग्रामपंचायत निधी व अर्थसंकल्प (Nidhi Management)" subtitle="आमदार, खासदार व वित्त आयोग निधी वाटप लेखाजोखा" />

    <div class="row g-4 my-3">
      <div v-for="fund in nidhiFunds" :key="fund.id" class="col-md-6 col-lg-3">
        <FundCard :fund="fund" />
      </div>
    </div>

    <!-- Allocations Breakdown -->
    <div class="eg-card p-4">
      <h5 class="fw-bold text-success mb-3"><i class="bi bi-bank me-1"></i> निधीवाटप व लेखापरीक्षण अहवाल (Audit Trail)</h5>
      <ResponsiveTable>
        <template #head>
          <tr>
            <th>निधी योजना</th>
            <th>मंजूर रक्कम</th>
            <th>खर्च झालेली रक्कम</th>
            <th>शिल्लक निधी</th>
            <th>उपयोगिता प्रमाणपत्र (UC Status)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="f in nidhiFunds" :key="f.id">
            <td><strong>{{ f.fundNameMr }}</strong></td>
            <td>₹{{ (f.allocatedAmount / 100000).toFixed(1) }} लाख</td>
            <td>₹{{ (f.utilizedAmount / 100000).toFixed(1) }} लाख</td>
            <td><strong class="text-success">₹{{ ((f.allocatedAmount - f.utilizedAmount) / 100000).toFixed(1) }} लाख</strong></td>
            <td><span class="badge bg-success bg-opacity-10 text-success">सादर केले (Submitted)</span></td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import FundCard from '../../components/cards/FundCard.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { nidhiFunds } = useMockData();
</script>
