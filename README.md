# Lingua Roots — Frontend Technical Assessment

A mobile lesson-flow prototype for an African-language learning app, built in React Native (Expo). Learners pick a language, work through a short lesson made of five different question types, earn XP with animated feedback, and land on a completion screen with a small "level map" teaser.

Full sprint planning, user stories, and every deliberate scope decision (including the ones that go beyond the original brief) are documented in [`PLANNING.md`](./PLANNING.md) — this README covers what you need to run it and the highlights of *why* things are built the way they are.

---

## Getting started

**Requirements:** Node 18+, and either the Expo Go app on a physical device or an iOS Simulator / Android Emulator.

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go, or press `i` / `a` in the terminal to launch a simulator.

No environment variables, no backend, no API keys — everything runs on local mock data.

---

## What's implemented

- **Splash → language selection → lesson flow**, using Expo Router's file-based routing
- **4 languages** with real, distinct mock content: Swahili, Yoruba, Igbo, Hausa
- **5 question types** per language: multiple choice, fill-in-the-blank, word bank, listen-and-type, match pairs
- **XP system** with an animated "+XP" popup on correct answers, and a progress bar that always fills to 100% by lesson end
- **In-session adaptive requeue** — get a question wrong, and it comes back later in the same lesson rather than being marked done and skipped
- **Completion screen** with a level-map preview (Level 1 complete, further levels shown locked)

---

## Key technical decisions

**Routing:** Flat file-based structure via Expo Router (`app/index.tsx`, `app/language-select.tsx`, `app/lesson.tsx`) — no `(tabs)` or `(auth)` route groups, since the flow is linear and there's no persistent navigation or authentication in scope.

**State management:** The lesson itself is modeled as a state machine via `useReducer` (`hooks/useLessonProgress.ts`), not scattered `useState` calls. The lesson is a **queue of question IDs**, not a fixed array + index — this is what makes the adaptive requeue possible: a wrong answer re-inserts its ID a few positions ahead in the queue rather than advancing past it. Progress is driven by `resolvedCount / totalCount`, not raw queue position, so the bar only ever moves forward.

**Theming:** Colors and typography are deliberately split into separate files (`theme/colors.ts`, `theme/typography.ts`) rather than one theme blob, and every component reads from these tokens rather than hardcoding hex values or font sizes. Base palette and font choices were pulled from a Stitch design export provided as reference.

**Question-type architecture:** Each question type has its own rendering component, composed under a shared `QuestionRenderer`, all sitting inside the same outer shell (progress bar, XP badge, Continue button) so there's no duplicated chrome per type. Correctness checking is centralized in one utility (`utils/checkAnswer.ts`) rather than duplicated per component.

**Adaptive requeue vs. spaced repetition:** Explicitly **not** real spaced repetition (which would need cross-session persistence and date-based scheduling). This is a same-session queue reinsertion — a smaller, well-scoped pattern that's fully demoable without a backend.

**Mock data over live backend:** All lesson and language content lives in `data/mockLessons.ts` and `data/languages.ts`. No network calls, no auth, per the brief.

---

## Scope decisions worth knowing about

A few things were deliberately expanded beyond the original brief's bullet list — flagged here explicitly rather than presented as if they'd always been required:

- **5 question types instead of a single generic "multiple choice"** — a bigger surface than strictly asked for, included to demonstrate range across component design and state handling.
- **Language selection is functional**, not cosmetic — each of the 4 languages has its own real (if small) question set.
- **The in-session adaptive requeue** and **the end-of-lesson level map** were both added on top of the brief's explicit requirements as polish/demonstration pieces.

Full context and acceptance criteria for every decision — including the ones that were *considered and deliberately left out* — are in `PLANNING.md`.

---

## Known limitations / explicitly out of scope

- **No persistence.** XP and progress reset on app restart — there's no `AsyncStorage` or backend. Worth adding first if this were taken further.
- **"Listen" audio is mocked.** No real audio playback or speech recognition — matches the brief's instruction to use mock data rather than live services.
- **Translations were sourced and cross-checked from online references, not a native speaker.** Given the cultural weight of the product's premise, I'd want a native-speaker review pass on the Yoruba, Igbo, and Hausa content before this went anywhere near production.
- **The level map is entirely decorative.** Only Level 1 has real content; Levels 2–5 are locked, non-interactive placeholders.
- **No automated tests.** Given the scope and timeframe, testing wasn't prioritized — happy to talk through what I'd cover first (the reducer's requeue logic is the highest-value target).

---

## Project structure

```
src/
  app/
    _layout.tsx                   Expo Router root layout (navigation shell)
    index.tsx                     splash / onboarding screen
    language-select.tsx           language picker
    lesson.tsx                    lesson flow orchestrator + completion handoff

  components/
    Button.tsx                    shared primary/secondary button
    CultureGreetingBanner.tsx     contextual greeting card shown during lesson
    FeedbackSheet.tsx             bottom sheet feedback (correct / incorrect)
    LessonCompletedView.tsx       end-of-lesson celebration screen
    LevelPath.tsx                 decorative level map (Levels 1–5)
    ProgressBarHeader.tsx         progress bar, XP badge, XP-gain popup

    questions/                    one file per question type
      QuestionRenderer.tsx        type dispatcher — routes to the right view
      MultipleChoiceQuestionView.tsx   multiple_choice + fill_in_blank
      WordBankQuestionView.tsx         word_bank (tap-to-build sentence)
      ListenAndTypeQuestionView.tsx    listen_and_type (mock audio + pills)
      MatchPairsQuestionView.tsx       match_pairs (two-column tile matching)

  data/
    languages.ts                  supported language metadata
    mockLessons.ts                hard-coded questions for all 4 languages
    levels.ts                     level map node definitions

  docs/
    PLANNING.md                   full sprint plan, user stories, and scope log

  hooks/
    UseLessonProgress.ts          lesson state machine (reducer + queue logic)

  theme/
    colors.ts                     design-system colour tokens
    typography.ts                 font families, sizes, and weights

  utils/
    checkAnswer.ts                per-question-type correctness logic
    feedback.ts                   derives correct-answer text + explanation
```