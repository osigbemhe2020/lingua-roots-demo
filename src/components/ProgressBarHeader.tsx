// components/ProgressBarHeader.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

type ProgressHeaderProps = {
    currentQuestionNumber: number;
    totalQuestions: number;
    categoryTitle?: string;
    progress: number; // 0–1, from useLessonProgress
    totalXp: number;
    lastXpGained: { amount: number; triggerId: string } | null;
    onClose?: () => void;
};

export function ProgressHeader({
    currentQuestionNumber,
    totalQuestions,
    categoryTitle,
    progress,
    totalXp,
    lastXpGained,
    onClose,
}: ProgressHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Top Navigation Row: Menu/Close, App Title, XP Badge */}
            <View style={styles.topRow}>
                {onClose ? (
                    <Pressable style={styles.iconButton} onPress={onClose} hitSlop={12}>
                        <Feather name="x" size={24} color={colors.textPrimary} />
                    </Pressable>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}

                <Text style={styles.brandTitle}>Lingua Roots</Text>

                {/* XP Badge with Popover */}
                <View style={styles.xpWrapper}>
                    <View style={styles.xpBadge}>
                        <Ionicons name="trophy" size={14} color={colors.primary[800]} />
                        <Text style={styles.xpText}>XP {totalXp}</Text>
                    </View>
                    <XPGainPopup lastXpGained={lastXpGained} />
                </View>
            </View>

            {/* Question Info Row: "Question 3 of 10" & "Swahili Basics" */}
            <View style={styles.infoRow}>
                <Text style={styles.questionNumberText}>
                    Question {Math.min(currentQuestionNumber, totalQuestions)} of {totalQuestions}
                </Text>
                {categoryTitle && (
                    <Text style={styles.categoryTitleText}>{categoryTitle}</Text>
                )}
            </View>

            {/* Continuous Green Progress Bar */}
            <View style={styles.barTrack}>
                <View
                    style={[
                        styles.barFill,
                        { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` },
                    ]}
                />
            </View>
        </View>
    );
}

// XP Gain Floating Animation
export function XPGainPopup({
    lastXpGained,
}: {
    lastXpGained: { amount: number; triggerId: string } | null;
}) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!lastXpGained) return;

        opacity.setValue(0);
        translateY.setValue(0);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -20,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(400),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [lastXpGained?.triggerId]);

    if (!lastXpGained) return null;

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.popup,
                {
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <Text style={styles.popupText}>+{lastXpGained.amount} XP</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    iconButton: {
        padding: 4,
    },
    iconPlaceholder: {
        width: 32,
    },
    brandTitle: {
        fontFamily: fonts.headline,
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary[800],
        letterSpacing: 0.2,
    },
    xpWrapper: {
        position: 'relative',
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    questionNumberText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    categoryTitleText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.sm,
        color: colors.primary[700],
        fontWeight: '600',
    },
    barTrack: {
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.neutral[200],
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 5,
        backgroundColor: colors.secondary[500], // #4A6B41 rich forest green from design
    },
    popup: {
        position: 'absolute',
        right: 0,
        top: -6,
    },
    popupText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.xs,
        fontWeight: '700',
        color: colors.success,
    },
});