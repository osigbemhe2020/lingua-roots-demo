// components/LevelPath.tsx
//
// Renders the level-map strip for Story 7's completion screen.
// Purely presentational — reads the static mock levels list, no
// interaction on locked nodes (onPress is intentionally omitted
// for locked levels, not just visually disabled).

import { Level, levels } from '@/data/levels';
import { colors } from '@/theme/colors';
import { fonts, fontSize } from '@/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function LevelPath() {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Your journey</Text>
            <View style={styles.row}>
                {levels.map((level, index) => (
                    <View key={level.id} style={styles.nodeWrapper}>
                        <LevelNode level={level} />
                        {index < levels.length - 1 && <View style={styles.connector} />}
                    </View>
                ))}
            </View>
        </View>
    );
}

function LevelNode({ level }: { level: Level }) {
    const isComplete = level.status === 'complete';

    return (
        <View style={styles.nodeColumn}>
            <View style={[styles.circle, isComplete ? styles.circleComplete : styles.circleLocked]}>
                <Ionicons
                    name={isComplete ? 'checkmark' : 'lock-closed'}
                    size={16}
                    color={isComplete ? colors.neutral[50] : colors.neutral[500]}
                />
            </View>
            <Text style={[styles.label, !isComplete && styles.labelLocked]}>{level.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        alignItems: 'center',
    },
    heading: {
        fontFamily: fonts.label,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    nodeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nodeColumn: {
        alignItems: 'center',
        width: 56,
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    circleComplete: {
        backgroundColor: colors.success,
    },
    circleLocked: {
        backgroundColor: colors.neutral[200],
        borderWidth: 1,
        borderColor: colors.neutral[300],
    },
    connector: {
        width: 16,
        height: 2,
        backgroundColor: colors.neutral[300],
        marginBottom: 22, // aligns with circle center, above the label
    },
    label: {
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    labelLocked: {
        color: colors.neutral[500],
    },
});