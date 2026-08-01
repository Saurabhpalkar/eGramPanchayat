<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 900px;">
      <SectionTitle 
        title="आमची ग्रामपंचायत व पदाधिकारी परिचय" 
        subtitle="महाराष्ट्रातील समृद्ध व आदर्श डिजिटल गाव निर्मितीचा संकल्प."
        tag="ग्रामपंचायत परिचय"
        align="center"
      />

      <div class="row g-4 mb-5">
        <div class="col-md-6">
          <div class="eg-card p-4 text-center border-top border-4 border-success">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" class="rounded-circle mb-3 border border-3 border-success" width="100" height="100" alt="Sarpanch" />
            <h5 class="fw-bold text-success mb-1">सौ. सुनीता आनंदराव पाटील</h5>
            <span class="badge bg-success bg-opacity-10 text-success font-sans mb-3">सरपंच (Sarpanch)</span>
            <p class="text-xs text-muted font-sans mb-0">
              "गावातील प्रत्येक नागरिकाला शासकीय दाखले व नागरी सोयी मोबाईलवर सहज उपलब्ध करून देणे हे आमचे ध्येय आहे."
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="eg-card p-4 text-center border-top border-4 border-warning">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" class="rounded-circle mb-3 border border-3 border-warning" width="100" height="100" alt="Gram Sevak" />
            <h5 class="fw-bold text-dark mb-1">श्री. रमेश तुकाराम शिंदे</h5>
            <span class="badge bg-warning bg-opacity-20 text-dark font-sans mb-3">ग्रामसेवक (Gram Sevak)</span>
            <p class="text-xs text-muted font-sans mb-0">
              "ई-ग्राम प्रणालीमुळे प्रशासनात पारदर्शकता आली असून दाखले वितरणाचा कालावधी २ दिवसांवर आणला आहे."
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionTitle from '../../components/common/SectionTitle.vue';
</script>
