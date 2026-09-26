

import { Question } from '../data/mockLessons';

// The shape of "what the learner did" varies by type too — a single
// selected string, an ordered array, or a set of matched pairs.
export type UserAnswer =
    | { type: 'multiple_choice' | 'fill_in_blank'; value: string }
    | { type: 'word_bank'; value: string[] }
    | { type: 'listen_and_type'; value: string }
    | { type: 'match_pairs'; value: { source: string; target: string }[] };

export function checkAnswer(question: Question, answer: UserAnswer): boolean {
    switch (question.type) {
        case 'multiple_choice':
        case 'fill_in_blank': {
            if (answer.type !== question.type) return false;
            return answer.value === question.correctAnswer;
        }

        case 'word_bank': {
            if (answer.type !== 'word_bank') return false;
            if (answer.value.length !== question.correctOrder.length) return false;
            return answer.value.every((word, i) => word === question.correctOrder[i]);
        }

        case 'listen_and_type': {
            if (answer.type !== 'listen_and_type') return false;
            // case/whitespace-insensitive — see PLANNING.md Story 1a open gap
            const normalize = (s: string) => s.trim().toLowerCase();
            return normalize(answer.value) === normalize(question.correctAnswer);
        }

        case 'match_pairs': {
            if (answer.type !== 'match_pairs') return false;
            if (answer.value.length !== question.pairs.length) return false;
            return answer.value.every((matched) =>
                question.pairs.some(
                    (pair) => pair.source === matched.source && pair.target === matched.target
                )
            );
        }

        default:
            return false;
    }
}