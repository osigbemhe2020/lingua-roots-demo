import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts, fontSize } from '../../theme/typography';
import { MatchPairsQuestion } from '../../data/mockLessons';

interface Tile {
    id: string;
    text: string;
    type: 'source' | 'target';
    pairKey: string; // identifier connecting source and target
}

interface MatchPairsQuestionViewProps {
    question: MatchPairsQuestion;
    matchedPairsCount: number;
    onMatchProgress: (matchedCount: number, totalCount: number) => void;
    isSubmitted: boolean;
    isCorrect: boolean | null;
}

export const MatchPairsQuestionView: React.FC<MatchPairsQuestionViewProps> = ({
    question,
    onMatchProgress,
    isSubmitted,
}) => {
    // Generate shuffled tiles
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
    const [matchedPairKeys, setMatchedPairKeys] = useState<string[]>([]);
    const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);

    // Create source tiles and target tiles shuffled independently
    const { sourceTiles, targetTiles } = useMemo(() => {
        const sources: Tile[] = question.pairs.map((p, idx) => ({
            id: `src-${idx}-${p.source}`,
            text: p.source,
            type: 'source',
            pairKey: `${p.source}:::${p.target}`,
        }));

        const targets: Tile[] = question.pairs.map((p, idx) => ({
            id: `tgt-${idx}-${p.target}`,
            text: p.target,
            type: 'target',
            pairKey: `${p.source}:::${p.target}`,
        }));

        // Deterministic or pseudorandom shuffle
        const shuffledSources = [...sources].sort(() => 0.5 - Math.random());
        const shuffledTargets = [...targets].sort(() => 0.5 - Math.random());

        return { sourceTiles: shuffledSources, targetTiles: shuffledTargets };
    }, [question]);

    // Reset when question changes
    useEffect(() => {
        setSelectedTile(null);
        setMatchedPairKeys([]);
        setWrongPairIds([]);
    }, [question]);

    // Handle tile selection
    const handleTilePress = (tile: Tile) => {
        if (isSubmitted) return;
        if (matchedPairKeys.includes(tile.pairKey)) return;
        if (wrongPairIds.length > 0) return; // ignore taps while error flash is animating

        // If clicking the same tile, deselect
        if (selectedTile?.id === tile.id) {
            setSelectedTile(null);
            return;
        }

        // If nothing is selected yet, select this tile
        if (!selectedTile) {
            setSelectedTile(tile);
            return;
        }

        // If a tile is already selected, check if they match
        if (selectedTile.pairKey === tile.pairKey && selectedTile.id !== tile.id) {
            // MATCH!
            const newMatched = [...matchedPairKeys, tile.pairKey];
            setMatchedPairKeys(newMatched);
            setSelectedTile(null);
            onMatchProgress(newMatched.length, question.pairs.length);
        } else {
            // WRONG MATCH!
            const wrongIds = [selectedTile.id, tile.id];
            setWrongPairIds(wrongIds);
            setSelectedTile(null);

            setTimeout(() => {
                setWrongPairIds([]);
            }, 650);
        }
    };

    const isAllMatched = matchedPairKeys.length === question.pairs.length;

    const renderTile = (tile: Tile) => {
        const isMatched = matchedPairKeys.includes(tile.pairKey);
        const isSelected = selectedTile?.id === tile.id;
        const isWrong = wrongPairIds.includes(tile.id);

        return (
            <Pressable
                key={tile.id}
                onPress={() => handleTilePress(tile)}
                disabled={isMatched || isSubmitted}
                style={({ pressed }) => [
                    styles.tile,
                    isSelected && styles.tileSelected,
                    isMatched && styles.tileMatched,
                    isWrong && styles.tileWrong,
                    pressed && !isMatched && { opacity: 0.8 },
                ]}
            >
                <Text
                    style={[
                        styles.tileText,
                        isSelected && styles.tileTextSelected,
                        isMatched && styles.tileTextMatched,
                        isWrong && styles.tileTextWrong,
                    ]}
                >
                    {tile.text}
                </Text>

                {isMatched && (
                    <View style={styles.tileCheckmark}>
                        <Ionicons name="checkmark" size={14} color={colors.neutral[50]} />
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            {/* Instruction / Header */}
            <View style={styles.header}>
                <View style={styles.instructionRow}>
                    <Ionicons name="grid-outline" size={18} color={colors.primary[600]} />
                    <Text style={styles.instructionText}>Tap matching pairs</Text>
                </View>
                <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>
                        {matchedPairKeys.length} / {question.pairs.length} pairs
                    </Text>
                </View>
            </View>

            {/* 2-Column Matching Layout */}
            <View style={styles.columnsContainer}>
                {/* Source Column */}
                <View style={styles.column}>
                    <Text style={styles.columnLabel}>Target Word</Text>
                    {sourceTiles.map((tile) => renderTile(tile))}
                </View>

                {/* Target Column */}
                <View style={styles.column}>
                    <Text style={styles.columnLabel}>Translation</Text>
                    {targetTiles.map((tile) => renderTile(tile))}
                </View>
            </View>

            {isAllMatched && (
                <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={styles.successText}>All pairs matched perfectly!</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    instructionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    instructionText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.lg,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    progressBadge: {
        backgroundColor: colors.tertiary[100],
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 14,
    },
    progressText: {
        fontFamily: fonts.label,
        fontSize: fontSize.xs,
        color: colors.primary[800],
        fontWeight: '700',
    },
    columnsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    column: {
        flex: 1,
        gap: 12,
    },
    columnLabel: {
        fontFamily: fonts.label,
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tile: {
        minHeight: 64,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 1,
        position: 'relative',
    },
    tileSelected: {
        borderWidth: 2.5,
        borderColor: colors.primary[700],
        backgroundColor: colors.tertiary[50],
        transform: [{ scale: 1.02 }],
    },
    tileMatched: {
        borderWidth: 2,
        borderColor: colors.success,
        backgroundColor: colors.successBg,
        opacity: 0.9,
    },
    tileWrong: {
        borderWidth: 2,
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
    },
    tileText: {
        fontFamily: fonts.body,
        fontSize: fontSize.base,
        color: colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
    tileTextSelected: {
        fontFamily: fonts.headline,
        color: colors.primary[800],
        fontWeight: '700',
    },
    tileTextMatched: {
        fontFamily: fonts.headline,
        color: colors.secondary[800],
        fontWeight: '700',
    },
    tileTextWrong: {
        fontFamily: fonts.headline,
        color: colors.error,
        fontWeight: '700',
    },
    tileCheckmark: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.successBg,
        paddingVertical: 12,
        borderRadius: 16,
        marginTop: 20,
        gap: 8,
        borderWidth: 1.5,
        borderColor: colors.success,
    },
    successText: {
        fontFamily: fonts.label,
        fontSize: fontSize.sm,
        color: colors.secondary[800],
        fontWeight: '700',
    },
});
