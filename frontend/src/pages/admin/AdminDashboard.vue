<template>
  <div>
    <DashboardHeader title="सरपंच व ग्रामसेवक कमांड सेंटर (Admin Dashboard)" subtitle="शिवणे ग्रामपंचायत कारभार व मॉनिटरिंग" />

    <!-- Top Admin Banner -->
    <div class="eg-card p-4 my-3 bg-dark text-white rounded-4" style="background: linear-gradient(135deg, #1B5E20, #144718) !important;">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <span class="badge bg-warning text-dark font-sans text-xs mb-2">शिवणे ग्रामपंचायत - हवेली (पुणे)</span>
          <h3 class="fw-bold text-white mb-1">नमस्कार, सौ. सुनीता पाटील (सरपंच)</h3>
          <p class="text-white-50 text-xs mb-0 font-sans">
            डिजिटल गव्हर्नन्स डॅशबोर्ड: आज अखेर ९८.५% अर्ज वेळेत मंजूर | एकूण ४५+ विकास कामे सुरु
          </p>
        </div>
        <div class="d-flex gap-2">
          <router-link to="/admin/works" class="btn btn-eg-primary btn-sm rounded-pill font-sans">
            <i class="bi bi-buildings-fill me-1"></i> विकास कामे पाहा
          </router-link>
          <router-link to="/admin/notices" class="btn btn-outline-light btn-sm rounded-pill font-sans">
            <i class="bi bi-plus-circle me-1"></i> नवीन नोटीस काढा
          </router-link>
        </div>
      </div>
    </div>

    <!-- Admin KPI Cards Grid -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-file-earmark-text-fill" label="एकूण अर्ज प्राप्त" :value="dashboardStats.totalApps" variant="green" trend="९८.५% SLA" :trendUp="true" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-shield-fill-check" label="तक्रार निवारण दर" :value="`${dashboardStats.resolutionRate}%`" variant="gold" trend="सरासरी ४८ तास" :trendUp="true" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-bank2" label="एकूण प्राप्त निधी" :value="`₹${(dashboardStats.totalFundsAllocated / 100000).toFixed(1)}L`" variant="blue" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-pie-chart-fill" label="निधी वापर" :value="`₹${(dashboardStats.totalFundsUtilized / 100000).toFixed(1)}L`" variant="brown" />
      </div>
    </div>

    <!-- Recent Works & Complaints Split Section -->
    <div class="row g-4 mb-4">
      <div class="col-lg-6">
        <div class="eg-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-success mb-0"><i class="bi bi-buildings me-1"></i> प्रगतीपथावरील विकास कामे</h5>
            <router-link to="/admin/works" class="text-xs text-success fw-bold">मॅनेज करा <i class="bi bi-chevron-right"></i></router-link>
          </div>
          <div class="d-flex flex-column gap-3">
            <WorkCard v-for="work in devWorks.slice(0, 2)" :key="work.id" :work="work" />
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="eg-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-success mb-0"><i class="bi bi-bank2 me-1"></i> निधी वापर स्थिती</h5>
            <router-link to="/admin/nidhi" class="text-xs text-success fw-bold">तपशील पाहा <i class="bi bi-chevron-right"></i></router-link>
          </div>
          <div class="d-flex flex-column gap-3">
            <FundCard v-for="fund in nidhiFunds.slice(0, 2)" :key="fund.id" :fund="fund" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';
import WorkCard from '../../components/cards/WorkCard.vue';
import FundCard from '../../components/cards/FundCard.vue';

const { user } = useAuth();
const { devWorks, nidhiFunds, dashboardStats } = useMockData();
</script>
