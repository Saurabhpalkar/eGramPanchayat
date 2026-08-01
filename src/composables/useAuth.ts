import { ref, computed } from 'vue';

export type UserRole = 'public' | 'citizen' | 'staff' | 'admin' | 'superadmin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  panchayatName: string;
  district: string;
  designation?: string;
  citizenAadhaar?: string;
}

const currentRole = ref<UserRole>('public');
export interface PanchayatTenant {
  id: string;
  nameMr: string;
  nameEn: string;
  taluka: string;
  district: string;
  sarpanch: string;
  gramSevak: string;
  code: string;
}

export const availablePanchayats: PanchayatTenant[] = [
  {
    id: 'gp-shivane',
    nameMr: 'शिवणे ग्रामपंचायत',
    nameEn: 'Shivane Gram Panchayat',
    taluka: 'हवेली (Haveli)',
    district: 'पुणे (Pune)',
    sarpanch: 'सौ. सुनीता पाटील',
    gramSevak: 'श्री. रमेश शिंदे',
    code: '27250012'
  },
  {
    id: 'gp-uruli',
    nameMr: 'उरुळी कांचन ग्रामपंचायत',
    nameEn: 'Uruli Kanchan Gram Panchayat',
    taluka: 'हवेली (Haveli)',
    district: 'पुणे (Pune)',
    sarpanch: 'सौ. कविता गायकवाड',
    gramSevak: 'श्री. संतोष माने',
    code: '27250199'
  },
  {
    id: 'gp-shikrapur',
    nameMr: 'शिक्रापूर ग्रामपंचायत',
    nameEn: 'Shikrapur Gram Panchayat',
    taluka: 'शिरुर (Shirur)',
    district: 'पुणे (Pune)',
    sarpanch: 'श्री. रामभाऊ गावडे',
    gramSevak: 'सौ. अंकिता जोशी',
    code: '27250204'
  },
  {
    id: 'gp-wagholi',
    nameMr: 'वाघोली ग्रामपंचायत',
    nameEn: 'Wagholi Gram Panchayat',
    taluka: 'हवेली (Haveli)',
    district: 'पुणे (Pune)',
    sarpanch: 'श्री. अमोल जाधव',
    gramSevak: 'श्री. विकास जगताप',
    code: '27250310'
  },
  {
    id: 'gp-rahata',
    nameMr: 'राहाता ग्रामपंचायत',
    nameEn: 'Rahata Gram Panchayat',
    taluka: 'राहाता (Rahata)',
    district: 'अहिल्यानगर (Ahilyanagar)',
    sarpanch: 'सौ. सरिता विखे',
    gramSevak: 'श्री. गणेश पवार',
    code: '27260045'
  }
];

const selectedPanchayat = ref<PanchayatTenant>(availablePanchayats[0]);

const mockUsers: Record<UserRole, UserProfile> = {

  public: {
    id: 'guest',
    name: 'पाहुणे नागरिक',
    email: 'guest@egram.maharashtra.gov.in',
    phone: '9822000000',
    role: 'public',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    panchayatName: 'शिवणे ग्रामपंचायत',
    district: 'पुणे'
  },
  citizen: {
    id: 'cit-101',
    name: 'संजय बबनराव देशमुख',
    email: 'sanjay.deshmukh@gmail.com',
    phone: '9822123456',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    panchayatName: 'शिवणे ग्रामपंचायत',
    district: 'पुणे',
    citizenAadhaar: 'XXXX-XXXX-8921'
  },
  staff: {
    id: 'stf-202',
    name: 'अमित ज्ञानेश्वर मोरे',
    email: 'amit.more@egram.gov.in',
    phone: '9422987654',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    panchayatName: 'शिवणे ग्रामपंचायत',
    district: 'पुणे',
    designation: 'ग्रामपंचायत लिपिक (Clerk)'
  },
  admin: {
    id: 'adm-303',
    name: 'सौ. सुनीता आनंदराव पाटील',
    email: 'sarpanch.shivane@egram.gov.in',
    phone: '9890112233',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    panchayatName: 'शिवणे ग्रामपंचायत',
    district: 'पुणे',
    designation: 'सरपंच (Sarpanch)'
  },
  superadmin: {
    id: 'sup-999',
    name: 'डॉ. विजय कदम (SaaS Platform Owner)',
    email: 'superadmin@egrampanchayat.in',
    phone: '9823000000',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    panchayatName: 'सर्व ग्रामपंचायती (Maharashtra State)',
    district: 'महाराष्ट्र राज्य',
    designation: 'मुख्य कार्यकारी अधिकारी'
  }
};

export function useAuth() {
  const user = computed(() => mockUsers[currentRole.value]);
  const activeRole = computed(() => currentRole.value);
  const activePanchayat = computed(() => selectedPanchayat.value);

  function switchRole(newRole: UserRole) {
    currentRole.value = newRole;
  }

  function setPanchayat(panchayat: PanchayatTenant) {
    selectedPanchayat.value = panchayat;
  }

  function setPanchayatById(id: string) {
    const found = availablePanchayats.find(p => p.id === id);
    if (found) {
      selectedPanchayat.value = found;
    }
  }

  return {
    user,
    activeRole,
    activePanchayat,
    availablePanchayats,
    switchRole,
    setPanchayat,
    setPanchayatById,
    mockUsers
  };
}
