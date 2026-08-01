<template>
  <div>
    <DashboardHeader title="प्रस्तावित कामे व योजना (Upcoming Works)" subtitle="पुढील वर्षातील नियोजित विकास प्रकल्प व नागरिकांचे मतदान" />

    <!-- Intro Card -->
    <div class="eg-card p-4 my-3 bg-gradient-success text-white">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h4 class="fw-bold mb-1"><i class="bi bi-calendar-check me-2"></i>आपल्या गावाचे भवितव्य घडवण्यात सहभागी व्हा!</h4>
          <p class="text-xs opacity-90 mb-0 font-sans">
            ग्रामपंचायतीने प्रस्तावित केलेल्या नवीन कामांना मत (Upvote) द्या किंवा नवीन विकासाची संकल्पना सुचवा.
          </p>
        </div>
        <button class="btn btn-warning btn-sm rounded-pill font-sans fw-bold text-dark px-3 shadow-sm" @click="showSuggestModal = true">
          <i class="bi bi-plus-lg me-1"></i> नवीन विकास काम सुचवा
        </button>
      </div>
    </div>

    <!-- Upcoming Works Cards -->
    <div class="row g-3 my-2">
      <div v-for="work in worksList" :key="work.id" class="col-md-6">
        <div class="eg-card h-100 p-4 d-flex flex-column justify-content-between border border-success border-opacity-25 hover-shadow transition-all">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 font-sans">
                वार्ड क्र. {{ work.wardNo }}
              </span>
              <span class="badge bg-warning text-dark font-sans text-xs">
                अंदाजे खर्च: ₹{{ (work.estimatedCost / 100000).toFixed(1) }} लाख
              </span>
            </div>

            <h5 class="fw-bold text-dark mb-2" style="font-family: var(--font-marathi);">{{ work.titleMr }}</h5>
            <p class="text-xs text-muted font-sans mb-3">{{ work.descriptionMr }}</p>

            <div class="bg-light p-2.5 rounded-3 border text-xs font-sans d-flex flex-column gap-1 mb-3">
              <div class="d-flex justify-content-between">
                <span class="text-muted">प्रस्तावित योजना:</span>
                <strong class="text-dark">{{ work.proposedScheme || 'ग्रामपंचायत विशेष विकास निधी' }}</strong>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">अपेक्षित सुरुवात:</span>
                <strong class="text-dark">{{ work.proposedStartDate || 'एप्रिल २०२६' }}</strong>
              </div>
            </div>
          </div>

          <!-- Citizen Upvoting Bar -->
          <div class="pt-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div class="d-flex align-items-center gap-2">
              <button 
                class="btn btn-sm rounded-pill font-sans fw-bold d-flex align-items-center gap-1.5 px-3"
                :class="userVotes[work.id] ? 'btn-success text-white shadow-sm' : 'btn-outline-success'"
                @click="toggleVote(work)"
              >
                <i class="bi" :class="userVotes[work.id] ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                <span>{{ userVotes[work.id] ? 'पाठिंबा दिला' : 'पाठिंबा द्या (Vote)' }}</span>
              </button>
              <span class="text-xs fw-bold text-muted font-sans">
                <strong class="text-success">{{ getVoteCount(work) }}</strong> ग्रामस्थांचा पाठिंबा
              </span>
            </div>

            <button class="btn btn-sm btn-link text-decoration-none text-xs text-success font-sans p-0 fw-semibold" @click="openCommentModal(work)">
              <i class="bi bi-chat-left-text me-1"></i> चर्चा / सूचना ({{ work.commentsCount || 3 }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggest New Work Modal -->
    <div v-if="showSuggestModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold" style="font-family: var(--font-marathi);">
              <i class="bi bi-lightbulb me-2"></i>नवीन विकास काम सुचवा
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showSuggestModal = false"></button>
          </div>
          <div class="modal-body p-4 font-sans">
            <div class="mb-3">
              <label class="form-label text-xs fw-bold text-dark">कामाचे नाव (Work Title) <span class="text-danger">*</span></label>
              <input type="text" v-model="newProposal.title" class="form-control text-xs" placeholder="उदा. वॉर्ड क्र. ४ मध्ये भूमिगत गटार लाईन..." />
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <label class="form-label text-xs fw-bold text-dark">वार्ड क्र.</label>
                <select v-model="newProposal.wardNo" class="form-select text-xs">
                  <option v-for="w in 6" :key="w" :value="w">वॉर्ड {{ w }}</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label text-xs fw-bold text-dark">अंदाजे बजेट (Budget)</label>
                <input type="text" v-model="newProposal.budget" class="form-control text-xs" placeholder="उदा. ₹२,००,०००" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label text-xs fw-bold text-dark">कामाचे वर्णन / गरज (Description)</label>
              <textarea v-model="newProposal.description" class="form-control text-xs" rows="3" placeholder="या कामाची गावातील गरज स्पष्ट करा..."></textarea>
            </div>

            <div v-if="proposalSuccess" class="alert alert-success py-2 text-xs">
              <i class="bi bi-check-circle me-1"></i> तुमची संकल्पना ग्रामपंचायतीकडे आणि आगामी ग्रामसभेकडे पाठवली गेली आहे!
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showSuggestModal = false">रद्द करा</button>
            <button type="button" class="btn btn-sm btn-success rounded-pill px-4 fw-bold" @click="submitProposal">
              प्रस्ताव पाठवा
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';

const { upcomingWorks } = useMockData();

const worksList = ref([...upcomingWorks.value]);
const userVotes = reactive<Record<string, boolean>>({});
const showSuggestModal = ref(false);
const proposalSuccess = ref(false);

const newProposal = reactive({
  title: '',
  wardNo: 1,
  budget: '',
  description: ''
});

function getVoteCount(work: any) {
  const baseCount = work.votesCount || 18;
  return userVotes[work.id] ? baseCount + 1 : baseCount;
}

function toggleVote(work: any) {
  userVotes[work.id] = !userVotes[work.id];
}

function openCommentModal(work: any) {
  alert(`'${work.titleMr}' या कामाबाबत नागरिकांच्या चर्चा आगामी ग्रामसभेत घेतल्या जातील.`);
}

function submitProposal() {
  if (!newProposal.title.trim()) return;
  proposalSuccess.value = true;
  setTimeout(() => {
    worksList.value.unshift({
      id: `up-${Date.now()}`,
      titleMr: newProposal.title,
      wardNo: newProposal.wardNo,
      estimatedCost: 250000,
      descriptionMr: newProposal.description || 'ग्रामस्थांकडून सुचवलेला विशेष विकास प्रस्ताव',
      votesCount: 1,
      commentsCount: 0
    });
    proposalSuccess.value = false;
    showSuggestModal.value = false;
    newProposal.title = '';
    newProposal.description = '';
  }, 1500);
}
</script>
