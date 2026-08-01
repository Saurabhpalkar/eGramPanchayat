import { ref, computed } from 'vue';
import {
  mockServices,
  mockComplaints,
  mockDevWorks,
  mockUpcomingWorks,
  mockNidhiFunds,
  mockGramSabha,
  mockNotices,
  mockCitizenApplications,
  mockPanchayatsList,
  type ServiceItem,
  type ComplaintItem,
  type DevelopmentWork,
  type UpcomingWork,
  type NidhiFund,
  type GramSabhaMeeting,
  type NoticeItem,
  type CitizenApplication,
  type GramPanchayatTenant
} from '../data/mockData';

const services = ref<ServiceItem[]>([...mockServices]);
const complaints = ref<ComplaintItem[]>([...mockComplaints]);
const devWorks = ref<DevelopmentWork[]>([...mockDevWorks]);
const upcomingWorks = ref<UpcomingWork[]>([...mockUpcomingWorks]);
const nidhiFunds = ref<NidhiFund[]>([...mockNidhiFunds]);
const gramSabhaMeetings = ref<GramSabhaMeeting[]>([...mockGramSabha]);
const notices = ref<NoticeItem[]>([...mockNotices]);
const citizenApplications = ref<CitizenApplication[]>([...mockCitizenApplications]);
const panchayats = ref<GramPanchayatTenant[]>([...mockPanchayatsList]);

