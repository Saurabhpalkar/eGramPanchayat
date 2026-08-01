export interface ServiceItem {
  id: string;
  code: string;
  nameMr: string;
  nameEn: string;
  category: string;
  fee: number;
  slaDays: number;
  icon: string;
  descriptionMr: string;
  descriptionEn: string;
  requiredDocumentsMr: string[];
  popular?: boolean;
}

export interface ComplaintItem {
  id: string;
  ticketId: string;
  category: string;
  categoryMr: string;
  title: string;
  description: string;
  citizenName: string;
  phone: string;
  location: string;
  wardNo: string;
  status: 'Received' | 'In Process' | 'Assigned' | 'Resolved' | 'Rejected';
  statusMr: string;
  createdAt: string;
  photoUrl?: string;
  assignedStaff?: string;
  timeline: { title: string; date: string; comment?: string; completed: boolean }[];
}

export interface DevelopmentWork {
  id: string;
  titleMr: string;
  titleEn: string;
  category: string;
  budgetLakhs: number;
  fundsSpentLakhs: number;
  contractor: string;
  startDate: string;
  expectedCompletion: string;
  progressPercent: number;
  status: 'In Progress' | 'Completed' | 'Tender Stage';
  statusMr: string;
  location: string;
  fundSource: string;
  photoUrl: string;
}

export interface UpcomingWork {
  id: string;
  titleMr: string;
  titleEn: string;
  category: string;
  estimatedBudgetLakhs: number;
  proposedTimeline: string;
  approvalStatus: 'Approved by Sabha' | 'Pending Sanction' | 'Tender Floating';
  approvalStatusMr: string;
  benefitCitizens: number;
}

export interface NidhiFund {
  id: string;
  fundNameMr: string;
  fundNameEn: string;
  category: 'MLA Fund' | 'MP Fund' | 'Zilla Parishad' | 'Panchayat Samiti' | 'State Grant' | 'Central 15th FC';
  totalAllocated: number;
  utilized: number;
  remaining: number;
  financialYear: string;
  projectCount: number;
}

export interface GramSabhaMeeting {
  id: string;
  meetingNumber: string;
  titleMr: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Completed' | 'Adjourned';
  agendaMr: string[];
  minutesSummaryMr?: string;
  expectedAttendees?: number;
  noticePdfUrl?: string;
}

export interface NoticeItem {
  id: string;
  noticeNo: string;
  titleMr: string;
  category: 'Public Notice' | 'Tax Payment' | 'Water Schedule' | 'Emergency' | 'Gram Sabha';
  categoryMr: string;
  date: string;
  importance: 'Urgent' | 'General' | 'Important';
  descriptionMr: string;
}

export interface CitizenApplication {
  id: string;
  applicationNo: string;
  serviceId: string;
  serviceNameMr: string;
  citizenName: string;
  citizenAadhaar: string;
  phone: string;
  appliedDate: string;
  dueDate: string;
  status: 'Pending Verification' | 'Document Approved' | 'Certificate Generated' | 'Rejected';
  statusMr: string;
  paymentStatus: 'Paid' | 'Pending';
  amount: number;
  verificationStaff?: string;
  downloadUrl?: string;
}

export interface GramPanchayatTenant {
  id: string;
  code: string;
  nameMr: string;
  nameEn: string;
  taluka: string;
  district: string;
  population: number;
  sarpanchName: string;
  contactNo: string;
  activePlan: 'Enterprise Gold' | 'Standard Green' | 'Starter';
  status: 'Active' | 'Suspended';
  renewalDate: string;
  monthlyFee: number;
}

