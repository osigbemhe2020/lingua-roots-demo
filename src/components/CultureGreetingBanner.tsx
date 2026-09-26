import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontSize, fonts } from '../theme/typography';

interface CultureGreetingBannerProps {
    greeting: string;
    languageName: string;
}

export const CultureGreetingBanner: React.FC<CultureGreetingBannerProps> = ({
    greeting,
    languageName,
}) => {
    return (
        <View style={styles.graphicCard}>
            <View style={styles.graphicInner}>
                <View style={styles.brandWordmark}>
                    <Text style={styles.graphicBrandText}>Lingua Roots</Text>
                </View>
                <View style={styles.characterBadge}>
                    <Ionicons name="sparkles" size={24} color={colors.primary[500]} />
                </View>
                <Text style={styles.characterGreeting}>
                    {greeting}, Learner!
                </Text>
                <Text style={styles.characterCaption}>
                    Let's learn {languageName} today.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});
