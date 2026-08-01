<template>
  <div>
    <DashboardHeader title="ग्रामपंचायत अहवाल व ॲनालिटिक्स (Reports)" subtitle="दाखले वितरण, कर वसुली व तक्रार निवारण अहवाल" />

    <div class="row g-3 my-3 font-sans">
      <div class="col-md-4">
        <div class="eg-card p-4 text-center border-top border-4 border-success">
          <h3 class="fw-bold text-success mb-1">९८.२%</h3>
          <p class="text-xs text-muted mb-0">वेळेत वितरीत केलेले दाखले (SLA Compliance)</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="eg-card p-4 text-center border-top border-4 border-warning">
          <h3 class="fw-bold text-dark mb-1">₹२८.४ लाख</h3>
          <p class="text-xs text-muted mb-0">चालू आर्थिक वर्षातील घरपट्टी व पाणीपट्टी वसुली</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="eg-card p-4 text-center border-top border-4 border-info">
          <h3 class="fw-bold text-info mb-1">४८ तास</h3>
          <p class="text-xs text-muted mb-0">सरासरी तक्रार निवारण कालावधी</p>
        </div>
      </div>
    </div>

    <!-- Monthly Trend Chart Mock -->
    <div class="eg-card p-4 my-3 font-sans">
      <h6 class="fw-bold text-success mb-3"><i class="bi bi-bar-chart-line me-1"></i> मासिक अर्ज व दाखले वितरण प्रगती (२०२६)</h6>
      <div class="bg-light p-4 rounded-3 text-center border">
        <div class="d-flex align-items-end justify-content-around style-chart" style="height: 180px;">
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 100px; width: 40px;"></div><small class="mt-2 text-xs">जानेवारी</small></div>
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 130px; width: 40px;"></div><small class="mt-2 text-xs">फेब्रुवारी</small></div>
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 110px; width: 40px;"></div><small class="mt-2 text-xs">मार्च</small></div>
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 150px; width: 40px;"></div><small class="mt-2 text-xs">एप्रिल</small></div>
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 160px; width: 40px;"></div><small class="mt-2 text-xs">मे</small></div>
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 140px; width: 40px;"></div><small class="mt-2 text-xs">जून</small></div>
          <div class="d-flex flex-column align-items-center"><div class="bg-success rounded-top w-100" style="height: 170px; width: 40px;"></div><small class="mt-2 text-xs">जुलै</small></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../../components/common/DashboardHeader.vue';
</script>
