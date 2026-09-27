// @ts-nocheck
// frontend/src/composables/useVoiceAssistant.ts
// Voice-driven apply flow in 3 languages (Marathi / Hindi / English):
// find service -> select -> ask fields -> confirm -> submit.
// Uses the browser Web Speech API (Chrome / Edge). Works on https or localhost.
import { ref, watch, onBeforeUnmount } from 'vue'
import { speechSupported, makeSpeech } from './speechCore'

export const LANGS = [
  { code: 'mr-IN', label: 'मराठी' },
  { code: 'hi-IN', label: 'हिंदी' },
  { code: 'en-IN', label: 'English' },
]

// Shared across the whole app (global assistant + this apply flow keep the same language).
let _saved = 'mr-IN'
try { _saved = localStorage.getItem('va_lang') || 'mr-IN' } catch {}
export const sharedLang = ref(LANGS.some(l => l.code === _saved) ? _saved : 'mr-IN')

/* ---------------- 1. Service aliases (spoken word -> part of service name_mr) ---------------- */
export const ALIASES = [
  { match: 'उत्पन्न', words: ['उत्पन्न', 'उत्पन्नाचा', 'उत्पन्ना', 'आय', 'आमदनी', 'इन्कम', 'इनकम', 'income', 'utpanna', 'utpann', 'aay'] },
  { match: 'जात', words: ['जात', 'जाती', 'जाति', 'कास्ट', 'caste', 'jaat', 'jat', 'jati'] },
  { match: 'जन्म', words: ['जन्म', 'बर्थ', 'birth', 'janm', 'janma'] },
  { match: 'मृत्यू', words: ['मृत्यू', 'मृत्यु', 'डेथ', 'death', 'mrutyu', 'mrityu'] },
  { match: 'अपंग', words: ['अपंग', 'दिव्यांग', 'विकलांग', 'disability', 'divyang', 'apang', 'handicap'] },
  { match: 'गरीब', words: ['गरीब', 'गरिबी', 'दारिद्र्य', 'poverty', 'bpl', 'garib', 'gareebi'] },
  { match: 'चरित्र', words: ['चरित्र', 'चारित्र्य', 'character', 'charitra'] },
  { match: 'कुटुंब', words: ['कुटुंब', 'कुटुम्ब', 'परिवार', 'फॅमिली', 'फैमिली', 'family', 'kutumb'] },
  { match: 'जमीन', words: ['जमीन', 'जमिनी', 'जमीनीचा', 'land', 'jamin', 'jameen'] },
  { match: 'शेतकरी', words: ['शेतकरी', 'किसान', 'फार्मर', 'farmer', 'shetkari'] },
  { match: 'वारस', words: ['वारस', 'वारसा', 'वारिस', 'heir', 'legal heir', 'waras', 'varas'] },
]
export const nameOf = (s) => s.name_mr || s.nameMr || s.name || ''

/* ---------------- 2. Number helpers ---------------- */
const DEV_DIGITS = '०१२३४५६७८९'
const WORD_DIGITS = {
  0: ['शून्य', 'zero', 'shunya', 'jeero'],
  1: ['एक', 'one', 'ek'],
  2: ['दोन', 'दो', 'two', 'don', 'do'],
  3: ['तीन', 'three', 'teen', 'tin'],
  4: ['चार', 'four', 'char', 'chaar'],
  5: ['पाच', 'पांच', 'पाँच', 'five', 'pach', 'panch', 'paanch'],
  6: ['सहा', 'छह', 'छे', 'six', 'saha', 'chha', 'che'],
  7: ['सात', 'seven', 'saat', 'sat'],
  8: ['आठ', 'eight', 'aath', 'ath'],
  9: ['नऊ', 'नौ', 'nine', 'nau', 'nav'],
}
const WORD_MAP = Object.fromEntries(
  Object.entries(WORD_DIGITS).flatMap(([d, ws]) => ws.map(w => [w, d]))
)

