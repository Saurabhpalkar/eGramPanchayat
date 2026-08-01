<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Platform Analytics & Reports (प्लॅटफॉर्म रिपोर्ट आणि विश्लेषण)" 
      subtitle="Super Admin System-Wide Metrics, Service Metrics, District Metrics & Revenue Growth" 
    />

    <!-- Download Bar -->
    <div class="eg-card p-3.5 my-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
      <div>
        <h6 class="fw-bold text-success mb-1"><i class="bi bi-file-earmark-bar-graph-fill me-1"></i> राज्यस्तरीय ई-ग्रामपंचायत परफॉर्मन्स अहवाल</h6>
        <p class="text-xs text-muted mb-0">महाराष्ट्र राज्य सर्व ग्रामपंचायतींचा एकत्रित डिजिटल अहवालजनरेटर</p>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-outline-success btn-sm rounded-pill font-sans fw-bold px-3" @click="downloadReport('PDF')">
          <i class="bi bi-file-earmark-pdf-fill me-1"></i> PDF अहवाल डाऊनलोड
        </button>
        <button class="btn btn-success btn-sm rounded-pill font-sans fw-bold px-3" @click="downloadReport('Excel')">
          <i class="bi bi-file-earmark-excel-fill me-1"></i> Excel रिपोर्ट डाऊनलोड
        </button>
      </div>
    </div>

    <!-- Analytics Key Metrics Row -->
    <div class="row g-3 my-2">
      <div class="col-md-3">
        <div class="eg-card p-3.5 border-start border-4 border-success">
          <span class="text-xs text-muted fw-bold">वार्षिक महसूल वाढ (ARR Growth)</span>
          <h3 class="fw-bold text-success my-1">₹ २२,१४,०००</h3>
          <span class="badge bg-success bg-opacity-10 text-success text-xs"><i class="bi bi-graph-up-arrow me-1"></i>+२८.४% वाढ</span>
        </div>
      </div>

      <div class="col-md-3">
        <div class="eg-card p-3.5 border-start border-4 border-primary">
          <span class="text-xs text-muted fw-bold">ऑनलाईन दाखले वितरीत (Certificates)</span>
          <h3 class="fw-bold text-primary my-1">३८,९२०</h3>
          <span class="badge bg-primary bg-opacity-10 text-primary text-xs"><i class="bi bi-check-all me-1"></i>९६.२% SLA वेळेत पूर्ण</span>
        </div>
      </div>

      <div class="col-md-3">
        <div class="eg-card p-3.5 border-start border-4 border-warning">
          <span class="text-xs text-muted fw-bold">डिजिटल कर वसुली (Online Tax)</span>
          <h3 class="fw-bold text-dark my-1">₹ ४८.६ लाख</h3>
          <span class="badge bg-warning text-dark text-xs"><i class="bi bi-lightning-charge-fill me-1"></i>Direct Treasury Transfer</span>
        </div>
      </div>

      <div class="col-md-3">
        <div class="eg-card p-3.5 border-start border-4 border-info">
          <span class="text-xs text-muted fw-bold">तक्रार निवारण दर (Resolution Rate)</span>
          <h3 class="fw-bold text-info my-1">९४.१%</h3>
          <span class="badge bg-info bg-opacity-10 text-info text-xs"><i class="bi bi-shield-check me-1"></i>सरासरी २.४ दिवस समयी</span>
        </div>
      </div>
    </div>

    <!-- Usage & Growth Visual Breakdowns Grid -->
    <div class="row g-3 my-2">
      <!-- Service Wise Certificate Distribution -->
      <div class="col-lg-6">
        <div class="eg-card p-4 h-100">
          <h6 class="fw-bold text-success mb-3"><i class="bi bi-pie-chart-fill me-2"></i> सर्वाधिक मागणी असलेले ऑनलाईन दाखले (Top Certificates)</h6>

          <div class="d-flex flex-column gap-3 text-xs">
            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold text-dark">रहिवासी दाखला (Residence Certificate)</span>
                <span class="fw-mono text-success">१२,४५० (३२%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-success" style="width: 32%"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold text-dark">जन्म दाखला (Birth Certificate)</span>
                <span class="fw-mono text-primary">९,८०० (२५%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-primary" style="width: 25%"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold text-dark">उत्पन्नाचा दाखला (Income Certificate)</span>
                <span class="fw-mono text-info">७,६०० (१९.५%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-info" style="width: 19.5%"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold text-dark">मृत्यू दाखला (Death Certificate)</span>
                <span class="fw-mono text-warning">४,५०० (११.५%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-warning" style="width: 11.5%"></div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold text-dark">इतर दाखले (विवाह, ना हरकत इ.)</span>
                <span class="fw-mono text-secondary font-sans">४,५७० (१२%)</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar bg-secondary" style="width: 12%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- District Wise Adoption Matrix -->
      <div class="col-lg-6">
        <div class="eg-card p-4 h-100">
          <h6 class="fw-bold text-success mb-3"><i class="bi bi-geo-alt-fill me-2"></i> जिल्हावार ग्रामपंचायत सहभाग (District-wise Gram Panchayats)</h6>

          <ResponsiveTable>
            <template #head>
              <tr>
                <th>जिल्हा (District)</th>
                <th>ग्रामपंचायती</th>
                <th>नागरिक लोकसंख्या</th>
                <th>डिजिटल दाखले</th>
              </tr>
            </template>
            <template #body>
              <tr>
                <td class="fw-bold text-dark">पुणे (Pune)</td>
                <td><span class="badge bg-success">२४ GP</span></td>
                <td>१,४५,०००</td>
                <td class="fw-bold text-success">२२,४००</td>
              </tr>
              <tr>
                <td class="fw-bold text-dark">सांगली (Sangli)</td>
                <td><span class="badge bg-success">१२ GP</span></td>
                <td>६५,०००</td>
                <td class="fw-bold text-success">९,२००</td>
              </tr>
              <tr>
                <td class="fw-bold text-dark">अहिल्यानगर (Ahilyanagar)</td>
                <td><span class="badge bg-success">६ GP</span></td>
                <td>२२,०००</td>
                <td class="fw-bold text-success">४,५००</td>
              </tr>
              <tr>
                <td class="fw-bold text-dark">नाशिक (Nashik)</td>
                <td><span class="badge bg-success">६ GP</span></td>
                <td>१८,०००</td>
                <td class="fw-bold text-success">२,८२०</td>
              </tr>
            </template>
          </ResponsiveTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

function downloadReport(format: string) {
  alert(`ग्रामपंचायत SaaS प्लॅटफॉर्मचा संपूर्ण [${format}] अहवाल तयार होऊन डाऊनलोड होत आहे.`);
}
</script>
