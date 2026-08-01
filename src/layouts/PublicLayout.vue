<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <!-- Navbar -->
    <AppNavbar />

    <!-- Main Content -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Luxury Village Footer -->
    <footer class="bg-dark text-white pt-5 pb-4 mt-5 font-sans" style="background-color: #123B15 !important;">
      <div class="container">
        <div class="row g-4 mb-4">
          <!-- Col 1: About Panchayat -->
          <div class="col-lg-4 col-md-6">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="bi bi-tree-fill fs-5"></i>
              </div>
              <h5 class="mb-0 fw-bold text-white font-marathi">ई-ग्रामपंचायत डिजिटल पोर्टल</h5>
            </div>
            <p class="text-white-50 text-sm mb-3">
              महाराष्ट्र राज्य शासन ग्रामविकास विभागांतर्गत डिजिटल ग्रामपंचायत उपक्रम. सर्व नागरिक सेवा, दाखले, तक्रार निवारण व ग्राम विकास निधी माहिती आता पारदर्शकपणे ऑनलाईन उपलब्ध.
            </p>
            <div class="d-flex gap-2">
              <span class="badge bg-success bg-opacity-25 text-warning border border-warning text-xs">ISO 9001:2025 प्रमाणित</span>
              <span class="badge bg-success bg-opacity-25 text-warning border border-warning text-xs">२५६-बिट एन्क्रिप्शन सुरेख</span>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="col-lg-2 col-md-6">
            <h6 class="fw-bold text-warning mb-3 text-uppercase tracking-wider text-xs">महत्वाच्या लिंक्स</h6>
            <ul class="list-unstyled text-sm d-flex flex-column gap-2 text-white-50">
              <li><router-link to="/services" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> नागरिक सेवा व दाखले</router-link></li>
              <li><router-link to="/track" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> अर्जाची स्थिती (Status)</router-link></li>
              <li><router-link to="/raise-complaint" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> तक्रार ऑनलाईन नोंदवा</router-link></li>
              <li><router-link to="/development-works" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> ग्राम विकास कामे</router-link></li>
              <li><router-link to="/gram-sabha" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> ग्रामसभा वेळापत्रक</router-link></li>
            </ul>
          </div>

          <!-- Col 3: Govt Funds & Notices -->
          <div class="col-lg-3 col-md-6">
            <h6 class="fw-bold text-warning mb-3 text-uppercase tracking-wider text-xs">प्रशासन व निधी</h6>
            <ul class="list-unstyled text-sm d-flex flex-column gap-2 text-white-50">
              <li><router-link to="/nidhi" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> आमदार व खासदार निधी</router-link></li>
              <li><router-link to="/notices" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> घरपट्टी व पाणीपट्टी सवलत</router-link></li>
              <li><router-link to="/schemes" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> राज्य व केंद्र योजना</router-link></li>
              <li><router-link to="/about" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> ग्रामपंचायत पदाधिकारी</router-link></li>
              <li><router-link to="/contact" class="text-white-50 text-decoration-none hover-white"><i class="bi bi-chevron-right text-warning me-1"></i> संपर्क व मदत केंद्र</router-link></li>
            </ul>
          </div>

          <!-- Col 4: Contact & Helpline -->
          <div class="col-lg-3 col-md-6">
            <h6 class="fw-bold text-warning mb-3 text-uppercase tracking-wider text-xs">ग्रामपंचायत संपर्क</h6>
            <div class="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10 mb-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <i class="bi bi-telephone-fill text-warning fs-5"></i>
                <div>
                  <small class="d-block text-white-50 text-xs">टोल फ्री मदत रेषा</small>
                  <strong class="text-white fs-6">१८००-२३३-४५६७</strong>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-envelope-fill text-warning fs-5"></i>
                <div>
                  <small class="d-block text-white-50 text-xs">ई-मेल संपर्क</small>
                  <span class="text-white text-xs">helpdesk@egram.maharashtra.gov.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-secondary opacity-25" />

        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between text-xs text-white-50 pt-2">
          <p class="mb-2 mb-md-0">
            © २०२६ ई-ग्रामपंचायत SaaS पोर्टल. सर्व हक्क सुरक्षित. महाराष्ट्र शासन ग्रामविकास विभाग.
          </p>
          <div class="d-flex gap-3">
            <a href="#" class="text-white-50 text-decoration-none">गोपनीयता धोरण (Privacy)</a>
            <a href="#" class="text-white-50 text-decoration-none">नियम व अटी</a>
            <a href="#" class="text-white-50 text-decoration-none">अक्सेसिबिलिटी</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Mobile Bottom Nav -->
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/common/AppNavbar.vue';
import MobileBottomNav from '../components/common/MobileBottomNav.vue';
</script>
