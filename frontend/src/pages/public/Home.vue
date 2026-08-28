<template>
  <div>
    <!-- Hero Section with Village Landscape Backdrop & High Contrast Overlay -->
    <section class="eg-hero-bg position-relative overflow-hidden">
      <div class="container">
        <div class="row align-items-center g-4 g-lg-5">
          <!-- Left Column Content -->
          <div class="col-lg-7 text-start">
            <!-- Village Badge -->
            <div class="d-inline-flex align-items-center gap-2  bg-opacity-40 backdrop-blur rounded-pill p-2 mb-3 text-warning fw-semibold text-xs border border-white border-opacity-30 shadow-sm">
              <i class="bi bi-geo-alt-fill text-warning"></i> {{ activePanchayat.nameMr }} (ता. {{ activePanchayat.taluka }}, जि. {{ activePanchayat.district }})
            </div>

            <!-- Title strictly required by prompt -->
            <h1 class="display-5 fw-bold text-white mb-3 font-marathi lh-sm">
              तुमची ग्रामपंचायत आता डिजिटल
            </h1>
            
            <p class="fs-5 text-white mb-4 font-marathi opacity-90" style="max-width: 620px; line-height: 1.6;">
              ग्रामपंचायत ऑनलाईन सेवा, अधिकृत दाखले, तक्रार निवारण, विकास कामे व निधी पारदर्शकता आता एकाच डिजिटल व्यासपीठावर.
            </p>

            <!-- Call-to-Action Buttons -->
            <div class="d-flex flex-wrap gap-3 mb-4">
              <router-link to="/services" class="btn btn-success shadow-lg d-inline-flex align-items-center gap-2">
                <i class="bi bi-rocket-takeoff-fill fs-5"></i> ऑनलाईन सेवा सुरू करा
              </router-link>
              <router-link to="/raise-complaint" class="btn btn-warning btn-lg text-white border-white rounded-pill px-4 d-inline-flex align-items-center gap-2 hover-bg-white text-dark">
                <i class="bi bi-exclamation-triangle-fill text-warning fs-5"></i> तक्रार नोंदवा
              </router-link>
            </div>

            <!-- Quick Features Pills -->
            <div class="d-flex flex-wrap gap-3 text-xs text-white opacity-90 font-sans border-top border-white border-opacity-25 pt-3">
              <span><i class="bi bi-check-circle-fill text-warning me-1"></i> १००% ऑनलाईन अर्ज व फी</span>
              <span><i class="bi bi-check-circle-fill text-warning me-1"></i> QR डिजिटल सहीचे प्रमाणपत्र</span>
              <span><i class="bi bi-check-circle-fill text-warning me-1"></i> SMS अलर्ट व रिअल-टाईम ट्रॅकिंग</span>
            </div>
          </div>

          <!-- Right Column Info Card -->
          <div class="col-lg-5">
            <div class="hero-info-card position-relative">
              <div class="badge bg-success text-white position-absolute top-0 end-0 m-3 px-3 py-1.5 font-sans rounded-pill">
                <i class="bi bi-award-fill me-1 text-warning"></i> आदर्श डिजिटल ग्राम
              </div>

              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 52px; height: 52px; flex-shrink: 0;">
                  <i class="bi bi-building-fill fs-3 text-warning"></i>
                </div>
                <div>
                  <h5 class="mb-0 fw-bold text-success" style="font-size: 1.2rem;">{{ activePanchayat.nameMr }}</h5>
                  <small class="text-muted font-sans fw-medium">सरपंच: {{ activePanchayat.sarpanch }}</small>
                </div>
              </div>

              <!-- e-Governance Progress Bar -->
              <div class="p-3 bg-light rounded-3 border mb-3">
                <div class="d-flex justify-content-between align-items-center text-xs font-sans text-muted mb-1.5">
                  <span class="fw-semibold">ग्रामपंचायत डिजिटल सेवा ई-प्रगती</span>
                  <span class="text-success fw-bold">९८.५%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-success rounded-pill" style="width: 98.5%;"></div>
                </div>
              </div>

              <!-- Quick Application Tracker Box -->
              <div class="bg-success bg-opacity-10 p-3 rounded-3 border border-success border-opacity-25">
                <label class="form-label text-xs fw-bold text-success mb-1.5">
                  <i class="bi bi-search me-1"></i> अर्जाची स्थिती त्वरित तपासा (Track Status):
                </label>
                <div class="input-group input-group-sm">
                  <input type="text" v-model="quickTrackId" class="form-control" placeholder="उदा. APP-2026-9012" />
                  <button class="btn btn-eg-primary px-3 fw-bold" @click="goToTrack">तपासा</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Statistics Bar -->
    <section class="py-4 bg-white border-bottom shadow-sm">
      <div class="container">
        <div class="row g-3 text-center">
          <div class="col-6 col-md-3">
            <StatsCard icon="bi-people-fill" label="एकूण नागरिक (Citizens)" :value="dashboardStats.totalCitizens.toLocaleString('mr-IN')" variant="green" />
          </div>
          <div class="col-6 col-md-3">
            <StatsCard icon="bi-file-earmark-check-fill" label="प्रक्रिया केलेले अर्ज" :value="dashboardStats.totalApps.toLocaleString('mr-IN')" variant="gold" trend="९८% ऑन-टाईम" :trendUp="true" />
          </div>
          <div class="col-6 col-md-3">
            <StatsCard icon="bi-shield-check" label="तक्रार निवारण दर" :value="`${dashboardStats.resolutionRate}%`" variant="blue" trend="सरासरी २ दिवस SLA" :trendUp="true" />
          </div>
          <div class="col-6 col-md-3">
            <StatsCard icon="bi-bank2" label="निधी वापर (Funds)" :value="`₹${(dashboardStats.totalFundsUtilized / 100000).toFixed(1)} लाख`" variant="brown" />
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Services Grid Section -->
    <section class="py-5" style="background-color: var(--color-warm-ivory);">
      <div class="container py-2">
        <SectionTitle 
          title="ग्रामपंचायत ऑनलाईन सेवा व दाखले" 
          subtitle="जन्म, मृत्यू, उत्पन्न, रहिवास दाखले आणि घरपट्टी-पाणीपट्टी कर भरणा घरबसल्या करा." 
          tag="नागरिक सेवा दालन"
          align="center"
        />

        <!-- Grid strict spec: Desktop 4 (col-xl-3), Laptop 3 (col-lg-4), Tablet 2 (col-md-6), Mobile 1 (col-12) -->
        <div class="row g-3 g-md-4">
          <div v-for="srv in popularServices" :key="srv.id" class="col-12 col-md-6 col-lg-4 col-xl-3">
            <ServiceCard :service="srv" @apply="openServiceModal" />
          </div>
        </div>

        <div class="text-center mt-4 pt-2">
          <router-link to="/services" class="btn btn-eg-secondary rounded-pill px-4 fw-bold">
            सर्व १२ ग्रामपंचायत सेवा पाहा <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Complaint Registration Section Preview -->
    <section class="py-5 bg-white border-top border-bottom">
      <div class="container py-2">
        <div class="row align-items-center g-4 g-lg-5">
          <div class="col-lg-6">
            <div class="p-4 p-md-5 rounded-4 text-white shadow-medium" style="background: linear-gradient(135deg, #1F4D3A 0%, #2E6A4F 100%);">
              <span class="badge bg-warning text-dark font-sans text-xs mb-2 px-3 py-1 fw-bold rounded-pill">
                <i class="bi bi-shield-exclamation me-1"></i> तक्रार निवारण कक्ष
              </span>
              <h3 class="fw-bold text-white mb-3" style="font-size: 1.75rem;">पाणी, रस्ते किंवा दिव्यांची समस्या आहे?</h3>
              <p class="text-white opacity-90 text-sm mb-4" style="line-height: 1.6;">
                गावातील सार्वजनिक समस्येचा फोटो काढून ऑनलाईन तक्रार नोंदवा. ग्रामपंचायत कर्मचारी २४ तासांत पाहणी करून तक्रार निवारण करतील.
              </p>

              <div class="d-flex flex-wrap gap-2 mb-4">
                <span class="badge bg-white bg-opacity-20 text-white font-sans px-3 py-1.5"><i class="bi bi-droplet-half me-1"></i> पाणी पुरवठा</span>
                <span class="badge bg-white bg-opacity-20 text-white font-sans px-3 py-1.5"><i class="bi bi-lightbulb me-1"></i> पथदिवे</span>
                <span class="badge bg-white bg-opacity-20 text-white font-sans px-3 py-1.5"><i class="bi bi-truck me-1"></i> कचरा व्यवस्थापन</span>
                <span class="badge bg-white bg-opacity-20 text-white font-sans px-3 py-1.5"><i class="bi bi-signpost-split me-1"></i> रस्ते दुरुस्ती</span>
              </div>

              <router-link to="/raise-complaint" class="btn btn-eg-primary rounded-pill px-4 py-2.5 fw-bold">
                <i class="bi bi-camera-fill me-1"></i> ऑनलाईन तक्रार नोंदवा
              </router-link>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-success mb-0"><i class="bi bi-clock-history me-1"></i> अलीकडील तक्रारी व निवारण स्थिती</h5>
              <router-link to="/raise-complaint" class="text-xs text-success fw-bold">सर्व पाहा <i class="bi bi-chevron-right"></i></router-link>
            </div>

            <div class="d-flex flex-column gap-3">
              <ComplaintCard v-for="cmp in recentComplaints" :key="cmp.id" :complaint="cmp" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Development Works Preview -->
    <section class="py-5" style="background-color: var(--color-warm-ivory);">
      <div class="container py-2">
        <SectionTitle 
          title="गावातील प्रगतीपथावरील विकास कामे" 
          subtitle="ग्रामपंचायतीतर्फे राबवल्या जाणाऱ्या सर्व काँक्रिट रस्ते, पाणी टाक्या व स्मार्ट डिजिटल प्रकल्पांची माहिती."
          tag="पारदर्शक विकास"
          align="center"
        />

        <div class="row g-4">
          <div v-for="work in activeWorks" :key="work.id" class="col-12 col-md-6 col-lg-4">
            <WorkCard :work="work" />
          </div>
        </div>

        <div class="text-center mt-4 pt-2">
          <router-link to="/development-works" class="btn btn-eg-secondary rounded-pill px-4 fw-bold">
            सर्व विकास कामे व बजेट पाहा <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Nidhi Funds & Government Schemes Section -->
    <section class="py-5 bg-white border-top border-bottom">
      <div class="container py-2">
        <div class="row align-items-center g-4 g-lg-5">
          <div class="col-lg-5">
            <SectionTitle 
              title="शासकीय निधी व अनुदान पारदर्शकता" 
              subtitle="आमदार निधी, खासदार निधी, १५ वा वित्त आयोग व जिल्हा परिषद अनुदानाचा गावात कुठे वापर झाला त्याची पारदर्शक माहिती."
              tag="ग्रामनिधी हिशोब"
              align="left"
            />
            <router-link to="/nidhi" class="btn btn-eg-primary rounded-pill px-4 font-sans fw-bold">
              निधी तपशील पाहा <i class="bi bi-bank2 ms-1"></i>
            </router-link>
          </div>

          <div class="col-lg-7">
            <div class="row g-3">
              <div v-for="fund in mainFunds" :key="fund.id" class="col-12 col-sm-6">
                <FundCard :fund="fund" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gram Sabha & Notices Section -->
    <section class="py-5" style="background-color: var(--color-warm-ivory);">
      <div class="container py-2">
        <div class="row g-4">
          <!-- Upcoming Gram Sabha -->
          <div class="col-lg-6">
            <div class="eg-card p-4 h-100 border-start border-4 border-success">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <span class="badge bg-success bg-opacity-10 text-success font-sans px-3 py-1 fw-bold">
                  <i class="bi bi-people-fill me-1"></i> आगामी ग्रामसभा
                </span>
                <span class="text-xs text-muted font-sans"><i class="bi bi-calendar-event me-1"></i> {{ upcomingSabha.date }}</span>
              </div>

              <h4 class="fw-bold text-success mb-2" style="font-size: 1.35rem;">{{ upcomingSabha.titleMr }}</h4>
              <p class="text-xs text-muted font-sans mb-3"><i class="bi bi-clock me-1"></i> वेळ: {{ upcomingSabha.time }} | ठिकाण: {{ upcomingSabha.location }}</p>

              <div class="bg-light p-3 rounded-3 border mb-3">
                <strong class="d-block text-xs text-uppercase font-sans text-muted mb-2">ग्रामसभा अजेंडा (विषय पत्रिका):</strong>
                <ul class="text-xs text-secondary mb-0 ps-3">
                  <li v-for="(agenda, idx) in upcomingSabha.agendaMr" :key="idx" class="mb-1">{{ agenda }}</li>
                </ul>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="text-xs text-muted"><i class="bi bi-person-check text-success me-1"></i> अपेक्षा: {{ upcomingSabha.expectedAttendees }} नागरिक</span>
                <router-link to="/gram-sabha" class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold">
                  सविस्तर वेळापत्रक पाहा
                </router-link>
              </div>
            </div>
          </div>

          <!-- Important Notices -->
          <div class="col-lg-6">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-success mb-0"><i class="bi bi-megaphone-fill me-1 text-warning"></i> महत्त्वाच्या सूचना व प्रकटन</h5>
              <router-link to="/notices" class="text-xs text-success fw-bold">सर्व सूचना <i class="bi bi-chevron-right"></i></router-link>
            </div>

            <div class="d-flex flex-column gap-3">
              <NoticeCard v-for="ntc in recentNotices" :key="ntc.id" :notice="ntc" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { useMockData } from '../../composables/useMockData';
