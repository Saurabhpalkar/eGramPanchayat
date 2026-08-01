<template>
  <div>
    <DashboardHeader 
      title="कर्मचारी कामकाज व दैनिक अहवाल (Staff Operational Reports)" 
      subtitle="दैनिक प्रलंबित अर्ज प्रक्रिया, दाखले वितरण, तक्रार निवारण दर व कार्यक्षमता अहवाल" 
    />

    <!-- Summary KPI Cards -->
    <div class="row g-3 my-3 font-sans">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-check-circle-fill" label="आज पूर्ण अर्ज प्रक्रिया" value="28" variant="green" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-clock-history" label="सरासरी SLA कालावधी" value="1.8 दिवस" variant="gold" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-award-fill" label="एकूण निर्गमित दाखले" value="142" variant="blue" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-emoji-smile-fill" label="तक्रार निवारण दर" value="95%" variant="green" />
      </div>
    </div>

    <!-- Operational Breakdown Charts & Statistics Grid -->
    <div class="row g-3 my-3 font-sans">
      <!-- Left Column: Service Wise Application Distribution -->
      <div class="col-lg-6">
        <div class="eg-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-success mb-0">
              <i class="bi bi-bar-chart-fill me-2"></i>सेवा निहाय अर्ज वितरण (Service Distribution)
            </h6>
            <span class="badge bg-success bg-opacity-10 text-success text-xs">ऑगस्ट २०२६</span>
          </div>

          <div class="d-flex flex-column gap-3 my-2">
            <div>
              <div class="d-flex justify-content-between text-xs mb-1">
                <span>उत्पन्न दाखला (Income Certificate)</span>
                <strong class="text-success">45% (64 अर्ज)</strong>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-success" role="progressbar" style="width: 45%;"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between text-xs mb-1">
                <span>पोलीस पाटील दाखला (Police Patil Cert.)</span>
                <strong class="text-success">28% (40 अर्ज)</strong>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-primary" role="progressbar" style="width: 28%;"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between text-xs mb-1">
                <span>रहवासी दाखला (Residence Cert.)</span>
                <strong class="text-success">15% (21 अर्ज)</strong>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-warning" role="progressbar" style="width: 15%;"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between text-xs mb-1">
                <span>जन्म व मृत्यू नोंद दाखले</span>
                <strong class="text-success">12% (17 अर्ज)</strong>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-info" role="progressbar" style="width: 12%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Complaint Resolution & Field Inspection Log -->
      <div class="col-lg-6">
        <div class="eg-card p-4 h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-success mb-0">
              <i class="bi bi-tools me-2"></i>तक्रार निवारण कार्यक्षमता (Complaint Resolution SLA)
            </h6>
            <span class="badge bg-success bg-opacity-10 text-success text-xs">९५% यश</span>
          </div>

          <div class="p-3 bg-light rounded-3 border mb-3 text-xs">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted">४८ तासांच्या आत निवारण झालेल्या तक्रारी:</span>
              <strong class="text-success">१८ पैकी १७ तक्रारी</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted">फील्ड व्हिजिट / प्रत्यक्ष पाहणी केलेल्या:</span>
              <strong class="text-primary">१२ ठिकाणे</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted">नागरिक समाधान रेटिंग (Feedback):</span>
              <strong class="text-warning"><i class="bi bi-star-fill me-1"></i>4.8 / 5.0</strong>
            </div>
          </div>

          <div class="p-3 bg-white border rounded-3">
            <h6 class="fw-bold text-dark text-xs mb-2">चालू आठवड्याचा कामाचा अहवाल सादर करणे</h6>
            <p class="text-xs text-muted mb-3">ग्रामसेवक व सरपंचांच्या आढावा बैठकीसाठी दैनिक व साप्ताहिक एक्सेल / पीडीएफ रिपोर्ट डाउनलोड करा.</p>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-success btn-sm rounded-pill text-xs px-3" @click="exportReport('Excel')">
                <i class="bi bi-file-earmark-excel me-1"></i> Excel मध्ये रिपोर्ट डाउनलोड
              </button>
              <button class="btn btn-eg-primary btn-sm rounded-pill text-xs px-3 fw-bold" @click="exportReport('PDF')">
                <i class="bi bi-file-earmark-pdf me-1"></i> PDF प्रिंट करा
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';

function exportReport(type: string) {
  alert(`कर्मचारी दैनिक कामकाज अहवाल (${type}) डाउनलोड यशस्वी झाला.`);
}
</script>
