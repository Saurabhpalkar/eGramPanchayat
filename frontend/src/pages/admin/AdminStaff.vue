<template>
  <div>
    <DashboardHeader title="कर्मचारी व्यवस्थापन (Staff Management)" subtitle="ग्रामपंचायत सेवक, लिपिक व सिस्टीम ऑपरेटर खाती" />

    <div class="eg-card p-4 my-3 font-sans">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0">ग्रामपंचायत कर्मचारी यादी</h6>
        <button class="btn btn-eg-primary btn-sm rounded-pill fw-bold">
          <i class="bi bi-person-plus-fill me-1"></i> नवीन कर्मचारी जोडा
        </button>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>कर्मचारी नाव</th>
            <th>पद / हुद्दा</th>
            <th>विभाग</th>
            <th>मोबाईल क्र.</th>
            <th>स्टेटस</th>
          </tr>
        </template>
        <template #body>
          <tr>
            <td><strong>श्री. अमित बाळकृष्ण मोरे</strong></td>
            <td>वरिष्ठ लिपिक (Senior Clerk)</td>
            <td>दाखले व सामान्य प्रशासन</td>
            <td>9822112233</td>
            <td><span class="badge bg-success bg-opacity-10 text-success">सक्रिय (Active)</span></td>
          </tr>
          <tr>
            <td><strong>श्री. विकास पांडुरंग कांबळे</strong></td>
            <td>जलसुरक्षक व तंत्रज्ञ</td>
            <td>पाणी पुरवठा विभाग</td>
            <td>9822334455</td>
            <td><span class="badge bg-success bg-opacity-10 text-success">सक्रिय (Active)</span></td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';
</script>