// MOCK DATA STORES
export const mockServices: ServiceItem[] = [
  {
    id: 'srv-1',
    code: 'POL-01',
    nameMr: 'पोलीस पाटील दाखला',
    nameEn: 'Police Patil Certificate',
    category: 'दाखले (Certificates)',
    fee: 30,
    slaDays: 3,
    icon: 'bi-shield-check',
    descriptionMr: 'चारित्र्य व रहिवास पडताळणीसाठी पोलीस पाटलांचा दाखला.',
    descriptionEn: 'Police Patil character and residency verification certificate.',
    requiredDocumentsMr: ['आधार कार्ड', 'रहिवास पुरावा', 'रेशन कार्ड', 'पासपोर्ट साईज फोटो'],
    popular: true
  },
  {
    id: 'srv-2',
    code: 'INC-02',
    nameMr: 'उत्पन्न दाखला (स्वयंघोषणा पत्र)',
    nameEn: 'Income Certificate',
    category: 'दाखले (Certificates)',
    fee: 50,
    slaDays: 3,
    icon: 'bi-cash-coin',
    descriptionMr: 'ग्रामपंचायत हद्दीतील वार्षिक उत्पन्नाचा दाखला.',
    descriptionEn: 'Gram Panchayat annual income certificate for government schemes.',
    requiredDocumentsMr: ['आधार कार्ड', '7/12 उतारा किंवा कर पावती', 'स्वयंघोषणा पत्र'],
    popular: true
  },
  {
    id: 'srv-3',
    code: 'RES-03',
    nameMr: 'रहवासी दाखला',
    nameEn: 'Residence Certificate',
    category: 'दाखले (Certificates)',
    fee: 30,
    slaDays: 2,
    icon: 'bi-house-check',
    descriptionMr: 'गावात कायमस्वरूपी वास्तव्याचा दाखला.',
    descriptionEn: 'Permanent residence certificate issued by Gram Panchayat.',
    requiredDocumentsMr: ['घरपट्टी पावती', 'आधार कार्ड', 'मतदार ओळखपत्र'],
    popular: true
  },
  {
    id: 'srv-4',
    code: 'BRT-04',
    nameMr: 'जन्म दाखला (Birth Certificate)',
    nameEn: 'Birth Certificate',
    category: 'दाखले (Certificates)',
    fee: 20,
    slaDays: 2,
    icon: 'bi-person-plus',
    descriptionMr: 'ग्रामपंचायत हद्दीत झालेल्या जन्माची नोंदणी दाखला.',
    descriptionEn: 'Official birth certificate issued by Registrar of Births.',
    requiredDocumentsMr: ['दवाखाना डिस्चार्ज कार्ड', 'आई-वडिलांचे आधार कार्ड', 'अर्जाचा नमुना'],
    popular: true
  },
  {
    id: 'srv-5',
    code: 'DTH-05',
    nameMr: 'मृत्यू दाखला (Death Certificate)',
    nameEn: 'Death Certificate',
    category: 'दाखले (Certificates)',
    fee: 20,
    slaDays: 2,
    icon: 'bi-file-earmark-medical',
    descriptionMr: 'ग्रामपंचायत हद्दीत झालेल्या मृत्यू नोंद दाखला.',
    descriptionEn: 'Official death certificate issued by Registrar of Births & Deaths.',
    requiredDocumentsMr: ['वैद्यकीय प्रमाणपत्र', 'स्मशानभूमी पावती', 'मृत व्यक्तीचे आधार'],
    popular: true
  },
  {
    id: 'srv-6',
    code: 'TAX-06',
    nameMr: 'घरपट्टी कर भरणा (Gharpatti)',
    nameEn: 'Property Tax (Gharpatti)',
    category: 'कर भरणा (Taxes)',
    fee: 0,
    slaDays: 1,
    icon: 'bi-receipt-cutoff',
    descriptionMr: 'वार्षिक घरपट्टी/मालमत्ता कर ऑनलाईन भरा व डिजिटल पावती मिळवा.',
    descriptionEn: 'Pay annual property tax online and download digital receipt.',
    requiredDocumentsMr: ['मालमत्ता क्रमांक / 8-अ उतारा'],
    popular: true
  },
  {
    id: 'srv-7',
    code: 'WTR-07',
    nameMr: 'पाणी पट्टी कर भरणा',
    nameEn: 'Water Tax Payment',
    category: 'कर भरणा (Taxes)',
    fee: 0,
    slaDays: 1,
    icon: 'bi-droplet-half',
    descriptionMr: 'ग्रामपंचायत नळ कनेक्शन पाणी पट्टी ऑनलाईन भरणा.',
    descriptionEn: 'Online water supply tax payment for village households.',
    requiredDocumentsMr: ['पाणी ग्राहक नळ जोडणी क्र.'],
    popular: true
  },
  {
    id: 'srv-8',
    code: 'NOC-08',
    nameMr: 'ना हरकत प्रमाणपत्र (NOC)',
    nameEn: 'No Objection Certificate (NOC)',
    category: 'परवाने (Permits)',
    fee: 100,
    slaDays: 5,
    icon: 'bi-file-earmark-check',
    descriptionMr: 'वीज जोडणी, व्यवसाय किंवा बँक कर्जासाठी ना हरकत दाखला.',
    descriptionEn: 'NOC for electricity connection, commercial activity, or bank loan.',
    requiredDocumentsMr: ['घरपट्टी कर भरणा पावती', 'जागेची मालकी हक्क कागदपत्रे'],
    popular: false
  },
  {
    id: 'srv-9',
    code: 'CHR-09',
    nameMr: 'चारित्र्य दाखला',
    nameEn: 'Character Certificate',
    category: 'दाखले (Certificates)',
    fee: 50,
    slaDays: 4,
    icon: 'bi-person-badge',
    descriptionMr: 'नोकरी किंवा शैक्षणिक कारणासाठी चारित्र्य प्रमाणपत्र.',
    descriptionEn: 'Character certificate for employment or educational needs.',
    requiredDocumentsMr: ['आधार कार्ड', 'शाळा सोडल्याचा दाखला'],
    popular: false
  },
  {
    id: 'srv-10',
    code: 'LIC-10',
    nameMr: 'व्यवसाय परवाना (Business License)',
    nameEn: 'Business License',
    category: 'परवाने (Permits)',
    fee: 250,
    slaDays: 7,
    icon: 'bi-shop',
    descriptionMr: 'गावात दुकाने किंवा छोटे उद्योग सुरू करण्यासाठी ग्रामपंचायत परवाना.',
    descriptionEn: 'Trade & business license for retail and small enterprises in village.',
    requiredDocumentsMr: ['दुकान भाडे करार / जागा मालकी', 'अन्न सुरक्षा दाखला (लागू असल्यास)'],
    popular: false
  },
  {
    id: 'srv-11',
    code: 'BLD-11',
    nameMr: 'बांधकाम परवानगी (Building Permission)',
    nameEn: 'Building Permission',
    category: 'परवाने (Permits)',
    fee: 500,
    slaDays: 10,
    icon: 'bi-building-gear',
    descriptionMr: 'ग्रामपंचायत हद्दीत नवीन घर/इमारत बांधकामाची मंजुरी.',
    descriptionEn: 'Residential building construction authorization approval.',
    requiredDocumentsMr: ['जागेचा 8-अ व नक्शा', 'आर्किटेक्ट प्लान', 'शेजार्यांचे संमती पत्र'],
    popular: false
  },
  {
    id: 'srv-12',
    code: 'OTH-12',
    nameMr: 'इतर ग्रामपंचायत दाखले',
    nameEn: 'Other Village Services',
    category: 'इतर (Others)',
    fee: 50,
    slaDays: 5,
    icon: 'bi-journal-text',
    descriptionMr: 'निराधार योजना, शौचालय दाखला, वीज नळ जोडणी शिफारस पत्र.',
    descriptionEn: 'Welfare schemes recommendation, toilet certificate, utility letters.',
    requiredDocumentsMr: ['आधार कार्ड', 'संबंधित योजनेचे कागदपत्र'],
    popular: false
  }
];

