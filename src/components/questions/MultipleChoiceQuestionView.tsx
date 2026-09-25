import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts, fontSize } from '../../theme/typography';
import { MultipleChoiceQuestion } from '../../data/mockLessons';

interface MultipleChoiceQuestionViewProps {
    question: MultipleChoiceQuestion;
    selectedOption: string | null;
    onSelectOption: (option: string) => void;
    isSubmitted: boolean;
    isCorrect: boolean | null;
}

export const MultipleChoiceQuestionView: React.FC<MultipleChoiceQuestionViewProps> = ({
    question,
    selectedOption,
    onSelectOption,
    isSubmitted,
    isCorrect,
}) => {
    const isFillInBlank = question.type === 'fill_in_blank';

    // Renders the prompt with an interactive/highlighted blank slot if fill_in_blank
    const renderPrompt = () => {
        if (isFillInBlank && question.prompt.includes('___')) {
            const parts = question.prompt.split('___');
            return (
                <View style={styles.fibPromptContainer}>
                    <Text style={styles.questionPromptText}>
                        {parts[0]}
                        <Text
                            style={[
                                styles.fibBlankSlot,
                                selectedOption && styles.fibBlankFilled,
                                isSubmitted && isCorrect && styles.fibBlankCorrect,
                                isSubmitted && !isCorrect && styles.fibBlankWrong,
                            ]}
                        >
                            {selectedOption ? ` ${selectedOption} ` : ' ____ '}
                        </Text>
                        {parts[1]}
                    </Text>
                </View>
            );
        }

        return <Text style={styles.questionPromptText}>{question.prompt}</Text>;
    };

    return (
        <View style={styles.container}>
            {/* Question prompt */}
            <View style={styles.promptWrapper}>{renderPrompt()}</View>

            {/* Multiple-Choice Options */}
            <View style={styles.optionsList}>
                {question.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrectOption = isSubmitted && question.correctAnswer === option;
                    const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                    return (
                        <Pressable
                            key={option}
                            onPress={() => onSelectOption(option)}
                            disabled={isSubmitted}
                            style={({ pressed }) => [
                                styles.optionCard,
                                isSelected && !isSubmitted && styles.optionCardSelected,
                                isSubmitted && isCorrectOption && styles.optionCardCorrect,
                                isWrongSelected && styles.optionCardWrong,
                                pressed && !isSubmitted && styles.optionCardPressed,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextSelected,
                                    isSubmitted && isCorrectOption && styles.optionTextCorrect,
                                    isWrongSelected && styles.optionTextWrong,
                                ]}
                            >
                                {option}
                            </Text>

                            {/* Radio Circle or Checkmark */}
                            {isSelected || (isSubmitted && isCorrectOption) ? (
                                <View
                                    style={[
                                        styles.radioSelected,
                                        isSubmitted && isCorrectOption
                                            ? styles.radioCorrect
                                            : isWrongSelected
                                            ? styles.radioWrong
                                            : null,
                                    ]}
                                >
                                    <Ionicons
                                        name={isWrongSelected ? 'close' : 'checkmark'}
                                        size={14}
                                        color={colors.neutral[50]}
                                    />
                                </View>
                            ) : (
                                <View style={styles.radioUnselected} />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    promptWrapper: {
        marginBottom: 24,
        alignItems: 'center',
    },
    questionPromptText: {
        fontFamily: fonts.headline,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
        textAlign: 'center',
        fontWeight: '700',
        paddingHorizontal: 12,
    },
    fibPromptContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fibBlankSlot: {
        color: colors.primary[600],
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    fibBlankFilled: {
        color: colors.primary[800],
        backgroundColor: colors.tertiary[100],
    },
    fibBlankCorrect: {
        color: colors.secondary[600],
        backgroundColor: colors.successBg,
    },
    fibBlankWrong: {
        color: colors.error,
        backgroundColor: colors.errorBg,
    },
    optionsList: {
        gap: 14,
    },
    optionCard: {
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    optionCardPressed: {
        backgroundColor: colors.neutral[100],
    },
    optionCardSelected: {
        borderWidth: 2.5,
        borderColor: colors.primary[800],
        backgroundColor: colors.surface,
    },
    optionCardCorrect: {
        borderWidth: 2.5,
        borderColor: colors.success,
        backgroundColor: colors.successBg,
    },
    optionCardWrong: {
        borderWidth: 2.5,
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
    },
    optionText: {
        fontFamily: fonts.body,
        fontSize: fontSize.lg,
        color: colors.textPrimary,
    },
    optionTextSelected: {
        fontFamily: fonts.headline,
        fontWeight: '700',
        color: colors.primary[800],
    },
    optionTextCorrect: {
        fontFamily: fonts.headline,
        fontWeight: '700',
        color: colors.secondary[700],
    },
    optionTextWrong: {
        fontFamily: fonts.headline,
        fontWeight: '700',
        color: colors.error,
    },
    radioUnselected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.neutral[300],
    },
    radioSelected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCorrect: {
        backgroundColor: colors.success,
    },
    radioWrong: {
        backgroundColor: colors.error,
    },
});
