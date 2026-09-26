import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fonts, fontSize, lineHeight } from '../theme/typography';

import { Button } from '../components/Button';
import { LanguageOption, LANGUAGES } from '../data/languages';

export default function LanguageSelect() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedId, setSelectedId] = useState<string>('swahili');

    const renderIcon = (option: LanguageOption, isSelected: boolean) => {
        const iconColor = isSelected ? colors.primary[700] : colors.neutral[600];
        const size = 20;

        if (option.iconType === 'feather') {
            return <Feather name={option.iconName as any} size={size} color={iconColor} />;
        }
        if (option.iconType === 'material') {
            return <MaterialIcons name={option.iconName as any} size={size} color={iconColor} />;
        }
        return <Ionicons name={option.iconName as any} size={size} color={iconColor} />;
    };

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
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.brandTitle}>LinguaRoots</Text>
            </View>

            {/* Main Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        {'Which language\nwould you like to\nlearn?'}
                    </Text>
                </View>

                {/* 2-Column Grid */}
                <View style={styles.grid}>
                    {LANGUAGES.map((lang) => {
                        const isSelected = lang.id === selectedId;

                        return (
                            <Pressable
                                key={lang.id}
                                onPress={() => setSelectedId(lang.id)}
                                style={[
                                    styles.card,
                                    isSelected ? styles.cardSelected : styles.cardUnselected,
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    <View
                                        style={[
                                            styles.iconCircle,
                                            isSelected ? styles.iconCircleSelected : styles.iconCircleUnselected,
                                        ]}
                                    >
                                        {renderIcon(lang, isSelected)}
                                    </View>

                                    {isSelected && (
                                        <View style={styles.checkBadge}>
                                            <Ionicons name="checkmark" size={13} color={colors.neutral[50]} />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                    <Text style={styles.languageGreeting}>{lang.greeting}</Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Footer CTA */}
            <View style={styles.footer}>
                <Button
                    title="Continue"
                    disabled={!selectedId}
                    icon={<Feather name="arrow-right" size={20} color={colors.neutral[50]} />}
                    onPress={() =>
                        router.push({
                            pathname: '/lesson',
                            params: { languageId: selectedId },
                        })
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    brandTitle: {
        textAlign: 'center',
        fontFamily: fonts.headline,
        fontSize: fontSize['2xl'],
        color: colors.primary[700],
        letterSpacing: -0.5,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: fonts.headline,
        fontSize: fontSize['3xl'],
        lineHeight: lineHeight['3xl'],
        color: colors.textPrimary,
        textAlign: 'center',
        fontWeight: '700',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 14,
    },
    card: {
        width: '48%',
        borderRadius: 24,
        padding: 16,
        minHeight: 132,
        justifyContent: 'space-between',
    },
    cardUnselected: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    cardSelected: {
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.primary[800],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleUnselected: {
        backgroundColor: colors.neutral[200],
    },
    iconCircleSelected: {
        backgroundColor: colors.tertiary[100],
    },
    checkBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary[800],
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFooter: {
        marginTop: 14,
    },
    languageName: {
        fontFamily: fonts.headline,
        fontSize: fontSize.lg,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    languageGreeting: {
        fontFamily: fonts.body,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    continueButton: {
        backgroundColor: colors.primary[800],
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    continueButtonDisabled: {
        backgroundColor: colors.disabled,
    },
    continueText: {
        fontFamily: fonts.label,
        fontSize: fontSize.base,
        color: colors.neutral[50],
    },
});