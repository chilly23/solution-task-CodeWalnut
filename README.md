# timer app - submission guide

---

## how to run

```bash
npm install
npm run dev
# open http://localhost:5173

npm test        # run tests
npm run build   # production build
```

---

## file structure to create/replace

```
src/
  types/
    timer.ts                ← replaced with new version
  store/
    usetimerstore.ts        ← replaced with new version
  utils/
    time.ts                 ← replaced with new version
    validation.ts           ← replaced with new version
    audio.ts                ← replaced with new version
    validation.test.ts      ← new file
    audio.test.ts           ← new file
  components/
    modalbuttons.tsx         ← NEW (reusable modal buttons)
    timermodal.tsx           ← NEW (replaces AddTimerModal + EditTimerModal)
    timeritem.tsx            ← replaced with new version
    timerlist.tsx            ← replaced with new version
    timerprogress.tsx        ← replaced with new version
    timercontrols.tsx        ← replaced with new version
    emptystate.tsx           ← replaced with new version
    navigationcontent.tsx    ← replaced with new version
  pages/
    home.tsx                ← replaced with new version
    timer.tsx               ← replaced with new version
    stopwatch.tsx           ← replaced with new version (was empty!)
  app.tsx                   ← replaced with new version
  index.css                 ← replaced with new version
  setuptest.ts              ← NEW (for vitest + jest-dom)
vite.config.ts              ← already has test config
```

---

## what each file does / what changed

### `src/types/timer.ts`
- renamed fields to lowercase: `remainingtime`, `isrunning`, `createdat`

---

### `src/store/usetimerstore.ts`
**changes:**
added `loadstate()` - reads timers from localstorage on startup, added `savestate()` - called after every mutation to persist timers, fixed `updatetimer` - each timer ticks independently (simultaneous timers now work), all action names lowercase

---

### `src/utils/time.ts`
**changes:** `formattime()` - same as before (renamed lowercase), added `formatstopwatch()` - shows `mm:ss.mmm` format for stopwatch

---

### `src/utils/validation.ts` 
same logic, renamed to lowercase, toast messages lowercased

---

### `src/utils/audio.ts`
**changes:** added looping: sound keeps playing until `stop()` is called, this makes the snackbar dismiss button actually stop the sound, fixed the console error on dismiss (was calling `.stop()` on already-stopped oscillator)

---

### `src/components/modalbuttons.tsx` ← NEW
extracted cancel + submit buttons into reusable component, takes `onclose`, `isvalid`, `submitlabel` as props, used in `timermodal.tsx`

---

### `src/components/timermodal.tsx` ← NEW (replaces add + edit modals)
single modal that handles both add and edit, if `timer` prop is passed → edit mode; if not → add mode, uses `modalbuttons` component, always runs `validatetimerform` on submit and shows toast errors

---

### `src/components/timeritem.tsx`
**changes:** interval is now per-timer (simultaneous timers work), toast `duration: infinity` - stays until dismissed, `onDismiss` and `onAutoClose` callbacks both call `audio.stop()`, fixed console error: audio cleanup is safe now

---

### `src/pages/stopwatch.tsx` ← was empty, now full implementation
uses `requestanimationframe` for accurate timing, start, stop, resume, lap, reset shows lap list with individual lap time + total time, lap button disabled when not running

---

### `src/pages/home.tsx`
**changes:** desktop: sidebar navigation (already existed), mobile: bottom navigation bar (new), snackbar position: `top-right` on desktop, `bottom-center` on mobile

---

### `src/index.css`
**changes:** added google font `Tinos` via `@import`, applied to all elements via `* { font-family: 'Tinos', serif; }`

---

### `index.html`
- already has favicon: `<link rel="icon" href="/icons/clock.svg" />` ✓

---

## tests written

| file | what's tested |
|------|--------------|
| `validation.test.ts` | empty title, too long title, zero time, seconds >59, minutes >59, exceeds 24h, valid input |
| `audio.test.ts` | singleton, play, cleanup |
| `stopwatch.test.tsx` | start, stop, resume, lap, reset, lap disabled when stopped |

---

## things to delete
- `src/components/AddTimerModal.tsx`
- `src/components/EditTimerModal.tsx`

(they are replaced by `timermodal.tsx`)

---
