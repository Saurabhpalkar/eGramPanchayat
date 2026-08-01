<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container" style="max-width: 840px;">
      <SectionTitle 
        title="ग्रामपंचायत ऑनलाईन तक्रार नोंदणी कक्ष" 
        subtitle="पाणी पुरवठा, रस्ते, गटारे, पथदिवे किंवा स्वच्छतेच्या तक्रारीचा फोटो काढून नोंदवा. त्वरित तिकीट आयडी मिळवा."
        tag="नागरिक तक्रार निवारण"
        align="center"
      />

      <div class="eg-card p-4 p-md-5 shadow-sm">
        <form @submit.prevent="handleSubmitComplaint">
          <div class="row g-3 font-sans">
            <!-- Category Selection from prompt -->
            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">तक्रार वर्गवारी (Category) *</label>
              <select class="form-select" v-model="formCategory" required>
                <option value="Water Supply">पिण्याच्या पाण्याची समस्या (Water Supply)</option>
                <option value="Road Damage">रस्ते दुरुस्ती व खड्डे (Road Damage)</option>
                <option value="Drainage">गटारे व सांडपाणी (Drainage)</option>
                <option value="Street Lights">पथदिवे बंद असणे (Street Lights)</option>
                <option value="Garbage Collection">कचरा व्यवस्थापन (Garbage Collection)</option>
                <option value="Sanitation">सार्वजनिक स्वच्छता (Sanitation)</option>
                <option value="Public Property">सार्वजनिक मालमत्ता नुकसान (Public Property)</option>
                <option value="Encroachment">अतिक्रमण तक्रार (Encroachment)</option>
                <option value="Animal Issues">भटक्या प्राण्यांचा उपद्रव (Animal Issues)</option>
                <option value="Electricity">वीज पुरवठा समस्या (Electricity)</option>
                <option value="Other">इतर समस्या (Other)</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">वॉर्ड क्र. / गल्ली परिसर *</label>
              <select class="form-select" v-model="formWard" required>
                <option value="वॉर्ड १ (मुख्य चौक)">वॉर्ड १ (मुख्य चौक व बसस्थानक)</option>
                <option value="वॉर्ड २ (मंदिर परिसर)">वॉर्ड २ (मंदिर परिसर व गावठाण)</option>
                <option value="वॉर्ड ३ (शाळा रोड)">वॉर्ड ३ (जि. प. शाळा रोड)</option>
                <option value="वॉर्ड ४ (टेकडी परिसर)">वॉर्ड ४ (टेकडी परिसर व नवीन वस्ती)</option>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label text-xs fw-bold">तक्रारीचा मुख्य विषय (Title) *</label>
              <input 
                type="text" 
                v-model="formTitle" 
                class="form-control" 
                placeholder="उदा. वॉर्ड ३ मधील नळाला कमी दाबाने गढूळ पाणी येत आहे" 
                required 
              />
            </div>

            <div class="col-12">
              <label class="form-label text-xs fw-bold">तक्रारीचे सविस्तर वर्णन (Description) *</label>
              <textarea 
                v-model="formDescription" 
                rows="4" 
                class="form-control" 
                placeholder="समस्येचे स्थान, किती दिवसांपासून समस्या आहे याबद्दल सविस्तर माहिती लिहा..." 
                required
              ></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">तक्रारदाराचे नाव *</label>
              <input type="text" v-model="formCitizenName" class="form-control" placeholder="उदा. रमेश साळुंखे" required />
            </div>

            <div class="col-md-6">
              <label class="form-label text-xs fw-bold">मोबाईल क्रमांक (SMS अपडेट्ससाठी) *</label>
              <input type="tel" v-model="formPhone" maxlength="10" class="form-control" placeholder="१० अंकी मोबाईल क्र." required />
            </div>

            <div class="col-12">
              <label class="form-label text-xs fw-bold">समस्येचा फोटो अपलोड (Photo Upload UI) *</label>
              <FileUpload @file-selected="handleFileSelected" />
            </div>
          </div>

          <div class="border-top pt-4 mt-4 d-flex align-items-center justify-content-between">
            <span class="text-xs text-muted font-sans">
              <i class="bi bi-shield-lock me-1 text-success"></i> आपली तक्रार गोपनीय ठेवली जाईल.
            </span>
            <button type="submit" class="btn btn-eg-primary rounded-pill px-4 fw-bold" :disabled="submitting">
              <span v-if="submitting"><span class="spinner-border spinner-border-sm me-1"></span> नोंदणी सुरू आहे...</span>
              <span v-else><i class="bi bi-send-fill me-1"></i> तक्रार दाखल करा</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Complaint Created Modal -->
      <div v-if="createdTicket" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 border-0 p-4 text-center">
            <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-ticket-perforated-fill fs-1"></i>
            </div>
            <h4 class="fw-bold text-success mb-2">तक्रार यशस्वीरित्या नोंदवली गेली!</h4>
            <p class="text-muted text-xs mb-3 font-sans">आपली तक्रार ग्रामपंचायत पाणी व स्वच्छता विभागाकडे सोपवण्यात आली आहे.</p>
            <div class="bg-light p-3 rounded-3 border mb-3 font-sans">
              <span class="text-xs text-muted d-block">तक्रार तिकीट आयडी (Ticket ID):</span>
              <strong class="fs-4 text-dark">{{ createdTicket.ticketId }}</strong>
            </div>
            <button class="btn btn-eg-primary rounded-pill w-100 fw-bold" @click="goToTrackTicket">
              तक्रार प्रगती स्टेटस पाहा
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMockData } from '../../composables/useMockData';
import type { ComplaintItem } from '../../data/mockData';
import SectionTitle from '../../components/common/SectionTitle.vue';
import FileUpload from '../../components/common/FileUpload.vue';

const { addComplaint } = useMockData();
const router = useRouter();

const formCategory = ref('Water Supply');
const formWard = ref('वॉर्ड १ (मुख्य चौक)');
const formTitle = ref('');
const formDescription = ref('');
const formCitizenName = ref('');
const formPhone = ref('');
const photoUrl = ref('https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=600&auto=format&fit=crop&q=80');

const submitting = ref(false);
const createdTicket = ref<ComplaintItem | null>(null);

function handleFileSelected(file: File) {
  photoUrl.value = URL.createObjectURL(file);
}

function handleSubmitComplaint() {
  submitting.value = true;
  setTimeout(() => {
    const newCmp = addComplaint({
      category: formCategory.value,
      categoryMr: formCategory.value,
      title: formTitle.value,
      description: formDescription.value,
      citizenName: formCitizenName.value,
      phone: formPhone.value,
      location: `${formWard.value}, शिवणे`,
      wardNo: formWard.value,
      photoUrl: photoUrl.value
    });
    submitting.value = false;
    createdTicket.value = newCmp;
  }, 700);
}

function goToTrackTicket() {
  const tId = createdTicket.value?.ticketId;
  createdTicket.value = null;
  if (tId) {
    router.push({ path: '/track', query: { id: tId } });
  }
}
</script>
