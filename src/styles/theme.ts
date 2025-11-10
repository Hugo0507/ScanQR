import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const lightColors = {
    // Modern primary palette
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',

    // Secondary colors
    secondary: '#8B5CF6', // Purple
    secondaryLight: '#A78BFA',

    // Status colors
    success: '#10B981', // Green
    successLight: '#34D399',
    danger: '#EF4444', // Red
    dangerLight: '#F87171',
    warning: '#F59E0B', // Amber
    warningLight: '#FBBF24',
    info: '#3B82F6', // Blue

    // Neutral palette
    background: '#F9FAFB',
    backgroundDark: '#F3F4F6',
    cardBackground: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    inputBackground: '#F9FAFB',

    // Accent colors
    accent: '#EC4899', // Pink
    accentLight: '#F472B6',
};

export const darkColors = {
    // Modern primary palette
    primary: '#818CF8', // Lighter Indigo for dark mode
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',

    // Secondary colors
    secondary: '#A78BFA', // Lighter Purple
    secondaryLight: '#C4B5FD',

    // Status colors
    success: '#34D399', // Lighter Green
    successLight: '#6EE7B7',
    danger: '#F87171', // Lighter Red
    dangerLight: '#FCA5A5',
    warning: '#FBBF24', // Lighter Amber
    warningLight: '#FCD34D',
    info: '#60A5FA', // Lighter Blue

    // Neutral palette - Dark mode
    background: '#111827', // Dark gray
    backgroundDark: '#0F172A', // Darker gray
    cardBackground: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    border: '#374151',
    borderLight: '#4B5563',
    inputBackground: '#1F2937',

    // Accent colors
    accent: '#F472B6', // Lighter Pink
    accentLight: '#F9A8D4',
};

export const colors = lightColors; // Default to light theme for backwards compatibility

export const spacing = {
    xs: width * 0.02,
    sm: width * 0.03,
    md: width * 0.04,
    lg: width * 0.05,
    xl: width * 0.06,
};

export const fontSize = {
    xs: width * 0.03,
    sm: width * 0.035,
    md: width * 0.04,
    lg: width * 0.045,
    xl: width * 0.05,
    xxl: width * 0.06,
};

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 24,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: spacing.md,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: fontSize.md,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.inputBackground,
        borderRadius: 12,
        padding: spacing.md,
        fontSize: fontSize.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
});