export const mockComplaints: ComplaintItem[] = [
  {
    id: 'cmp-101',
    ticketId: 'SHV-2026-0891',
    category: 'Water Supply',
    categoryMr: 'पिण्याच्या पाण्याची समस्या',
    title: 'वॉर्ड क्र. ३ मध्ये नळाला कमी दाबाने गढूळ पाणी येत आहे',
    description: 'गेल्या ३ दिवसांपासून मारुती मंदिरामागील गल्लीत नळ योजनेचे पाणी अतिशय गढूळ व कमी दाबाने येत आहे. कृपया जलवाहिनीची दुरुस्ती करावी.',
    citizenName: 'रमेश तुकाराम साळुंखे',
    phone: '9822114455',
    location: 'वॉर्ड क्र. ३, मारुती मंदिर गल्ली, शिवणे',
    wardNo: 'वॉर्ड ३',
    status: 'In Process',
    statusMr: 'प्रक्रियेत आहे',
    createdAt: '2026-07-29',
    photoUrl: 'https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?w=600&auto=format&fit=crop&q=80',
    assignedStaff: 'श्री. गणेश जाधवर (पाणी पुरवठा कर्मचारी)',
    timeline: [
      { title: 'तक्रार नोंदवली (Registered)', date: '29 जुलै 2026, सकाळी १०:३०', completed: true },
      { title: 'कर्मचाऱ्याकडे सुपूर्द (Assigned)', date: '29 जुलै 2026, दुपारी १२:१५', comment: 'पाणी पुरवठा तंत्रज्ञ पाहणी करतील', completed: true },
      { title: 'घटनास्थळ पाहणी (Site Visit)', date: '30 जुलै 2026, सकाळी ११:००', comment: 'मुख्य पाईपलाईन गळती आढळली, काम सुरू', completed: true },
      { title: 'दुरुस्ती व निवारण (Resolution)', date: '31 जुलै 2026', comment: 'पाईपलाईन जॉईंट बदलण्याचे काम सुरू आहे', completed: false }
    ]
  },
  {
    id: 'cmp-102',
    ticketId: 'SHV-2026-0884',
    category: 'Street Lights',
    categoryMr: 'पथदिवे (Street Light)',
    title: 'मुख्य बसस्थानक परिसरातील ४ पथदिवे बंद आहेत',
    description: 'रात्रीच्या वेळी मुख्य चौकात अंधार असल्याने महिला व ज्येष्ठांना ये-जा करणे कठीण होत आहे. नवीन एलईडी बल्ब बसवावेत.',
    citizenName: 'सुप्रिया अजय निकम',
    phone: '9423998877',
    location: 'बसस्थानक चौक, शिवणे',
    wardNo: 'वॉर्ड १',
    status: 'Resolved',
    statusMr: 'निवारण झाले',
    createdAt: '2026-07-25',
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
    assignedStaff: 'श्री. महेश गावंडे (वीज विभाग)',
    timeline: [
      { title: 'तक्रार नोंदवली', date: '25 जुलै 2026', completed: true },
      { title: 'कर्मचारी नियुक्त', date: '26 जुलै 2026', completed: true },
      { title: 'नवीन एलईडी बसवले', date: '27 जुलै 2026', comment: '४ नवीन ७२W एलईडी पथदिवे बसवून काम पूर्ण केले.', completed: true }
    ]
  },
  {
    id: 'cmp-103',
    ticketId: 'SHV-2026-0870',
    category: 'Road Damage',
    categoryMr: 'रस्ते दुरुस्ती व खड्डे',
    title: 'शाळेसमोरील मुख्य रस्त्यावर मोठे खड्डे पडले आहेत',
    description: 'जिल्हा परिषद प्राथमिक शाळेच्या रस्त्यावर पावसाचे पाणी साचून खड्डे झाले आहेत. लहान मुलांना अपघाताचा धोका आहे.',
    citizenName: 'बाळासाहेब संभाजी गायकवाड',
    phone: '9890556677',
    location: 'जि. प. शाळा रोड, वॉर्ड ४',
    wardNo: 'वॉर्ड ४',
    status: 'Assigned',
    statusMr: 'मंजूर व नियुक्त',
    createdAt: '2026-07-28',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    assignedStaff: 'सार्वजनिक बांधकाम कंत्राटदार',
    timeline: [
      { title: 'तक्रार नोंदवली', date: '28 जुलै 2026', completed: true },
      { title: 'ग्रामसभा मंजुरी व निधी शेड्युल', date: '30 जुलै 2026', comment: 'मुरुम व डांबरीकरण पॅचवर्क मंजूर', completed: true },
      { title: 'काम पूर्ण करणे', date: 'प्रस्तावित २ ऑगस्ट', completed: false }
    ]
  }
];

