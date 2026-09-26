import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Question,
    MultipleChoiceQuestion,
    WordBankQuestion,
    ListenAndTypeQuestion,
    MatchPairsQuestion,
} from '../../data/mockLessons';
import { MultipleChoiceQuestionView } from './MultipleChoiceQuestionView';
import { WordBankQuestionView } from './WordBankQuestionView';
import { ListenAndTypeQuestionView } from './ListenAndTypeQuestionView';
import { MatchPairsQuestionView } from './MatchPairsQuestionView';

interface QuestionRendererProps {
    question: Question;
    selectedOption: string | null;
    onSelectOption: (option: string) => void;
    selectedWords: string[];
    onWordsChange: (words: string[]) => void;
    matchedPairsCount: number;
    onMatchProgress: (matchedCount: number, totalCount: number) => void;
    isSubmitted: boolean;
    isCorrect: boolean | null;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
    question,
    selectedOption,
    onSelectOption,
    selectedWords,
    onWordsChange,
    matchedPairsCount,
    onMatchProgress,
    isSubmitted,
    isCorrect,
}) => {
    return (
        <View style={styles.container}>
            {(() => {
                switch (question.type) {
                    case 'multiple_choice':
                    case 'fill_in_blank':
                        return (
                            <MultipleChoiceQuestionView
                                key={question.id}
                                question={question as MultipleChoiceQuestion}
                                selectedOption={selectedOption}
                                onSelectOption={onSelectOption}
                                isSubmitted={isSubmitted}
                                isCorrect={isCorrect}
                            />
                        );

                    case 'word_bank':
                        return (
                            <WordBankQuestionView
                                key={question.id}
                                question={question as WordBankQuestion}
                                selectedWords={selectedWords}
                                onWordsChange={onWordsChange}
                                isSubmitted={isSubmitted}
                                isCorrect={isCorrect}
                            />
                        );

                    case 'listen_and_type':
                        return (
                            <ListenAndTypeQuestionView
                                key={question.id}
                                question={question as ListenAndTypeQuestion}
                                selectedWords={selectedWords}
                                onWordsChange={onWordsChange}
                                isSubmitted={isSubmitted}
                                isCorrect={isCorrect}
                            />
                        );

                    case 'match_pairs':
                        return (
                            <MatchPairsQuestionView
                                key={question.id}
                                question={question as MatchPairsQuestion}
                                matchedPairsCount={matchedPairsCount}
                                onMatchProgress={onMatchProgress}
                                isSubmitted={isSubmitted}
                                isCorrect={isCorrect}
                            />
                        );

                    default:
                        return null;
                }
            })()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
