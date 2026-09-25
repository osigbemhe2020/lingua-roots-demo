import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

interface FeedbackSheetProps {
    isSubmitted: boolean;
    isCorrect: boolean | null;
    isAnswerReady: boolean;
    onCheckOrContinue: () => void;
    correctAnswerText?: string;
    explanation?: string;
}

export const FeedbackSheet: React.FC<FeedbackSheetProps> = ({
    isSubmitted,
    isCorrect,
    isAnswerReady,
    onCheckOrContinue,
    correctAnswerText,
    explanation,
}) => {
    if (!isSubmitted) {
        // Idle state: normal "Check Answer" footer
        return (
            <View style={styles.idleContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionButton,
                        !isAnswerReady && styles.actionButtonDisabled,
                        pressed && isAnswerReady && { opacity: 0.9 },
                    ]}
                    disabled={!isAnswerReady}
                    onPress={onCheckOrContinue}
                >
                    <Text style={styles.actionButtonText}>Check Answer</Text>
                </Pressable>
            </View>
        );
    }

    const isSuccess = Boolean(isCorrect);

    return (
        <View
            style={[
                styles.feedbackContainer,
                isSuccess ? styles.feedbackSuccess : styles.feedbackError,
            ]}
        >
            {/* Top Feedback Row: Icon Badge, Title, Subtitle, Close */}
            <View style={styles.feedbackHeaderRow}>
                <View style={styles.feedbackLeft}>
                    <View
                        style={[
                            styles.feedbackIconBadge,
                            isSuccess
                                ? styles.feedbackIconBadgeSuccess
                                : styles.feedbackIconBadgeError,
                        ]}
                    >
                        <Ionicons
                            name={isSuccess ? 'sparkles' : 'close'}
                            size={20}
                            color={isSuccess ? colors.secondary[600] : colors.error}
                        />
                    </View>

                    <View style={styles.feedbackTextWrapper}>
                        <Text style={styles.feedbackTitle}>
                            {isSuccess ? 'Well done!' : 'Not quite right'}
                        </Text>
                        <Text style={styles.feedbackSubtitle} numberOfLines={2}>
                            {isSuccess
                                ? explanation || 'Great job!'
                                : correctAnswerText
                                ? `Correct answer: ${correctAnswerText}`
                                : 'Review the correct answer above'}
                        </Text>
                    </View>
                </View>

                <View style={styles.feedbackDismiss}>
                    <Feather
                        name={isSuccess ? 'check' : 'x'}
                        size={20}
                        color={colors.neutral[50]}
                        style={{ opacity: 0.8 }}
                    />
                </View>
            </View>

            {/* Big White Continue CTA Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.continueButton,
                    pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
                ]}
                onPress={onCheckOrContinue}
            >
                <Text
                    style={[
                        styles.continueButtonText,
                        isSuccess
                            ? styles.continueButtonTextSuccess
                            : styles.continueButtonTextError,
                    ]}
                >
                    Continue
                </Text>
                <Feather
                    name="arrow-right"
                    size={20}
                    color={isSuccess ? colors.secondary[700] : colors.error}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    idleContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    actionButton: {
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary[800],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    actionButtonDisabled: {
        backgroundColor: colors.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    actionButtonText: {
        fontFamily: fonts.label,
        fontSize: fontSize.base,
        color: colors.neutral[50],
        fontWeight: '600',
    },
    feedbackContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    feedbackSuccess: {
        backgroundColor: colors.secondary[700], // #32472B / dark rich green
    },
    feedbackError: {
        backgroundColor: '#8A1C16', // rich deep red
    },
    feedbackHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    feedbackLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    feedbackIconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.neutral[50],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    feedbackIconBadgeSuccess: {
        backgroundColor: colors.neutral[50],
    },
    feedbackIconBadgeError: {
        backgroundColor: colors.neutral[50],
    },
    feedbackTextWrapper: {
        flex: 1,
    },
    feedbackTitle: {
        fontFamily: fonts.headline,
        fontSize: 20,
        color: colors.neutral[50],
        fontWeight: '700',
        marginBottom: 2,
    },
    feedbackSubtitle: {
        fontFamily: fonts.body,
        fontSize: fontSize.sm,
        color: colors.neutral[100],
        opacity: 0.9,
    },
    feedbackDismiss: {
        padding: 6,
    },
    continueButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.neutral[50],
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    continueButtonText: {
        fontFamily: fonts.headline,
        fontSize: fontSize.base,
        fontWeight: '700',
    },
    continueButtonTextSuccess: {
        color: colors.secondary[700],
    },
    continueButtonTextError: {
        color: colors.error,
    },
});
