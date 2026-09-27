<!-- frontend/src/components/common/VoiceApplyAssistant.vue -->
<!-- Floating voice button with a language picker (मराठी / हिंदी / English). -->
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useVoiceAssistant, LANGS } from '../../composables/useVoiceAssistant'
import { voiceActionState, clearVoiceAction } from '../../composables/voiceActions'

const props = defineProps({
  services: { type: Array as () => any[], required: true },
  form: { type: Object as () => Record<string, any>, required: true },
  hideLauncher: { type: Boolean, default: false },   // true when GlobalVoiceAssistant provides the mic button
})
const emit = defineEmits(['select-service', 'go-to-step', 'submit'])

const { supported, active, listening, speaking, lang, log, voiceNote, start, stop } = useVoiceAssistant({
  services: computed(() => props.services),
  form: props.form,
  selectService: (s: any) => emit('select-service', s),
  goToStep: (n: number) => emit('go-to-step', n),
  submit: () => emit('submit'),
})

// GlobalVoiceAssistant hands this page a pending START_APPLICATION action through the
// typed voice-action bus (voiceActions.ts) — no DOM events, no timing guesses. We check
// once on mount (action arrived just before this page opened) and again via `watch`
// (action arrives while this page is already open).
function consumePendingApply() {
  const a = voiceActionState().action
  if (a?.type === 'START_APPLICATION' && !active.value) {
    clearVoiceAction()
    start(a.serviceQuery || '')
  }
}
onMounted(consumePendingApply)
watch(() => voiceActionState().seq, consumePendingApply)

function setLang(code: string) {
  if (!active.value) lang.value = code
}

const UI: Record<string, any> = {
  'mr-IN': { title: 'आवाज सहाय्यक', start: '🎤 आवाजाने अर्ज भरा', stop: '■ थांबवा', listening: '👂 ऐकत आहे…', speaking: '🔊 बोलत आहे…', pick: 'भाषा निवडा' },
  'hi-IN': { title: 'आवाज़ सहायक', start: '🎤 आवाज़ से आवेदन भरें', stop: '■ रोकें', listening: '👂 सुन रहा हूँ…', speaking: '🔊 बोल रहा हूँ…', pick: 'भाषा चुनें' },
  'en-IN': { title: 'Voice assistant', start: '🎤 Fill by voice', stop: '■ Stop', listening: '👂 Listening…', speaking: '🔊 Speaking…', pick: 'Language' },
}
const ui = computed(() => UI[lang.value] || UI['mr-IN'])
</script>

<template>
  <div v-if="supported" class="va-wrap">
    <div v-if="active" class="va-panel">
      <div class="va-head"><strong>🎙️ {{ ui.title }}</strong></div>
      <div class="va-log">
        <p v-for="(l, i) in log" :key="i" :class="l.who">{{ l.text }}</p>
      </div>
      <div class="va-state">
        <span v-if="listening">{{ ui.listening }}</span>
        <span v-else-if="speaking">{{ ui.speaking }}</span>
        <span v-else>⏳</span>
      </div>
    </div>

    <div v-if="!hideLauncher && voiceNote && !active" class="va-note">⚠️ {{ voiceNote }}</div>

    <div v-if="!hideLauncher" class="va-langs" :title="ui.pick">
      <button v-for="l in LANGS" :key="l.code" type="button" :class="{ sel: lang === l.code }" :disabled="active"
        @click="setLang(l.code)">{{ l.label }}</button>
    </div>

    <button v-if="!hideLauncher" class="va-btn" :class="{ on: active, pulse: listening }" type="button" @click="active ? stop() : start()">
      {{ active ? ui.stop : ui.start }}
    </button>
  </div>
</template>

<style scoped>
.va-wrap { position: fixed; right: 24px; bottom: 80px; z-index: 50; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.va-btn { background: #14803c; color: #fff; border: 0; border-radius: 999px; padding: 14px 22px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
.va-btn.on { background: #b91c1c; }
.va-btn.pulse { animation: pulse 1.2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(20,128,60,.6); } 100% { box-shadow: 0 0 0 16px rgba(20,128,60,0); } }
.va-langs { display: flex; background: #fff; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,.2); overflow: hidden; }
.va-langs button { border: 0; background: transparent; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; color: #334155; }
.va-langs button.sel { background: #14803c; color: #fff; }
.va-langs button:disabled { cursor: not-allowed; opacity: .6; }
.va-note { max-width: 300px; background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; font-size: 12px; padding: 8px 10px; border-radius: 10px; }
.va-panel { width: 340px; max-height: 380px; background: #fff; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.25); display: flex; flex-direction: column; overflow: hidden; }
.va-head { padding: 10px 14px; background: #ecfdf3; }
.va-log { padding: 10px 14px; overflow-y: auto; flex: 1; font-size: 14px; }
.va-log p { margin: 0 0 8px; padding: 6px 10px; border-radius: 10px; }
.va-log .bot { background: #f1f5f9; }
.va-log .user { background: #dcfce7; text-align: right; }
.va-state { padding: 8px 14px; font-size: 13px; color: #475569; border-top: 1px solid #e5e7eb; }
</style>
