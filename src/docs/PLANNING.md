# Lingua Roots — Frontend Technical Assessment
## Sprint Planning

This is a single-sprint scope covering the full lesson flow described in the assessment brief, plus two supporting screens (splash and language selection) added to give the lesson flow a realistic entry point. No UI/UX spec was provided beyond a Figma link that could not be resolved, so visual decisions (layout, color, type) are treated as designer-in-the-loop assumptions and called out per story rather than borrowed silently from any existing reference app.

**Theme decision:** a warm brown/terracotta palette with gold/amber accents was chosen based on the tones visible in the Figma screenshot shared by the interviewer, combined with African-inspired geometric pattern accents (Kente/mudcloth-style) to support the product's stated identity. This is stated here as an explicit assumption rather than inferred silently, since the full Figma file could not be reviewed in detail.

---

## Story 0a — Splash / Welcome screen

**Context**
Not in the original bullet list, but added to give the lesson flow (Stories 1–7) a realistic entry point rather than dropping the user straight into a lesson with no app identity established.

**Outcome**
On opening the app, a learner sees a branded welcome screen establishing the app's identity before choosing to proceed.

**Acceptance criteria**
1. Displays app name/wordmark, a short tagline, and a single primary CTA ("Get Started")
2. Tapping the CTA navigates to the language selection screen (Story 0b)
3. No backend/auth check — purely a static entry screen for this exercise
4. **Open gap:** brief didn't request this screen at all — included as scope addition to make the flow demoable end-to-end, flagged explicitly here rather than presented as a requirement

---

## Story 0b — Language selection screen

**Context**
Depends on Story 0a. Added for the same reason — a real product would need the learner to choose a target language before a lesson can be meaningfully mocked, even though the brief's mock data doesn't require this to function.

**Outcome**
A learner selects a language from a set of options before entering a lesson.

**Acceptance criteria**
1. Displays a grid/list of language options (mock/static list, e.g. Swahili, Yoruba, Amharic, Hausa, Zulu)
2. Tapping a language marks it selected (visually distinct); Continue is disabled until one is selected
3. Tapping Continue navigates to the lesson screen — selected language is not required to actually change lesson content in this exercise, since only one mock dataset is in scope
4. **Open gap:** selection currently has no functional effect on lesson content (single mock dataset only) — stated explicitly as a simplification, not hidden as if it were fully wired up

---

## Story 1 — Mock lesson data + question screen shell

**Context**
The sprint's headline is a learner opening a lesson and seeing a question rendered from data, with no live backend. Nothing else in this sprint works without this — it's the foundation every later story reads from.

**Outcome**
A learner opens the lesson and sees the first question's prompt rendered on screen, pulled from a local mock dataset shaped to support multiple questions in sequence.

**Acceptance criteria**
1. Mock dataset contains at least 3–5 questions, each with a prompt, an options array, and a marked correct answer
2. `LessonScreen` renders the current question's prompt text from that dataset, not hardcoded inline text
3. Screen is scrollable/responsive and doesn't clip content on a small device viewport
4. **Open gap:** no design spec defines typography scale or color tokens — assumption stated in README, not silently copied from a reference app

---

## Story 2 — Progress indicator

**Context**
Depends on Story 1's question sequence existing. The brief asks for "a progress indicator" without specifying visual form (bar vs. dots vs. fraction) or whether it should be lesson-position-based or something else (e.g. accuracy-based).

**Outcome**
A learner can see how far through the lesson they are at any point, updating as they move from question to question.

**Acceptance criteria**
1. Indicator reflects current question index out of total question count
2. Updates immediately on advancing to the next question (Story 6 dependency)
3. Visually distinguishes completed vs. remaining segments
4. **Open gap:** spec doesn't say whether progress should persist if the app is closed mid-lesson — treated as out of scope for this exercise, stated explicitly rather than assumed

---

## Story 3 — Multiple-choice options + selection state

**Context**
Depends on Story 1's options data. The spec lists "multiple-choice answer options" and "selected-answer state" as two separate bullets, implying selection is a distinct, visible interaction step before any submission/feedback happens.

**Outcome**
A learner sees all answer options for the current question and can tap one to mark it as selected, with the selection visibly distinct from unselected options, before any correctness is revealed.

**Acceptance criteria**
1. All options from the current question render as individually tappable elements
2. Tapping an option marks it visually selected; tapping a different option before submitting moves the selection (only one selected at a time)
3. No correctness feedback is shown at this stage — selection and evaluation are separate states
4. **Open gap:** spec doesn't say if re-selection is allowed after the first tap or if the first tap locks it in — assumption (re-selection allowed) documented in README

---

## Story 4 — Answer submission + correct/incorrect feedback
 
**Context**
Depends on Story 3's selection state existing. This is the core "does the learner get told the truth clearly" requirement, and the spec doesn't define what happens to the option the learner didn't pick when they're wrong.
 
**Outcome**
Once a learner submits their selected answer, they immediately see whether it was correct or incorrect, with a visible, unambiguous state on the option(s) involved.
 
