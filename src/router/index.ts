import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import PublicLayout from '../layouts/PublicLayout.vue';
import CitizenLayout from '../layouts/CitizenLayout.vue';
import StaffLayout from '../layouts/StaffLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import SuperAdminLayout from '../layouts/SuperAdminLayout.vue';

// Public Pages
import Home from '../pages/public/Home.vue';
import Services from '../pages/public/Services.vue';
import ServiceDetails from '../pages/public/ServiceDetails.vue';
import RaiseComplaint from '../pages/public/RaiseComplaint.vue';
import DevelopmentWorks from '../pages/public/DevelopmentWorks.vue';
import UpcomingWorks from '../pages/public/UpcomingWorks.vue';
import Nidhi from '../pages/public/Nidhi.vue';
import Notices from '../pages/public/Notices.vue';
import GramSabha from '../pages/public/GramSabha.vue';
import Contact from '../pages/public/Contact.vue';
import TrackApplication from '../pages/public/TrackApplication.vue';
import Schemes from '../pages/public/Schemes.vue';
import About from '../pages/public/About.vue';
import Login from '../pages/public/Login.vue';
import Register from '../pages/public/Register.vue';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard.vue';
import CitizenApply from '../pages/citizen/CitizenApply.vue';
import CitizenApplications from '../pages/citizen/CitizenApplications.vue';
import CitizenComplaints from '../pages/citizen/CitizenComplaints.vue';
import CitizenWorks from '../pages/citizen/CitizenWorks.vue';
import CitizenUpcomingWorks from '../pages/citizen/CitizenUpcomingWorks.vue';
import CitizenNidhi from '../pages/citizen/CitizenNidhi.vue';
import CitizenNotices from '../pages/citizen/CitizenNotices.vue';
import CitizenGramSabha from '../pages/citizen/CitizenGramSabha.vue';
import CitizenNotifications from '../pages/citizen/CitizenNotifications.vue';
import CitizenProfile from '../pages/citizen/CitizenProfile.vue';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard.vue';
import StaffApplications from '../pages/staff/StaffApplications.vue';
import StaffComplaints from '../pages/staff/StaffComplaints.vue';
import StaffVerification from '../pages/staff/StaffVerification.vue';
import StaffWorks from '../pages/staff/StaffWorks.vue';
import StaffCertificates from '../pages/staff/StaffCertificates.vue';
import StaffCitizens from '../pages/staff/StaffCitizens.vue';
import StaffReports from '../pages/staff/StaffReports.vue';
import StaffProfile from '../pages/staff/StaffProfile.vue';
import StaffNotifications from '../pages/staff/StaffNotifications.vue';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard.vue';
import AdminApplications from '../pages/admin/AdminApplications.vue';
import AdminComplaints from '../pages/admin/AdminComplaints.vue';
import AdminWorks from '../pages/admin/AdminWorks.vue';
import AdminUpcomingWorks from '../pages/admin/AdminUpcomingWorks.vue';
import AdminNidhi from '../pages/admin/AdminNidhi.vue';
import AdminNotices from '../pages/admin/AdminNotices.vue';
import AdminGramSabha from '../pages/admin/AdminGramSabha.vue';
import AdminReports from '../pages/admin/AdminReports.vue';
import AdminStaff from '../pages/admin/AdminStaff.vue';

// Super Admin Pages
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard.vue';
import SuperAdminPanchayats from '../pages/superadmin/SuperAdminPanchayats.vue';
import SuperAdminAddPanchayat from '../pages/superadmin/SuperAdminAddPanchayat.vue';
import SuperAdminAdmins from '../pages/superadmin/SuperAdminAdmins.vue';
import SuperAdminStaff from '../pages/superadmin/SuperAdminStaff.vue';
import SuperAdminUsers from '../pages/superadmin/SuperAdminUsers.vue';
import SuperAdminSubscriptions from '../pages/superadmin/SuperAdminSubscriptions.vue';
import SuperAdminPayments from '../pages/superadmin/SuperAdminPayments.vue';
import SuperAdminAnalytics from '../pages/superadmin/SuperAdminAnalytics.vue';
import SuperAdminReports from '../pages/superadmin/SuperAdminReports.vue';
import SuperAdminSettings from '../pages/superadmin/SuperAdminSettings.vue';

