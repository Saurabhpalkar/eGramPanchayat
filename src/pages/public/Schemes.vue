<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container">
      <SectionTitle 
        title="महाराष्ट्र व केंद्र सरकार कल्याणकारी योजना" 
        subtitle="लाडकी बहीण योजना, पीएम आवास योजना, जलजीवन मिशन व संजय गांधी निराधार योजनेसाठी ऑनलाईन अर्ज मार्गदर्शन."
        tag="शासकीय योजना"
        align="center"
      />

      <div class="row g-4 font-sans">
        <div class="col-md-6 col-lg-4">
          <div class="eg-card p-4 h-100 border-top border-4 border-success">
            <span class="badge bg-success bg-opacity-10 text-success mb-2">महिला सबलीकरण</span>
            <h5 class="fw-bold text-success mb-2">मुख्यमंत्री माझी लाडकी बहीण योजना</h5>
            <p class="text-xs text-secondary mb-3">२१ ते ६५ वयोगटातील महिलांना दरमहा ₹१,५०० आर्थिक सहाय्य.</p>
            <div class="bg-light p-2.5 rounded border text-xs mb-3">
              <strong>पात्रता:</strong> वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी, आधार संलग्न बँक खाते.
            </div>
            <button class="btn btn-outline-success btn-sm w-100 rounded-pill">अर्जाची माहिती पाहा</button>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="eg-card p-4 h-100 border-top border-4 border-warning">
            <span class="badge bg-warning bg-opacity-20 text-dark mb-2">गृहनिर्माण योजना</span>
            <h5 class="fw-bold text-dark mb-2">प्रधानमंत्री आवास योजना (ग्रामीण)</h5>
            <p class="text-xs text-secondary mb-3">बेघर व कच्च्या घरातील नागरिकांना पक्के घर बांधण्यासाठी ₹१.२० लाख अनुदान.</p>
            <div class="bg-light p-2.5 rounded border text-xs mb-3">
              <strong>पात्रता:</strong> SECC-2011 यादीतील नावे, स्वत:ची जागा / 8A उतारा.
            </div>
            <button class="btn btn-outline-success btn-sm w-100 rounded-pill">अर्जाची माहिती पाहा</button>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="eg-card p-4 h-100 border-top border-4 border-info">
            <span class="badge bg-info bg-opacity-10 text-info mb-2">सामाजिक सुरक्षा</span>
            <h5 class="fw-bold text-info mb-2">संजय गांधी निराधार योजना</h5>
            <p class="text-xs text-secondary mb-3">निराधार, अपंग व वृद्ध नागरिकांना दरमहा ₹१,५०० निवृत्तीवेतन सहाय्य.</p>
            <div class="bg-light p-2.5 rounded border text-xs mb-3">
              <strong>पात्रता:</strong> वयाचा दाखला, उत्पन्नाचा दाखला (₹२१,००० च्या आत).
            </div>
            <button class="btn btn-outline-success btn-sm w-100 rounded-pill">अर्जाची माहिती पाहा</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionTitle from '../../components/common/SectionTitle.vue';
</script>