**Acceptance criteria**
1. Correct submission marks the selected option in a success state (e.g. green) with confirming feedback text
2. Incorrect submission marks the selected option in an error state (e.g. red) and reveals which option was actually correct
3. Once submitted, options become non-interactive (no changing the answer after the fact)
4. **Open gap:** spec doesn't define behavior for "no answer selected" — assumption: Continue/submit is disabled until a selection is made, documented rather than inferred from any specific reference app's forgiving flow
---

## Story 5 — XP / progress update after answering
 
**Context**
Depends on Story 4's correctness result. The spec says "a simple XP/progress update" without defining the scoring rule — correct-only, partial credit, or flat participation credit are all reasonable and it doesn't say which.
 
**Outcome**
After answering, the learner sees some numeric progress value increase, giving a visible sense of reward tied to the interaction they just completed.
 
**Acceptance criteria**
1. An XP value is visible on screen at all times during the lesson
2. Value updates immediately after a correct answer is evaluated
3. Update is visually noticeable (not a silent number swap) — e.g. brief animation or highlight
4. **Open gap:** scoring rule (correct-only vs. partial credit for wrong answers) is undefined in the brief — one rule chosen and stated explicitly as an assumption, not borrowed wholesale from any specific existing app's XP model
---
 
## Story 6 — Continue → next question
 
**Context**
Depends on Story 4 (feedback must be visible first) and closes the loop back to Story 1/2 (next question renders, progress updates).
 
**Outcome**
After seeing feedback, the learner taps Continue and moves to the next question in sequence, with progress and state resetting appropriately for the new question.
 
**Acceptance criteria**
1. Continue is disabled/hidden until an answer has been submitted
2. Tapping Continue advances to the next question's data and resets selection/feedback state for that new question
3. Progress indicator (Story 2) reflects the new position immediately
4. **Open gap:** spec doesn't say whether Continue should be a full re-render or an animated transition — plain state swap chosen for this exercise, animation noted as a stretch item, not required
---
 
## Story 6a — In-session adaptive requeue
 
**Context**
Requested as a "minor algorithm" for repetition based on answering. Important distinction documented here: this is **not** spaced repetition (SM-2/Leitner-style scheduling across days, which requires persisted review history and is out of scope). This is a same-session adaptive queue — a smaller, well-known pattern that real language apps also use within a single lesson.
 
**Outcome**
Answering a question incorrectly causes it to reappear later in the same lesson session, rather than being marked done and never revisited.
 
**Acceptance criteria**
1. The lesson is modeled as a queue of question IDs, not a fixed indexed array
2. An incorrectly-answered question is re-inserted a few positions ahead in the queue (not immediately next, not appended at the very end)
3. A cap exists on re-insertion (e.g. max 1 retry per question) so a single question cannot loop indefinitely
4. Lesson completion is determined by the queue being empty, not by reaching a fixed original length
5. Progress indicator (Story 2) reflects "questions resolved" against total unique questions, not raw index position, since queue length can grow as answers come in wrong
6. **Open gap:** explicitly documented as in-session adaptive requeueing, not spaced repetition — no cross-session persistence, no review scheduling by date, stated plainly to avoid overclaiming the algorithm's sophistication

## Story 7 — End-of-lesson state (stretch, flagged not required)

**Context**
Not explicitly requested in the bullet list, but implied by "moves the user to the next question" needing a defined terminal case once questions run out. Included only if time allows.

**Outcome**
After the last question is answered and Continue is tapped, the learner sees a simple completion state rather than an error or blank screen.

**Acceptance criteria**
1. Reaching the end of the question array shows a distinct "lesson complete" state instead of crashing or looping
2. Total XP earned in the session is visible on this screen
3. **Open gap:** explicitly out of scope per the brief ("you do not need to build a complete application") — included only as a polish item, stated as such in README so it doesn't read as scope creep

---

## Explicitly out of scope for this exercise
- **Live backend / persistence beyond in-memory session state**
- **Multi-lesson navigation or dashboard beyond single lesson flow**
- **Authentication**
- **Real Speech-to-Text (STT) / Native Microphone Audio Capture**:
  - *Technical Rationale & Constraints*:
    1. **Ecosystem & Runtime Limitations**: Native speech recognition libraries (such as `@react-native-voice/voice`) require custom native bindings and cannot run inside standard Expo Go without custom development builds (`eas build` or `npx expo run:ios|android`).
    2. **Language Model Availability**: Stock mobile STT engines (Apple Speech / Android SpeechRecognizer) lack reliable acoustic models and tonal recognition for low-resource indigenous African languages (Yoruba, Igbo, Hausa).
    3. **Cloud API & Security Boundaries**: Integrating third-party cloud STT (e.g. OpenAI Whisper or Google Cloud Speech) requires client-side secret exposure or a dedicated backend proxy pipeline (audio buffer streaming, chunking, and latency overhead), which exceeds the frontend scope of this assessment.
    4. **Assessment Alignment**: The brief explicitly outlines audio and speech as mockable interactions ("🔊 tap to hear" and simulated speak). Simulating the UI interaction provides predictable, cross-platform reviewability without hardware permission blockers.
- **Localization/i18n implementation** (acknowledged as a future concern given the product's multi-language target market, not built here)

## Screen map
1. Splash / Welcome (Story 0a)
2. Language Selection (Story 0b)
3. Lesson Screen (Stories 1–6, optional 7)