export const mockDevWorks: DevelopmentWork[] = [
  {
    id: 'wrk-1',
    titleMr: 'ग्रामपंचायत स्मार्ट काँक्रिट रस्ता व बंदिस्त गटार बांधकाम',
    titleEn: 'Smart Concrete Road & Underground Drainage System',
    category: 'रस्ते व पायाभूत सुविधा',
    budgetLakhs: 25.50,
    fundsSpentLakhs: 18.20,
    contractor: 'मे. शिवशक्ती कन्स्ट्रक्शन्स, पुणे',
    startDate: '15 मार्च 2026',
    expectedCompletion: '30 ऑगस्ट 2026',
    progressPercent: 75,
    status: 'In Progress',
    statusMr: 'प्रगतीपथावर',
    location: 'मुख्य चौक ते स्मशानभूमी रस्ता (वॉर्ड २ व ३)',
    fundSource: '१५ वा वित्त आयोग (Central 15th FC)',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-2',
    titleMr: '१५ लाख लिटर क्षमतेची नवीन आर.सी.सी. उंच पाण्याची टाकी',
    titleEn: '15 Lakh Litre RCC Elevated Water Tank Project',
    category: 'जलपुरवठा व जलजीवन मिशन',
    budgetLakhs: 68.00,
    fundsSpentLakhs: 61.50,
    contractor: 'महाराष्ट्र जीवन प्राधिकरण मान्यताप्राप्त कंत्राटदार',
    startDate: '10 जानेवारी 2026',
    expectedCompletion: '15 जुलै 2026',
    progressPercent: 92,
    status: 'In Progress',
    statusMr: 'अंतिम टप्प्यात',
    location: 'टेकडी परिसर, शिवणे',
    fundSource: 'जलजीवन मिशन (State & Central Govt)',
    photoUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'wrk-3',
    titleMr: 'ग्रामपंचायत डिजिटल अभ्यासिका व संगणक केंद्र इमारत',
    titleEn: 'Gram Panchayat Digital Library & Computer Lab',
    category: 'शिक्षण व तंत्रज्ञान',
    budgetLakhs: 15.00,
    fundsSpentLakhs: 15.00,
    contractor: 'सह्याद्री इन्फ्रा प्रायव्हेट लि.',
    startDate: '01 नोव्हेंबर 2025',
    expectedCompletion: '20 मे 2026',
    progressPercent: 100,
    status: 'Completed',
    statusMr: 'पूर्ण झाले',
    location: 'ग्रामपंचायत कार्यालय शेजारी',
    fundSource: 'आमदार स्थानिक विकास निधी (MLA Fund)',
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80'
  }
];

