<template>
  <div>
    <DashboardHeader 
      title="कागदपत्र पडताळणी कक्ष (Document Verification Queue)" 
      subtitle="अर्जासोबत जोडलेल्या कागदपत्रांची पडताळणी, स्पष्टता व अचूकता तपासा" 
    />

    <!-- Verification Queue Split View -->
    <div class="row g-3 my-3">
      <!-- Left Column: Pending Applicants List -->
      <div class="col-lg-4">
        <div class="eg-card p-3 font-sans h-100">
          <h6 class="fw-bold text-success mb-3 d-flex justify-content-between align-items-center">
            <span><i class="bi bi-file-earmark-check me-2"></i>पडताळणी रांग ({{ pendingQueue.length }})</span>
            <span class="badge bg-danger bg-opacity-10 text-danger text-xs">२ अर्जांना उशीर</span>
          </h6>

          <div class="d-flex flex-column gap-2">
            <div 
              v-for="item in pendingQueue" 
              :key="item.id" 
              class="p-3 rounded-3 border cursor-pointer transition-all"
              :class="selectedItem?.id === item.id ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-white hover-shadow'"
              @click="selectedItem = item"
            >
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong class="text-xs text-success">{{ item.appNo }}</strong>
                <span class="badge bg-warning bg-opacity-25 text-dark text-xs">{{ item.serviceName }}</span>
              </div>
              <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.9rem;">{{ item.citizenName }}</h6>
              <div class="text-xs text-muted d-flex justify-content-between">
                <span><i class="bi bi-phone me-1"></i>{{ item.phone }}</span>
                <span><i class="bi bi-clock me-1"></i>{{ item.appliedDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Document Inspector & Verification Checklist -->
      <div class="col-lg-8" v-if="selectedItem">
        <div class="eg-card p-4 font-sans">
          <!-- Application Header -->
          <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <div>
              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 mb-1">
                अर्ज क्रमांक: {{ selectedItem.appNo }}
              </span>
              <h5 class="fw-bold text-success mb-0">{{ selectedItem.citizenName }} - {{ selectedItem.serviceName }}</h5>
              <small class="text-muted">आधार क्र.: {{ selectedItem.aadhaar }} | पत्ता: शिवणे गावठाण, वॉर्ड क्र. ३</small>
            </div>
            <button class="btn btn-sm btn-outline-secondary rounded-pill" @click="resetVerification">
              <i class="bi bi-arrow-counterclockwise me-1"></i> रीफ्रेश
            </button>
          </div>

          <!-- Document Verification Checklist & Preview -->
          <div class="mb-4">
            <h6 class="fw-bold text-dark mb-3"><i class="bi bi-card-checklist text-success me-2"></i>कागदपत्र पडताळणी चेकलिस्ट (Checklist):</h6>

            <div class="d-flex flex-column gap-3">
              <div v-for="(doc, idx) in selectedItem.documents" :key="idx" class="p-3 border rounded-3 bg-light">
                <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <div>
                    <strong class="text-dark me-2">{{ idx + 1 }}. {{ doc.nameMr }}</strong>
                    <span class="badge bg-secondary bg-opacity-10 text-muted text-xs">{{ doc.category }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-1">
                    <button 
                      class="btn btn-sm text-xs rounded-pill px-3"
                      :class="doc.status === 'Verified' ? 'btn-success fw-bold' : 'btn-outline-success'"
                      @click="doc.status = 'Verified'"
                    >
                      <i class="bi bi-check-circle me-1"></i> Verified
                    </button>
                    <button 
                      class="btn btn-sm text-xs rounded-pill px-3"
                      :class="doc.status === 'Rejected' ? 'btn-danger fw-bold' : 'btn-outline-danger'"
                      @click="doc.status = 'Rejected'"
                    >
                      <i class="bi bi-x-circle me-1"></i> Rejected
                    </button>
                    <button 
                      class="btn btn-sm text-xs rounded-pill px-3"
                      :class="doc.status === 'Missing' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning text-dark'"
                      @click="doc.status = 'Missing'"
                    >
                      <i class="bi bi-exclamation-triangle me-1"></i> Missing
                    </button>
                    <button class="btn btn-sm btn-light border text-xs rounded-pill px-2" @click="previewDocModal(doc)">
                      <i class="bi bi-file-earmark-pdf text-danger me-1"></i> PreView Document
                    </button>
                  </div>
                </div>

                <!-- Document Info & Status Badge -->
                <div class="d-flex justify-content-between align-items-center text-xs text-muted border-top pt-2">
                  <span>फाईलचे नाव: <code class="text-dark">{{ doc.fileName }}</code> ({{ doc.fileSize }})</span>
                  <span :class="getStatusBadgeClass(doc.status)">
                    सद्य स्थिती: {{ doc.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Document Inspection Preview Card (Mock Viewer) -->
          <div class="p-3 border rounded-3 bg-white mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <strong class="text-xs text-success"><i class="bi bi-file-pdf me-1"></i>कागदपत्र व्ह्यूवर (Live Document Rendering Preview)</strong>
              <small class="text-muted text-xs">झूम करा: १००%</small>
            </div>
            <div class="p-4 bg-light border rounded text-center my-2" style="min-height: 180px;">
              <div class="d-flex flex-column align-items-center justify-content-center h-100">
                <i class="bi bi-file-earmark-text-fill fs-1 text-success mb-2"></i>
                <h6 class="fw-bold mb-1">महाराष्ट्र शासन - ग्रामपंचायत कागदपत्र पडताळणी पुरावा</h6>
                <p class="text-xs text-muted mb-0">नागरिक नाव: {{ selectedItem.citizenName }} | पडताळलेला आधार क्र: {{ selectedItem.aadhaar }}</p>
                <div class="mt-2 text-xs text-success fw-bold">
                  <i class="bi bi-patch-check-fill me-1"></i> डिजिटल स्कॅन क्लिअर व वाचनीय आहे
                </div>
              </div>
            </div>
          </div>

          <!-- Remarks & Action Buttons -->
          <div class="mb-3">
            <label class="form-label text-xs fw-bold text-dark">कर्मचारी शेरा / पडताळणी टिप्पणी (Verification Note) *</label>
            <textarea 
              v-model="verificationNote" 
              rows="2" 
              class="form-control text-xs" 
              placeholder="उदा. आधार कार्ड व ७/१२ उतारा जुळत असून पडताळणी यशस्वी झाली आहे."
            ></textarea>
          </div>

          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <button class="btn btn-outline-warning text-dark rounded-pill px-3 text-xs" @click="requestReupload">
              <i class="bi bi-arrow-repeat me-1"></i> पुनरारोपणाची विनंती करा (Request Re-upload)
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-danger rounded-pill px-3 text-xs" @click="rejectVerification">
                <i class="bi bi-x-circle me-1"></i> नाकारा (Reject)
              </button>
              <button class="btn btn-eg-primary rounded-pill px-4 text-xs fw-bold" @click="approveVerification">
                <i class="bi bi-check-circle-fill me-1"></i> सर्व कागदपत्रे मंजूर करा (Approve All)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Preview Modal -->
    <div v-if="docToPreview" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 p-4 font-sans text-center">
          <h5 class="fw-bold text-success mb-2"><i class="bi bi-file-earmark-pdf me-2"></i>{{ docToPreview.nameMr }}</h5>
          <p class="text-xs text-muted">फाईल: {{ docToPreview.fileName }} ({{ docToPreview.fileSize }})</p>
          <div class="p-4 bg-light rounded border my-3">
            <i class="bi bi-file-earmark-richtext fs-1 text-success d-block mb-2"></i>
            <span class="badge bg-success bg-opacity-10 text-success text-xs">डिजिटल स्वाक्षरी पडताळली</span>
            <p class="text-xs mt-2 text-muted">या फाईल मधील सर्व माहिती स्पष्ट व वाचनीय आहे.</p>
          </div>
          <button class="btn btn-light rounded-pill px-4" @click="docToPreview = null">बंद करा (Close)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

interface DocumentItem {
  nameMr: string;
  category: string;
  fileName: string;
  fileSize: string;
  status: 'Verified' | 'Rejected' | 'Missing' | 'Pending';
}

interface PendingQueueItem {
  id: string;
  appNo: string;
  citizenName: string;
  serviceName: string;
  phone: string;
  aadhaar: string;
  appliedDate: string;
  documents: DocumentItem[];
}

const pendingQueue = ref<PendingQueueItem[]>([
  {
    id: 'pq-1',
    appNo: 'APP-2026-9045',
    citizenName: 'संजय बबनराव देशमुख',
    serviceName: 'उत्पन्न दाखला (स्वयंघोषणा पत्र)',
    phone: '9822123456',
    aadhaar: 'XXXX-XXXX-8921',
    appliedDate: '30 जुलै 2026',
    documents: [
      { nameMr: 'आधार कार्ड (Identity Proof)', category: 'ओळख पुरावा', fileName: 'aadhaar_card_sanjay.pdf', fileSize: '1.2 MB', status: 'Verified' },
      { nameMr: '७/१२ उतारा / घरपट्टी पावती', category: 'उत्पन्न पुरावा', fileName: '7_12_extract_2026.pdf', fileSize: '2.4 MB', status: 'Pending' },
      { nameMr: 'रेशन कार्ड (Address Proof)', category: 'पत्ता पुरावा', fileName: 'ration_card_page1.pdf', fileSize: '850 KB', status: 'Verified' },
      { nameMr: 'स्वयंघोषणा पत्र व सही', category: 'प्रतिज्ञापत्र', fileName: 'self_declaration_signed.pdf', fileSize: '1.1 MB', status: 'Verified' }
    ]
  },
  {
    id: 'pq-2',
    appNo: 'APP-2026-9078',
    citizenName: 'रमेश तुकाराम साळुंखे',
    serviceName: 'पोलीस पाटील दाखला',
    phone: '9822114455',
    aadhaar: 'XXXX-XXXX-4422',
    appliedDate: '31 जुलै 2026',
    documents: [
      { nameMr: 'आधार कार्ड (Identity Proof)', category: 'ओळख पुरावा', fileName: 'aadhaar_ramesh.pdf', fileSize: '1.1 MB', status: 'Verified' },
      { nameMr: 'मतदार ओळखपत्र (Voter ID)', category: 'पत्ता पुरावा', fileName: 'voter_id.pdf', fileSize: '900 KB', status: 'Pending' },
      { nameMr: 'पासपोर्ट साईज फोटो', category: 'फोटो', fileName: 'photo_ramesh.jpg', fileSize: '350 KB', status: 'Verified' }
    ]
  },
  {
    id: 'pq-3',
    appNo: 'APP-2026-9102',
    citizenName: 'सौ. सविता प्रकाश जगताप',
    serviceName: 'रहवासी दाखला',
    phone: '9422556677',
    aadhaar: 'XXXX-XXXX-9011',
    appliedDate: '01 ऑगस्ट 2026',
    documents: [
      { nameMr: 'घरपट्टी कर पावती', category: 'निवास पुरावा', fileName: 'house_tax_receipt.pdf', fileSize: '1.5 MB', status: 'Pending' },
      { nameMr: 'आधार कार्ड', category: 'ओळख पुरावा', fileName: 'aadhaar_savita.pdf', fileSize: '1.0 MB', status: 'Verified' }
    ]
  }
]);

const selectedItem = ref<PendingQueueItem | null>(pendingQueue.value[0]);
const verificationNote = ref('सर्व कागदपत्रे व ७/१२ उतारा पडताळणीमध्ये अचूक आढळले.');
const docToPreview = ref<DocumentItem | null>(null);

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Verified': return 'badge bg-success text-white';
    case 'Rejected': return 'badge bg-danger text-white';
    case 'Missing': return 'badge bg-warning text-dark';
    default: return 'badge bg-secondary text-white';
  }
}

function previewDocModal(doc: DocumentItem) {
  docToPreview.value = doc;
}

function approveVerification() {
  if (selectedItem.value) {
    selectedItem.value.documents.forEach(d => d.status = 'Verified');
    alert(`अर्ज ${selectedItem.value.appNo} ची सर्व कागदपत्रे मंजूर झाली असून दाखला जनरेट करण्यासाठी पाठवले गेले.`);
  }
}

function rejectVerification() {
  if (selectedItem.value) {
    alert(`अर्ज ${selectedItem.value.appNo} कागदपत्र त्रुटीमुळे नाकारला.`);
  }
}

function requestReupload() {
  alert('नागरिकाला त्रुटी दुरुस्त करून कागदपत्र पुन्हा पाठवण्याचा SMS व पोर्टल संदेश पाठवला गेला.');
}

function resetVerification() {
  verificationNote.value = '';
}
</script>
