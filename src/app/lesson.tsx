import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CultureGreetingBanner } from '../components/CultureGreetingBanner';
import { FeedbackSheet } from '../components/FeedbackSheet';
import { LessonCompletedView } from '../components/LessonCompletedView';
import { ProgressHeader } from '../components/ProgressBarHeader';
import { QuestionRenderer } from '../components/questions/QuestionRenderer';
import { LANGUAGES } from '../data/languages';
import { LanguageId } from '../data/mockLessons';
import { useLessonProgress } from '../hooks/UseLessonProgress';
import { colors } from '../theme/colors';
import { checkAnswer, UserAnswer } from '../utils/checkAnswer';
import { getFeedbackDetails } from '../utils/feedback';

export default function LessonScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { languageId } = useLocalSearchParams<{ languageId?: string }>();

    // Resolve language and dataset
    const langKey: LanguageId =
        languageId === 'yo'
            ? 'yo'
            : languageId === 'ig'
                ? 'ig'
                : languageId === 'ha'
                    ? 'ha'
                    : 'sw';

    const selectedLanguage =
        LANGUAGES.find((lang) => lang.id === langKey) || LANGUAGES[0];

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

    const { correctAnswerText, explanation } = getFeedbackDetails(currentQuestion);

    // Completion state
    if (isComplete) {
        return (
            <LessonCompletedView
                totalXp={state.totalXp}
                languageName={selectedLanguage.name}
                onClose={() => router.replace('/language-select')}
            />
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
            {/* Design Progress Header */}
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
                <CultureGreetingBanner
                    greeting={selectedLanguage.greeting}
                    languageName={selectedLanguage.name}
                />

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

            {/* Dynamic Bottom Feedback Sheet */}
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 24,
    },
});