/** "१२३ four five 6" -> "123456" */
export function toDigits(text = '') {
  let out = ''
  for (const tok of text.toLowerCase().split(/[\s,.\-]+/)) {
    if (!tok) continue
    if (WORD_MAP[tok] !== undefined) { out += WORD_MAP[tok]; continue }
    out += tok.replace(/[०-९]/g, c => DEV_DIGITS.indexOf(c)).replace(/\D/g, '')
  }
  return out
}

// How digits are SPOKEN back (words read far better than raw numbers by the voice engine)
const SPOKEN = {
  'mr-IN': ['शून्य', 'एक', 'दोन', 'तीन', 'चार', 'पाच', 'सहा', 'सात', 'आठ', 'नऊ'],
  'hi-IN': ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ'],
  'en-IN': ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
}
export function spell(str, l, group = 4) {
  const d = String(str ?? '').replace(/\D/g, '')
  const chunks = d.match(new RegExp(`.{1,${group}}`, 'g')) || []
  return chunks.map(c => c.split('').map(x => SPOKEN[l][+x]).join(' ')).join(', ')
}

/* ---------------- 3. Text cleaning ---------------- */
const NAME_STOP = new Set([
  'माझे', 'माझं', 'माझ', 'माझा', 'नाव', 'नाम', 'मेरा', 'मेरे', 'है', 'आहे', 'हे', 'हैं',
  'maaz', 'maza', 'maze', 'majha', 'majhe', 'mera', 'mere', 'naav', 'nav', 'naam',
  'my', 'name', 'is', 'am', 'i', 'the', 'ahe', 'hai',
])
export function cleanName(text = '') {
  return text.split(/\s+/).filter(t => t && !NAME_STOP.has(t.toLowerCase())).join(' ').trim()
}
export function cleanEmail(text = '') {
  return text.toLowerCase()
    .replace(/\s*(at the rate|at rate|ॲट द रेट|एट द रेट|ॲट|एट|at)\s*/g, '@')
    .replace(/\s*(dot|डॉट|डाट|पूर्णविराम)\s*/g, '.')
    .replace(/\s+/g, '')
}

// These cover the many natural ways people confirm/decline in Marathi and Hindi
// ("तेच ठेवा", "तसंच ठेवा", "हो चालेल", "बरोबर आहे", "बदलायचा आहे", "दुसरा नंबर देतो", ...)
// rather than a rigid one-phrase match.
export const YES = /(^|\s)(हो|होय|हां|हाँ|जी|बरोबर|बरोबर आहे|ठीक|ठीक आहे|ठेवा|तेच|तेच ठेवा|तसंच|तसंच ठेवा|चालेल|हो चालेल|yes|yeah|yep|haan|ha|ho|correct|keep|keep it|confirm|submit|सबमिट)(\s|$)/i
export const NO = /(^|\s)(नाही|नको|बदल|बदला|बदलायचा|बदलायची|बदलायचे|बदलायचं|बदलायचा आहे|चुकीचा|चुकीचे|दुसरा|दुसरा नंबर|नवीन नंबर|नहीं|नहि|बदलो|बदलना|नई|नया नंबर|galat|badalna|no|nahi|nako|change|change it|badla|wrong|different)(\s|$)/i
const SKIP = /(skip|नाही|नको|नहीं|nahi|nako|पुढे|next|काही नाही|कुछ नहीं|none)/i
const NEXT = /(पुढे|पुढे जा|पुढे चला|आता पुढे|पुढं|आगे|आगे जाओ|next|continue|झालं|झाले|झाला|done|zala|kelay|केलं|अपलोड केले|अपलोड झाले|hogaya|ho gaya)/i
const BACK = /(मागे|मागे जा|मागे चला|पीछे|पीछे जाओ|back|previous)/i
// Mid-flow escape hatches, checked inside every ask()/askYesNo() so the person is never
// stuck answering a question they don't want to answer.
// Anchored to whole words/phrases (not bare substrings) — a plain substring match on
// short words like "बस" (stop/enough) would also fire inside unrelated words, e.g. it
// is literally contained in "सबस्क्रिप्शन" (subscription). Same fix as useGlobalVoice.ts.
const STOP = /(^|\s)(बंद करा|बंद कर|थांबा|थांबवा|थांब|बस|रद्द करा|रद्द|धन्यवाद|शुक्रिया|रुको|रुकिए|stop|exit|close|bye|quit|cancel|thank)(\s|$)/i
const HELP = /(^|\s)(मदत|परत सांगा|पुन्हा विचारा|काय करू शकता|काय बोलू|सहायता|मदद|क्या बोलूं|help|what can i say)(\s|$)/i
const cleanUtterance = (s = '') => s.replace(/[.,!?।]/g, ' ').replace(/\s+/g, ' ').trim()

