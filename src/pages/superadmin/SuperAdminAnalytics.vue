<template>
  <div>
    <DashboardHeader title="SaaS प्लॅटफॉर्म ॲनालिटिक्स (Platform Analytics)" subtitle="सर्व्हर युसेज, API कॉल व ट्रॅफिक विश्लेषण" />

    <div class="row g-3 my-3 font-sans">
      <div class="col-md-4">
        <div class="eg-card p-4 text-center border-top border-4 border-success">
          <h3 class="fw-bold text-success mb-1">२.४M</h3>
          <p class="text-xs text-muted mb-0">मासिक ऑनलाईन दाखले जनरेशन API Requests</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="eg-card p-4 text-center border-top border-4 border-warning">
          <h3 class="fw-bold text-dark mb-1">१२० ms</h3>
          <p class="text-xs text-muted mb-0">सरासरी सर्व्हर रिस्पॉन्स टाईम (Latency)</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="eg-card p-4 text-center border-top border-4 border-info">
          <h3 class="fw-bold text-info mb-1">९९.९८%</h3>
          <p class="text-xs text-muted mb-0">क्लाऊड इन्फ्रास्ट्रक्चर SLA अपटाईम</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../../components/common/DashboardHeader.vue';
</script>
