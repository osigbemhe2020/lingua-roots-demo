import React from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'surface' | 'success' | 'white';

export interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({
    title,
    onPress,
    disabled = false,
    variant = 'primary',
    icon,
    iconPosition = 'right',
    style,
    textStyle,
}: ButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.base,
                styles[variant],
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                style,
            ]}
            disabled={disabled}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
        >
            {icon && iconPosition === 'left' && icon}
            <Text
                style={[
                    styles.text,
                    variant === 'surface' && styles.surfaceText,
                    variant === 'white' && styles.whiteText,
                    textStyle,
                ]}
            >
                {title}
            </Text>
            {icon && iconPosition === 'right' && icon}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        height: 58,
        borderRadius: 29,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 8,
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    primary: {
        backgroundColor: colors.primary[800],
    },
    secondary: {
        backgroundColor: colors.neutral[200],
        shadowOpacity: 0,
        elevation: 0,
    },
    surface: {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.neutral[300],
    },
    success: {
        backgroundColor: colors.success,
    },
    white: {
        backgroundColor: colors.neutral[50],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    disabled: {
        backgroundColor: colors.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
    text: {
        fontFamily: fonts.label,
        fontSize: fontSize.base,
        color: colors.neutral[50],
        fontWeight: '600',
    },
    surfaceText: {
        color: colors.textPrimary,
    },
    whiteText: {
        fontFamily: fonts.headline,
        color: colors.primary[800],
        fontWeight: '700',
    },
});
