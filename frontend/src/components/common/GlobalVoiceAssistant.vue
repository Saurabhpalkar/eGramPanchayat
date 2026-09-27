<!-- frontend/src/components/common/GlobalVoiceAssistant.vue -->
<!-- Put ONCE in App.vue (after <router-view />). Search / open anything by voice or typing. -->
<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalVoice } from '../../composables/useGlobalVoice'
import { LANGS } from '../../composables/useVoiceAssistant'

const route = useRoute()
const hidden = computed(() => /login|register|otp|forgot|reset/i.test(route.path))

const g = useGlobalVoice()
const { supported, active, listening, speaking, lang, log, voiceNote } = g

const open = ref(false)
const query = ref('')
const logBox = ref<HTMLElement | null>(null)
const results = computed(() => g.suggest(query.value))

function toggle() {
  open.value = !open.value
  if (open.value) g.loadServices()
  else g.stop()
}
function setLang(code: string) { if (!active.value) lang.value = code }
function submit() { g.submitText(query.value); query.value = '' }
function pick(r: any) { r.run(); query.value = ''; if (r.kind !== 'app') open.value = false }

watch(() => log.value.length, async () => { await nextTick(); logBox.value?.scrollTo(0, logBox.value.scrollHeight) })

const UI: Record<string, any> = {
  'mr-IN': { title: 'शोधा व उघडा', placeholder: 'काहीही शोधा… उदा. तक्रार, उत्पन्न दाखला', speak: '🎤 बोला', stop: '■ थांबवा', listening: '👂 ऐकत आहे…', speaking: '🔊 बोलत आहे…', hint: 'बोला: "माझे अर्ज उघडा" किंवा "उत्पन्नाचा दाखला काढायचा आहे"', page: 'पान', service: 'दाखला', app: 'अर्ज क्रमांक' },
  'hi-IN': { title: 'खोजें व खोलें', placeholder: 'कुछ भी खोजें… जैसे शिकायत, आय प्रमाणपत्र', speak: '🎤 बोलिए', stop: '■ रोकें', listening: '👂 सुन रहा हूँ…', speaking: '🔊 बोल रहा हूँ…', hint: 'बोलिए: "मेरे आवेदन खोलो" या "आय प्रमाणपत्र बनवाना है"', page: 'पेज', service: 'प्रमाणपत्र', app: 'आवेदन क्रमांक' },
  'en-IN': { title: 'Search & open', placeholder: 'Search anything… e.g. complaint, income certificate', speak: '🎤 Speak', stop: '■ Stop', listening: '👂 Listening…', speaking: '🔊 Speaking…', hint: 'Say: "open my applications" or "I need an income certificate"', page: 'Page', service: 'Certificate', app: 'Application no.' },
}
const ui = computed(() => UI[lang.value] || UI['mr-IN'])
</script>

<template>
  <div v-if="supported && !hidden" class="gv-wrap">
    <div v-if="open" class="gv-panel">
      <div class="gv-head">
        <strong>🔎 {{ ui.title }}</strong>
        <button type="button" class="gv-x" @click="toggle">✕</button>
      </div>

      <div class="gv-langs">
        <button v-for="l in LANGS" :key="l.code" type="button" :class="{ sel: lang === l.code }" :disabled="active"
          @click="setLang(l.code)">{{ l.label }}</button>
      </div>

      <div class="gv-search">
        <input v-model="query" type="text" :placeholder="ui.placeholder" @keyup.enter="submit" />
      </div>

      <ul v-if="results.length" class="gv-results">
        <li v-for="r in results" :key="r.key" @click="pick(r)">
          <span>{{ r.label }}</span>
          <small>{{ ui[r.kind] }}</small>
        </li>
      </ul>

      <div ref="logBox" class="gv-log">
        <p v-if="!log.length" class="gv-hint">{{ ui.hint }}</p>
        <p v-for="(l, i) in log" :key="i" :class="l.who">{{ l.text }}</p>
      </div>

      <div v-if="voiceNote" class="gv-note">⚠️ {{ voiceNote }}</div>

      <div class="gv-foot">
        <button type="button" class="gv-mic" :class="{ on: active, pulse: listening }"
          @click="active ? g.stop() : g.start()">
          {{ active ? ui.stop : ui.speak }}
        </button>
        <span class="gv-state">
          <template v-if="listening">{{ ui.listening }}</template>
          <template v-else-if="speaking">{{ ui.speaking }}</template>
        </span>
      </div>
    </div>

    <button type="button" class="gv-fab" :class="{ on: open }" :title="ui.title" @click="toggle">
      {{ open ? '✕' : '🎤' }}
    </button>
  </div>
</template>

<style scoped>
.gv-wrap { position: fixed; right: 24px; bottom: 24px; z-index: 60; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
.gv-fab { width: 58px; height: 58px; border-radius: 50%; border: 0; background: #14803c; color: #fff; font-size: 24px; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,.3); }
.gv-fab.on { background: #475569; font-size: 20px; }
.gv-panel { width: 360px; max-width: calc(100vw - 32px); max-height: 78vh; background: #fff; border-radius: 16px; box-shadow: 0 12px 34px rgba(0,0,0,.28); display: flex; flex-direction: column; overflow: hidden; }
.gv-head { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #ecfdf3; }
.gv-x { border: 0; background: transparent; font-size: 16px; cursor: pointer; color: #475569; }
.gv-langs { display: flex; gap: 6px; padding: 8px 12px 0; }
.gv-langs button { flex: 1; border: 1px solid #cbd5e1; background: #fff; border-radius: 999px; padding: 5px 0; font-size: 13px; font-weight: 600; cursor: pointer; color: #334155; }
.gv-langs button.sel { background: #14803c; border-color: #14803c; color: #fff; }
.gv-langs button:disabled { opacity: .6; cursor: not-allowed; }
.gv-search { padding: 10px 12px 4px; }
.gv-search input { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 9px 12px; font-size: 14px; outline: none; }
.gv-search input:focus { border-color: #14803c; }
.gv-results { list-style: none; margin: 0; padding: 4px 12px; max-height: 180px; overflow-y: auto; }
.gv-results li { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 14px; }
.gv-results li:hover { background: #f0fdf4; }
.gv-results small { color: #64748b; font-size: 11px; background: #f1f5f9; padding: 2px 8px; border-radius: 999px; }
.gv-log { padding: 8px 14px; overflow-y: auto; flex: 1; min-height: 70px; font-size: 14px; }
.gv-log p { margin: 0 0 8px; padding: 6px 10px; border-radius: 10px; }
.gv-log .bot { background: #f1f5f9; }
.gv-log .user { background: #dcfce7; text-align: right; }
.gv-log .gv-hint { background: transparent; color: #64748b; font-size: 13px; padding: 0; }
.gv-note { margin: 0 12px 6px; background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; font-size: 12px; padding: 6px 10px; border-radius: 10px; }
.gv-foot { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-top: 1px solid #e5e7eb; }
.gv-mic { background: #14803c; color: #fff; border: 0; border-radius: 999px; padding: 10px 20px; font-weight: 700; cursor: pointer; }
.gv-mic.on { background: #b91c1c; }
.gv-mic.pulse { animation: gvpulse 1.2s infinite; }
@keyframes gvpulse { 0% { box-shadow: 0 0 0 0 rgba(20,128,60,.55); } 100% { box-shadow: 0 0 0 14px rgba(20,128,60,0); } }
.gv-state { font-size: 13px; color: #475569; }
</style>
