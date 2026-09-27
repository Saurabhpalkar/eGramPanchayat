// @ts-nocheck
// frontend/src/composables/useGlobalVoice.ts
// Global voice + typed assistant: "find / open anything in the whole project"
// (public site, citizen, staff, admin and super-admin areas).
//  - opens any page      ("माझे अर्ज उघडा", "स्टाफ यादी दाखवा", "पेमेंट्स दाखवा")
//  - finds an application by number ("अर्ज क्रमांक APP 505122")
//  - starts the apply flow for a certificate ("उत्पन्नाचा दाखला काढायचा आहे")
// Real page addresses are NOT hard-coded: they are looked up at runtime from
// router.getRoutes(), scoped to whichever area (public/citizen/staff/admin/
// superadmin) the person is currently in.
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { speechSupported, makeSpeech } from './speechCore'
import { sharedLang, LANGS, toDigits, spell, pickVoice, norm, YES, ALIASES, nameOf } from './useVoiceAssistant'
import { dispatchVoiceAction, currentUserArea } from './voiceActions'

const L3 = (mr, hi, en) => ({ 'mr-IN': mr, 'hi-IN': hi, 'en-IN': en })

/* ---------------- 1. Page registry (built from the project's actual router) ----------------
   find    : substrings that must appear in the real route path (e.g. 'applications')
   exclude : substrings that must NOT appear (used to tell 'works' apart from 'upcoming-works')
   root    : this page IS the root of whichever area we're in ('/', '/citizen', '/staff', ...)
   flow    : selecting this page hands off to the voice-apply flow instead of just navigating   */