export const mockUpcomingWorks: UpcomingWork[] = [
  {
    id: 'upk-1',
    titleMr: 'गावात हायमस्ट सौर ऊर्जा पथदिवे बसवणे (५० ठिकाणे)',
    titleEn: 'Solar High-Mast Street Light Installation',
    category: 'अपारंपरिक ऊर्जा',
    estimatedBudgetLakhs: 12.00,
    proposedTimeline: 'सप्टेंबर २०२६ ते नोव्हेंबर २०२६',
    approvalStatus: 'Approved by Sabha',
    approvalStatusMr: 'ग्रामसभा मंजूर',
    benefitCitizens: 4500
  },
  {
    id: 'upk-2',
    titleMr: 'प्राथमिक आरोग्य केंद्र इमारतीचे नूतनीकरण व रुग्णवाहिका खरेदी',
    titleEn: 'Primary Health Center Renovation & Ambulance Purchase',
    category: 'सार्वजनिक आरोग्य',
    estimatedBudgetLakhs: 22.00,
    proposedTimeline: 'ऑक्टोबर २०२६ ते जानेवारी २०२७',
    approvalStatus: 'Pending Sanction',
    approvalStatusMr: 'जिल्हा परिषद मंजुरी प्रक्रियेत',
    benefitCitizens: 12000
  },
  {
    id: 'upk-3',
    titleMr: 'जैविक कचरा प्रक्रिया केंद्र व गांडूळ खत प्रकल्प',
    titleEn: 'Solid Waste Management & Bio-Composting Unit',
    category: 'स्वच्छ भारत मिशन',
    estimatedBudgetLakhs: 8.50,
    proposedTimeline: 'ऑगस्ट २०२६',
    approvalStatus: 'Tender Floating',
    approvalStatusMr: 'निविदा (Tender) प्रसिद्धी',
    benefitCitizens: 8000
  }
];

export const mockNidhiFunds: NidhiFund[] = [
  {
    id: 'fnd-1',
    fundNameMr: '१५ वा वित्त आयोग (Central 15th FC)',
    fundNameEn: '15th Finance Commission Grant',
    category: 'Central 15th FC',
    totalAllocated: 4500000,
    utilized: 3250000,
    remaining: 1250000,
    financialYear: '2025-26',
    projectCount: 6
  },
  {
    id: 'fnd-2',
    fundNameMr: 'आमदार स्थानिक विकास निधी (MLA Fund)',
    fundNameEn: 'MLA Local Area Development Fund',
    category: 'MLA Fund',
    totalAllocated: 2500000,
    utilized: 2200000,
    remaining: 300000,
    financialYear: '2025-26',
    projectCount: 3
  },
  {
    id: 'fnd-3',
    fundNameMr: 'खासदार निधी (MP Fund)',
    fundNameEn: 'MP Local Area Development Fund',
    category: 'MP Fund',
    totalAllocated: 3000000,
    utilized: 1800000,
    remaining: 1200000,
    financialYear: '2025-26',
    projectCount: 2
  },
  {
    id: 'fnd-4',
    fundNameMr: 'जिल्हा परिषद जनसुविधा व रस्ते अनुदान',
    fundNameEn: 'Zilla Parishad Amenities Grant',
    category: 'Zilla Parishad',
    totalAllocated: 1800000,
    utilized: 1500000,
    remaining: 300000,
    financialYear: '2025-26',
    projectCount: 4
  }
];

