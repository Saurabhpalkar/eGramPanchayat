<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 900px;">
      <SectionTitle 
        title="ग्रामपंचायत अधिकृत सूचना फलक" 
        subtitle="घरपट्टी सवलत, पाणी पुरवठा वेळापत्रक, ग्रामसभा जाहीर नोटीस व आपत्कालीन प्रकटन."
        tag="जाहीर प्रकटन"
        align="center"
      />

      <div class="row g-3">
        <div v-for="ntc in notices" :key="ntc.id" class="col-md-6">
          <NoticeCard :notice="ntc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '../../composables/useMockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import NoticeCard from '../../components/cards/NoticeCard.vue';

const { notices } = useMockData();
</script>
