<template>
  <div class="font-sans">
    <DashboardHeader 
      title="Payment History & Invoices (पेमेंट व इन्व्हॉईस इतिहास)" 
      subtitle="Super Admin Financial Ledger — Subscription Invoices, Razorpay/UPI Transactions & Receipt Downloads" 
    />

    <!-- Revenue Stats Row -->
    <div class="row g-3 my-3">
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-cash-stack" label="एकूण जमा महसूल (Total Collected)" value="₹ १८,४५,०००" variant="green" trend="+२४% या वर्षी" :trendUp="true" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-graph-up-arrow" label="चालू महिन्याचा महसूल (MRR)" value="₹ १,८४,५००" variant="green" trend="+१८.५% MRR" :trendUp="true" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-hourglass-split" label="प्रलंबित बिलिंग (Pending Invoices)" value="₹ ४५,०००" variant="gold" trend="२ ग्रामपंचायती" :trendUp="false" />
      </div>
      <div class="col-6 col-md-3">
        <StatsCard icon="bi-file-earmark-pdf-fill" label="एकूण इन्व्हॉईसेस (Total Invoices)" value="५६" variant="blue" trend="All Tax Compliant" :trendUp="true" />
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="eg-card p-3.5 my-3">
      <div class="row g-3 align-items-center">
        <div class="col-md-5">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control bg-light border-start-0" 
              placeholder="इन्व्हॉईस क्र., ग्रामपंचायत नाव, ट्रान्सॅक्शन ID..." 
            />
          </div>
        </div>

        <div class="col-6 col-md-3">
          <select v-model="statusFilter" class="form-select form-select-sm">
            <option value="">सर्व पेमेंट स्टेटस (All Status)</option>
            <option value="Paid">Paid (यशस्वी भरणा)</option>
            <option value="Pending">Pending (प्रलंबित)</option>
            <option value="Failed">Failed (अयशस्वी)</option>
          </select>
        </div>

        <div class="col-6 col-md-4">
          <select v-model="methodFilter" class="form-select form-select-sm">
            <option value="">सर्व पेमेंट पद्धती (All Methods)</option>
            <option value="Razorpay / UPI">UPI / QR Code</option>
            <option value="NetBanking (NEFT)">NetBanking / NEFT</option>
            <option value="Govt Treasury / Challan">Govt Treasury Challan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Payments Ledger Table -->
    <div class="eg-card p-4 my-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold text-success mb-0"><i class="bi bi-receipt-cutoff me-1"></i> सबस्क्रिप्शन ट्रान्सॅक्शन इतिहास ({{ filteredTransactions.length }})</h6>
        <button class="btn btn-outline-success btn-sm rounded-pill font-sans fw-bold px-3" @click="exportCSV">
          <i class="bi bi-download me-1"></i> Excel/CSV रिपोर्ट डाऊनलोड
        </button>
      </div>

      <ResponsiveTable>
        <template #head>
          <tr>
            <th>इन्व्हॉईस क्रमांक</th>
            <th>ग्रामपंचायत नाव</th>
            <th>सबस्क्रिप्शन प्लॅन</th>
            <th>रक्कम (Amount)</th>
            <th>पेमेंट पद्धत</th>
            <th>तारीख</th>
            <th>स्टेटस</th>
            <th class="text-end">ॲक्शन (Invoice)</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="tx in filteredTransactions" :key="tx.id">
            <td><strong class="font-mono text-xs text-dark">{{ tx.invoiceNo }}</strong></td>
            <td>
              <div class="fw-bold text-success text-xs">{{ tx.gpName }}</div>
              <small class="text-muted text-xs"><i class="bi bi-geo-alt me-1"></i>{{ tx.district }}</small>
            </td>
            <td><span class="badge bg-light text-dark border text-xs">{{ tx.plan }}</span></td>
            <td><strong class="font-mono text-success text-xs">₹{{ tx.amount.toLocaleString('en-IN') }}</strong></td>
            <td>
              <span class="text-xs font-mono"><i class="bi bi-credit-card me-1"></i>{{ tx.method }}</span>
            </td>
            <td><span class="text-xs text-muted">{{ tx.date }}</span></td>
            <td>
              <span class="badge text-xs" :class="{
                'bg-success bg-opacity-10 text-success border border-success': tx.status === 'Paid',
                'bg-warning bg-opacity-10 text-warning border border-warning': tx.status === 'Pending',
                'bg-danger bg-opacity-10 text-danger border border-danger': tx.status === 'Failed'
              }">
                {{ tx.status === 'Paid' ? 'Paid (यशस्वी)' : tx.status === 'Pending' ? 'Pending (प्रलंबित)' : 'Failed' }}
              </span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-success rounded-pill text-xs px-3 py-1" @click="downloadInvoice(tx)">
                <i class="bi bi-file-earmark-pdf-fill me-1"></i> Invoice PDF
              </button>
            </td>
          </tr>
        </template>
      </ResponsiveTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DashboardHeader from '../../components/common/DashboardHeader.vue';
import StatsCard from '../../components/common/StatsCard.vue';
import ResponsiveTable from '../../components/common/ResponsiveTable.vue';

const searchQuery = ref('');
const statusFilter = ref('');
const methodFilter = ref('');

const transactions = ref([
  { id: 't1', invoiceNo: 'INV-2026-0048', gpName: 'शिवणे ग्रामपंचायत', district: 'पुणे', plan: 'Enterprise Gold', amount: 75000, method: 'Razorpay / UPI', date: '01 जुलै २०२६', status: 'Paid' },
  { id: 't2', invoiceNo: 'INV-2026-0047', gpName: 'सासवड ग्रामपंचायत', district: 'पुणे', plan: 'Standard Green', amount: 45000, method: 'NetBanking (NEFT)', date: '28 जून २०२६', status: 'Paid' },
  { id: 't3', invoiceNo: 'INV-2026-0046', gpName: 'शिराळा ग्रामपंचायत', district: 'सांगली', plan: 'Standard Green', amount: 45000, method: 'Govt Treasury / Challan', date: '20 जून २०२६', status: 'Paid' },
  { id: 't4', invoiceNo: 'INV-2026-0045', gpName: 'कडूस ग्रामपंचायत', district: 'पुणे', plan: 'Starter', amount: 25000, method: 'Razorpay / UPI', date: '15 मे २०२६', status: 'Pending' },
  { id: 't5', invoiceNo: 'INV-2026-0044', gpName: 'धामणे ग्रामपंचायत', district: 'पुणे', plan: 'Starter', amount: 25000, method: 'Razorpay / UPI', date: '10 मे २०२६', status: 'Paid' },
]);

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const matchesSearch = 
      !searchQuery.value ||
      t.invoiceNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.gpName.includes(searchQuery.value) ||
      t.district.includes(searchQuery.value);

    const matchesStatus = !statusFilter.value || t.status === statusFilter.value;
    const matchesMethod = !methodFilter.value || t.method.includes(methodFilter.value);

    return matchesSearch && matchesStatus && matchesMethod;
  });
});

function downloadInvoice(tx: any) {
  alert(`इन्व्हॉईस [${tx.invoiceNo}] ग्रामपंचायत [${tx.gpName}] ची PDF पावती डाऊनलोड होत आहे.`);
}

function exportCSV() {
  alert(`सर्व वित्तीय पेमेंट व्यवहार Excel / CSV फॉरमॅटमध्ये डाऊनलोड केले गेले.`);
}
</script>