import StatsCard from '../../components/common/StatsCard.vue';
import SectionTitle from '../../components/common/SectionTitle.vue';
import ServiceCard from '../../components/cards/ServiceCard.vue';
import ComplaintCard from '../../components/cards/ComplaintCard.vue';
import WorkCard from '../../components/cards/WorkCard.vue';
import FundCard from '../../components/cards/FundCard.vue';
import NoticeCard from '../../components/cards/NoticeCard.vue';

const { activePanchayat } = useAuth();
const { services, complaints, devWorks, nidhiFunds, gramSabhaMeetings, notices, dashboardStats } = useMockData();
const router = useRouter();

const quickTrackId = ref('');

const popularServices = computed(() => services.value.filter(s => s.popular).slice(0, 8));
const recentComplaints = computed(() => complaints.value.slice(0, 2));
const activeWorks = computed(() => devWorks.value.slice(0, 3));
const mainFunds = computed(() => nidhiFunds.value.slice(0, 2));
const upcomingSabha = computed(() => gramSabhaMeetings.value[0]);
const recentNotices = computed(() => notices.value.slice(0, 2));

function goToTrack() {
  if (quickTrackId.value) {
    router.push({ path: '/track', query: { id: quickTrackId.value } });
  } else {
    router.push('/track');
  }
}

function openServiceModal(srv: any) {
  router.push({ path: '/services', query: { applyId: srv.id } });
}
</script>
