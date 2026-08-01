<template>
  <div>
    <DashboardHeader title="ग्रामसभा नियोजन व इतिवृत्त (Gram Sabha)" subtitle="आगामी ग्रामसभा, विषयसूची, ऑनलाईन नोंदणी आणि मागील इतिवृत्त" />

    <!-- Next Meeting Banner -->
    <div v-if="upcomingMeeting" class="eg-card p-4 my-3 border-2 border-success bg-success bg-opacity-10">
      <div class="row align-items-center g-3">
        <div class="col-lg-8">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-danger text-white font-sans text-xs">आगामी महत्त्वाची ग्रामसभा</span>
            <span class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 font-sans text-xs">
              स्थान: {{ upcomingMeeting.venueMr || 'ग्रामपंचायत सभागृह' }}
            </span>
          </div>
          <h4 class="fw-bold text-success mb-2" style="font-family: var(--font-marathi);">{{ upcomingMeeting.titleMr }}</h4>
          <p class="text-xs text-muted font-sans mb-3">{{ upcomingMeeting.descriptionMr }}</p>

          <div class="d-flex align-items-center gap-4 flex-wrap text-xs font-sans fw-semibold text-dark">
            <div><i class="bi bi-calendar-event text-success me-1"></i>दिनांक: <strong>{{ upcomingMeeting.meetingDate }}</strong></div>
            <div><i class="bi bi-clock text-success me-1"></i>वेळ: <strong>{{ upcomingMeeting.meetingTime || 'सकाळी ११:०० वाजता' }}</strong></div>
            <div><i class="bi bi-person-badge text-success me-1"></i>अध्यक्ष: <strong>{{ upcomingMeeting.chairpersonMr || 'सौ. ग्राम सरपंच' }}</strong></div>
          </div>
        </div>

        <div class="col-lg-4 text-lg-end">
          <div class="d-flex flex-column gap-2">
            <button 
              class="btn btn-sm font-sans fw-bold rounded-pill px-4 py-2"
              :class="isRsvpDone ? 'btn-success text-white' : 'btn-eg-primary'"
              @click="toggleRsvp"
            >
              <i class="bi" :class="isRsvpDone ? 'bi-check-circle-fill me-1' : 'bi-person-check-fill me-1'"></i>
              {{ isRsvpDone ? 'उपस्थिती नोंदवली आहे!' : 'मी उपस्थित राहणार आहे (RSVP)' }}
            </button>
            <button class="btn btn-outline-success btn-sm font-sans fw-semibold rounded-pill px-3" @click="showQuestionModal = true">
              <i class="bi bi-chat-dots me-1"></i> विषय सुचवा / प्रश्न विचारा
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Agenda Section -->
    <div v-if="upcomingMeeting" class="eg-card p-4 mb-4">
      <h5 class="fw-bold text-success mb-3"><i class="bi bi-list-check me-2"></i>ग्रामसभा विषयसूची (Agenda Items)</h5>
      <div class="list-group list-group-flush font-sans">
        <div v-for="(agenda, idx) in upcomingMeeting.agendaItemsMr" :key="idx" class="list-group-item px-0 py-2.5 d-flex align-items-start gap-3">
          <span class="badge bg-success rounded-circle d-flex align-items-center justify-content-center text-white" style="width: 24px; height: 24px; min-width: 24px;">
            {{ idx + 1 }}
          </span>
          <div>
            <div class="fw-semibold text-dark text-sm">{{ agenda }}</div>
            <small class="text-muted" style="font-size: 0.72rem;">सविस्तर चर्चा व मंजुरी</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Past Meetings & Minutes (इतिवृत्त) -->
    <div class="eg-card p-4 mb-4">
      <h5 class="fw-bold text-success mb-3"><i class="bi bi-journal-text me-2"></i>मागील ग्रामसभा व इतिवृत्त (Past Resolutions)</h5>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>दिनांक</th>
            <th>ग्रामसभा विषय / प्रकार</th>
            <th>अध्यक्ष</th>
            <th>उपस्थित नागरिक</th>
            <th>ठराव व इतिवृत्त</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="meeting in pastMeetings" :key="meeting.id">
            <td><strong>{{ meeting.meetingDate }}</strong></td>
            <td>{{ meeting.titleMr }}</td>
            <td>{{ meeting.chairpersonMr || 'सरपंच' }}</td>
            <td><span class="badge bg-light text-dark border font-sans">{{ meeting.attendeesCount || 240 }} ग्रामस्थ</span></td>
            <td>
              <button class="btn btn-sm btn-outline-success rounded-pill text-xs font-sans fw-bold px-3" @click="downloadMinutes(meeting)">
                <i class="bi bi-file-earmark-pdf me-1"></i> इतिवृत्त PDF
              </button>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>

    <!-- Submit Question Modal -->
    <div v-if="showQuestionModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-chat-square-text me-2"></i>ग्रामसभेत प्रश्न मांडण्यासाठी नोंदणी
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showQuestionModal = false"></button>
          </div>
          <div class="modal-body p-4 font-sans">
            <p class="text-xs text-muted mb-3">
              ग्रामसभेच्या अजेंडामध्ये तुमचा प्रश्न/विषय समाविष्ट करण्यासाठी खालील फॉर्म भरा.
            </p>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold text-dark">विषय / प्रश्न (Subject) <span class="text-danger">*</span></label>
              <input type="text" v-model="citizenQuestion.title" class="form-control text-xs" placeholder="उदा. वॉर्ड क्र. २ मधील पिण्याच्या पाण्याचा प्रश्न..." />
            </div>
            <div class="mb-3">
              <label class="form-label text-xs fw-bold text-dark">सविस्तर माहिती</label>
              <textarea v-model="citizenQuestion.details" class="form-control text-xs" rows="3" placeholder="आपला प्रश्न सविस्तर स्पष्ट करा..."></textarea>
            </div>

            <div v-if="questionSuccess" class="alert alert-success py-2 text-xs">
              <i class="bi bi-check-circle me-1"></i> तुमचा विषय ग्रामपंचायत सचिवांकडे नोंदवला गेला आहे!
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showQuestionModal = false">रद्द करा</button>
            <button type="button" class="btn btn-sm btn-success rounded-pill px-4 fw-bold" @click="submitQuestion">
              विषय पाठवा
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const { gramSabhaMeetings } = useMockData();

const isRsvpDone = ref(false);
const showQuestionModal = ref(false);
const questionSuccess = ref(false);

const citizenQuestion = reactive({
  title: '',
  details: ''
});

const upcomingMeeting = computed(() => gramSabhaMeetings.value[0] || null);
const pastMeetings = computed(() => gramSabhaMeetings.value.slice(1));

function toggleRsvp() {
  isRsvpDone.value = !isRsvpDone.value;
}

function downloadMinutes(meeting: any) {
  alert(`'${meeting.titleMr}' या ग्रामसभेचे अधिकृत इतिवृत्त (Minutes of Meeting) डाऊनलोड पूर्ण झाले.`);
}

function submitQuestion() {
  if (!citizenQuestion.title.trim()) return;
  questionSuccess.value = true;
  setTimeout(() => {
    questionSuccess.value = false;
    showQuestionModal.value = false;
    citizenQuestion.title = '';
    citizenQuestion.details = '';
  }, 1500);
}
</script>