/* ---------------- 4. All spoken / shown sentences, per language ---------------- */
const TXT = {
  'mr-IN': {
    hello: 'नमस्कार! आपल्याला कोणता दाखला हवा आहे? उदाहरणार्थ, उत्पन्नाचा दाखला, जातीचा दाखला किंवा जन्म दाखला.',
    notFound: 'क्षमा करा, तो दाखला सापडला नाही. कृपया दुसरे नाव सांगा.',
    confirmService: (n) => `आपल्याला "${n}" हा दाखला निवडायचा आहे का? कृपया होय किंवा नाही म्हणा.`,
    fieldsIntro: 'ठीक आहे. आता आपली माहिती भरूया.',
    askName: 'कृपया आपले पूर्ण नाव सांगा.',
    askAadhaar: 'कृपया आपला बारा अंकी आधार क्रमांक सांगा. दरम्यान थोडा वेळ थांबलात तरी हरकत नाही, मी वाट पाहीन.',
    errAadhaar: 'आधार क्रमांक बारा अंकांचा असतो. कृपया पुन्हा सांगा.',
    askMobile: 'कृपया आपला दहा अंकी मोबाईल क्रमांक सांगा.',
    errMobile: 'मोबाईल क्रमांक दहा अंकांचा असतो. कृपया पुन्हा सांगा.',
    askEmail: 'कृपया आपला ईमेल सांगा. नसल्यास "नाही" म्हणा.',
    askWard: 'आपला वॉर्ड क्रमांक कोणता आहे? कृपया एक ते सहा यांपैकी सांगा.',
    errWard: 'वॉर्ड क्रमांक एक ते सहा यांपैकीच असला पाहिजे.',
    askAddress: 'कृपया आपला राहण्याचा पत्ता सांगा.',
    keepValue: (l, v) => `${l}: ${v}. ही माहिती आधीच भरलेली आहे. ती तशीच ठेवायची का? होय म्हणजे तशीच राहील, नाही म्हणजे नव्याने सांगा.`,
    retry: 'क्षमा करा, मला नीट ऐकू आले नाही. कृपया पुन्हा सांगा.',
    manual: 'क्षमा करा, ही माहिती कृपया स्वतः टाइप करा. टाइप करून झाल्यावर "पुढे" म्हणा.',
    docs: 'आता आवश्यक कागदपत्रे अपलोड करा. "Choose File" बटणावर क्लिक करून फाइल निवडा. काम झाल्यावर "पुढे" म्हणा.',
    summary: (f, l) => `कृपया आपली माहिती तपासा. नाव: ${f.applicantName}. आधार क्रमांक: ${spell(f.aadhaarNo, l, 4)}. मोबाईल क्रमांक: ${spell(f.mobile, l, 5)}. वॉर्ड क्रमांक: ${spell(f.wardNo, l)}. आता अर्ज सादर करायचा का? कृपया होय किंवा नाही म्हणा.`,
    submitted: 'पेमेंटसाठी विंडो उघडली आहे. कृपया शुल्क भरून अर्ज पूर्ण करा.',
    notSubmitted: 'ठीक आहे, अर्ज सादर केलेला नाही. आपण माहिती बदलू शकता.',
    cannotSelect: 'क्षमा करा, दाखला निवडता आला नाही. कृपया पुन्हा प्रयत्न करा.',
    unsupported: 'हा ब्राउझर आवाज सुविधेला साथ देत नाही. कृपया Chrome किंवा Edge वापरा.',
    stoppedByUser: 'ठीक आहे, थांबतो. आपण नंतर पुन्हा सुरू करू शकता.',
    helpDuring: 'आपण म्हणू शकता: "तेच ठेवा", "बदला", "पुढे जा", "मागे जा" किंवा "थांबा".',
    labels: { applicantName: 'नाव', aadhaarNo: 'आधार क्रमांक', mobile: 'मोबाईल क्रमांक', email: 'ईमेल', wardNo: 'वॉर्ड क्रमांक', address: 'राहण्याचा पत्ता' },
    voiceFallback: 'मराठी आवाज उपलब्ध नाही, म्हणून हिंदी आवाज वापरला जात आहे. सर्वोत्तम आवाजासाठी Edge browser वापरा.',
    voiceNone: 'या संगणकावर बोलण्यासाठी आवाज उपलब्ध नाही.',
  },
  'hi-IN': {
    hello: 'नमस्ते! आपको कौन सा प्रमाणपत्र बनवाना है? जैसे आय प्रमाणपत्र, जाति प्रमाणपत्र या जन्म प्रमाणपत्र।',
    notFound: 'क्षमा करें, वह सेवा नहीं मिली। कृपया दूसरा नाम बताइए।',
    confirmService: (n) => `क्या आप "${n}" चुनना चाहते हैं? हाँ या नहीं बोलिए।`,
    fieldsIntro: 'ठीक है। अब आपकी जानकारी भरते हैं।',
    askName: 'कृपया अपना पूरा नाम बताइए।',
    askAadhaar: 'कृपया अपना बारह अंकों का आधार नंबर बताइए। बीच में रुकें तो कोई बात नहीं, मैं इंतज़ार करूँगा।',
    errAadhaar: 'आधार नंबर बारह अंकों का होता है। कृपया फिर से बताइए।',
    askMobile: 'कृपया अपना दस अंकों का मोबाइल नंबर बताइए।',
    errMobile: 'मोबाइल नंबर दस अंकों का होता है। कृपया फिर से बताइए।',
    askEmail: 'अपना ईमेल बताइए। न हो तो "नहीं" बोलिए।',
    askWard: 'आपका वार्ड नंबर क्या है? एक से छह के बीच बताइए।',
    errWard: 'वार्ड नंबर एक से छह के बीच होना चाहिए।',
    askAddress: 'कृपया अपने घर का पता बताइए।',
    keepValue: (l, v) => `${l} पहले से भरा हुआ है: ${v}। क्या इसे रखना है? हाँ बोलेंगे तो यही रहेगा, नहीं बोलेंगे तो फिर से बताइए।`,
    retry: 'मुझे ठीक से सुनाई नहीं दिया। कृपया फिर से बताइए।',
    manual: 'क्षमा करें, कृपया यह जानकारी खुद टाइप कर लें। फिर "आगे" बोलिए।',
    docs: 'अब दस्तावेज़ अपलोड करें। "Choose File" बटन पर क्लिक करके फ़ाइल चुनें। हो जाने पर "आगे" बोलिए।',
    summary: (f, l) => `कृपया जानकारी जाँच लें। नाम: ${f.applicantName}। आधार नंबर: ${spell(f.aadhaarNo, l, 4)}। मोबाइल नंबर: ${spell(f.mobile, l, 5)}। वार्ड नंबर: ${spell(f.wardNo, l)}। क्या आवेदन जमा करना है? हाँ या नहीं बोलिए।`,
    submitted: 'भुगतान की विंडो खुल गई है। कृपया भुगतान पूरा करें।',
    notSubmitted: 'ठीक है, आवेदन जमा नहीं किया गया। आप जानकारी बदल सकते हैं।',
    cannotSelect: 'सेवा चुन नहीं पाए। कृपया फिर से कोशिश करें।',
    unsupported: 'यह ब्राउज़र आवाज़ सुविधा को सपोर्ट नहीं करता। कृपया Chrome या Edge इस्तेमाल करें।',
    stoppedByUser: 'ठीक है, रुकता हूँ। आप बाद में फिर से शुरू कर सकते हैं।',
    helpDuring: 'आप बोल सकते हैं: "वैसा ही रखो", "बदलो", "आगे बढ़ो", "पीछे जाओ" या "रुको"।',
    labels: { applicantName: 'नाम', aadhaarNo: 'आधार नंबर', mobile: 'मोबाइल नंबर', email: 'ईमेल', wardNo: 'वार्ड नंबर', address: 'पता' },
    voiceFallback: '',
    voiceNone: 'इस कंप्यूटर पर बोलने के लिए आवाज़ उपलब्ध नहीं है।',
  },
  'en-IN': {
    hello: 'Hello! Which certificate do you need? For example, an income certificate, a caste certificate or a birth certificate.',
    notFound: "Sorry, I couldn't find that service. Please tell me another name.",
    confirmService: (n) => `Do you want to select "${n}"? Please say yes or no.`,
    fieldsIntro: "Okay. Now let's fill in your details.",
    askName: 'Please tell me your full name.',
    askAadhaar: "Please say your twelve digit Aadhaar number. It's fine to pause partway through, I'll wait.",
    errAadhaar: 'An Aadhaar number has twelve digits. Please say it again.',
    askMobile: 'Please say your ten digit mobile number.',
    errMobile: 'A mobile number has ten digits. Please say it again.',
    askEmail: 'Please say your email address, or say "skip".',
    askWard: 'What is your ward number? Please say a number from one to six.',
    errWard: 'The ward number must be between one and six.',
    askAddress: 'Please tell me your residential address.',
    keepValue: (l, v) => `Your ${l} is already filled in as ${v}. Shall I keep it? Say yes to keep it, or no to change it.`,
    retry: "Sorry, I didn't catch that. Please say it again.",
    manual: 'Sorry, please type this one yourself. Then say "next".',
    docs: 'Now please upload your documents using the Choose File buttons. Say "next" when you are done.',
    summary: (f, l) => `Please check your details. Name: ${f.applicantName}. Aadhaar number: ${spell(f.aadhaarNo, l, 4)}. Mobile number: ${spell(f.mobile, l, 5)}. Ward number: ${spell(f.wardNo, l)}. Shall I submit the application? Please say yes or no.`,
    submitted: 'The payment window is open. Please complete the payment.',
    notSubmitted: 'Okay, the application was not submitted. You can edit your details.',
    cannotSelect: 'Could not select a service. Please try again.',
    unsupported: 'This browser does not support voice. Please use Chrome or Edge.',
    stoppedByUser: "Okay, stopping here. You can start again anytime.",
    helpDuring: 'You can say: "keep it", "change it", "next", "back", or "stop".',
    labels: { applicantName: 'name', aadhaarNo: 'Aadhaar number', mobile: 'mobile number', email: 'email', wardNo: 'ward number', address: 'address' },
    voiceFallback: '',
    voiceNone: 'No voice is available on this computer for speaking.',
  },
}

