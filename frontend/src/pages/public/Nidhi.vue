<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container">
      <SectionTitle 
        title="ग्रामपंचायत शासकीय निधी व अनुदान" 
        subtitle="आमदार निधी, खासदार निधी, १५ वा वित्त आयोग, जिल्हा परिषद व पंचायत समितीच्या निधी वाटपाची संपूर्ण माहिती."
        tag="पारदर्शक अर्थसंकल्प"
        align="center"
      />

      <!-- Funds Overview Grid -->
      <div class="row g-4 mb-5">
        <div v-for="fund in nidhiFunds" :key="fund.id" class="col-md-6 col-lg-3">
          <FundCard :fund="fund" />
        </div>
      </div>

      <!-- Project Mapping Table -->
      <div class="eg-card p-4">
        <h5 class="fw-bold text-success mb-3"><i class="bi bi-list-check me-1"></i> निधीनुसार मंजूर कामे व प्रकल्पांची यादी:</h5>
        
        <ResponsiveTable>
          <template #head>
            <tr>
              <th>निधी नाव / योजना</th>
              <th>मंजूर काम</th>
              <th>मंजूर रक्कम (रु.)</th>
              <th>खर्च (रु.)</th>
              <th>सद्यस्थिती</th>
            </tr>
          </template>
          <template #body>
            <tr>
              <td><strong class="text-success">१५ वा वित्त आयोग</strong></td>
              <td>स्मार्ट काँक्रिट रस्ता व गटार</td>
              <td>₹२५,५०,०००</td>
              <td>₹१८,२०,०००</td>
              <td><span class="badge bg-warning bg-opacity-20 text-dark">प्रगतीपथावर (७५%)</span></td>
            </tr>
            <tr>
              <td><strong class="text-success">आमदार निधी (MLA Fund)</strong></td>
              <td>डिजिटल अभ्यासीका केंद्र</td>
              <td>₹१५,००,०००</td>
              <td>₹१५,००,०००</td>
              <td><span class="badge bg-success bg-opacity-20 text-success">पूर्ण (100%)</span></td>
            </tr>
            <tr>
              <td><strong class="text-success">जलजीवन मिशन</strong></td>
              <td>१५ लाख लिटर पाण्याची टाकी</td>
              <td>₹६८,००,०००</td>
              <td>₹६१,५०,०००</td>
              <td><span class="badge bg-warning bg-opacity-20 text-dark">अंतिम टप्प्यात (९२%)</span></td>
            </tr>
          </template>
        </ResponsiveTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import FundCard from '../../components/cards/FundCard.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { nidhiFunds } = useMockData();
</script>
