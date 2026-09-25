import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';
import { LANGUAGES } from '../data/languages';
import {
    LanguageId,
    MultipleChoiceQuestion,
    WordBankQuestion,
    ListenAndTypeQuestion,
} from '../data/mockLessons';
import { useLessonProgress } from '../hooks/UseLessonProgress';
import { checkAnswer, UserAnswer } from '../utils/checkAnswer';
import { ProgressHeader } from '../components/ProgressBarHeader';
import { QuestionRenderer } from '../components/questions/QuestionRenderer';
import { FeedbackSheet } from '../components/FeedbackSheet';

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

    // Lesson state — owned by useLessonProgress reducer state machine
    const { state, dispatch, currentQuestion, isComplete, progress } = useLessonProgress(langKey);

    const isSubmitted = state.answerState !== 'idle';
    const isCorrect =
        state.answerState === 'submitted_correct'
            ? true
            : state.answerState === 'submitted_incorrect'
            ? false
            : null;

    // Derived answer states for child components
    const selectedOption: string | null =
        state.selectedAnswer &&
        typeof state.selectedAnswer === 'object' &&
        'value' in state.selectedAnswer &&
        typeof (state.selectedAnswer as { value: unknown }).value === 'string'
            ? (state.selectedAnswer as { value: string }).value
            : null;

    const selectedWords: string[] =
        state.selectedAnswer &&
        typeof state.selectedAnswer === 'object' &&
        'wordsArray' in state.selectedAnswer &&
        Array.isArray((state.selectedAnswer as { wordsArray: unknown }).wordsArray)
            ? (state.selectedAnswer as { wordsArray: string[] }).wordsArray
            : state.selectedAnswer &&
              typeof state.selectedAnswer === 'object' &&
              'value' in state.selectedAnswer &&
              Array.isArray((state.selectedAnswer as { value: unknown }).value)
            ? (state.selectedAnswer as { value: string[] }).value
            : [];

    const matchedPairsCount: number =
        state.selectedAnswer &&
        typeof state.selectedAnswer === 'object' &&
        'count' in state.selectedAnswer &&
        typeof (state.selectedAnswer as { count: unknown }).count === 'number'
            ? (state.selectedAnswer as { count: number }).count
            : 0;

    const handleSelectOption = (option: string) => {
        if (isSubmitted || !currentQuestion) return;
        const answer: UserAnswer = {
            type: currentQuestion.type as 'multiple_choice' | 'fill_in_blank',
            value: option,
        };
        dispatch({ type: 'SELECT_ANSWER', payload: answer });
    };

    const handleWordsChange = (words: string[]) => {
        if (isSubmitted || !currentQuestion) return;
        if (currentQuestion.type === 'word_bank') {
            const answer: UserAnswer = {
                type: 'word_bank',
                value: words,
            };
            dispatch({ type: 'SELECT_ANSWER', payload: answer });
        } else if (currentQuestion.type === 'listen_and_type') {
            const answer = {
                type: 'listen_and_type' as const,
                value: words.join(' '),
                wordsArray: words,
            };
            dispatch({ type: 'SELECT_ANSWER', payload: answer });
        }
    };

    const handleMatchProgress = (matchedCount: number, totalCount: number) => {
        if (isSubmitted || !currentQuestion) return;
        if (currentQuestion.type === 'match_pairs') {
            const pairs = matchedCount === totalCount ? currentQuestion.pairs : [];
            const answer: UserAnswer = {
                type: 'match_pairs',
                value: pairs,
            };
            dispatch({
                type: 'SELECT_ANSWER',
                payload: { ...answer, count: matchedCount },
            });
        }
    };

    const isAnswerReady = (): boolean => {
        if (isSubmitted) return true;
        if (!currentQuestion || !state.selectedAnswer) return false;

        switch (currentQuestion.type) {
            case 'multiple_choice':
            case 'fill_in_blank':
                return selectedOption !== null;
            case 'word_bank':
            case 'listen_and_type':
                return selectedWords.length > 0;
            case 'match_pairs':
                return matchedPairsCount === currentQuestion.pairs.length;
            default:
                return false;
        }
    };

    const handleCheckOrContinue = () => {
        if (!currentQuestion) return;

        if (!isSubmitted) {
            if (!isAnswerReady()) return;
            const answer = state.selectedAnswer as UserAnswer;
            const correct = checkAnswer(currentQuestion, answer);
            dispatch({
                type: 'SUBMIT_ANSWER',
                payload: { isCorrect: correct, xp: currentQuestion.xp },
            });
        } else {
            dispatch({ type: 'CONTINUE' });
        }
    };

    // Calculate feedback message and correct answer string for Story 4 feedback sheet
    const getFeedbackDetails = () => {
        if (!currentQuestion) return { correctAnswerText: '', explanation: '' };

        switch (currentQuestion.type) {
            case 'multiple_choice':
            case 'fill_in_blank': {
                const q = currentQuestion as MultipleChoiceQuestion;
                return {
                    correctAnswerText: q.correctAnswer,
                    explanation: `${q.correctAnswer} is the correct translation!`,
                };
            }
            case 'word_bank': {
                const q = currentQuestion as WordBankQuestion;
                const orderStr = q.correctOrder.join(' ');
                return {
                    correctAnswerText: orderStr,
                    explanation: `"${orderStr}" correctly translates "${q.englishPrompt}"`,
                };
            }
            case 'listen_and_type': {
                const q = currentQuestion as ListenAndTypeQuestion;
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
    };

    const { correctAnswerText, explanation } = getFeedbackDetails();

    // Completion state
    if (isComplete) {
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
                        <Ionicons name="trophy" size={14} color={colors.primary[800]} />
                        <Text style={styles.xpText}>XP {state.totalXp}</Text>
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
                            <Text style={styles.xpGainedText}>Total XP: {state.totalXp}</Text>
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

    const ready = isAnswerReady();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: Math.max(insets.top, 16),
                    paddingBottom: Math.max(insets.bottom, 0),
                },
            ]}
        >
            {/* Design Progress Header: "Question X of Y", "Swahili Basics", and smooth green progress bar */}
            <ProgressHeader
                currentQuestionNumber={state.resolvedCount + 1}
                totalQuestions={state.totalCount}
                categoryTitle={`${selectedLanguage.name} Basics`}
                progress={progress}
                totalXp={state.totalXp}
                lastXpGained={state.lastXpGained}
                onClose={() => router.back()}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Brand / Culture Banner */}
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

                {/* Modular Question View Component */}
                {currentQuestion && (
                    <QuestionRenderer
                        question={currentQuestion}
                        selectedOption={selectedOption}
                        onSelectOption={handleSelectOption}
                        selectedWords={selectedWords}
                        onWordsChange={handleWordsChange}
                        matchedPairsCount={matchedPairsCount}
                        onMatchProgress={handleMatchProgress}
                        isSubmitted={isSubmitted}
                        isCorrect={isCorrect}
                    />
                )}
            </ScrollView>

            {/* Story 4: Dynamic Bottom Feedback Sheet (Green for correct, Red for incorrect) */}
            <FeedbackSheet
                isSubmitted={isSubmitted}
                isCorrect={isCorrect}
                isAnswerReady={ready}
                onCheckOrContinue={handleCheckOrContinue}
                correctAnswerText={correctAnswerText}
                explanation={explanation}
            />
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
    },
    iconButton: {
        padding: 4,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[200],
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        gap: 6,
    },
    xpText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 4,
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