/* ---------------- 5. Voice (text-to-speech) selection ---------------- */
export const norm = (l = '') => l.replace('_', '-').toLowerCase()
export function pickVoice(langCode) {
  const voices = window.speechSynthesis?.getVoices?.() || []
  // Marathi voices are rare: fall back to Hindi (same Devanagari script, pronounced far better than an English voice)
  const wanted = langCode === 'mr-IN' ? ['mr-in', 'mr', 'hi-in', 'hi'] : [norm(langCode), norm(langCode).slice(0, 2)]
  for (const w of wanted) {
    const exact = voices.filter(v => norm(v.lang) === w)
    const loose = voices.filter(v => norm(v.lang).startsWith(w + '-') || norm(v.lang) === w)
    const pool = exact.length ? exact : loose
    if (pool.length) {
      return pool.find(v => /natural|online/i.test(v.name)) || pool.find(v => /google/i.test(v.name)) || pool[0]
    }
  }
  return null
}

/* ---------------- 6. The composable ---------------- */
/**
 * @param {Object} o
 * @param {import('vue').Ref<Array>} o.services   list of services [{id, name_mr, ...}]
 * @param {Object}   o.form                       reactive formData {applicantName, aadhaarNo, mobile, email, wardNo, address}
 * @param {Function} o.selectService(service)     your existing "निवडा" handler
 * @param {Function} o.goToStep(n)                1..4
 * @param {Function} o.submit()                   your existing submitFinalApplication
 */
