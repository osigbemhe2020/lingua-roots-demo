// hooks/useLessonProgress.ts
//
// Drives Stories 2, 5, and 6a together — progress bar fill, XP totals
// and the +XP trigger, and the in-session adaptive requeue.
//
// Design notes:
// - `queue` is the source of truth for ordering, not a fixed index.
//   Story 6a (adaptive requeue) needs this: a wrong answer re-inserts
//   the question ID a few positions ahead rather than advancing past it.
// - `resolvedCount` (not queue position) drives the progress bar, since
//   the queue can temporarily grow when a question is requeued. The bar
//   always reaches 100% at lesson end — a requeued question still counts
//   once fully resolved (correct, or retries exhausted).
// - `lastXpGained` carries a unique `triggerId`, not just the XP amount.
//   If we stored only the number, two consecutive +10 XP answers
//   wouldn't produce a new value, so the popup animation wouldn't
//   replay on the second one. The triggerId guarantees a state change
//   every time, which is what the component's useEffect watches.

import { useMemo, useReducer } from 'react';
import { LanguageId, mockLessons, Question } from '../data/mockLessons';

const MAX_RETRIES = 1; // a question can be requeued once before we let it go
const REQUEUE_OFFSET = 3; // how many positions ahead to reinsert a missed question

type AnswerState = 'idle' | 'submitted_correct' | 'submitted_incorrect';

type State = {
    queue: string[];
    attempts: Record<string, number>;
    resolvedCount: number;
    totalCount: number;
    currentQuestionId: string | null;
    selectedAnswer: unknown;
    answerState: AnswerState;
    totalXp: number;
    lastXpGained: { amount: number; triggerId: string } | null;
};

type Action =
    | { type: 'SELECT_ANSWER'; payload: unknown }
    | { type: 'SUBMIT_ANSWER'; payload: { isCorrect: boolean; xp: number } }
    | { type: 'CONTINUE' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SELECT_ANSWER':
            return { ...state, selectedAnswer: action.payload };

        case 'SUBMIT_ANSWER': {
            const { isCorrect, xp } = action.payload;
            return {
                ...state,
                answerState: isCorrect ? 'submitted_correct' : 'submitted_incorrect',
                totalXp: isCorrect ? state.totalXp + xp : state.totalXp,
                // only correct answers trigger the popup — a new triggerId every
                // time so the animation replays even on repeated identical amounts
                lastXpGained: isCorrect
                    ? { amount: xp, triggerId: `${state.currentQuestionId}-${Date.now()}` }
                    : state.lastXpGained,
            };
        }

        case 'CONTINUE': {
            const currentId = state.currentQuestionId;
            if (!currentId) return state;

            const [, ...rest] = state.queue;
            let newQueue = rest;
            let newAttempts = state.attempts;
            let newResolvedCount = state.resolvedCount;

            if (state.answerState === 'submitted_incorrect') {
                const attemptsSoFar = state.attempts[currentId] ?? 0;
                if (attemptsSoFar < MAX_RETRIES) {
                    // requeue a few positions ahead, not immediately next
                    const insertAt = Math.min(REQUEUE_OFFSET, newQueue.length);
                    newQueue = [
                        ...newQueue.slice(0, insertAt),
                        currentId,
                        ...newQueue.slice(insertAt),
                    ];
                    newAttempts = { ...state.attempts, [currentId]: attemptsSoFar + 1 };
                    // not resolved yet — will count when it comes back around
                } else {
                    // retries exhausted — still counts as resolved so the bar
                    // can reach 100% and the lesson can end
                    newResolvedCount += 1;
                }
            } else {
                newResolvedCount += 1;
            }

            return {
                ...state,
                queue: newQueue,
                attempts: newAttempts,
                resolvedCount: newResolvedCount,
                currentQuestionId: newQueue[0] ?? null,
                selectedAnswer: null,
                answerState: 'idle',
            };
        }

        default:
            return state;
    }
}

export function useLessonProgress(languageId: LanguageId) {
    const questions: Question[] = mockLessons[languageId];

    const [state, dispatch] = useReducer(reducer, undefined, (): State => ({
        queue: questions.map((q) => q.id),
        attempts: {},
        resolvedCount: 0,
        totalCount: questions.length,
        currentQuestionId: questions[0]?.id ?? null,
        selectedAnswer: null,
        answerState: 'idle',
        totalXp: 0,
        lastXpGained: null,
    }));

    const currentQuestion = useMemo(
        () => questions.find((q) => q.id === state.currentQuestionId) ?? null,
        [questions, state.currentQuestionId]
    );

    const isComplete = state.currentQuestionId === null;

    return {
        state,
        dispatch,
        currentQuestion,
        isComplete,
        progress: state.totalCount === 0 ? 0 : state.resolvedCount / state.totalCount,
    };
}