// data/mockLessons.ts


export type BaseQuestion = {
    id: string;
    xp: number;
};

export type MultipleChoiceQuestion = BaseQuestion & {
    type: 'multiple_choice' | 'fill_in_blank';
    prompt: string;
    options: string[];
    correctAnswer: string;
};

export type WordBankQuestion = BaseQuestion & {
    type: 'word_bank';
    englishPrompt: string;
    wordBank: string[];
    correctOrder: string[];
};

export type ListenAndTypeQuestion = BaseQuestion & {
    type: 'listen_and_type';
    audioLabel: string; // what the mock "audio" represents — no real audio file required
    correctAnswer: string; // compared case/whitespace-insensitively
    wordBank?: string[]; // word pills for Duolingo-style pill assembly
};

export type MatchPairsQuestion = BaseQuestion & {
    type: 'match_pairs';
    pairs: { source: string; target: string }[];
};

export type Question =
    | MultipleChoiceQuestion
    | WordBankQuestion
    | ListenAndTypeQuestion
    | MatchPairsQuestion;

export type LanguageId = 'sw' | 'yo' | 'ig' | 'ha';

export const mockLessons: Record<LanguageId, Question[]> = {
    // ---- Swahili ----
    sw: [
        {
            id: 'sw-mc-1',
            type: 'multiple_choice',
            xp: 10,
            prompt: 'How do you say "Hello" in Swahili?',
            options: ['Jambo', 'Habari', 'Asante', 'Karibu'],
            correctAnswer: 'Jambo',
        },
        {
            id: 'sw-fib-1',
            type: 'fill_in_blank',
            xp: 10,
            prompt: '"___" is how you say "Thank you"',
            options: ['Karibu', 'Asante', 'Jambo', 'Habari'],
            correctAnswer: 'Asante',
        },
        {
            id: 'sw-wb-1',
            type: 'word_bank',
            xp: 15,
            englishPrompt: 'My name is John',
            wordBank: ['jina', 'ni', 'langu', 'John', 'habari', 'karibu'],
            correctOrder: ['jina', 'langu', 'ni', 'John'],
        },
        {
            id: 'sw-lt-1',
            type: 'listen_and_type',
            xp: 15,
            audioLabel: 'Jambo',
            correctAnswer: 'Jambo',
            wordBank: ['Jambo', 'Habari', 'Asante', 'Karibu'],
        },
        {
            id: 'sw-mp-1',
            type: 'match_pairs',
            xp: 20,
            pairs: [
                { source: 'Jambo', target: 'Hello' },
                { source: 'Asante', target: 'Thank you' },
                { source: 'Karibu', target: 'Welcome' },
            ],
        },
    ],

    // ---- Yoruba ----
    yo: [
        {
            id: 'yo-mc-1',
            type: 'multiple_choice',
            xp: 10,
            prompt: 'How do you say "Thank you" in Yoruba?',
            options: ['Ẹ ṣé', 'Káàbọ̀', 'Báwo ni', 'Dáadáa'],
            correctAnswer: 'Ẹ ṣé',
        },
        {
            id: 'yo-fib-1',
            type: 'fill_in_blank',
            xp: 10,
            prompt: '"___" means "Welcome" in Yoruba',
            options: ['Káàbọ̀', 'Ẹ ṣé', 'Báwo ni', 'Dáadáa'],
            correctAnswer: 'Káàbọ̀',
        },
        {
            id: 'yo-wb-1',
            type: 'word_bank',
            xp: 15,
            englishPrompt: 'My name is John',
            wordBank: ['Orúkọ', 'mi', 'ni', 'John', 'Káàbọ̀', 'Báwo'],
            correctOrder: ['Orúkọ', 'mi', 'ni', 'John'],
        },
        {
            id: 'yo-lt-1',
            type: 'listen_and_type',
            xp: 15,
            audioLabel: 'Báwo ni',
            correctAnswer: 'Báwo ni',
            wordBank: ['Báwo', 'ni', 'Ẹ', 'ṣé', 'Káàbọ̀'],
        },
        {
            id: 'yo-mp-1',
            type: 'match_pairs',
            xp: 20,
            pairs: [
                { source: 'Ẹ ṣé', target: 'Thank you' },
                { source: 'Káàbọ̀', target: 'Welcome' },
                { source: 'Dáadáa', target: 'Fine' },
            ],
        },
    ],

    // ---- Igbo ----
    ig: [
        {
            id: 'ig-mc-1',
            type: 'multiple_choice',
            xp: 10,
            prompt: 'How do you say "Welcome" in Igbo?',
            options: ['Nnọọ', 'Ndewo', 'Kedụ', 'Daalụ'],
            correctAnswer: 'Nnọọ',
        },
        {
            id: 'ig-fib-1',
            type: 'fill_in_blank',
            xp: 10,
            prompt: '"___" means "Thank you" in Igbo',
            options: ['Daalụ', 'Nnọọ', 'Kedụ', 'Biko'],
            correctAnswer: 'Daalụ',
        },
        {
            id: 'ig-wb-1',
            type: 'word_bank',
            xp: 15,
            englishPrompt: 'My name is John',
            wordBank: ['Aha', 'm', 'bụ', 'John', 'Nnọọ', 'Kedụ'],
            correctOrder: ['Aha', 'm', 'bụ', 'John'],
        },
        {
            id: 'ig-lt-1',
            type: 'listen_and_type',
            xp: 15,
            audioLabel: 'Ndewo',
            correctAnswer: 'Ndewo',
            wordBank: ['Ndewo', 'Nnọọ', 'Daalụ', 'Kedụ'],
        },
        {
            id: 'ig-mp-1',
            type: 'match_pairs',
            xp: 20,
            pairs: [
                { source: 'Nnọọ', target: 'Welcome' },
                { source: 'Daalụ', target: 'Thank you' },
                { source: 'Kedụ', target: 'How are you' },
            ],
        },
    ],

    // ---- Hausa ----
    ha: [
        {
            id: 'ha-mc-1',
            type: 'multiple_choice',
            xp: 10,
            prompt: 'How do you say "Thank you" in Hausa?',
            options: ['Na gode', 'Sannu', 'Lafiya', 'Sannu da zuwa'],
            correctAnswer: 'Na gode',
        },
        {
            id: 'ha-fib-1',
            type: 'fill_in_blank',
            xp: 10,
            prompt: '"___" means "Hello" in Hausa',
            options: ['Sannu', 'Na gode', 'Lafiya', 'Sannu da zuwa'],
            correctAnswer: 'Sannu',
        },
        {
            id: 'ha-wb-1',
            type: 'word_bank',
            xp: 15,
            englishPrompt: 'My name is Ben',
            wordBank: ['Suna', 'na', 'Ben', 'Sannu', 'Lafiya'],
            correctOrder: ['Suna', 'na', 'Ben'],
        },
        {
            id: 'ha-lt-1',
            type: 'listen_and_type',
            xp: 15,
            audioLabel: 'Sannu',
            correctAnswer: 'Sannu',
            wordBank: ['Sannu', 'Na', 'gode', 'Lafiya'],
        },
        {
            id: 'ha-mp-1',
            type: 'match_pairs',
            xp: 20,
            pairs: [
                { source: 'Sannu', target: 'Hello' },
                { source: 'Na gode', target: 'Thank you' },
                { source: 'Lafiya', target: 'Fine' },
            ],
        },
    ],
};