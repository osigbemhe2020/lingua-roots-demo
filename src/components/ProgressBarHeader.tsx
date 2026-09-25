// components/ProgressHeader.tsx
//
// Story 2 (progress indicator) + Story 5 (XP update), built together
// since they share the top row of the lesson screen and the XP popup
// visually anchors off the XP badge.
//
// Uses React Native's built-in Animated API — deliberately not
// Reanimated, since a fade + float is simple enough not to justify
// the extra dependency for this exercise.

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { textStyles } from '../theme/typography';

type ProgressHeaderProps = {
    progress: number; // 0–1, from useLessonProgress
    totalXp: number;
    lastXpGained: { amount: number; triggerId: string } | null;
};

export function ProgressHeader({
    progress,
    totalXp,
    lastXpGained,
}: ProgressHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.min(progress, 1) * 100}%` }]} />
            </View>

            <View style={styles.xpRow}>
                <Text style={styles.xpText}>⭐ {totalXp} XP</Text>
                <XPGainPopup lastXpGained={lastXpGained} />
            </View>
        </View>
    );
}

// Separated so its animation lifecycle (mount → animate → unmount)
// doesn't have to live inside the parent's render logic.
export function XPGainPopup({
    lastXpGained,
}: {
    lastXpGained: { amount: number; triggerId: string } | null;
}) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!lastXpGained) return;

        // reset instantly, then animate — lets the effect replay cleanly
        // every time triggerId changes, even for the same XP amount twice in a row
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
        // re-runs whenever triggerId changes — that's the whole point of
        // using a triggerId instead of just the raw amount
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
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    barTrack: {
        height: 10,
        borderRadius: 6,
        backgroundColor: colors.neutral[200],
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 6,
        backgroundColor: colors.tertiary[500],
    },
    xpRow: {
        marginTop: 8,
        alignSelf: 'flex-end',
        position: 'relative',
    },
    xpText: {
        ...textStyles.caption,
        color: colors.textSecondary,
    },
    popup: {
        position: 'absolute',
        right: 0,
        top: -4,
    },
    popupText: {
        ...textStyles.caption,
        fontWeight: '700' as const,
        color: colors.success,
    },
});