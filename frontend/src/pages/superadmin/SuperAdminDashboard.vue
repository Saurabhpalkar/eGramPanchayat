<template>
  <div class="font-sans">
    <DashboardHeader 
      title="SaaS Owner Super Admin Dashboard" 
      subtitle="Multi-Tenant eGram Panchayat SaaS Infrastructure Control & Performance Overview" 
    />

    <!-- Top 8 Statistics Cards Grid -->
    <div class="row g-3 my-3">
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-buildings-fill" 
          label="Total Gram Panchayats" 
          value="48" 
          variant="green" 
          trend="+4 या महिन्यात" 
          :trendUp="true" 
        />
      </div>
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-check-circle-fill" 
          label="Active Gram Panchayats" 
          value="45" 
          variant="green" 
          trend="93.7% Active" 
          :trendUp="true" 
        />
      </div>
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-person-badge-fill" 
          label="Total Admins (Sarpanch)" 
          value="52" 
          variant="gold" 
          trend="All Verified" 
          :trendUp="true" 
        />
      </div>
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-person-workspace" 
          label="Total Staff" 
          value="184" 
          variant="blue" 
          trend="+12 New Staff" 
          :trendUp="true" 
        />
      </div>

      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-people-fill" 
          label="Total Citizens" 
          value="2,45,800" 
          variant="gold" 
          trend="+12.4% YoY" 
          :trendUp="true" 
        />
      </div>
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-file-earmark-text-fill" 
          label="Total Applications" 
          value="38,920" 
          variant="blue" 
          trend="96.2% SLA Met" 
          :trendUp="true" 
        />
      </div>
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-exclamation-triangle-fill" 
          label="Total Complaints" 
          value="4,120" 
          variant="brown" 
          trend="94.1% Resolved" 
          :trendUp="true" 
        />
      </div>
      <div class="col-6 col-lg-3">
        <StatsCard 
          icon="bi-cash-coin" 
          label="Monthly Revenue" 
          value="₹ 1,84,500" 
          variant="green" 
          trend="+18.5% MRR" 
          :trendUp="true" 
        />
      </div>
    </div>

    <!-- Quick Action Banner -->
    <div class="bg-success bg-gradient text-white rounded-4 p-3.5 p-md-4 mb-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="bg-white text-success rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm" style="width: 52px; height: 52px;">
          <i class="bi bi-plus-circle-fill fs-3"></i>
        </div>
        <div>
          <h5 class="fw-bold mb-1">नवीन ग्रामपंचायत ऑनबोर्ड करा (Onboard New Gram Panchayat)</h5>
          <p class="mb-0 text-white-50 text-xs">४-सोप्या स्टेप्समध्ये नवीन ग्रामपंचायत ऑनबोर्ड करा, सरपंच अकाऊंट बनवा आणि सबस्क्रिप्शन प्लॅन निवडा.</p>
        </div>
      </div>
      <router-link to="/superadmin/add-panchayat" class="btn btn-warning fw-bold rounded-pill px-4 py-2 text-nowrap shadow-sm">
        <i class="bi bi-rocket-takeoff-fill me-1"></i> नवीन GP ऑनबोर्ड करा
      </router-link>
    </div>

    <!-- Recent Gram Panchayats Section -->
    <div class="eg-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 class="fw-bold text-success mb-0"><i class="bi bi-buildings-fill me-2"></i>नवीन ऑनबोर्ड झालेल्या ग्रामपंचायती (Recent Gram Panchayats)</h5>
          <span class="text-xs text-muted">अलीकडेच प्लॅटफॉर्मवर सामील झालेल्या ग्रामपंचायतींची यादी</span>
        </div>
        <router-link to="/superadmin/panchayats" class="btn btn-outline-success btn-sm rounded-pill font-sans fw-bold px-3">
          सर्व ग्रामपंचायती पाहा <i class="bi bi-arrow-right ms-1"></i>
        </router-link>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>लोगो / कोड</th>
            <th>ग्रामपंचायत नाव</th>
            <th>गाव व तालुका</th>
            <th>जिल्हा</th>
            <th>सरपंच (Admin)</th>
            <th>सबस्क्रिप्शन</th>
            <th>स्टेटस</th>
            <th class="text-end">ॲक्शन</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="gp in panchayats.slice(0, 5)" :key="gp.id">
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="bg-success bg-opacity-10 text-success rounded-circle fw-bold d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; font-size: 0.8rem;">
                  {{ gp.code.slice(-3) }}
                </div>
                <small class="fw-mono text-muted text-xs">{{ gp.code }}</small>
              </div>
            </td>
            <td>
              <div class="fw-bold text-success">{{ gp.nameMr }}</div>
              <small class="text-xs text-muted">{{ gp.nameEn }}</small>
            </td>
            <td>{{ gp.taluka }}</td>
            <td><span class="badge bg-light text-dark border">{{ gp.district }}</span></td>
            <td>
              <div class="fw-semibold text-xs text-dark">{{ gp.sarpanchName }}</div>
              <small class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-phone me-1"></i>{{ gp.contactNo }}</small>
            </td>
            <td>
              <span class="badge" :class="{
                'bg-warning text-dark': gp.activePlan === 'Enterprise Gold',
                'bg-success text-white': gp.activePlan === 'Standard Green',
                'bg-info text-white': gp.activePlan === 'Starter'
              }">
                {{ gp.activePlan }}
              </span>
            </td>
            <td>
              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                <i class="bi bi-check-circle-fill me-1"></i> {{ gp.status }}
              </span>
            </td>
            <td class="text-end">
              <router-link :to="`/superadmin/panchayats`" class="btn btn-sm btn-outline-success rounded-pill text-xs px-2.5 py-1">
                तपशील पाहा
              </router-link>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- 3 Grid Column Overview Cards: Recent Registrations, Applications, Complaints -->
    <div class="row g-3">
      <!-- Recent Registrations -->
      <div class="col-lg-4">
        <div class="eg-card p-3.5 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h6 class="fw-bold text-success mb-0"><i class="bi bi-person-plus-fill me-1 text-warning"></i> नवीन नागरिक नोंदणी (Registrations)</h6>
            <router-link to="/superadmin/users" class="text-xs text-success fw-bold text-decoration-none">सर्व पाहा</router-link>
          </div>
          <div class="d-flex flex-column gap-2 font-sans">
            <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-success d-flex align-items-center justify-content-between" v-for="user in recentUsers" :key="user.id">
              <div>
                <div class="fw-bold text-xs text-dark">{{ user.name }}</div>
                <small class="text-muted d-block" style="font-size: 0.72rem;"><i class="bi bi-building me-1"></i>{{ user.gpName }}</small>
              </div>
              <span class="badge bg-light text-dark border text-xs">{{ user.registeredAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="col-lg-4">
        <div class="eg-card p-3.5 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h6 class="fw-bold text-success mb-0"><i class="bi bi-file-earmark-check-fill me-1 text-primary"></i> नवीन प्राप्त अर्ज (Applications)</h6>
            <span class="badge bg-primary text-white text-xs">Live Feed</span>
          </div>
          <div class="d-flex flex-column gap-2 font-sans">
            <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-primary d-flex align-items-center justify-content-between" v-for="app in citizenApplications.slice(0, 3)" :key="app.id">
              <div>
                <div class="fw-bold text-xs text-dark">{{ app.serviceNameMr }}</div>
                <small class="text-muted d-block" style="font-size: 0.72rem;">{{ app.citizenName }} • {{ app.applicationNo }}</small>
              </div>
              <span class="badge bg-info bg-opacity-10 text-info text-xs border border-info border-opacity-25">{{ app.statusMr }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Complaints -->
      <div class="col-lg-4">
        <div class="eg-card p-3.5 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h6 class="fw-bold text-success mb-0"><i class="bi bi-exclamation-triangle-fill me-1 text-danger"></i> नवीन तक्रारी (Complaints)</h6>
            <span class="badge bg-danger text-white text-xs">Alerts</span>
          </div>
          <div class="d-flex flex-column gap-2 font-sans">
            <div class="p-2 rounded bg-light hover-bg-gray border-start border-3 border-danger d-flex align-items-center justify-content-between" v-for="cmp in complaints.slice(0, 3)" :key="cmp.id">
              <div>
                <div class="fw-bold text-xs text-dark text-truncate" style="max-width: 180px;">{{ cmp.title }}</div>
                <small class="text-muted d-block" style="font-size: 0.72rem;">{{ cmp.citizenName }} • {{ cmp.ticketId }}</small>
              </div>
              <span class="badge bg-warning text-dark text-xs">{{ cmp.statusMr }}</span>
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
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { panchayats, citizenApplications, complaints } = useMockData();

const recentUsers = ref([
  { id: 'u1', name: 'संदिप मारुती पवार', gpName: 'शिवणे ग्रामपंचायत', registeredAt: '१० मि. पूर्वी' },
  { id: 'u2', name: 'कविता विश्वास शिंदे', gpName: 'सासवड ग्रामपंचायत', registeredAt: '२५ मि. पूर्वी' },
  { id: 'u3', name: 'ज्ञानेश्वर तुकाराम मोर', gpName: 'शिराळा ग्रामपंचायत', registeredAt: '१ तासापूर्वी' }
]);
</script>
