import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';
import { LANGUAGES } from '../data/languages';
import {
    mockLessons,
    Question,
    LanguageId,
    MultipleChoiceQuestion,
    WordBankQuestion,
    ListenAndTypeQuestion,
    MatchPairsQuestion,
} from '../data/mockLessons';
import { QuestionRenderer } from '../components/questions/QuestionRenderer';

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
    const [xp, setXp] = useState(350);
    const [isCompleted, setIsCompleted] = useState(false);

    // Question interaction state
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [matchedPairsCount, setMatchedPairsCount] = useState(0);

    // Submission state
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const currentQuestion = questions[currentIndex] || questions[0];

    // Determine whether user has provided an answer ready to check
    const isAnswerReady = (): boolean => {
        if (isSubmitted) return true;

        switch (currentQuestion.type) {
            case 'multiple_choice':
            case 'fill_in_blank':
                return selectedOption !== null;
            case 'word_bank':
                return selectedWords.length > 0;
            case 'listen_and_type':
                return selectedWords.length > 0;
            case 'match_pairs':
                return (
                    matchedPairsCount === (currentQuestion as MatchPairsQuestion).pairs.length
                );
            default:
                return false;
        }
    };

    const handleSelectOption = (option: string) => {
        if (isSubmitted) return;
        setSelectedOption(option);
    };

    const handleWordsChange = (words: string[]) => {
        if (isSubmitted) return;
        setSelectedWords(words);
    };

    const handleMatchProgress = (matchedCount: number) => {
        setMatchedPairsCount(matchedCount);
    };

    const handleCheckOrContinue = () => {
        if (!isAnswerReady()) return;

        if (!isSubmitted) {
            let correct = false;

            switch (currentQuestion.type) {
                case 'multiple_choice':
                case 'fill_in_blank':
                    correct =
                        (currentQuestion as MultipleChoiceQuestion).correctAnswer ===
                        selectedOption;
                    break;

                case 'word_bank': {
                    const expected = (currentQuestion as WordBankQuestion).correctOrder
                        .join(' ')
                        .trim()
                        .toLowerCase();
                    const actual = selectedWords.join(' ').trim().toLowerCase();
                    correct = expected === actual;
                    break;
                }

                case 'listen_and_type': {
                    const expected = (currentQuestion as ListenAndTypeQuestion).correctAnswer
                        .trim()
                        .toLowerCase();
                    const actual = selectedWords.join(' ').trim().toLowerCase();
                    correct = expected === actual;
                    break;
                }

                case 'match_pairs':
                    correct =
                        matchedPairsCount ===
                        (currentQuestion as MatchPairsQuestion).pairs.length;
                    break;
            }

            setIsSubmitted(true);
            setIsCorrect(correct);

            if (correct) {
                setXp((prev) => prev + currentQuestion.xp);
            }
        } else {
            // Advance to next question or complete lesson
            if (currentIndex + 1 < questions.length) {
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
                setSelectedWords([]);
                setMatchedPairsCount(0);
                setIsSubmitted(false);
                setIsCorrect(null);
            } else {
                setIsCompleted(true);
            }
        }
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

    const ready = isAnswerReady();

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
            </ScrollView>

            {/* Bottom Action CTA */}
            <View style={styles.footer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        !ready && styles.actionButtonDisabled,
                        isSubmitted && isCorrect && styles.actionButtonCorrect,
                        isSubmitted && !isCorrect && styles.actionButtonWrong,
                        pressed && ready && { opacity: 0.9 },
                    ]}
                    disabled={!ready}
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