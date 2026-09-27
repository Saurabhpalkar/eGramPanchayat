<template>
  <div>
    <DashboardHeader title="नागरिक डॅशबोर्ड (Citizen Workspace)" subtitle="माझे ऑनलाईन दाखले व तक्रारी" />

    <!-- Welcome Banner -->
    <div class="eg-card p-4 my-3 bg-success bg-opacity-10 border-success border-opacity-25">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h4 class="fw-bold text-success mb-1">नमस्कार, {{ user.name }}!</h4>
          <p class="text-xs text-muted font-sans mb-0">
            आधार क्रमांक: {{ user.citizenAadhaar }} | {{ user.panchayatName }} (वॉर्ड ३)
          </p>
        </div>
        <router-link to="/citizen/apply" class="btn btn-eg-primary btn-sm rounded-pill font-sans fw-bold">
          <i class="bi bi-plus-circle me-1"></i> नवीन दाखल्यासाठी अर्ज करा
        </router-link>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-file-earmark-check" label="माझे एकूण अर्ज" :value="stats.total_applications" variant="green" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-award" label="मंजूर दाखले" :value="stats.approved_applications" variant="gold" />
      </div>
      <!-- <div class="col-6 col-md-3">
        <StatsCard icon="bi-exclamation-triangle" label="माझ्या तक्रारी" :value="myComplaintsCount" variant="blue" />
      </div> -->
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-exclamation-triangle" label="प्रलंबित अर्ज" :value="stats.pending_applications" variant="blue" />
      </div>
      <!-- <div class="col-6 col-md-3">
        <StatsCard icon="bi-bell" label="नवीन सूचना" value="2" variant="red" />
      </div> -->
     <div class="col-6 col-md-3">
        <StatsCard icon="bi-bell" label="नामंजूर अर्ज"  variant="red" :value="stats.rejected_applications"/>
      </div>
    </div>

    <!-- My Recent Applications Section -->
    <div class="eg-card p-4 mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-success mb-0"><i class="bi bi-journal-check me-1"></i> माझे अलीकडील अर्ज</h5>
        <router-link to="/citizen/applications" class="text-xs text-success fw-bold">सर्व अर्ज पाहा <i class="bi bi-chevron-right"></i></router-link>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>अर्ज क्रमांक</th>
            <th>दाखला / सेवा</th>
            <th>दाखल तारीख</th>
            <th>अंतिम मुदत</th>
            <th>सद्यस्थिती</th>
            <th>ॲक्शन</th>
            <th>पेमेंट</th>
            <th>पेमेंट करा</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="app in recentApplications" :key="app.id">
            <td><strong class="text-dark">{{ app.application_no }}</strong></td>
            <td>{{ app.service?.name_mr || '-' }}</td> 
            <td>{{ app.applied_date }}</td>
            <td><span class="text-warning">{{ app.due_date }}</span></td>
            <td><StatusBadge :status="app.status" :text="app.status" /></td>
            <td>
              <router-link :to="{ path: '/track', query: { id: app.application_no } }" class="btn btn-sm btn-outline-success rounded-pill px-2.5 py-0.5 text-xs">
                ट्रॅक करा
              </router-link>
            </td>
            <td><StatusBadge :status="app.payment?.status || 'Not Paid'" :text="app.payment?.status || 'Not Paid'" /></td>
            <td>
            <button
              type="button"
              class="btn btn-sm rounded-pill px-2.5 py-0.5 text-xs"
              :class="
                app.payment?.status === 'paid'
                  ? 'btn-secondary'
                  : 'btn-outline-primary'
              "
              :disabled="app.payment?.status === 'paid'"
              @click="payApplicationFees(app)"
            >
              {{
                app.payment?.status === 'paid'
                  ? 'पेमेंट झाले'
                  : 'पेमेंट करा'
              }}
            </button>
          </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div> 
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted } from 'vue';
import { useAuth } from '../../composables/useAuth';
// import { useMockData } from '../../composables/useMockData';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';
import StatusBadge from '../../components/common/StatusBadge.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';
import {getCitizenDashboard, createPaymentOrder, verifyPayment} from '../../services/citizenService';
import router from '@/router/index.ts';
// const { user } = useAuth();
// const { citizenApplications, complaints } = useMockData();

// const myApplications = computed(() => citizenApplications.value);
// const myAppsCount = computed(() => myApplications.value.length);
// const myApprovedCount = computed(() => myApplications.value.filter(a => a.status === 'Certificate Generated').length);
// const myComplaintsCount = computed(() => complaints.value.length);

const user = ref({
  name : '',
  mobile : '',
  aadhaar_number : '',
  ward_id : '',
  grampanchayat_id : '',
  citizenAadhaar : '',            
  panchayatName : '',
});
const recentApplications = ref([]);
const stats = ref({
  total_applications: 0,
  approved_applications: 0,
  pending_applications: 0,
  rejected_applications: 0,
})

async function payApplicationFees(app: Record<string, unknown>) {
  // alert('Pay Application Fees clicked for application: ' + app.id);
  const paymentResponse = await createPaymentOrder(app.id); 
    // console.log('Payment Response:', paymentResponse);
    const razorpayData = paymentResponse.data.razorpay;

    // console.log('Razorpay data:', razorpayData);

    const options: RazorpayOptions = {
      key: razorpayData.key,

      amount: razorpayData.amount,

      currency: razorpayData.currency,

      name: 'eGram Panchayat',

      // description: `Application ${application.application_no}`,

      order_id: razorpayData.order_id,

      // prefill: {
      //   name: formData.applicantName,
      //   email: formData.email,
      //   contact: formData.mobile,
      // },

      theme: {
        color: '#2E7D32',
      },

      handler: async function (response) {

        // console.log('========== RAZORPAY SUCCESS ==========');
        // console.log(response);

        // console.log('Payment ID:', response.razorpay_payment_id);
        // console.log('Order ID:', response.razorpay_order_id);
        // console.log('Signature:', response.razorpay_signature);

        // Verify payment with Laravel
        try {

          const verifyData = {
            application_id: app.id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_order_id:
              response.razorpay_order_id,

            razorpay_signature:
              response.razorpay_signature,
          };

          console.log('Sending verification data:', verifyData);

          const verifyResponse = await verifyPayment(verifyData);

          console.log('Payment verification response:', verifyResponse);

          // After successful verification
       // ONLY after backend verification
    // submittedApp.value = {
    //   applicationNo:
    //     application.application_no,

    //   serviceNameMr:
    //     selectedService.value?.name_mr,

    //   dueDate:
    //     application.due_date,

    //   paymentId:
    //     response.razorpay_payment_id,

    //   amount:
    //     verifyResponse.data.payment.amount,

    //   paymentStatus:
    //     'paid'
    // };
        } catch (error: any) {

          console.error('Payment verification failed:', error);

          // submitError.value =
          //   error.response?.data?.message ||
          //   'पेमेंट पडताळणी अयशस्वी झाली.';
        }
      },

      modal: {
        ondismiss: function () {
          console.log('Razorpay checkout closed');
        }
      }
    };

    const razorpay = new Razorpay(options);

    razorpay.open();
}
onMounted(loadDashboard);
async function loadDashboard() {
    try {
      // console.log(localStorage.getItem('user'));
      const response = await getCitizenDashboard();
      // console.log('Citizen dashboard data fetched successfully:', response);
      user.value = response.user;
      stats.value = response.stats;
      recentApplications.value = response.recent_applications;

      // console.log('Citizen dashboard data fetched successfully:', user.value);
    } catch (error) { 
      // console.error('Error fetching citizen dashboard data:', error);
    } 
  }

</script>