export function useVoiceAssistant({ services, form, selectService, goToStep, submit }) {
  const active = ref(false)
  const log = ref([])
  const voiceNote = ref('')
  const lang = sharedLang
  const supported = speechSupported

  const engine = makeSpeech({
    lang,
    push: (who, text) => log.value.push({ who, text }),
    pickVoice,
  })
  const { listening, speaking } = engine

  let cancelled = false
  const T = () => TXT[lang.value]

  function refreshVoiceNote() {
    if (!('speechSynthesis' in window)) return
    const v = pickVoice(lang.value)
    if (!v) voiceNote.value = T().voiceNone
    else if (lang.value === 'mr-IN' && !norm(v.lang).startsWith('mr')) voiceNote.value = T().voiceFallback
    else voiceNote.value = ''
  }
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = refreshVoiceNote
  watch(lang, (l) => { try { localStorage.setItem('va_lang', l) } catch {}; refreshVoiceNote() }, { immediate: true })

  /**
   * Ask -> listen, retry when nothing is heard. `listenOpts` tunes how long we wait for pauses.
   * "थांबा"/"stop" cancels the whole flow (no further speech after that). "मदत"/"help" gets a
   * short contextual hint and re-asks the SAME question without burning one of the retries.
   */
  async function ask(question, tries = 3, listenOpts) {
    for (let i = 0; i < tries && !cancelled; ) {
      await engine.say(i === 0 ? question : T().retry)
      const raw = await engine.listen(listenOpts)
      if (!raw) { i++; continue }
      const c = cleanUtterance(raw)
      if (STOP.test(c)) { cancelled = true; await engine.say(T().stoppedByUser); return '' }
      if (HELP.test(c)) { await engine.say(T().helpDuring); continue }
      return raw
    }
    return ''
  }

  /** Yes/No with a definite fallback so we never loop forever waiting for a clean "yes". */
  async function askYesNo(question, tries = 2, fallback = true) {
    for (let i = 0; i < tries && !cancelled; i++) {
      await engine.say(i === 0 ? question : T().retry)
      const raw = await engine.listen()
      if (!raw) continue
      const c = cleanUtterance(raw)
      if (STOP.test(c)) { cancelled = true; await engine.say(T().stoppedByUser); return fallback }
      if (HELP.test(c)) { await engine.say(T().helpDuring); i--; continue }
      if (YES.test(c)) return true
      if (NO.test(c)) return false
      // heard something but it wasn't a clear yes/no: ask once more, then fall back
    }
    return fallback
  }

  /* ---- Step 1: find & select the service ---- */
  function findService(text) {
    const q = text.toLowerCase()
    const list = services.value || []
    for (const a of ALIASES) {
      if (a.words.some(w => q.includes(w.toLowerCase()))) {
        const hit = list.find(s => nameOf(s).includes(a.match))
        if (hit) return hit
      }
    }
    return list.find(s => nameOf(s) && q.includes(nameOf(s).toLowerCase())) || null
  }

  async function waitForServices() {
    for (let k = 0; k < 40 && !(services.value || []).length; k++) await new Promise(r => setTimeout(r, 100))
  }

  async function pickService(prefill = '') {
    await waitForServices()
    if (prefill) { const s0 = findService(prefill); if (s0) return s0 }
    for (let i = 0; i < 4 && !cancelled; i++) {
      const t = await ask(i === 0 ? T().hello : T().notFound)
      if (!t) continue
      const s = findService(t)
      if (!s) continue
      const ok = await askYesNo(T().confirmService(nameOf(s)), 2, true)
      if (ok) return s
    }
    return null
  }

  /* ---- Step 2: fields ---- */
  const FIELDS = [
    { key: 'applicantName', required: true, q: () => T().askName,
      parse: t => cleanName(t) || null },
    { key: 'aadhaarNo', required: true, q: () => T().askAadhaar, err: () => T().errAadhaar,
      listenOpts: { silenceMs: 2800, maxMs: 22000 },
      parse: t => { const d = toDigits(t); return d.length === 12 ? d : null } },
    { key: 'mobile', required: true, q: () => T().askMobile, err: () => T().errMobile,
      listenOpts: { silenceMs: 2600, maxMs: 18000 },
      parse: t => { const d = toDigits(t).slice(-10); return d.length === 10 ? d : null } },
    { key: 'email', required: false, q: () => T().askEmail,
      listenOpts: { silenceMs: 2600 },
      parse: t => (SKIP.test(t) ? '' : (/^\S+@\S+\.\S+$/.test(cleanEmail(t)) ? cleanEmail(t) : null)) },
    { key: 'wardNo', required: true, q: () => T().askWard, err: () => T().errWard,
      parse: t => { const n = Number(toDigits(t)); return n >= 1 && n <= 6 ? n : null } },
    { key: 'address', required: true, q: () => T().askAddress,
      listenOpts: { silenceMs: 2600 },
      parse: t => t.trim() || null },
  ]

  /** If the user says name + numbers in one sentence, pick the numbers up too. */
  function bulkFill(text) {
    const flat = toDigits(text)
    const a = flat.match(/\d{12}/)
    if (a && !form.aadhaarNo) form.aadhaarNo = a[0]
    const mob = (flat.replace(a?.[0] || '', '').match(/\d{10}/) || [])[0]
    if (mob && !form.mobile) form.mobile = mob
  }

  const spokenValue = (key) =>
    key === 'aadhaarNo' ? spell(form[key], lang.value, 4)
      : key === 'mobile' ? spell(form[key], lang.value, 5)
        : key === 'wardNo' ? spell(form[key], lang.value)
          : String(form[key])

  async function collectFields() {
    goToStep(2)
    await engine.say(T().fieldsIntro)
    for (const f of FIELDS) {
      if (cancelled) return
      // Already filled (e.g. auto-filled from the logged-in user's profile): confirm once, then move on either way.
      if (form[f.key] && f.key !== 'applicantName') {
        const keep = await askYesNo(T().keepValue(T().labels[f.key], spokenValue(f.key)), 2, true)
        if (keep) continue
      }
      let value = null
      for (let i = 0; i < 3 && value === null && !cancelled; i++) {
        const t = await ask(i === 0 ? f.q() : (f.err ? f.err() : f.q()), 2, f.listenOpts)
        if (!t) continue
        if (f.key === 'applicantName') bulkFill(t)
        value = f.parse(t)
      }
      if (value === null && f.required) {
        await engine.say(T().manual)
        await engine.listen()
        continue
      }
      if (value !== null) form[f.key] = value
    }
  }

  /* ---- Step 3: documents (browsers do not let scripts pick files) ---- */
  async function docsStep() {
    goToStep(3)
    for (;;) {
      if (cancelled) return
      const t = await ask(T().docs, 1)
      if (BACK.test(t)) { goToStep(2); return 'back' }
      if (NEXT.test(t)) return
    }
  }

  /* ---- Step 4: confirm & submit ---- */
  async function confirmStep() {
    if (cancelled) return
    goToStep(4)
    const ok = await askYesNo(T().summary(form, lang.value), 2, false)
    if (ok) { await submit(); await engine.say(T().submitted) }
    else await engine.say(T().notSubmitted)
  }

  /* ---- public API ---- */
  async function start(prefill = '') {
    if (!supported) return alert(T().unsupported)
    cancelled = false; active.value = true; log.value = []
    engine.reset()
    try {
      goToStep(1)
      const service = await pickService(prefill)
      if (cancelled) return
      if (!service) { await engine.say(T().cannotSelect); return }
      selectService(service)
      await collectFields()
      if (cancelled) return
      while ((await docsStep()) === 'back') await collectFields()
      if (cancelled) return
      await confirmStep()
    } finally { stop() }
  }

  function stop() {
    cancelled = true; active.value = false
    engine.haltAll()
    engine.cancelSpeech()
  }

  onBeforeUnmount(stop)
  return { supported, active, listening, speaking, lang, log, voiceNote, start, stop }
}
