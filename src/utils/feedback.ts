import {
    ListenAndTypeQuestion,
    MultipleChoiceQuestion,
    Question,
    WordBankQuestion,
} from '../data/mockLessons';

export interface FeedbackDetails {
    correctAnswerText: string;
    explanation: string;
}

/**
 * Derives the correct answer text and explanation for a question to display in the FeedbackSheet.
 */
export function getFeedbackDetails(question: Question | null): FeedbackDetails {
    if (!question) return { correctAnswerText: '', explanation: '' };

    switch (question.type) {
        case 'multiple_choice':
        case 'fill_in_blank': {
            const q = question as MultipleChoiceQuestion;
            return {
                correctAnswerText: q.correctAnswer,
                explanation: `${q.correctAnswer} is the correct translation!`,
            };
        }
        case 'word_bank': {
            const q = question as WordBankQuestion;
            const orderStr = q.correctOrder.join(' ');
            return {
                correctAnswerText: orderStr,
                explanation: `"${orderStr}" correctly translates "${q.englishPrompt}"`,
            };
        }
        case 'listen_and_type': {
            const q = question as ListenAndTypeQuestion;
            return {
                correctAnswerText: q.correctAnswer,
                explanation: `"${q.correctAnswer}" is what was spoken!`,
            };
        }
        case 'match_pairs':
            return {
                correctAnswerText: 'All pairs matched',
                explanation: 'All vocabulary pairs matched successfully!',
            };
        default:
            return { correctAnswerText: '', explanation: '' };
    }
}
