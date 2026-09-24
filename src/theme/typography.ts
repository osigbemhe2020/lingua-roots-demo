
// ---- Font family tokens ----

export const fonts = {
    headline: 'BricolageGrotesque_700Bold',
    body: 'Inter_400Regular',
    label: 'Inter_500Medium',
} as const;

// ---- Type scale ----
export const fontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
} as const;

export const lineHeight = {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 26,
    xl: 30,
    '2xl': 36,
    '3xl': 42,
} as const;

/**
 * ---- Reusable text styles ----
 * Pre-composed font + size + line-height combos for the roles that
 * actually show up in this app (screen titles, question prompts,
 * option labels, buttons, captions). Prefer reaching for these over
 * building a one-off style in every component.
 */
export const textStyles = {
    screenTitle: {
        fontFamily: fonts.headline,
        fontSize: fontSize['3xl'],
        lineHeight: lineHeight['3xl'],
    },
    questionPrompt: {
        fontFamily: fonts.headline,
        fontSize: fontSize.xl,
        lineHeight: lineHeight.xl,
    },
    body: {
        fontFamily: fonts.body,
        fontSize: fontSize.base,
        lineHeight: lineHeight.base,
    },
    optionLabel: {
        fontFamily: fonts.label,
        fontSize: fontSize.base,
        lineHeight: lineHeight.base,
    },
    buttonLabel: {
        fontFamily: fonts.label,
        fontSize: fontSize.base,
        lineHeight: lineHeight.sm,
    },
    caption: {
        fontFamily: fonts.body,
        fontSize: fontSize.xs,
        lineHeight: lineHeight.xs,
    },
} as const;