export const PAGES = [
  { id: 'home', root: true, find: ['dashboard', 'overview'],
    title: L3('मुख्य पान', 'मुख्य पृष्ठ', 'Home'),
    words: ['डॅशबोर्ड', 'डैशबोर्ड', 'मुख्य पृष्ठ', 'मुख्यपृष्ठ', 'मुख्य पान', 'मुख्य पेज', 'होम', 'dashboard', 'home', 'overview'] },
  { id: 'apply', flow: true, find: ['apply'],
    title: L3('नवीन दाखला / अर्ज', 'नया प्रमाणपत्र / आवेदन', 'New application'),
    words: ['नवीन अर्ज', 'नवीन दाखला', 'नवीन application', 'नवा अर्ज', 'नव्याने अर्ज', 'नया आवेदन', 'नया प्रमाणपत्र', 'नई application', 'अर्ज करा', 'अर्ज काढायचा', 'दाखल्यासाठी अर्ज', 'certificate साठी apply', 'आवेदन करें', 'apply', 'apply करा', 'apply करूया', 'new application', 'new certificate', 'create new application'] },
  // Public catalogue of services (browsing, not the citizen apply flow) — kept separate from
  // 'apply' above: without this, "सेवा दाखवा" scored under 'apply' but /citizen/apply's path
  // doesn't contain 'services', so it silently failed to open the real /services page.
  { id: 'servicesList', find: ['services'], exclude: ['service/'],
    title: L3('सेवांची यादी', 'सेवाओं की सूची', 'Services'),
    words: ['सेवा दाखवा', 'सेवांची यादी', 'सर्व सेवा', 'सेवा यादी', 'सेवाएं दिखाओ', 'सेवाओं की सूची', 'services list', 'all services', 'services'] },
  { id: 'applications', find: ['applications'],
    title: L3('अर्जांची यादी', 'आवेदनों की सूची', 'Applications'),
    words: ['माझे अर्ज', 'माझ्या अर्ज', 'माझे application', 'माझी application', 'my application', 'अर्जांची यादी', 'अर्जांची', 'अर्ज पहा', 'अर्ज पाहा', 'अर्ज बघायचे', 'अर्ज कुठे आहेत', 'application कुठे आहेत', 'सर्व अर्ज', 'मेरे आवेदन', 'आवेदन सूची', 'सभी आवेदन', 'my applications', 'all applications', 'applications', 'application search', 'application track', 'अर्ज'] },
  { id: 'track', find: ['track'],
    title: L3('अर्जाची स्थिती', 'आवेदन की स्थिति', 'Track application'),
    words: ['अर्जाची स्थिती', 'स्थिती तपासा', 'स्टेटस', 'ट्रॅक करा', 'ट्रैक करें', 'स्थिति जाँचें', 'track', 'status'] },
  { id: 'raiseComplaint', find: ['raise-complaint'],
    title: L3('तक्रार नोंदवा', 'शिकायत दर्ज करें', 'Raise a complaint'),
    words: ['तक्रार नोंदवा', 'नवीन तक्रार', 'तक्रार करा', 'complaint register', 'register complaint', 'register a complaint', 'complaint दर्ज', 'शिकायत दर्ज करें', 'नई शिकायत', 'शिकायत करें', 'शिकायत दर्ज', 'raise complaint', 'file a complaint', 'new complaint'] },
  { id: 'complaints', find: ['complaints'],
    title: L3('माझ्या तक्रारी', 'मेरी शिकायतें', 'My complaints'),
    words: ['माझ्या तक्रारी', 'तक्रारींची यादी', 'तक्रार पहा', 'मेरी शिकायतें', 'शिकायतें देखें', 'complaints list', 'my complaints', 'complaints', 'तक्रार'] },
  { id: 'works', find: ['works'], exclude: ['upcoming'],
    title: L3('विकास कामे', 'विकास कार्य', 'Development works'),
    words: ['विकास काम', 'विकासकाम', 'विकास कार्य', 'development work', 'development', 'dev works', 'works'] },
  { id: 'upcoming', find: ['upcoming-works'],
    title: L3('प्रस्तावित कामे', 'प्रस्तावित कार्य', 'Upcoming works'),
    words: ['प्रस्तावित काम', 'प्रस्तावित', 'आगामी काम', 'आगामी', 'अपकमिंग', 'upcoming works', 'upcoming', 'proposed works'] },
  { id: 'funds', find: ['nidhi'],
    title: L3('ग्रामपंचायत निधी', 'ग्राम पंचायत निधि', 'Panchayat funds'),
    words: ['निधी', 'निधि', 'फंड', 'बजेट', 'nidhi', 'fund', 'funds', 'budget'] },
  { id: 'notices', find: ['notices'],
    title: L3('सूचना फलक', 'सूचना पट्ट', 'Notice board'),
    words: ['सूचना फलक', 'सूचना पट्ट', 'नोटीस', 'नोटिस', 'फलक', 'notice board', 'notices', 'notice'] },
  { id: 'gramsabha', find: ['gram-sabha'],
    title: L3('ग्रामसभा', 'ग्राम सभा', 'Gram Sabha'),
    words: ['ग्रामसभा', 'ग्राम सभा', 'gram sabha', 'gramsabha'] },
  { id: 'notifications', find: ['notifications'],
    title: L3('सूचना व संदेश', 'सूचनाएँ व संदेश', 'Notifications'),
    words: ['सूचना व संदेश', 'संदेश', 'मेसेज', 'मैसेज', 'सूचनाएं', 'सूचनाएँ', 'notifications', 'messages'] },
  { id: 'profile', find: ['profile'],
    title: L3('माझी प्रोफाइल', 'मेरी प्रोफाइल', 'My profile'),
    words: ['प्रोफाइल', 'प्रोफ़ाइल', 'माझी माहिती', 'माझे खाते', 'my profile', 'profile', 'account'] },
  { id: 'verification', find: ['verification'],
    title: L3('पडताळणी', 'सत्यापन', 'Verification'),
    words: ['पडताळणी', 'व्हेरिफिकेशन', 'सत्यापन', 'verification', 'verify'] },
  { id: 'certificates', find: ['certificates'],
    title: L3('दाखले जारी करा', 'प्रमाणपत्र जारी करें', 'Certificates'),
    words: ['दाखले जारी', 'प्रमाणपत्र जारी', 'certificates'] },
  { id: 'citizens', find: ['citizens'],
    title: L3('नागरिकांची यादी', 'नागरिकों की सूची', 'Citizens'),
    words: ['नागरिकांची यादी', 'नागरिक यादी', 'नागरिकों की सूची', 'citizens list', 'citizens'] },
  { id: 'reports', find: ['reports'],
    title: L3('अहवाल', 'रिपोर्ट', 'Reports'),
    words: ['अहवाल', 'रिपोर्ट', 'reports', 'report'] },
  { id: 'staffMgmt', find: ['/staff'],
    title: L3('स्टाफ यादी', 'स्टाफ सूची', 'Staff'),
    words: ['स्टाफ यादी', 'स्टाफची यादी', 'कर्मचारी यादी', 'स्टाफ सूची', 'कर्मचारी सूची', 'staff list', 'staff'] },
  { id: 'panchayats', find: ['panchayats'],
    title: L3('ग्रामपंचायतींची यादी', 'ग्राम पंचायतों की सूची', 'Panchayats'),
    words: ['ग्रामपंचायतींची यादी', 'पंचायतींची यादी', 'सर्व पंचायती', 'पंचायतों की सूची', 'panchayats list', 'panchayats'] },
  { id: 'addPanchayat', find: ['add-panchayat'],
    title: L3('नवीन ग्रामपंचायत जोडा', 'नई पंचायत जोड़ें', 'Add panchayat'),
    words: ['ग्रामपंचायत जोडा', 'नवीन पंचायत जोडा', 'पंचायत जोड़ें', 'add panchayat', 'new panchayat'] },
  { id: 'admins', find: ['admins'],
    title: L3('प्रशासकांची यादी', 'प्रशासकों की सूची', 'Admins'),
    words: ['प्रशासक', 'एडमिन यादी', 'प्रशासकों की सूची', 'admins list', 'admins'] },
  { id: 'users', find: ['users'],
    title: L3('वापरकर्ते', 'उपयोगकर्ता', 'Users'),
    words: ['वापरकर्ते', 'युजर यादी', 'उपयोगकर्ता सूची', 'users list', 'users'] },
  { id: 'subscriptions', find: ['subscriptions'],
    title: L3('सबस्क्रिप्शन', 'सदस्यता', 'Subscriptions'),
    words: ['सबस्क्रिप्शन', 'सदस्यता', 'subscriptions', 'subscription'] },
  { id: 'payments', find: ['payments'],
    title: L3('पेमेंट्स', 'भुगतान', 'Payments'),
    words: ['पेमेंट्स', 'पेमेंट यादी', 'पेमेंट स्थिती', 'पेमेंट करा', 'payment status', 'payment', 'pay application', 'भुगतान', 'payments'] },
  { id: 'analytics', find: ['analytics'],
    title: L3('विश्लेषण', 'विश्लेषण', 'Analytics'),
    words: ['विश्लेषण', 'ॲनालिटिक्स', 'एनालिटिक्स', 'analytics'] },
  { id: 'settings', find: ['settings'],
    title: L3('सेटिंग्स', 'सेटिंग्स', 'Settings'),
    words: ['सेटिंग्स', 'सेटिंग', 'settings', 'setting'] },
  { id: 'schemes', find: ['schemes'],
    title: L3('शासकीय योजना', 'सरकारी योजनाएं', 'Schemes'),
    words: ['योजना', 'योजनांची यादी', 'योजनाएं', 'सरकारी योजना', 'schemes'] },
  { id: 'about', find: ['about'],
    title: L3('आमच्याबद्दल', 'हमारे बारे में', 'About us'),
    words: ['आमच्याबद्दल', 'ग्रामपंचायत विषयी', 'हमारे बारे में', 'about us', 'about'] },
  { id: 'contact', find: ['contact'],
    title: L3('संपर्क', 'संपर्क करें', 'Contact us'),
    words: ['संपर्क', 'संपर्क साधा', 'हमसे संपर्क करें', 'contact us', 'contact'] },
  { id: 'login', find: ['login'],
    title: L3('लॉगिन', 'लॉग इन', 'Login'),
    words: ['लॉगिन करा', 'लॉग इन करा', 'लॉग इन करें', 'साइन इन करें', 'login', 'sign in'] },
  { id: 'register', find: ['register'],
    title: L3('नोंदणी करा', 'रजिस्टर करें', 'Register'),
    words: ['नोंदणी करा', 'नवीन खाते', 'रजिस्टर करें', 'नया खाता बनाएं', 'register', 'sign up'] },
]
const PAGE = (id) => PAGES.find(p => p.id === id)