export const mockGramSabha: GramSabhaMeeting[] = [
  {
    id: 'sab-1',
    meetingNumber: 'विशेष स्वातंत्र्य दिन ग्रामसभा २०२६',
    titleMr: 'स्वातंत्र्य दिन विशेष ग्रामसभा व वार्षिक जमा-खर्च मंजुरी',
    date: '15 ऑगस्ट 2026',
    time: 'सकाळी 09:30 वाजता',
    location: 'ग्रामपंचायत सभागृह, शिवणे',
    status: 'Upcoming',
    agendaMr: [
      'मागील ग्रामसभेचे इतिवृत्त वाचून मंजूर करणे.',
      'सन २०२५-२६ च्या वार्षिक जमा-खर्चाचा हिशोब ग्रामसभेपुढे मांडणे.',
      'जलजीवन मिशन व पाणीपट्टी कर आकारणीबाबत चर्चा.',
      'नवीन विकास कामांच्या कामांची यादी मंजुरी.',
      'अध्यक्षांच्या परवानगीने येणारे एनवेळचे विषय.'
    ],
    expectedAttendees: 350,
    noticePdfUrl: '#'
  },
  {
    id: 'sab-2',
    meetingNumber: 'महिला विशेष ग्रामसभा',
    titleMr: 'महिला सबलीकरण, स्वच्छता व बचत गट योजना विशेष सभा',
    date: '08 मार्च 2026',
    time: 'दुपारी 02:00 वाजता',
    location: 'जि. प. प्राथमिक शाळा पटांगण',
    status: 'Completed',
    agendaMr: [
      'महिला बचत गटांना १०% ग्रामपंचायत निधी वाटप.',
      'गावातील अंगणवाडी व माता-बाल संगोपन आढावा.',
      'पिण्याच्या पाण्याच्या स्वच्छतेची पडताळणी.'
    ],
    minutesSummaryMr: 'सभेत १२ बचत गटांना व्यावसायिक अनुदान मंजूर करण्यात आले. १५० महिला उपस्थित होत्या.',
    expectedAttendees: 180
  }
];

export const mockNotices: NoticeItem[] = [
  {
    id: 'ntc-1',
    noticeNo: 'GP/SHV/2026/104',
    titleMr: 'सन २०२६-२७ ची घरपट्टी व पाणीपट्टी १५ ऑगस्टपूर्वी भरल्यास १०% सवलत',
    category: 'Tax Payment',
    categoryMr: 'कर भरणा सवलत',
    date: '01 ऑगस्ट 2026',
    importance: 'Urgent',
    descriptionMr: 'सर्व ग्रामस्थांना कळवण्यात येते की, वार्षिक घरपट्टी व पाणीपट्टी ऑनलाईन भरणाऱ्या नागरिकांना १०% विशेष सवलत देण्यात येत आहे. तरी सर्वांनी ऑनलाईन ई-ग्राम पोर्टलवरून कर भरावा.'
  },
  {
    id: 'ntc-2',
    noticeNo: 'GP/SHV/2026/098',
    titleMr: 'जलवाहिनी दुरुस्तीमुळे रविवारी दि. ३ ऑगस्ट रोजी पाणीपुरवठा बंद राहील',
    category: 'Water Schedule',
    categoryMr: 'पाणी पुरवठा सूचना',
    date: '30 जुलै 2026',
    importance: 'Important',
    descriptionMr: 'मुख्य टाकीच्या साफसफाईचे व व्हॉल्व्ह दुरुस्तीचे काम हाती घेतले असल्याने रविवारी पाणीपुरवठा बंद राहील. नागरिकांनी सहकार्य करावे.'
  },
  {
    id: 'ntc-3',
    noticeNo: 'GP/SHV/2026/092',
    titleMr: 'स्वातंत्र्य दिन ग्रामसभा नोटीस व विषय पत्रिका',
    category: 'Gram Sabha',
    categoryMr: 'ग्रामसभा नोटीस',
    date: '28 जुलै 2026',
    importance: 'General',
    descriptionMr: '१५ ऑगस्ट २०२६ रोजी सकाळी ९:३० वाजता सर्व ग्रामस्थांनी ग्रामसभेस उपस्थित राहावे.'
  }
];