const routes: Array<RouteRecordRaw> = [
  // Public Section
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'services', name: 'Services', component: Services },
      { path: 'service/:id', name: 'ServiceDetails', component: ServiceDetails },
      { path: 'raise-complaint', name: 'RaiseComplaint', component: RaiseComplaint },
      { path: 'development-works', name: 'DevelopmentWorks', component: DevelopmentWorks },
      { path: 'upcoming-works', name: 'UpcomingWorks', component: UpcomingWorks },
      { path: 'nidhi', name: 'Nidhi', component: Nidhi },
      { path: 'notices', name: 'Notices', component: Notices },
      { path: 'gram-sabha', name: 'GramSabha', component: GramSabha },
      { path: 'schemes', name: 'Schemes', component: Schemes },
      { path: 'about', name: 'About', component: About },
      { path: 'contact', name: 'Contact', component: Contact },
      { path: 'track', name: 'TrackApplication', component: TrackApplication },
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
    ]
  },

  // Citizen Section
  {
    path: '/citizen',
    component: CitizenLayout,
    children: [
      { path: '', redirect: '/citizen/dashboard' },
      { path: 'dashboard', name: 'CitizenDashboard', component: CitizenDashboard },
      { path: 'apply', name: 'CitizenApply', component: CitizenApply },
      { path: 'applications', name: 'CitizenApplications', component: CitizenApplications },
      { path: 'track', name: 'CitizenTrack', component: TrackApplication },
      { path: 'raise-complaint', name: 'CitizenRaiseComplaint', component: RaiseComplaint },
      { path: 'complaints', name: 'CitizenComplaints', component: CitizenComplaints },
      { path: 'works', name: 'CitizenWorks', component: CitizenWorks },
      { path: 'upcoming-works', name: 'CitizenUpcomingWorks', component: CitizenUpcomingWorks },
      { path: 'nidhi', name: 'CitizenNidhi', component: CitizenNidhi },
      { path: 'notices', name: 'CitizenNotices', component: CitizenNotices },
      { path: 'gram-sabha', name: 'CitizenGramSabha', component: CitizenGramSabha },
      { path: 'notifications', name: 'CitizenNotifications', component: CitizenNotifications },
      { path: 'profile', name: 'CitizenProfile', component: CitizenProfile },
    ]
  },

  // Staff Section
  {
    path: '/staff',
    component: StaffLayout,
    children: [
      { path: '', redirect: '/staff/dashboard' },
      { path: 'dashboard', name: 'StaffDashboard', component: StaffDashboard },
      { path: 'applications', name: 'StaffApplications', component: StaffApplications },
      { path: 'verification', name: 'StaffVerification', component: StaffVerification },
      { path: 'complaints', name: 'StaffComplaints', component: StaffComplaints },
      { path: 'works', name: 'StaffWorks', component: StaffWorks },
      { path: 'certificates', name: 'StaffCertificates', component: StaffCertificates },
      { path: 'citizens', name: 'StaffCitizens', component: StaffCitizens },
      { path: 'reports', name: 'StaffReports', component: StaffReports },
      { path: 'notifications', name: 'StaffNotifications', component: StaffNotifications },
      { path: 'profile', name: 'StaffProfile', component: StaffProfile },
    ]
  },

  // Admin Section
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'applications', name: 'AdminApplications', component: AdminApplications },
      { path: 'complaints', name: 'AdminComplaints', component: AdminComplaints },
      { path: 'works', name: 'AdminWorks', component: AdminWorks },
      { path: 'upcoming-works', name: 'AdminUpcomingWorks', component: AdminUpcomingWorks },
      { path: 'nidhi', name: 'AdminNidhi', component: AdminNidhi },
      { path: 'notices', name: 'AdminNotices', component: AdminNotices },
      { path: 'gram-sabha', name: 'AdminGramSabha', component: AdminGramSabha },
      { path: 'reports', name: 'AdminReports', component: AdminReports },
      { path: 'staff', name: 'AdminStaff', component: AdminStaff },
    ]
  },

  // Super Admin Section
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    children: [
      { path: '', redirect: '/superadmin/dashboard' },
      { path: 'dashboard', name: 'SuperAdminDashboard', component: SuperAdminDashboard },
      { path: 'panchayats', name: 'SuperAdminPanchayats', component: SuperAdminPanchayats },
      { path: 'add-panchayat', name: 'SuperAdminAddPanchayat', component: SuperAdminAddPanchayat },
      { path: 'admins', name: 'SuperAdminAdmins', component: SuperAdminAdmins },
      { path: 'staff', name: 'SuperAdminStaff', component: SuperAdminStaff },
      { path: 'users', name: 'SuperAdminUsers', component: SuperAdminUsers },
      { path: 'subscriptions', name: 'SuperAdminSubscriptions', component: SuperAdminSubscriptions },
      { path: 'payments', name: 'SuperAdminPayments', component: SuperAdminPayments },
      { path: 'analytics', name: 'SuperAdminAnalytics', component: SuperAdminAnalytics },
      { path: 'reports', name: 'SuperAdminReports', component: SuperAdminReports },
      { path: 'settings', name: 'SuperAdminSettings', component: SuperAdminSettings },
    ]
  },

  // Catch-all 404
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