const APPLY_WORDS = ['काढायचा', 'काढायची', 'काढायचे', 'काढा', 'हवा', 'हवी', 'हवे', 'पाहिजे', 'पाहिजेत', 'करायचा', 'करायची', 'करायचे',
  'करायचं', 'करूया', 'बनवायचा', 'बनवायची', 'बनवाना', 'बनवाएं', 'चाहिए', 'निकालना', 'apply', 'want', 'need', 'get', 'make', 'create']
const SEARCH_WORDS = ['शोध', 'शोधा', 'शोधून', 'search', 'खोज', 'खोजो', 'खोजिए', 'ढूंढो', 'ढूंढिए', 'find', 'दुंडो']
// Anchored to whole words/phrases (not bare substrings) — a plain substring match on
// short words like "बस" (stop/enough) would also fire inside unrelated words, e.g. it
// is literally contained in "सबस्क्रिप्शन" (subscription).
const STOP = /(^|\s)(बंद करा|बंद कर|थांबा|थांबवा|थांब|बस|रद्द करा|रद्द|धन्यवाद|शुक्रिया|रुको|रुकिए|stop|exit|close|bye|quit|cancel|thank)(\s|$)/i
const HELP = /(^|\s)(मदत|काय करू शकता|काय करू शकतो|काय बोलू|काय विचारू|सहायता|मदद|क्या बोलूं|क्या कर सकते|help|what can (i|you) say|what can you do)(\s|$)/i

