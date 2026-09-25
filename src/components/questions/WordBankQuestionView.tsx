import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts, fontSize } from '../../theme/typography';
import { WordBankQuestion } from '../../data/mockLessons';

interface WordBankQuestionViewProps {
    question: WordBankQuestion;
    selectedWords: string[];
    onWordsChange: (words: string[]) => void;
    isSubmitted: boolean;
    isCorrect: boolean | null;
}

export const WordBankQuestionView: React.FC<WordBankQuestionViewProps> = ({
    question,
    selectedWords,
    onWordsChange,
    isSubmitted,
    isCorrect,
}) => {
    // Keep track of which bank indices are currently placed in assembly
    // We track items by unique object/id { id: string, word: string } to support duplicate words seamlessly
    const [bankItems, setBankItems] = useState<{ id: string; word: string }[]>([]);

    useEffect(() => {
        const items = question.wordBank.map((word, index) => ({
            id: `${word}-${index}`,
            word,
        }));
        setBankItems(items);
    }, [question]);

    // Handle tapping a word in the word bank
    const handleAddWord = (item: { id: string; word: string }) => {
        if (isSubmitted) return;
        const newWords = [...selectedWords, item.word];
        onWordsChange(newWords);
    };

    // Handle tapping a word in the assembly area to remove it
    const handleRemoveWord = (indexToRemove: number) => {
        if (isSubmitted) return;
        const newWords = selectedWords.filter((_, idx) => idx !== indexToRemove);
        onWordsChange(newWords);
    };

    // Helper: Determine how many instances of a word have been selected
    const getUsedCountForWord = (word: string) => {
        return selectedWords.filter((w) => w === word).length;
    };

    // Helper: Determine if a specific bank item is already placed
    const isItemUsed = (item: { id: string; word: string }, itemIndex: number) => {
        // Count preceding matching items in the bank
        const precedingMatches = question.wordBank
            .slice(0, itemIndex)
            .filter((w) => w === item.word).length;
        const totalUsed = getUsedCountForWord(item.word);
        return precedingMatches < totalUsed;
    };

    return (
        <View style={styles.container}>
            {/* Instruction & English Prompt */}
            <View style={styles.promptHeader}>
                <View style={styles.instructionRow}>
                    <Ionicons name="chatbubbles-outline" size={18} color={colors.primary[600]} />
                    <Text style={styles.instructionText}>Translate this sentence</Text>
                </View>
                <View style={styles.promptBubble}>
                    <Text style={styles.englishPromptText}>"{question.englishPrompt}"</Text>
                </View>
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
                        <Text style={styles.placeholderText}>Tap words below to translate</Text>
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

            {/* If submitted and incorrect, show the expected correct order */}
            {isSubmitted && !isCorrect && (
                <View style={styles.correctionBanner}>
                    <Text style={styles.correctionLabel}>Correct translation:</Text>
                    <Text style={styles.correctionValue}>{question.correctOrder.join(' ')}</Text>
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
    promptHeader: {
        marginBottom: 18,
        alignItems: 'center',
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    instructionText: {
        fontFamily: fonts.label,
        fontSize: fontSize.sm,
        color: colors.primary[700],
        fontWeight: '600',
    },
    promptBubble: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    englishPromptText: {
        fontFamily: fonts.headline,
        fontSize: 20,
        color: colors.textPrimary,
        fontWeight: '700',
        textAlign: 'center',
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
