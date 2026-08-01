<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Subscription Plans Management (सबस्क्रिप्शन प्लॅन्स)" 
      subtitle="Super Admin SaaS Pricing, Tiers, Feature Matrix & Active Subscriber Breakdown" 
    />

    <!-- Billing Cycle Toggle Header -->
    <div class="eg-card p-3.5 my-3 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
      <div>
        <h6 class="fw-bold text-success mb-1"><i class="bi bi-credit-card-2-front-fill me-1"></i> SaaS बिलिंग सायकल्स (Billing Cycle Selection)</h6>
        <p class="text-xs text-muted mb-0">मासिक किंवा वार्षिक बिलिंगचे दर पाहा व नियंत्रित करा.</p>
      </div>

      <!-- Toggle Switch -->
      <div class="bg-light p-1 rounded-pill d-flex align-items-center border">
        <button 
          class="btn btn-sm rounded-pill font-sans text-xs fw-bold px-3 py-1 transition-all"
          :class="billingCycle === 'monthly' ? 'btn-success text-white shadow-sm' : 'btn-light text-muted'"
          @click="billingCycle = 'monthly'"
        >
          मासिक (Monthly)
        </button>
        <button 
          class="btn btn-sm rounded-pill font-sans text-xs fw-bold px-3 py-1 transition-all position-relative"
          :class="billingCycle === 'yearly' ? 'btn-success text-white shadow-sm' : 'btn-light text-muted'"
          @click="billingCycle = 'yearly'"
        >
          वार्षिक (Yearly)
          <span class="badge bg-warning text-dark text-xs position-absolute top-0 start-100 translate-middle rounded-pill ms-1">२०% सवलत</span>
        </button>
      </div>
    </div>

    <!-- 4 Subscription Cards Grid -->
    <div class="row g-4 my-2">
      <!-- 1. FREE PLAN -->
      <div class="col-md-6 col-xl-3">
        <div class="eg-card p-4 h-100 d-flex flex-column border-top border-4 border-secondary hover-shadow">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-secondary text-white text-xs">Free Trial</span>
            <span class="badge bg-light text-dark border text-xs"><i class="bi bi-people me-1"></i>३ ग्रामपंचायती</span>
          </div>

          <h5 class="fw-bold text-dark mb-1">Free Trial</h5>
          <p class="text-xs text-muted mb-3">नवीन ग्रामपंचायतींसाठी ३० दिवसांचा मोफत अनुभव.</p>

          <div class="my-2">
            <h3 class="fw-bold text-dark mb-0">₹ ०</h3>
            <small class="text-muted text-xs">३० दिवस मर्यादित चाचणी</small>
          </div>

          <hr class="my-3 opacity-25" />

          <div class="fw-bold text-xs text-dark mb-2">समाविष्ट वैशिष्ट्ये (Features):</div>
          <ul class="text-xs text-secondary list-unstyled d-flex flex-column gap-2 mb-4 flex-grow-1">
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> ५०० नागरिकांपर्यंत नोंदणी</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> ५ मूलभूत दाखले प्रकार</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> मूलभूत ई-तक्रार निवारण</li>
            <li><i class="bi bi-dash-circle text-muted me-1.5"></i> <span class="text-muted">कर ऑनलाईन भरणा नाही</span></li>
            <li><i class="bi bi-dash-circle text-muted me-1.5"></i> <span class="text-muted">कस्टम डोमेन नाही</span></li>
          </ul>

          <div class="p-2.5 rounded-3 bg-light border text-center text-xs mb-3">
            <strong>सक्रिय सबस्क्रायबर्स:</strong> <span class="fw-bold text-success ms-1">३ ग्रामपंचायती</span>
          </div>

          <button class="btn btn-outline-secondary btn-sm w-100 rounded-pill fw-bold text-xs" @click="managePlan('Free Trial')">
            <i class="bi bi-gear me-1"></i> प्लॅन संपादित करा
          </button>
        </div>
      </div>

      <!-- 2. BASIC PLAN -->
      <div class="col-md-6 col-xl-3">
        <div class="eg-card p-4 h-100 d-flex flex-column border-top border-4 border-info hover-shadow">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-info text-white text-xs">Starter GP</span>
            <span class="badge bg-light text-dark border text-xs"><i class="bi bi-people me-1"></i>१२ ग्रामपंचायती</span>
          </div>

          <h5 class="fw-bold text-dark mb-1">Basic Starter</h5>
          <p class="text-xs text-muted mb-3">लहान ग्रामपंचायतींसाठी (लोकसंख्या < ५,०००)</p>

          <div class="my-2">
            <h3 class="fw-bold text-success mb-0">
              {{ billingCycle === 'monthly' ? '₹ ९९९' : '₹ ९,९९९' }}
              <small class="fs-6 text-muted font-sans">{{ billingCycle === 'monthly' ? '/महिना' : '/वर्ष' }}</small>
            </h3>
            <small class="text-muted text-xs">{{ billingCycle === 'yearly' ? '₹८३३/महिना (२०% बचत)' : 'मासिक बिलिंग' }}</small>
          </div>

          <hr class="my-3 opacity-25" />

          <div class="fw-bold text-xs text-dark mb-2">समाविष्ट वैशिष्ट्ये (Features):</div>
          <ul class="text-xs text-secondary list-unstyled d-flex flex-column gap-2 mb-4 flex-grow-1">
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> ५,००० नागरिकांपर्यंत</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> सर्व १२ ऑनलाईन दाखले</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> घरपट्टी व पाणीपट्टी भरणा</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> SMS सूचना व अपडेट्स</li>
            <li><i class="bi bi-dash-circle text-muted me-1.5"></i> <span class="text-muted">कस्टम डोमेन नाही</span></li>
          </ul>

          <div class="p-2.5 rounded-3 bg-light border text-center text-xs mb-3">
            <strong>सक्रिय सबस्क्रायबर्स:</strong> <span class="fw-bold text-success ms-1">१२ ग्रामपंचायती</span>
          </div>

          <button class="btn btn-outline-info btn-sm w-100 rounded-pill fw-bold text-xs" @click="managePlan('Basic Starter')">
            <i class="bi bi-gear me-1"></i> प्लॅन संपादित करा
          </button>
        </div>
      </div>

      <!-- 3. STANDARD PLAN -->
      <div class="col-md-6 col-xl-3">
        <div class="eg-card p-4 h-100 d-flex flex-column border-top border-4 border-success shadow-sm hover-shadow position-relative">
          <div class="position-absolute top-0 end-0 translate-middle-y me-3">
            <span class="badge bg-warning text-dark font-sans fw-bold text-xs shadow-sm"><i class="bi bi-star-fill me-1"></i>सर्वात लोकप्रिय</span>
          </div>

          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-success text-white text-xs">Standard Green</span>
            <span class="badge bg-light text-dark border text-xs"><i class="bi bi-people me-1"></i>२२ ग्रामपंचायती</span>
          </div>

          <h5 class="fw-bold text-success mb-1">Standard Green</h5>
          <p class="text-xs text-muted mb-3">मध्यम ग्रामपंचायतींसाठी (लोकसंख्या < २०,०००)</p>

          <div class="my-2">
            <h3 class="fw-bold text-success mb-0">
              {{ billingCycle === 'monthly' ? '₹ १,९९९' : '₹ १९,९९९' }}
              <small class="fs-6 text-muted font-sans">{{ billingCycle === 'monthly' ? '/महिना' : '/वर्ष' }}</small>
            </h3>
            <small class="text-muted text-xs">{{ billingCycle === 'yearly' ? '₹१,६६६/महिना (२०% बचत)' : 'मासिक बिलिंग' }}</small>
          </div>

          <hr class="my-3 opacity-25" />

          <div class="fw-bold text-xs text-dark mb-2">समाविष्ट वैशिष्ट्ये (Features):</div>
          <ul class="text-xs text-secondary list-unstyled d-flex flex-column gap-2 mb-4 flex-grow-1">
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> अमर्याद नागरिक नोंदणी</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> विकास कामे मॉनिटरिंग</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> निधी व अर्थसंकल्प (Nidhi)</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> व्हॉट्सॲप बोट अलर्ट्स</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> डिजिटल स्टॅम्प व QR पडताळणी</li>
          </ul>

          <div class="p-2.5 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 text-center text-xs mb-3">
            <strong>सक्रिय सबस्क्रायबर्स:</strong> <span class="fw-bold text-success ms-1">२२ ग्रामपंचायती</span>
          </div>

          <button class="btn btn-eg-primary btn-sm w-100 rounded-pill fw-bold text-xs" @click="managePlan('Standard Green')">
            <i class="bi bi-gear me-1"></i> प्लॅन संपादित करा
          </button>
        </div>
      </div>

      <!-- 4. PREMIUM PLAN -->
      <div class="col-md-6 col-xl-3">
        <div class="eg-card p-4 h-100 d-flex flex-column border-top border-4 border-warning hover-shadow">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-warning text-dark text-xs fw-bold">Enterprise Gold</span>
            <span class="badge bg-light text-dark border text-xs"><i class="bi bi-people me-1"></i>११ ग्रामपंचायती</span>
          </div>

          <h5 class="fw-bold text-dark mb-1">Premium Gold</h5>
          <p class="text-xs text-muted mb-3">मोठ्या ग्रामपंचायती व नगरपरिषदांसाठी</p>

          <div class="my-2">
            <h3 class="fw-bold text-success mb-0">
              {{ billingCycle === 'monthly' ? '₹ २,९९९' : '₹ २९,९९९' }}
              <small class="fs-6 text-muted font-sans">{{ billingCycle === 'monthly' ? '/महिना' : '/वर्ष' }}</small>
            </h3>
            <small class="text-muted text-xs">{{ billingCycle === 'yearly' ? '₹२,५००/महिना (२०% बचत)' : 'मासिक बिलिंग' }}</small>
          </div>

          <hr class="my-3 opacity-25" />

          <div class="fw-bold text-xs text-dark mb-2">समाविष्ट वैशिष्ट्ये (Features):</div>
          <ul class="text-xs text-secondary list-unstyled d-flex flex-column gap-2 mb-4 flex-grow-1">
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> सर्व Standard फीचर्स</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> कस्टम सबडोमेन (उदा. shivane.egram.gov.in)</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> AI डॅशबोर्ड व अहवाल</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> Dedicated अकाऊंट मॅनेजर</li>
            <li><i class="bi bi-check-circle-fill text-success me-1.5"></i> २४x७ कॉल व ऑन-साइट सपोर्ट</li>
          </ul>

          <div class="p-2.5 rounded-3 bg-light border text-center text-xs mb-3">
            <strong>सक्रिय सबस्क्रायबर्स:</strong> <span class="fw-bold text-success ms-1">११ ग्रामपंचायती</span>
          </div>

          <button class="btn btn-outline-warning text-dark btn-sm w-100 rounded-pill fw-bold text-xs" @click="managePlan('Premium Gold')">
            <i class="bi bi-gear me-1"></i> प्लॅन संपादित करा
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const billingCycle = ref<'monthly' | 'yearly'>('yearly');

function managePlan(planName: string) {
  alert(`[${planName}] प्लॅनचे दर व वैशिष्ट्ये संपादित करण्याची विंडो उघडली.`);
}
</script>