/* ---------------- 2. Pure helpers (also used by the typed search box) ---------------- */
const clean = (s = '') => s.toLowerCase().replace(/[.,!?।"'“”‘’]/g, ' ').replace(/\s+/g, ' ').trim()
const hasWord = (q, tokens, w) => {
  w = w.toLowerCase()
  return w.length <= 3 ? tokens.some(t => t.startsWith(w)) : q.includes(w)
}

export function scorePages(q) {
  return PAGES
    .map(p => ({ p, score: Math.max(0, ...p.words.map(w => (q.includes(w.toLowerCase()) ? w.length : 0))) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function matchServices(q, services = []) {
  const tokens = q.split(' ')
  const hits = new Map()
  for (const a of ALIASES) {
    if (a.words.some(w => hasWord(q, tokens, w))) {
      services.filter(s => nameOf(s).includes(a.match)).forEach(s => hits.set(s.id ?? nameOf(s), s))
    }
  }
  for (const s of services) {
    const n = nameOf(s).toLowerCase()
    if (n && (q.includes(n) || (q.length >= 2 && n.includes(q)))) hits.set(s.id ?? n, s)
  }
  return [...hits.values()]
}

/** "APP 505122" / "ए पी पी पाच शून्य ..." / "अर्ज क्रमांक ..." -> "505122" */
export function appNoFrom(q) {
  const re = /(?:app|ॲप|ऍप|ऐप|एपीपी|ए पी पी|अर्ज क्रमांक|आवेदन क्रमांक|application number|application no)[\s:\-]*([0-9०-९a-zऀ-ॿ\s]{2,})/
  const m = q.match(re)
  if (m) { const d = toDigits(m[1]); if (d.length >= 4) return d }
  // "505122 वाला application शोध" / "505122 चा अर्ज शोधा": a bare digit group, with no APP/अर्ज-क्रमांक
  // prefix, still counts as an application number IF the sentence also mentions
  // "application"/"अर्ज"/"आवेदन" AND a search-ish verb — otherwise a bare number is too
  // ambiguous (could be a ward number, an amount, anything) to guess at.
  const bare = q.match(/\b\d{4,8}\b/)
  if (bare && /अर्ज|आवेदन|application/.test(q) && SEARCH_WORDS.some(w => q.includes(w))) {
    return bare[0]
  }
  return ''
}

export function interpret(text, services = []) {
  const q = clean(text)
  if (!q) return { type: 'empty' }
  if (STOP.test(q)) return { type: 'stop' }
  if (HELP.test(q)) return { type: 'help' }
  const no = appNoFrom(q)
  if (no) return { type: 'app', no: 'APP' + no }
  const top = scorePages(q)[0]?.p
  const svcs = matchServices(q, services)
  const tokens = q.split(' ')
  const wantsApply = APPLY_WORDS.some(w => hasWord(q, tokens, w))
  // Bare "search"/"शोध" while talking about applications, with no number spoken yet:
  // open the applications page and focus its search box rather than doing nothing.
  if (!svcs.length && !top?.flow && /अर्ज|आवेदन|application/.test(q) && SEARCH_WORDS.some(w => q.includes(w))) {
    return { type: 'focusSearch' }
  }
  if (top?.flow) return { type: 'apply', svc: svcs[0] }
  if (svcs.length && (wantsApply || !top)) return { type: 'apply', svc: svcs[0] }
  if (top) return { type: 'page', page: top }
  return { type: 'none' }
}

/* ---------------- 3. Spoken sentences ---------------- */
const TXT = {
  'mr-IN': {
    greet: 'नमस्कार! आपल्याला काय शोधायचे आहे, कृपया सांगा.',
    again: 'क्षमा करा, मला नीट ऐकू आले नाही. कृपया पुन्हा सांगा.',
    bye: 'ठीक आहे. गरज लागल्यास मला पुन्हा बोलवा.',
    stopped: 'ठीक आहे, धन्यवाद!',
    help: 'आपण असे सांगू शकता: "माझे अर्ज उघडा", "तक्रार नोंदवा", "सूचना फलक दाखवा", "उत्पन्नाचा दाखला काढायचा आहे", किंवा "अर्ज क्रमांक ए पी पी पाच शून्य पाच एक दोन दोन शोधा".',
    helpApplications: 'आपण म्हणू शकता: "APP पाच शून्य पाच एक दोन दोन शोधा", "माझे अर्ज दाखवा" किंवा "नवीन अर्ज करा".',
    opening: (t) => `"${t}" हे पान उघडत आहे.`,
    pageMissing: (t) => `क्षमा करा, "${t}" हे पान येथे उपलब्ध नाही.`,
    searchApp: (no, l) => `अर्ज क्रमांक ए पी पी ${spell(no.slice(3), l, 3)} शोधत आहे.`,
    focusSearch: 'ठीक आहे, अर्जाचा शोध घेण्यासाठी अर्ज क्रमांक सांगा.',
    applyStart: (n) => (n ? `ठीक आहे. "${n}" साठी अर्ज सुरू करूया.` : 'ठीक आहे. नवीन अर्ज सुरू करूया.'),
    noMatch: 'क्षमा करा, मला ते सापडले नाही. आपण "मदत" असे म्हणून पाहू शकता.',
    voiceFallback: 'मराठी आवाज उपलब्ध नाही, म्हणून हिंदी आवाज वापरला जात आहे. सर्वोत्तम आवाजासाठी Edge browser वापरा.',
  },
  'hi-IN': {
    greet: 'नमस्ते! बताइए, आपको क्या ढूँढना है?',
    again: 'क्षमा करें, मुझे ठीक से सुनाई नहीं दिया। कृपया फिर से बताइए।',
    bye: 'ठीक है। ज़रूरत हो तो मुझे फिर बुला लीजिए।',
    stopped: 'ठीक है, धन्यवाद!',
    help: 'आप ऐसे बोल सकते हैं: "मेरे आवेदन खोलो", "शिकायत दर्ज करनी है", "सूचना पट्ट दिखाओ", "आय प्रमाणपत्र बनवाना है", या "आवेदन क्रमांक ए पी पी पाँच शून्य पाँच एक दो दो खोजो"।',
    helpApplications: 'आप बोल सकते हैं: "APP पाँच शून्य पाँच एक दो दो खोजो", "मेरे आवेदन दिखाओ" या "नया आवेदन करो"।',
    opening: (t) => `"${t}" पेज खोल रहा हूँ।`,
    pageMissing: (t) => `क्षमा करें, "${t}" पेज यहाँ उपलब्ध नहीं है।`,
    searchApp: (no, l) => `आवेदन क्रमांक ए पी पी ${spell(no.slice(3), l, 3)} खोज रहा हूँ।`,
    focusSearch: 'ठीक है, आवेदन खोजने के लिए आवेदन क्रमांक बताइए।',
    applyStart: (n) => (n ? `ठीक है। "${n}" के लिए आवेदन शुरू करते हैं।` : 'ठीक है। नया आवेदन शुरू करते हैं।'),
    noMatch: 'क्षमा करें, मुझे वह नहीं मिला। आप "मदद" बोलकर देख सकते हैं।',
    voiceFallback: '',
  },
  'en-IN': {
    greet: 'Hello! Tell me, what would you like to find?',
    again: "Sorry, I didn't catch that. Please say it again.",
    bye: 'Okay. Call me again whenever you need me.',
    stopped: 'Okay, thank you!',
    help: 'You can say things like: "open my applications", "register a complaint", "show the notice board", "I need an income certificate", or "find application A P P five zero five one two two".',
    helpApplications: 'You can say: "search APP five zero five one two two", "show my applications", or "create new application".',
    opening: (t) => `Opening "${t}".`,
    pageMissing: (t) => `Sorry, the "${t}" page is not available here.`,
    searchApp: (no, l) => `Searching for application A P P ${spell(no.slice(3), l, 3)}.`,
    focusSearch: 'Okay, tell me the application number to search for.',
    applyStart: (n) => (n ? `Okay. Let's start the application for "${n}".` : "Okay. Let's start a new application."),
    noMatch: 'Sorry, I could not find that. You can say "help" to see what I can do.',
    voiceFallback: '',
  },
}

/* ---------------- 4. The composable ---------------- */
export function useGlobalVoice() {
  const router = useRouter()
  const route = useRoute()
  const lang = sharedLang
  const active = ref(false)
  const log = ref([])
  const services = ref([])
  const voiceNote = ref('')
  const supported = speechSupported

  const engine = makeSpeech({
    lang,
    push: (who, text) => log.value.push({ who, text }),
    pickVoice,
  })
  const { listening, speaking } = engine

  let cancelled = false
  let servicesLoaded = false
  const T = () => TXT[lang.value]

  // Best-effort: if the person is on a neutral/public page (area '/') but is actually
  // logged in, prefer their own area (citizen/staff/admin/superadmin) instead of the
  // public routes. Reuses the project's existing auth composable — never a second
  // auth system — and simply does nothing if that lookup fails or the field isn't found.
  const authArea = ref(null)
  currentUserArea().then(a => { authArea.value = a })

  watch(lang, (l) => {
    try { localStorage.setItem('va_lang', l) } catch {}
    const v = 'speechSynthesis' in window ? pickVoice(l) : null
    voiceNote.value = l === 'mr-IN' && v && !norm(v.lang).startsWith('mr') ? TXT['mr-IN'].voiceFallback : ''
  }, { immediate: true })

  async function loadServices() {
    if (servicesLoaded) return
    servicesLoaded = true
    try {
      const mod = await import('@/services/citizenService.js')
      const res = await mod.getCitizenServices()
      services.value = res?.services || res?.data?.services || []
    } catch { /* not a citizen page / not logged in: page navigation still works */ }
  }

  /* ---- real page address, from the router, scoped to the current area ---- */
  function resolvePath(page) {
    // The current layout wins first ("if inside CitizenLayout, prefer citizen routes"), and
    // only when we're on a neutral public page do we fall back to the logged-in user's own area.
    let area = '/' + (route.path.split('/')[1] || '')
    if (area === '/' && authArea.value) area = authArea.value
    if (page.root) return area // '/', '/citizen', '/staff', '/admin', '/superadmin' are all real paths
    const routes = router.getRoutes().filter(r => r.path && !r.path.includes(':') && !r.path.includes('*'))
    const ok = (r) => {
      const p = r.path.toLowerCase()
      return page.find.some(f => p.includes(f)) && !(page.exclude || []).some(x => p.includes(x))
    }
    let c = routes.filter(ok)
    const inArea = c.filter(r => r.path === area || r.path.startsWith(area + '/'))
    if (inArea.length) c = inArea
    if (!c.length) return null
    c.sort((a, b) => a.path.length - b.path.length)
    return c[0].path
  }

  /* ---- actions ----
     Navigation alone is never the end of the story for these two: we also hand the
     target page a typed, real action through the pending-action bus (voiceActions.ts),
     so it performs its OWN search/select logic instead of the voice assistant faking it. */
  async function startApply(svc) {
    const name = svc ? nameOf(svc) : ''
    await engine.say(T().applyStart(name))
    const path = resolvePath(PAGE('apply'))
    if (!path) { await engine.say(T().pageMissing(PAGE('apply').title[lang.value])); return 'ok' }
    dispatchVoiceAction({ type: 'START_APPLICATION', serviceQuery: name })
    engine.haltAll()
    if (route.path !== path) await router.push(path)
    // No setTimeout guess: CitizenApply.vue reads the pending action itself, either on
    // mount (if it wasn't open yet) or via a `watch` (if it was already open).
    return 'handoff'
  }

  function contextualHelp() {
    const area = '/' + (route.path.split('/')[1] || '')
    return area.startsWith('/citizen') && route.path.includes('applications') ? T().helpApplications : T().help
  }

  async function act(r, raw) {
    const t = T()
    switch (r.type) {
      case 'stop': await engine.say(t.stopped); return 'stop'
      case 'help': await engine.say(contextualHelp()); return 'ok'
      case 'focusSearch': {
        const path = resolvePath(PAGE('applications'))
        if (!path) { await engine.say(t.pageMissing(PAGE('applications').title[lang.value])); return 'ok' }
        dispatchVoiceAction({ type: 'FOCUS_SEARCH' })
        if (route.path !== path) router.push(path)
        await engine.say(t.focusSearch)
        return 'ok'
      }
      case 'app': {
        const path = resolvePath(PAGE('applications'))
        if (!path) { await engine.say(t.pageMissing(PAGE('applications').title[lang.value])); return 'ok' }
        dispatchVoiceAction({ type: 'SEARCH_APPLICATION', query: r.no })
        // Query param too, so the link is shareable and CitizenApplications.vue can read
        // route.query.q on a fresh load, not only the reactive action (belt and braces).
        if (route.path === path) router.replace({ path, query: { q: r.no } })
        else router.push({ path, query: { q: r.no } })
        await engine.say(t.searchApp(r.no, lang.value))
        return 'ok'
      }
      case 'page': {
        const title = r.page.title[lang.value]
        const path = resolvePath(r.page)
        if (!path) { await engine.say(t.pageMissing(title)); return 'ok' }
        router.push(path)
        await engine.say(t.opening(title))
        return 'ok'
      }
      case 'apply': return startApply(r.svc)
      default: {
        // last chance: an English word that appears in exactly one real route path
        const tokens = clean(raw).split(' ').filter(w => /^[a-z]{3,}$/.test(w))
        const hits = router.getRoutes().filter(x => x.path && !x.path.includes(':') && !x.path.includes('*') &&
          tokens.some(w => x.path.toLowerCase().replace(/[-_/]/g, ' ').includes(w)))
        if (hits.length === 1) { router.push(hits[0].path); await engine.say(t.opening(hits[0].path)); return 'ok' }
        await engine.say(t.noMatch)
        return 'ok'
      }
    }
  }

  /** Typed search box: same brain, no microphone, no speaking out loud. */
  async function submitText(text) {
    if (!text.trim()) return
    await loadServices()
    log.value.push({ who: 'user', text })
    const silentEngine = { say: async () => {} }
    const res = interpret(text, services.value)
    // reuse act() but swap engine.say for a no-op so the typed box stays quiet
    const realSay = engine.say
    engine.say = async (msg) => { log.value.push({ who: 'bot', text: msg }) }
    try { await act(res, text) } finally { engine.say = realSay }
  }

  /** Live suggestions while typing. */
  function suggest(text) {
    const q = clean(text)
    if (!q) return []
    const out = []
    const no = appNoFrom(q) || (/^app\s?\d{3,}$/.test(q) ? q.replace(/\D/g, '') : '')
    if (no) out.push({ key: 'app', label: 'APP' + no, kind: 'app', run: () => submitText('APP ' + no) })
    for (const { p } of scorePages(q)) {
      out.push({ key: 'p-' + p.id, label: p.title[lang.value], kind: 'page', run: () => submitText(p.words[0]) })
    }
    for (const s of matchServices(q, services.value)) {
      out.push({ key: 's-' + (s.id ?? nameOf(s)), label: nameOf(s), kind: 'service', run: () => submitText(nameOf(s)) })
    }
    return out.slice(0, 8)
  }

  /* ---- voice loop: keeps listening until "थांबा" / two silences in a row ---- */
  async function start() {
    if (!supported) return
    await loadServices()
    cancelled = false; active.value = true; log.value = []
    engine.reset()
    let idle = 0, commands = 0, handoff = false
    try {
      await engine.say(T().greet)
      while (!cancelled) {
        const heard = await engine.listen()
        if (!heard) {
          idle++
          if (idle >= 2) { if (!commands) await engine.say(T().bye); break }
          await engine.say(T().again)
          continue
        }
        idle = 0; commands++
        const res = await act(interpret(heard, services.value), heard)
        if (res === 'stop') break
        if (res === 'handoff') { handoff = true; break }
      }
    } finally { stop(handoff) }
  }

  function stop(keepSpeech = false) {
    cancelled = true; active.value = false
    engine.haltAll()
    if (!keepSpeech) engine.cancelSpeech()
  }

  onBeforeUnmount(() => stop())
  return { supported, active, listening, speaking, lang, log, voiceNote, start, stop, suggest, submitText, loadServices }
}
