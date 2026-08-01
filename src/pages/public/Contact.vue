<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 900px;">
      <SectionTitle 
        title="ग्रामपंचायत कार्यालय संपर्क व मदत केंद्र" 
        subtitle="नागरी चौकशी, अभिप्राय किंवा मदतीसाठी ग्रामपंचायत कार्यालयाशी संपर्क साधा."
        tag="संपर्क साधा"
        align="center"
      />

      <div class="row g-4 font-sans">
        <div class="col-md-5">
          <div class="eg-card p-4 h-100 border-start border-4 border-success">
            <h5 class="fw-bold text-success mb-3">ग्रामपंचायत पत्ता:</h5>
            <p class="text-sm text-dark mb-4">
              ग्रामपंचायत कार्यालय शिवणे, मुख्य रस्ता, मारुती मंदिराजवळ, तालुका हवेली, जिल्हा पुणे - ४११०२३.
            </p>

            <div class="d-flex flex-column gap-3 text-xs text-muted">
              <div>
                <strong class="text-dark d-block mb-1"><i class="bi bi-clock-fill text-success me-1"></i> कार्यालयीन वेळ:</strong>
                सोमवार ते शनिवार: सकाळी १०:०० ते दुपारी ०५:४५ (शासकीय सुट्ट्या वगळून)
              </div>
              <div>
                <strong class="text-dark d-block mb-1"><i class="bi bi-telephone-fill text-success me-1"></i> संपर्क क्रमांक:</strong>
                ०२०-२४४५६७८९ | टोल फ्री: १८००-२३३-४५६७
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-7">
          <div class="eg-card p-4">
            <h5 class="fw-bold text-success mb-3">ऑनलाईन अभिप्राय व चौकशी फॉर्म</h5>
            <form @submit.prevent="sent = true">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-xs fw-bold">नाव *</label>
                  <input type="text" required class="form-control" placeholder="आपले नाव" />
                </div>
                <div class="col-md-6">
                  <label class="form-label text-xs fw-bold">मोबाईल क्र. *</label>
                  <input type="tel" required maxlength="10" class="form-control" placeholder="मोबाईल क्र." />
                </div>
                <div class="col-12">
                  <label class="form-label text-xs fw-bold">संदेश / चौकशी *</label>
                  <textarea rows="3" required class="form-control" placeholder="आपला संदेश किंवा प्रश्न लिहा..."></textarea>
                </div>
              </div>

              <div v-if="sent" class="alert alert-success text-xs mt-3 mb-0">
                <i class="bi bi-check-circle-fill me-1"></i> आपला संदेश ग्रामपंचायत कार्यालयात पाठवला आहे!
              </div>

              <button type="submit" class="btn btn-eg-primary rounded-pill px-4 mt-3 fw-bold">
                संदेश पाठवा
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SectionTitle from '../../components/common/SectionTitle.vue';

const sent = ref(false);
</script>
