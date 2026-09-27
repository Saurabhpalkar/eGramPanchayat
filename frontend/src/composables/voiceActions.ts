// frontend/src/composables/voiceActions.ts
//
// The typed action contract between the global voice assistant (useGlobalVoice.ts,
// which only knows about routes) and individual pages (which know their own real
// search/filter/form state). This is what lets a voice command do more than
// navigate: "APP505122 शोधा" both opens /citizen/applications AND tells that page
// to actually run its search.
//
// Why reactive state instead of a DOM CustomEvent: a CustomEvent is fire-and-forget,
// so if the target page hasn't mounted its listener yet (e.g. immediately after
// router.push), the event is lost and you're forced into a setTimeout guess. A
// small reactive object has no such race — a page that mounts a moment later can
// still read the pending action, and a page that's already mounted reacts to the
// change immediately via `watch`. No setTimeout needed either way.
import { reactive } from 'vue'

export type VoiceAction =
  | { type: 'NAVIGATE'; route: string }
  | { type: 'SEARCH_APPLICATION'; query: string }
  | { type: 'FOCUS_SEARCH' }
  | { type: 'START_APPLICATION'; serviceQuery: string }
  | { type: 'OPEN_PROFILE' }
  | { type: 'NEXT_FORM_STEP' }
  | { type: 'PREVIOUS_FORM_STEP' }
  | { type: 'PAY_APPLICATION'; appNo: string }
  | { type: 'CONFIRM' }
  | { type: 'CANCEL' }

const state = reactive<{ action: VoiceAction | null; seq: number }>({ action: null, seq: 0 })

/** Called by useGlobalVoice.ts when a voice command needs a page to do something real. */
export function dispatchVoiceAction(action: VoiceAction) {
  state.action = action
  state.seq++
}

/** Called by the consuming page once it has handled the action. */
export function clearVoiceAction() {
  state.action = null
}

/** The consuming page reads this — check `.action?.type`, and re-run on `.seq` changes via `watch`. */
export function voiceActionState() {
  return state
}

/**
 * Recommended pattern for a page that consumes an action (e.g. CitizenApplications.vue):
 *
 *   import { voiceActionState, clearVoiceAction } from '@/composables/voiceActions'
 *   import { watch, onMounted } from 'vue'
 *
 *   function handleVoiceAction() {
 *     const a = voiceActionState().action
 *     if (a?.type === 'SEARCH_APPLICATION') {
 *       yourSearchRef.value = a.query        // use YOUR real search variable
 *       runYourExistingFilter()              // reuse the existing filter logic, don't duplicate it
 *       clearVoiceAction()
 *     } else if (a?.type === 'FOCUS_SEARCH') {
 *       searchInputEl.value?.focus()
 *       clearVoiceAction()
 *     }
 *   }
 *   onMounted(handleVoiceAction)                       // action arrived just before this page mounted
 *   watch(() => voiceActionState().seq, handleVoiceAction) // action arrives while already on this page
 */

/** Poll until `check()` is truthy or `tries` is exhausted. Use for "wait until data has loaded". */
export async function waitFor(check: () => boolean, { tries = 50, delayMs = 100 } = {}) {
  for (let i = 0; i < tries; i++) {
    if (check()) return true
    await new Promise((r) => setTimeout(r, delayMs))
  }
  return check()
}

/**
 * Best-effort role lookup, reusing the project's own auth composable rather than a
 * second auth system. Tries a few common field names since the exact one wasn't
 * confirmed; returns null (never throws) if it can't determine a role, in which
 * case the caller should fall back to route-based area detection.
 */
export async function currentUserArea(): Promise<'/citizen' | '/staff' | '/admin' | '/superadmin' | null> {
  try {
    const mod = await import('./useAuth')
    const { user } = mod.useAuth()
    const u = user?.value ?? user
    if (!u) return null
    const raw = String(u.role ?? u.user_role ?? u.userType ?? u.user_type ?? u.type ?? '').toLowerCase()
    if (raw.includes('superadmin') || raw.includes('super_admin') || raw.includes('super admin')) return '/superadmin'
    if (raw.includes('admin')) return '/admin'
    if (raw.includes('staff')) return '/staff'
    if (raw.includes('citizen')) return '/citizen'
    return null
  } catch {
    return null
  }
}
