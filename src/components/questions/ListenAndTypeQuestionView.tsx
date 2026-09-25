import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts, fontSize } from '../../theme/typography';
import { ListenAndTypeQuestion } from '../../data/mockLessons';

interface ListenAndTypeQuestionViewProps {
    question: ListenAndTypeQuestion;
    selectedWords: string[];
    onWordsChange: (words: string[]) => void;
    isSubmitted: boolean;
    isCorrect: boolean | null;
}

export const ListenAndTypeQuestionView: React.FC<ListenAndTypeQuestionViewProps> = ({
    question,
    selectedWords,
    onWordsChange,
    isSubmitted,
    isCorrect,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSlowPlaying, setIsSlowPlaying] = useState(false);

    // Prepare bank items
    const bankWords =
        question.wordBank && question.wordBank.length > 0
            ? question.wordBank
            : question.correctAnswer.split(' ');

    const [bankItems, setBankItems] = useState<{ id: string; word: string }[]>([]);

    useEffect(() => {
        const items = bankWords.map((word, index) => ({
            id: `${word}-${index}`,
            word,
        }));
        setBankItems(items);
    }, [question]);

    const handlePlayAudio = (slow: boolean = false) => {
        if (slow) {
            setIsSlowPlaying(true);
            setTimeout(() => setIsSlowPlaying(false), 1200);
        } else {
            setIsPlaying(true);
            setTimeout(() => setIsPlaying(false), 1000);
        }
    };

    const handleAddWord = (item: { id: string; word: string }) => {
        if (isSubmitted) return;
        const newWords = [...selectedWords, item.word];
        onWordsChange(newWords);
    };

    const handleRemoveWord = (indexToRemove: number) => {
        if (isSubmitted) return;
        const newWords = selectedWords.filter((_, idx) => idx !== indexToRemove);
        onWordsChange(newWords);
    };

    const getUsedCountForWord = (word: string) => {
        return selectedWords.filter((w) => w === word).length;
    };

    const isItemUsed = (item: { id: string; word: string }, itemIndex: number) => {
        const precedingMatches = bankWords
            .slice(0, itemIndex)
            .filter((w) => w === item.word).length;
        const totalUsed = getUsedCountForWord(item.word);
        return precedingMatches < totalUsed;
    };

    return (
        <View style={styles.container}>
            {/* Audio Widget & Instruction */}
            <View style={styles.audioSection}>
                <View style={styles.instructionRow}>
                    <Ionicons name="volume-high-outline" size={18} color={colors.primary[600]} />
                    <Text style={styles.instructionText}>Tap to listen & assemble</Text>
                </View>

                {/* Speaker Control Buttons */}
                <View style={styles.audioControlsRow}>
                    <Pressable
                        onPress={() => handlePlayAudio(false)}
                        style={({ pressed }) => [
                            styles.mainAudioButton,
                            isPlaying && styles.mainAudioButtonActive,
                            pressed && { opacity: 0.85 },
                        ]}
                    >
                        <Ionicons
                            name={isPlaying ? 'volume-high' : 'volume-medium'}
                            size={32}
                            color={colors.neutral[50]}
                        />
                        <Text style={styles.audioButtonLabel}>
                            {isPlaying ? 'Playing...' : 'Tap to hear'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => handlePlayAudio(true)}
                        style={({ pressed }) => [
                            styles.slowAudioButton,
                            isSlowPlaying && styles.slowAudioButtonActive,
                            pressed && { opacity: 0.85 },
                        ]}
                    >
                        <Text style={styles.turtleIcon}>🐢</Text>
                        <Text style={styles.slowButtonLabel}>Slow</Text>
                    </Pressable>
                </View>

                {/* Subtitle / Hint */}
                <Text style={styles.audioHint}>
                    "{question.audioLabel}"
                </Text>
            </View>

            {/* Sentence Assembly Area */}
            <View
                style={[
                    styles.assemblyArea,
                    isSubmitted && isCorrect && styles.assemblyAreaCorrect,
                    isSubmitted && !isCorrect && styles.assemblyAreaWrong,
                ]}
            >
                {selectedWords.length === 0 ? (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Tap words below to form what you heard</Text>
                    </View>
                ) : (
                    <View style={styles.assemblyWordsContainer}>
                        {selectedWords.map((word, index) => (
                            <Pressable
                                key={`${word}-${index}`}
                                onPress={() => handleRemoveWord(index)}
                                disabled={isSubmitted}
                                style={({ pressed }) => [
                                    styles.placedPill,
                                    isSubmitted && isCorrect && styles.placedPillCorrect,
                                    isSubmitted && !isCorrect && styles.placedPillWrong,
                                    pressed && !isSubmitted && { opacity: 0.7 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.placedPillText,
                                        isSubmitted && isCorrect && styles.placedPillTextCorrect,
                                        isSubmitted && !isCorrect && styles.placedPillTextWrong,
                                    ]}
                                >
                                    {word}
                                </Text>
                                {!isSubmitted && (
                                    <Feather
                                        name="x"
                                        size={12}
                                        color={colors.primary[700]}
                                        style={styles.pillIcon}
                                    />
                                )}
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            {/* Correction if wrong */}
            {isSubmitted && !isCorrect && (
                <View style={styles.correctionBanner}>
                    <Text style={styles.correctionLabel}>Expected answer:</Text>
                    <Text style={styles.correctionValue}>{question.correctAnswer}</Text>
                </View>
            )}

            {/* Word Bank Pool */}
            <View style={styles.bankContainer}>
                <View style={styles.bankGrid}>
                    {bankItems.map((item, index) => {
                        const used = isItemUsed(item, index);
                        return (
                            <View key={item.id} style={styles.bankSlot}>
                                {used ? (
                                    <View style={styles.bankPillGhost}>
                                        <Text style={styles.bankPillGhostText}>{item.word}</Text>
                                    </View>
                                ) : (
                                    <Pressable
                                        onPress={() => handleAddWord(item)}
                                        disabled={isSubmitted}
                                        style={({ pressed }) => [
                                            styles.bankPill,
                                            pressed && !isSubmitted && styles.bankPillPressed,
                                        ]}
                                    >
                                        <Text style={styles.bankPillText}>{item.word}</Text>
                                    </Pressable>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    audioSection: {
        alignItems: 'center',
        marginBottom: 18,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    instructionText: {
        fontFamily: fonts.label,
        fontSize: fontSize.sm,
        color: colors.primary[700],
        fontWeight: '600',
    },
    audioControlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    mainAudioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary[800],
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 28,
        gap: 8,
        shadowColor: colors.primary[800],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    mainAudioButtonActive: {
        backgroundColor: colors.primary[600],
        transform: [{ scale: 1.03 }],
    },
    audioButtonLabel: {
        fontFamily: fonts.headline,
        fontSize: fontSize.base,
        color: colors.neutral[50],
        fontWeight: '700',
    },
    slowAudioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 28,
        gap: 6,
    },
    slowAudioButtonActive: {
        borderColor: colors.tertiary[500],
        backgroundColor: colors.tertiary[100],
    },
    turtleIcon: {
        fontSize: 18,
    },
    slowButtonLabel: {
        fontFamily: fonts.label,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    audioHint: {
        fontFamily: fonts.body,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    assemblyArea: {
        minHeight: 100,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.neutral[300],
        borderStyle: 'dashed',
        padding: 12,
        marginBottom: 16,
        justifyContent: 'center',
    },
    assemblyAreaCorrect: {
        borderColor: colors.success,
        backgroundColor: colors.successBg,
        borderStyle: 'solid',
    },
    assemblyAreaWrong: {
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
        borderStyle: 'solid',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    placeholderText: {
        fontFamily: fonts.body,
        fontSize: fontSize.sm,
        color: colors.disabled,
        textAlign: 'center',
    },
    assemblyWordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
    },
    placedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.tertiary[100],
        borderWidth: 1.5,
        borderColor: colors.primary[400],
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
        gap: 4,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    placedPillCorrect: {
        backgroundColor: colors.secondary[100],
        borderColor: colors.success,
    },
    placedPillWrong: {
        backgroundColor: colors.errorBg,
        borderColor: colors.error,
    },
    placedPillText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.base,
        color: colors.primary[800],
        fontWeight: '700',
    },
    placedPillTextCorrect: {
        color: colors.secondary[800],
    },
    placedPillTextWrong: {
        color: colors.error,
    },
    pillIcon: {
        marginLeft: 2,
    },
    correctionBanner: {
        backgroundColor: colors.errorBg,
        borderRadius: 14,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.error,
    },
    correctionLabel: {
        fontFamily: fonts.label,
        fontSize: fontSize.xs,
        color: colors.error,
        fontWeight: '600',
        marginBottom: 2,
    },
    correctionValue: {
        fontFamily: fonts.headline,
        fontSize: fontSize.base,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    bankContainer: {
        marginTop: 8,
    },
    bankGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    bankSlot: {
        marginVertical: 2,
    },
    bankPill: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 18,
        minWidth: 64,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },
    bankPillPressed: {
        transform: [{ translateY: 2 }],
        backgroundColor: colors.neutral[200],
    },
    bankPillText: {
        fontFamily: fonts.body,
        fontSize: fontSize.base,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    bankPillGhost: {
        backgroundColor: colors.neutral[200],
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 18,
        minWidth: 64,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        opacity: 0.4,
    },
    bankPillGhostText: {
        fontFamily: fonts.body,
        fontSize: fontSize.base,
        color: 'transparent',
    },
});