export function useMockData() {
  // Add a new complaint
  function addComplaint(newComplaint: Omit<ComplaintItem, 'id' | 'ticketId' | 'status' | 'statusMr' | 'createdAt' | 'timeline'>) {
    const ticketId = `SHV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    
    const createdItem: ComplaintItem = {
      ...newComplaint,
      id: `cmp-${Date.now()}`,
      ticketId,
      status: 'Received',
      statusMr: 'तक्रार प्राप्त झाली',
      createdAt: today,
      timeline: [
        { title: 'तक्रार ऑनलाईन नोंदवली', date: `${today}, आत्ताच`, completed: true },
        { title: 'ग्रामपंचायत कर्मचाऱ्याकडे वर्ग', date: 'प्रक्रियेत', completed: false },
        { title: 'घटनास्थळ पाहणी व निवारण', date: 'प्रस्तावित २ दिवसात', completed: false }
      ]
    };
    
    complaints.value.unshift(createdItem);
    return createdItem;
  }

  // Update complaint status (for Staff / Admin)
  function updateComplaintStatus(complaintId: string, status: ComplaintItem['status'], statusMr: string, staffName?: string, comment?: string) {
    const cmp = complaints.value.find(c => c.id === complaintId);
    if (cmp) {
      cmp.status = status;
      cmp.statusMr = statusMr;
      if (staffName) cmp.assignedStaff = staffName;
      cmp.timeline.push({
        title: `स्थिती बदलली: ${statusMr}`,
        date: new Date().toLocaleDateString('mr-IN'),
        comment: comment || 'अद्ययावत माहिती जोडली',
        completed: true
      });
    }
  }

  // Submit new Service Application
  function submitServiceApplication(serviceId: string, citizenName: string, phone: string, aadhaar: string) {
    const srv = services.value.find(s => s.id === serviceId);
    const appNo = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const dueDateObj = new Date();
    dueDateObj.setDate(today.getDate() + (srv?.slaDays || 3));

    const newApp: CitizenApplication = {
      id: `app-${Date.now()}`,
      applicationNo: appNo,
      serviceId,
      serviceNameMr: srv?.nameMr || 'ग्रामपंचायत दाखला',
      citizenName,
      citizenAadhaar: aadhaar,
      phone,
      appliedDate: today.toISOString().split('T')[0],
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: 'Pending Verification',
      statusMr: 'कागदपत्र तपासणी प्रक्रियेत',
      paymentStatus: 'Paid',
      amount: srv?.fee || 30
    };

    citizenApplications.value.unshift(newApp);
    return newApp;
  }

  // Update Application Status (for Staff / Admin)
  function updateApplicationStatus(appId: string, status: CitizenApplication['status'], statusMr: string, staffName?: string) {
    const app = citizenApplications.value.find(a => a.id === appId);
    if (app) {
      app.status = status;
      app.statusMr = statusMr;
      if (staffName) app.verificationStaff = staffName;
      if (status === 'Certificate Generated') {
        app.downloadUrl = '#';
      }
    }
  }

  // Stats summary for dashboards
  const dashboardStats = computed(() => {
    const totalApps = citizenApplications.value.length + 4280;
    const pendingApps = citizenApplications.value.filter(a => a.status === 'Pending Verification').length + 12;
    const totalComplaints = complaints.value.length;
    const resolvedComplaints = complaints.value.filter(c => c.status === 'Resolved').length;
    const totalFundsAllocated = nidhiFunds.value.reduce((acc, f) => acc + f.totalAllocated, 0);
    const totalFundsUtilized = nidhiFunds.value.reduce((acc, f) => acc + f.utilized, 0);

    return {
      totalCitizens: 12450,
      totalApps,
      pendingApps,
      totalComplaints,
      resolvedComplaints,
      resolutionRate: Math.round((resolvedComplaints / (totalComplaints || 1)) * 100) || 95,
      devWorksCount: devWorks.value.length,
      completedWorksCount: devWorks.value.filter(w => w.status === 'Completed').length,
      totalFundsAllocated,
      totalFundsUtilized
    };
  });

  // Super Admin: Add new Gram Panchayat
  function addPanchayat(newGP: Partial<GramPanchayatTenant> & { nameMr: string; village?: string; taluka: string; district: string; state?: string; adminName?: string; mobile?: string; email?: string; address?: string; activePlan?: GramPanchayatTenant['activePlan'] }) {
    const newId = `gp-${Date.now()}`;
    const code = newGP.code || `2725${Math.floor(1000 + Math.random() * 9000)}`;
    const createdGP: GramPanchayatTenant = {
      id: newId,
      code,
      nameMr: newGP.nameMr,
      nameEn: newGP.nameEn || newGP.nameMr,
      taluka: newGP.taluka || 'हवेली',
      district: newGP.district || 'पुणे',
      population: newGP.population || 5000,
      sarpanchName: newGP.adminName || newGP.sarpanchName || 'सौ. नवीन सरपंच',
      contactNo: newGP.mobile || newGP.contactNo || '9822000000',
      activePlan: newGP.activePlan || 'Enterprise Gold',
      status: 'Active',
      renewalDate: '2027-03-31',
      monthlyFee: newGP.activePlan === 'Starter' ? 999 : newGP.activePlan === 'Standard Green' ? 1999 : 2999
    };
    panchayats.value.unshift(createdGP);
    return createdGP;
  }

  // Delete Gram Panchayat
  function deletePanchayat(id: string) {
    panchayats.value = panchayats.value.filter(p => p.id !== id);
  }

  // Add new Notice
  function addNotice(notice: Omit<NoticeItem, 'id'>) {
    const newNotice: NoticeItem = {
      ...notice,
      id: `ntc-${Date.now()}`
    };
    notices.value.unshift(newNotice);
    return newNotice;
  }

  // Add Development Work
  function addDevWork(work: Omit<DevelopmentWork, 'id'>) {
    const newWork: DevelopmentWork = {
      ...work,
      id: `work-${Date.now()}`
    };
    devWorks.value.unshift(newWork);
    return newWork;
  }

  // Add Gram Sabha
  function addGramSabha(sabha: Omit<GramSabhaMeeting, 'id'>) {
    const newSabha: GramSabhaMeeting = {
      ...sabha,
      id: `gs-${Date.now()}`
    };
    gramSabhaMeetings.value.unshift(newSabha);
    return newSabha;
  }

  // Update Development Work progress (for Staff)
  function updateWorkProgress(workId: string, progressPercent: number, note?: string, photoUrl?: string, status?: DevelopmentWork['status']) {
    const work = devWorks.value.find(w => w.id === workId);
    if (work) {
      work.progressPercent = progressPercent;
      if (status) work.status = status;
      if (photoUrl) work.photoUrl = photoUrl;
    }
  }

  // Update document verification status in CitizenApplication
  function updateDocumentVerification(appId: string, status: CitizenApplication['status'], statusMr: string, staffName?: string, notes?: string) {
    const app = citizenApplications.value.find(a => a.id === appId);
    if (app) {
      app.status = status;
      app.statusMr = statusMr;
      if (staffName) app.verificationStaff = staffName;
    }
  }

  return {
    services,
    complaints,
    devWorks,
    upcomingWorks,
    nidhiFunds,
    gramSabhaMeetings,
    notices,
    citizenApplications,
    panchayats,
    addComplaint,
    updateComplaintStatus,
    submitServiceApplication,
    updateApplicationStatus,
    updateWorkProgress,
    updateDocumentVerification,
    addNotice,
    addDevWork,
    addGramSabha,
    addPanchayat,
    deletePanchayat,
    dashboardStats
  };
}
