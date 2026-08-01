<template>
  <div>
    <DashboardHeader 
      title="ग्रामपंचायत कर्मचारी वर्कस्पेस (Staff Operational Dashboard)" 
      subtitle="दैनिक कामे, अर्ज पडताळणी, तक्रार निवारण व दाखले निर्गमित करणे" 
    />

    <!-- Top Statistics Grid (6 Cards) -->
    <div class="row g-3 my-3">
      <div class="col-6 col-md-4 col-lg-2">
        <StatsCard icon="bi-inbox-fill" label="प्रलंबित अर्ज" value="12" variant="gold" />
      </div>
      <div class="col-6 col-md-4 col-lg-2">
        <StatsCard icon="bi-file-earmark-check" label="पडताळणी बाकी" value="8" variant="blue" />
      </div>
      <div class="col-6 col-md-4 col-lg-2">
        <StatsCard icon="bi-tools" label="असाईन तक्रारी" value="4" variant="blue" />
      </div>
      <div class="col-6 col-md-4 col-lg-2">
        <StatsCard icon="bi-check-circle-fill" label="आज निवारण" value="15" variant="green" />
      </div>
      <div class="col-6 col-md-4 col-lg-2">
        <StatsCard icon="bi-award-fill" label="दाखले प्रलंबित" value="6" variant="gold" />
      </div>
      <div class="col-6 col-md-4 col-lg-2">
        <StatsCard icon="bi-buildings-fill" label="विकास कामे असाईन" value="3" variant="brown" />
      </div>
    </div>

    <!-- Operational Split Grid: Today's Tasks & Urgent Reminders -->
    <div class="row g-3 mb-4">
      <!-- Today's Tasks & Checklist -->
      <div class="col-lg-7">
        <div class="eg-card p-4 h-100 font-sans">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-success mb-0">
              <i class="bi bi-card-checklist me-2"></i>आजचे नियोजित कामकाज व टास्क (Today's Tasks)
            </h6>
            <span class="badge bg-success bg-opacity-10 text-success text-xs">५ पैकी ३ पूर्ण</span>
          </div>

          <div class="d-flex flex-column gap-2">
            <div v-for="task in todayTasks" :key="task.id" class="p-3 rounded-3 border d-flex align-items-center justify-content-between" :class="task.done ? 'bg-light text-muted' : 'bg-white shadow-sm'">
              <div class="d-flex align-items-center gap-3">
                <input type="checkbox" class="form-check-input flex-shrink-0" :checked="task.done" @change="task.done = !task.done" style="width: 1.2rem; height: 1.2rem;" />
                <div>
                  <div class="fw-bold text-xs" :class="{ 'text-decoration-line-through': task.done }">{{ task.title }}</div>
                  <small class="text-muted text-xs d-block">{{ task.time }} | {{ task.category }}</small>
                </div>
              </div>
              <span :class="['badge text-xs', task.done ? 'bg-secondary bg-opacity-25 text-secondary' : 'bg-warning bg-opacity-25 text-dark']">
                {{ task.done ? 'पूर्ण' : 'प्रलंबित' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Reminders & Upcoming Deadlines -->
      <div class="col-lg-5">
        <div class="eg-card p-4 h-100 font-sans">
          <h6 class="fw-bold text-success mb-3">
            <i class="bi bi-clock-history me-2"></i>महत्त्वाच्या डेडलाईन्स व सूचना (Deadlines)
          </h6>

          <div class="d-flex flex-column gap-3">
            <div class="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3">
              <div class="d-flex justify-content-between text-xs fw-bold text-danger mb-1">
                <span><i class="bi bi-exclamation-triangle-fill me-1"></i>SLA इशारा (२ अर्ज)</span>
                <span>आज सायंकाळी ५ वा.</span>
              </div>
              <p class="text-xs mb-0 text-dark">APP-2026-9045 (उत्पन्न दाखला) चा SLA ३ दिवस आज संपत आहे. त्वरित पडताळणी पूर्ण करा.</p>
            </div>

            <div class="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3">
              <div class="d-flex justify-content-between text-xs fw-bold text-dark mb-1">
                <span><i class="bi bi-geo-alt-fill me-1"></i>तक्रार स्थळ पाहणी</span>
                <span>उद्या सकाळी १० वा.</span>
              </div>
              <p class="text-xs mb-0 text-dark">वॉर्ड क्र. ३ मधील गटार तुंबल्याबाबत तक्रार #SHV-2026-4421 स्थळ पाहणी प्रस्तावित.</p>
            </div>

            <div class="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3">
              <div class="d-flex justify-content-between text-xs fw-bold text-success mb-1">
                <span><i class="bi bi-calendar-event me-1"></i>स्वातंत्र्य दिन ग्रामसभा</span>
                <span>१५ ऑगस्ट २०२६</span>
              </div>
              <p class="text-xs mb-0 text-dark">ग्रामसभा इतिवृत्त व विषयपत्रिका मसुदा तयार करून ग्रामसेवकांकडे सादर करणे.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Pending Applications Table -->
    <div class="eg-card p-4 mb-4 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-success mb-0"><i class="bi bi-inbox-fill me-2"></i>नवीन प्राप्त अर्ज (Recent Applications)</h5>
        <router-link to="/staff/applications" class="btn btn-sm btn-outline-success rounded-pill fw-bold text-xs">
          सर्व अर्ज पहा (View All) <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>अर्ज क्रमांक</th>
            <th>नागरिकाचे नाव</th>
            <th>मागणी केलेला दाखला</th>
            <th>दाखल तारीख</th>
            <th>डेडलाईन (SLA)</th>
            <th>स्थिती</th>
            <th>क्रिया (Actions)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="app in citizenApplications.slice(0, 4)" :key="app.id">
            <td><strong>{{ app.applicationNo }}</strong></td>
            <td>{{ app.citizenName }}</td>
            <td>{{ app.serviceNameMr }}</td>
            <td>{{ app.appliedDate }}</td>
            <td><span class="text-danger fw-bold text-xs">{{ app.dueDate }}</span></td>
            <td><StatusBadge :status="app.status" :text="app.statusMr" /></td>
            <td>
              <router-link to="/staff/verification" class="btn btn-sm btn-success rounded-pill px-3 text-xs me-1">
                <i class="bi bi-search me-1"></i> तपासणी करा
              </router-link>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- Recent Assigned Complaints Quick Grid -->
    <div class="eg-card p-4 mb-4 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-success mb-0"><i class="bi bi-tools me-2"></i>माझ्याकडे असाईन केलेल्या तक्रारी (Assigned Complaints)</h5>
        <router-link to="/staff/complaints" class="btn btn-sm btn-outline-success rounded-pill text-xs fw-bold">
          तक्रार कक्ष पहा <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>

      <div class="row g-3">
        <div v-for="cmp in complaints.slice(0, 2)" :key="cmp.id" class="col-md-6">
          <div class="p-3 border rounded-3 bg-light">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">{{ cmp.ticketId }}</span>
              <StatusBadge :status="cmp.status" :text="cmp.statusMr" />
            </div>
            <h6 class="fw-bold mb-1 text-dark">{{ cmp.title }}</h6>
            <p class="text-xs text-muted mb-2"><i class="bi bi-geo-alt me-1 text-success"></i>{{ cmp.location }} ({{ cmp.wardNo }}) | तक्रारदार: {{ cmp.citizenName }}</p>
            <div class="d-flex justify-content-between align-items-center border-top pt-2 mt-2 text-xs">
              <span class="text-muted"><i class="bi bi-calendar3 me-1"></i>{{ cmp.createdAt }}</span>
              <button class="btn btn-sm btn-success rounded-pill px-3 text-xs" @click="resolveQuick(cmp.id)">
                <i class="bi bi-check-lg me-1"></i> स्टेटस अद्ययावत करा
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { citizenApplications, complaints, updateComplaintStatus } = useMockData();

const todayTasks = ref([
  { id: 1, title: 'सकाळी १०:०० - अर्ज क्र. APP-2026-9045 चा ७/१२ व आधार पडताळणी', time: '10:00 AM', category: 'कागदपत्र पडताळणी', done: true },
  { id: 2, title: 'सकाळी ११:३० - वॉर्ड क्र. ३ गटार तुंबल्याबाबत तक्रार स्थळ पाहणी', time: '11:30 AM', category: 'तक्रार निवारण', done: true },
  { id: 3, title: 'दुपारी ०२:०० - पोलीस पाटील दाखल्यांवर डिजिटल स्टॅम्प लावणे', time: '02:00 PM', category: 'दाखले निर्गमित', done: true },
  { id: 4, title: 'दुपारी ०३:३० - सिमेंट रस्ता बांधकामाची फोटो अपलोड व काम प्रगती टक्का अद्ययावत करणे', time: '03:30 PM', category: 'विकास कामे', done: false },
  { id: 5, title: 'सायंकाळी ०५:०० - प्रलंबित अर्जाचा दैनिक अहवाल ग्रामसेवकांकडे सादर करणे', time: '05:00 PM', category: 'रिपोर्ट्स', done: false }
]);

function resolveQuick(id: string) {
  updateComplaintStatus(id, 'In Process', 'काम प्रगतीपथावर आहे', 'अमित मोरे (लिपिक)', 'स्थळ पाहणी करून कर्मचाऱ्यांना काम पूर्ण करण्याचे आदेश दिले.');
}
</script>
