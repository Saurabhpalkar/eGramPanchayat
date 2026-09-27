// @ts-nocheck
// frontend/src/composables/speechCore.ts
// Shared low-level speech engine used by both useVoiceAssistant.ts and useGlobalVoice.ts.
//
// Why this exists: the old code used continuous:false speech recognition, which the
// browser cuts off after a very short pause. That is what caused "mobile number
// sarkh sarkh vicharte" — the user was still speaking (e.g. reading 10 digits with
// small pauses between them) and the mic had already stopped, so only part of the
// number was captured, parsing failed, and the same question was asked again.
//
// Fix: continuous + interim results, with our OWN silence timer that we control
// (silenceMs). The mic only stops after that much real silence, not after the
// browser's own (much shorter, non-configurable) heuristic. A small pauseBeforeMs
// also gives the person a breath before the mic starts listening.
import { ref } from 'vue'

const SR = window.SpeechRecognition || window.webkitSpeechRecognition
export const speechSupported = !!SR && 'speechSynthesis' in window

/**
 * @param {Object} o
 * @param {import('vue').Ref<string>} o.lang        BCP-47 code, e.g. 'mr-IN'
 * @param {Function} [o.push]                       (who: 'bot'|'user', text: string) => void, for a visible log
 * @param {Function} [o.pickVoice]                   (langCode: string) => SpeechSynthesisVoice | null
 */
export function makeSpeech({ lang, push, pickVoice }) {
  const listening = ref(false)
  const speaking = ref(false)
  let recognition = null
  let stopped = true // true until start()/reset() is called by the owning composable

  function reset() { stopped = false }
  function haltAll() {
    stopped = true
    listening.value = false
    try { recognition?.abort() } catch {}
    recognition = null
  }
  function cancelSpeech() {
    speaking.value = false
    try { window.speechSynthesis?.cancel() } catch {}
  }

  /** Speak text and resolve only once speaking has actually finished. */
  function say(text) {
    push?.('bot', text)
    return new Promise(resolve => {
      if (stopped || !('speechSynthesis' in window)) return resolve()
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const v = pickVoice ? pickVoice(lang.value) : null
      if (v) { u.voice = v; u.lang = v.lang } else u.lang = lang.value
      u.rate = 0.9
      u.pitch = 1
      u.onstart = () => (speaking.value = true)
      u.onend = u.onerror = () => { speaking.value = false; resolve() }
      window.speechSynthesis.speak(u)
    })
  }

  /**
   * Listen for one utterance. Keeps listening through short pauses (between
   * digits, between words) and only stops after `silenceMs` of real silence,
   * or after `maxMs` no matter what (safety cap).
   */
  function listen({ silenceMs = 2200, maxMs = 16000, pauseBeforeMs = 450 } = {}) {
    return new Promise(resolve => {
      if (stopped) return resolve('')
      const begin = () => {
        if (stopped) return resolve('')
        let rec
        try { rec = new SR() } catch { return resolve('') }
        recognition = rec
        rec.lang = lang.value
        rec.continuous = true
        rec.interimResults = true
        rec.maxAlternatives = 1

        let finalText = ''
        let interimText = ''
        let silenceTimer = null
        let maxTimer = null
        let finished = false

        const finish = () => {
          if (finished) return
          finished = true
          clearTimeout(silenceTimer); clearTimeout(maxTimer)
          try { rec.stop() } catch {}
        }
        const bump = () => { clearTimeout(silenceTimer); silenceTimer = setTimeout(finish, silenceMs) }

        rec.onstart = () => { listening.value = true; bump() }
        rec.onresult = (e) => {
          let interim = ''
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const seg = e.results[i][0].transcript
            if (e.results[i].isFinal) finalText += (finalText ? ' ' : '') + seg
            else interim += seg
          }
          interimText = interim
          bump() // more speech arrived -> push the silence deadline forward
        }
        rec.onerror = () => {}
        rec.onend = () => {
          listening.value = false
          const text = (finalText || interimText).trim()
          if (text) push?.('user', text)
          resolve(text)
        }
        maxTimer = setTimeout(finish, maxMs)
        try { rec.start() } catch { resolve('') }
      }
      if (pauseBeforeMs > 0) setTimeout(begin, pauseBeforeMs)
      else begin()
    })
  }

  return { listening, speaking, say, listen, reset, haltAll, cancelSpeech }
}