export const mockCitizenApplications: CitizenApplication[] = [
  {
    id: 'app-501',
    applicationNo: 'APP-2026-9012',
    serviceId: 'srv-1',
    serviceNameMr: 'पोलीस पाटील दाखला',
    citizenName: 'संजय बबनराव देशमुख',
    citizenAadhaar: 'XXXX-XXXX-8921',
    phone: '9822123456',
    appliedDate: '2026-07-28',
    dueDate: '2026-07-31',
    status: 'Certificate Generated',
    statusMr: 'दाखला मंजूर व तयार',
    paymentStatus: 'Paid',
    amount: 30,
    verificationStaff: 'अमित मोर (लिपिक)',
    downloadUrl: '#'
  },
  {
    id: 'app-502',
    applicationNo: 'APP-2026-9045',
    serviceId: 'srv-2',
    serviceNameMr: 'उत्पन्न दाखला (स्वयंघोषणा पत्र)',
    citizenName: 'संजय बबनराव देशमुख',
    citizenAadhaar: 'XXXX-XXXX-8921',
    phone: '9822123456',
    appliedDate: '2026-07-30',
    dueDate: '2026-08-02',
    status: 'Pending Verification',
    statusMr: 'कागदपत्र तपासणी प्रक्रियेत',
    paymentStatus: 'Paid',
    amount: 50,
    verificationStaff: 'श्री. रमेश शिंदे (ग्रामसेवक)'
  },
  {
    id: 'app-503',
    applicationNo: 'APP-2026-8890',
    serviceId: 'srv-6',
    serviceNameMr: 'घरपट्टी कर भरणा पावती',
    citizenName: 'प्रमोद सीताराम केदारी',
    citizenAadhaar: 'XXXX-XXXX-3344',
    phone: '9422001122',
    appliedDate: '2026-07-26',
    dueDate: '2026-07-26',
    status: 'Certificate Generated',
    statusMr: 'कर पावती जनरेट झाली',
    paymentStatus: 'Paid',
    amount: 1450,
    downloadUrl: '#'
  }
];

export const mockPanchayatsList: GramPanchayatTenant[] = [
  {
    id: 'gp-1',
    code: '27250012',
    nameMr: 'शिवणे ग्रामपंचायत',
    nameEn: 'Shivane Gram Panchayat',
    taluka: 'हवेली',
    district: 'पुणे',
    population: 14250,
    sarpanchName: 'सौ. सुनीता पाटील',
    contactNo: '9890112233',
    activePlan: 'Enterprise Gold',
    status: 'Active',
    renewalDate: '2027-03-31',
    monthlyFee: 2999
  },
  {
    id: 'gp-2',
    code: '27250045',
    nameMr: 'सासवड ग्रामपंचायत',
    nameEn: 'Saswad Gram Panchayat',
    taluka: 'पुरंदर',
    district: 'पुणे',
    population: 28500,
    sarpanchName: 'श्री. मारुती जगताप',
    contactNo: '9822445566',
    activePlan: 'Enterprise Gold',
    status: 'Active',
    renewalDate: '2027-01-15',
    monthlyFee: 3999
  },
  {
    id: 'gp-3',
    code: '27250089',
    nameMr: 'शिराळा ग्रामपंचायत',
    nameEn: 'Shirala Gram Panchayat',
    taluka: 'शिराळा',
    district: 'सांगली',
    population: 18900,
    sarpanchName: 'श्री. संभाजीराव नाईक',
    contactNo: '9422887711',
    activePlan: 'Standard Green',
    status: 'Active',
    renewalDate: '2026-11-30',
    monthlyFee: 1999
  },
  {
    id: 'gp-4',
    code: '27250102',
    nameMr: 'कडूस ग्रामपंचायत',
    nameEn: 'Kadus Gram Panchayat',
    taluka: 'खेड',
    district: 'पुणे',
    population: 11200,
    sarpanchName: 'सौ. सरिता ढमाले',
    contactNo: '9850332211',
    activePlan: 'Standard Green',
    status: 'Active',
    renewalDate: '2026-12-10',
    monthlyFee: 1999
  }
];
