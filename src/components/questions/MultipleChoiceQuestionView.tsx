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
                {question.options.map((option, index) => {
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
                            {/* Left Badge: Number (1,2,3,4) or State Icon */}
                            <View
                                style={[
                                    styles.indexBadge,
                                    isSelected && !isSubmitted && styles.indexBadgeSelected,
                                    isSubmitted && isCorrectOption && styles.indexBadgeCorrect,
                                    isWrongSelected && styles.indexBadgeWrong,
                                ]}
                            >
                                {isSubmitted && isCorrectOption ? (
                                    <Ionicons name="checkmark" size={14} color={colors.neutral[50]} />
                                ) : isWrongSelected ? (
                                    <Ionicons name="close" size={14} color={colors.neutral[50]} />
                                ) : (
                                    <Text
                                        style={[
                                            styles.indexBadgeText,
                                            isSelected && !isSubmitted && styles.indexBadgeTextSelected,
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </View>

                            {/* Option Label & Sub-label */}
                            <View style={styles.textContainer}>
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

                                {isSubmitted && isCorrectOption && (
                                    <Text style={styles.subLabelCorrect}>Correct translation</Text>
                                )}
                                {isWrongSelected && (
                                    <Text style={styles.subLabelWrong}>Your answer</Text>
                                )}
                            </View>

                            {/* Right Status Indicator: Checkmark or Cross or Radio */}
                            {isSubmitted && isCorrectOption ? (
                                <View style={styles.statusBadgeCorrect}>
                                    <Ionicons name="checkmark" size={16} color={colors.neutral[50]} />
                                </View>
                            ) : isWrongSelected ? (
                                <View style={styles.statusBadgeWrong}>
                                    <Ionicons name="close" size={16} color={colors.neutral[50]} />
                                </View>
                            ) : isSelected ? (
                                <View style={styles.radioSelected}>
                                    <View style={styles.radioSelectedDot} />
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
        minHeight: 68,
        borderRadius: 34,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
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
        borderColor: colors.secondary[500],
        backgroundColor: '#CFDECA', // Soft green matching reference screenshot
    },
    optionCardWrong: {
        borderWidth: 2.5,
        borderColor: colors.error,
        backgroundColor: colors.errorBg, // Soft red
    },
    indexBadge: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: colors.neutral[200],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    indexBadgeSelected: {
        backgroundColor: colors.primary[800],
    },
    indexBadgeCorrect: {
        backgroundColor: colors.secondary[600],
    },
    indexBadgeWrong: {
        backgroundColor: colors.error,
    },
    indexBadgeText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    indexBadgeTextSelected: {
        color: colors.neutral[50],
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
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
        color: colors.secondary[900],
    },
    optionTextWrong: {
        fontFamily: fonts.headline,
        fontWeight: '700',
        color: colors.error,
    },
    subLabelCorrect: {
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        color: colors.secondary[700],
        marginTop: 2,
    },
    subLabelWrong: {
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        color: colors.error,
        marginTop: 2,
    },
    radioUnselected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.neutral[300],
        marginLeft: 12,
    },
    radioSelected: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    radioSelectedDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary[800],
    },
    statusBadgeCorrect: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.secondary[600],
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    statusBadgeWrong: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
});
