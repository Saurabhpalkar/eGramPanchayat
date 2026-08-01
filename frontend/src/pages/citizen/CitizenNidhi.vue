<template>
  <div>
    <DashboardHeader title="ग्रामपंचायत निधी पारदर्शकता (Nidhi Portal)" subtitle="सरकारी अनुदान, जमा-खर्च व १५ वा वित्त आयोग पारदर्शक विवरण" />

    <!-- Top Summary Cards -->
    <div class="row g-3 my-3">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-bank2" label="एकूण प्राप्त अनुदान" :value="'₹' + (totalAllocated / 100000).toFixed(1) + ' लाख'" variant="green" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-cash-coin" label="एकूण खर्च (Utilized)" :value="'₹' + (totalUtilized / 100000).toFixed(1) + ' लाख'" variant="gold" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-wallet2" label="शिल्लक निधी (Balance)" :value="'₹' + (balanceFund / 100000).toFixed(1) + ' लाख'" variant="blue" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-pie-chart-fill" label="निधी वापर प्रमाण" :value="overallUtilizationRate + '%'" variant="red" />
      </div>
    </div>

    <!-- Overall Progress Banner -->
    <div class="eg-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div>
          <h5 class="fw-bold text-success mb-1"><i class="bi bi-bar-chart-line me-2"></i>निधी वापर प्रगती (Fund Utilization Status)</h5>
          <span class="text-xs text-muted font-sans">आर्थिक वर्ष २०२५-२०२६ अंतर्गत सर्व योजना</span>
        </div>
        <button class="btn btn-outline-success btn-sm rounded-pill font-sans fw-bold px-3" @click="downloadBudgetDoc">
          <i class="bi bi-file-earmark-pdf me-1"></i> वार्षिक बजेट रिपोर्ट डाऊनलोड
        </button>
      </div>

      <div class="progress mt-3" style="height: 14px;">
        <div 
          class="progress-bar bg-success bg-gradient" 
          role="progressbar" 
          :style="{ width: overallUtilizationRate + '%' }"
        >
          {{ overallUtilizationRate }}% खर्च झाला
        </div>
      </div>
    </div>

    <!-- Scheme Breakdown Cards -->
    <div class="row g-3">
      <div v-for="fund in nidhiFunds" :key="fund.id" class="col-md-6">
        <div class="eg-card h-100 p-4 border hover-shadow transition-all">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 font-sans">
              {{ fund.headType || 'सरकारी अनुदान' }}
            </span>
            <span class="text-xs text-muted font-sans">आर्थिक वर्ष: {{ fund.financialYear || '२०२५-२६' }}</span>
          </div>

          <h5 class="fw-bold text-dark mb-3" style="font-family: var(--font-marathi);">{{ fund.schemeNameMr }}</h5>

          <div class="row g-2 mb-3 font-sans text-xs">
            <div class="col-4 bg-light p-2 rounded text-center border">
              <span class="text-muted d-block">मंजूर निधी</span>
              <strong class="text-success fs-6">₹{{ (fund.totalAllocated / 100000).toFixed(2) }} L</strong>
            </div>
            <div class="col-4 bg-light p-2 rounded text-center border">
              <span class="text-muted d-block">झालेला खर्च</span>
              <strong class="text-primary fs-6">₹{{ (fund.utilized / 100000).toFixed(2) }} L</strong>
            </div>
            <div class="col-4 bg-light p-2 rounded text-center border">
              <span class="text-muted d-block">शिल्लक रक्कम</span>
              <strong class="text-warning fs-6">₹{{ ((fund.totalAllocated - fund.utilized) / 100000).toFixed(2) }} L</strong>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-2">
            <div class="d-flex justify-content-between text-xs font-sans fw-bold mb-1">
              <span>वापर टक्केवारी:</span>
              <span>{{ Math.round((fund.utilized / fund.totalAllocated) * 100) }}%</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div 
                class="progress-bar bg-success" 
                role="progressbar" 
                :style="{ width: Math.round((fund.utilized / fund.totalAllocated) * 100) + '%' }"
              ></div>
            </div>
          </div>

          <p class="text-xs text-muted font-sans mb-0 mt-3 border-top pt-2">
            <i class="bi bi-info-circle me-1"></i> मुख्य उपयोग: {{ fund.purposeMr || 'गावातील मूलभूत सुविधा, रस्ते, पाणीपुरवठा व स्वच्छता कामे' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';

const { nidhiFunds } = useMockData();

const totalAllocated = computed(() => nidhiFunds.value.reduce((acc, f) => acc + f.totalAllocated, 0));
const totalUtilized = computed(() => nidhiFunds.value.reduce((acc, f) => acc + f.utilized, 0));
const balanceFund = computed(() => totalAllocated.value - totalUtilized.value);
const overallUtilizationRate = computed(() => Math.round((totalUtilized.value / (totalAllocated.value || 1)) * 100));

function downloadBudgetDoc() {
  alert('ग्रामपंचायत वार्षिक आर्थिक जमा-खर्च ऑडिट अहवाल डाऊनलोड सुरू झाला आहे.');
}
</script>
