import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fontSize, fonts } from '../theme/typography';
import { Button } from './Button';
import { LevelPath } from './LevelPath';

interface LessonCompletedViewProps {
    totalXp: number;
    languageName: string;
    onClose: () => void;
}

export const LessonCompletedView: React.FC<LessonCompletedViewProps> = ({
    totalXp,
    languageName,
    onClose,
}) => {
    const insets = useSafeAreaInsets();

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
                    onPress={onClose}
                    hitSlop={12}
                >
                    <Feather name="x" size={24} color={colors.textPrimary} />
                </Pressable>
                <View style={styles.xpBadge}>
                    <Ionicons name="trophy" size={14} color={colors.primary[800]} />
                    <Text style={styles.xpText}>XP {totalXp}</Text>
                </View>
            </View>

            <View style={styles.completedContent}>
                <View style={styles.completedCard}>
                    <View style={styles.trophyCircle}>
                        <Ionicons name="trophy" size={42} color={colors.primary[800]} />
                    </View>
                    <Text style={styles.completedTitle}>Lesson Completed!</Text>
                    <Text style={styles.completedSubtitle}>
                        You earned XP practicing {languageName}!
                    </Text>

                    <View style={styles.xpGainedPill}>
                        <Text style={styles.xpGainedText}>Total XP: {totalXp}</Text>
                    </View>
                    <LevelPath />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Choose Another Language"
                    onPress={onClose}
                />
            </View>
        </View>
    );
};

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
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
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
