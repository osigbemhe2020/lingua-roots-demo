import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize, lineHeight } from '../theme/typography';
import { LANGUAGES } from '../data/languages';
import { mockLessons, Question, LanguageId, MultipleChoiceQuestion } from '../data/mockLessons';

export default function LessonScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { languageId } = useLocalSearchParams<{ languageId?: string }>();

    // Resolve language and dataset (map e.g. 'swahili' -> 'sw')
    const langKey: LanguageId =
        languageId === 'yoruba' || languageId === 'yo'
            ? 'yo'
            : languageId === 'igbo' || languageId === 'ig'
            ? 'ig'
            : languageId === 'hausa' || languageId === 'ha'
            ? 'ha'
            : 'sw';

    const selectedLanguage =
        LANGUAGES.find((lang) => lang.id === languageId || lang.id === langKey) || LANGUAGES[0];

    const questions: Question[] = mockLessons[langKey] || mockLessons.sw;

    // Lesson state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [xp, setXp] = useState(350);
    const [isCompleted, setIsCompleted] = useState(false);

    const currentQuestion = questions[currentIndex] || questions[0];

    // Get options for current question
    const options: string[] =
        'options' in currentQuestion
            ? (currentQuestion as MultipleChoiceQuestion).options
            : [];

    const handleSelectOption = (option: string) => {
        if (isSubmitted) return;
        setSelectedOption(option);
    };

    const handleCheckOrContinue = () => {
        if (!selectedOption) return;

        if (!isSubmitted) {
            // Evaluate answer
            const correct =
                'correctAnswer' in currentQuestion &&
                (currentQuestion as MultipleChoiceQuestion).correctAnswer === selectedOption;

            setIsSubmitted(true);
            setIsCorrect(correct);

            if (correct) {
                setXp((prev) => prev + currentQuestion.xp);
            }
        } else {
            // Advance to next question
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsSubmitted(false);
                setIsCorrect(null);
            } else {
                setIsCompleted(true);
            }
        }
    };

    const renderQuestionPrompt = () => {
        if ('prompt' in currentQuestion) {
            return currentQuestion.prompt;
        }
        if ('englishPrompt' in currentQuestion) {
            return `Translate: "${currentQuestion.englishPrompt}"`;
        }
        if ('audioLabel' in currentQuestion) {
            return `Type what you hear: "${currentQuestion.audioLabel}"`;
        }
        return `Practice ${selectedLanguage.name}`;
    };

    // Completion state
    if (isCompleted) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        paddingTop: Math.max(insets.top, 16),
                        paddingBottom: Math.max(insets.bottom, 20),
                    },
                ]}
            >
                <View style={styles.header}>
                    <Pressable
                        style={styles.iconButton}
                        onPress={() => router.replace('/language-select')}
                        hitSlop={12}
                    >
                        <Feather name="x" size={24} color={colors.textPrimary} />
                    </Pressable>
                    <View style={styles.xpBadge}>
                        <View style={styles.coinCircle}>
                            <Text style={styles.coinIcon}>$</Text>
                        </View>
                        <Text style={styles.xpText}>{xp}</Text>
                    </View>
                </View>

                <View style={styles.completedContent}>
                    <View style={styles.completedCard}>
                        <View style={styles.trophyCircle}>
                            <Ionicons name="trophy" size={42} color={colors.primary[800]} />
                        </View>
                        <Text style={styles.completedTitle}>Lesson Completed!</Text>
                        <Text style={styles.completedSubtitle}>
                            You earned XP practicing {selectedLanguage.name}!
                        </Text>

                        <View style={styles.xpGainedPill}>
                            <Text style={styles.xpGainedText}>Total XP: {xp}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Pressable
                        style={styles.actionButton}
                        onPress={() => router.replace('/language-select')}
                    >
                        <Text style={styles.actionButtonText}>Choose Another Language</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: Math.max(insets.top, 16),
                    paddingBottom: Math.max(insets.bottom, 20),
                },
            ]}
        >
            {/* Header: Close, Segmented Progress, XP */}
            <View style={styles.header}>
                <Pressable
                    style={styles.iconButton}
                    onPress={() => router.back()}
                    hitSlop={12}
                >
                    <Feather name="x" size={24} color={colors.textPrimary} />
                </Pressable>

                {/* Segmented Progress Indicators */}
                <View style={styles.progressSegments}>
                    {questions.map((_, index) => {
                        const isFilled = index <= currentIndex;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.progressSegment,
                                    isFilled
                                        ? styles.progressSegmentFilled
                                        : styles.progressSegmentUnfilled,
                                ]}
                            />
                        );
                    })}
                </View>

                {/* XP / Coin Counter */}
                <View style={styles.xpBadge}>
                    <View style={styles.coinCircle}>
                        <Text style={styles.coinIcon}>$</Text>
                    </View>
                    <Text style={styles.xpText}>{xp}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Illustration / Graphic Card */}
                <View style={styles.graphicCard}>
                    <View style={styles.graphicInner}>
                        <View style={styles.brandWordmark}>
                            <Text style={styles.graphicBrandText}>Lingua Roots</Text>
                        </View>
                        <View style={styles.characterBadge}>
                            <Ionicons name="sparkles" size={24} color={colors.primary[500]} />
                        </View>
                        <Text style={styles.characterGreeting}>
                            {selectedLanguage.greeting}, Learner!
                        </Text>
                        <Text style={styles.characterCaption}>
                            Let's learn {selectedLanguage.name} today.
                        </Text>
                    </View>
                </View>

                {/* Question Prompt */}
                <Text style={styles.questionPrompt}>{renderQuestionPrompt()}</Text>

                {/* Multiple-Choice Options */}
                <View style={styles.optionsList}>
                    {options.map((option) => {
                        const isSelected = selectedOption === option;
                        const isCorrectOption =
                            isSubmitted &&
                            'correctAnswer' in currentQuestion &&
                            (currentQuestion as MultipleChoiceQuestion).correctAnswer === option;
                        const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                        return (
                            <Pressable
                                key={option}
                                onPress={() => handleSelectOption(option)}
                                style={[
                                    styles.optionCard,
                                    isSelected && !isSubmitted && styles.optionCardSelected,
                                    isSubmitted && isCorrectOption && styles.optionCardCorrect,
                                    isWrongSelected && styles.optionCardWrong,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected && styles.optionTextSelected,
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
            </ScrollView>

            {/* Bottom Action CTA */}
            <View style={styles.footer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        !selectedOption && styles.actionButtonDisabled,
                        isSubmitted && isCorrect && styles.actionButtonCorrect,
                        isSubmitted && !isCorrect && styles.actionButtonWrong,
                        pressed && { opacity: 0.9 },
                    ]}
                    disabled={!selectedOption}
                    onPress={handleCheckOrContinue}
                >
                    <Text style={styles.actionButtonText}>
                        {isSubmitted ? 'Continue' : 'Check Answer'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    progressSegments: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
    },
    progressSegment: {
        flex: 1,
        height: 8,
        borderRadius: 4,
    },
    progressSegmentFilled: {
        backgroundColor: colors.tertiary[400],
    },
    progressSegmentUnfilled: {
        backgroundColor: colors.neutral[300],
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[200],
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 16,
        gap: 6,
    },
    coinCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinIcon: {
        color: colors.neutral[50],
        fontSize: 10,
        fontWeight: 'bold',
    },
    xpText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
    },
    graphicCard: {
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: colors.neutral[200],
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    graphicInner: {
        alignItems: 'center',
    },
    brandWordmark: {
        marginBottom: 8,
    },
    graphicBrandText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.xs,
        color: colors.primary[700],
        letterSpacing: 0.5,
    },
    characterBadge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.tertiary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    characterGreeting: {
        fontFamily: fonts.headline,
        fontSize: fontSize.base,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    characterCaption: {
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    questionPrompt: {
        fontFamily: fonts.headline,
        fontSize: 22,
        lineHeight: 30,
        color: colors.textPrimary,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 24,
        paddingHorizontal: 12,
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
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    actionButton: {
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    actionButtonCorrect: {
        backgroundColor: colors.success,
    },
    actionButtonWrong: {
        backgroundColor: colors.primary[800],
    },
    actionButtonText: {
        fontFamily: fonts.label,
        fontSize: fontSize.base,
        color: colors.neutral[50],
        fontWeight: '600',
    },
    completedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    completedCard: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.neutral[200],
    },
    trophyCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.tertiary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    completedTitle: {
        fontFamily: fonts.headline,
        fontSize: fontSize['2xl'],
        color: colors.textPrimary,
        fontWeight: '700',
        marginBottom: 8,
    },
    completedSubtitle: {
        fontFamily: fonts.body,
        fontSize: fontSize.base,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    xpGainedPill: {
        backgroundColor: colors.tertiary[100],
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    xpGainedText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.sm,
        color: colors.primary[800],
        fontWeight: '700',
    },
});