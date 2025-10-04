import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors, commonStyles } from '../styles/theme';
import { Screen } from '../types';

interface ForgotPasswordScreenProps {
    email: string;
    onEmailChange: (email: string) => void;
    onSubmit: () => void;
    onNavigate: (screen: Screen) => void;
}

export default function ForgotPasswordScreen({
                                                 email,
                                                 onEmailChange,
                                                 onSubmit,
                                                 onNavigate,
                                             }: ForgotPasswordScreenProps) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={commonStyles.card}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => onNavigate('login')}
                    >
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>🔑</Text>
                        </View>
                        <Text style={styles.appTitle}>Recuperar Contraseña</Text>
                        <Text style={styles.appSubtitle}>Te enviaremos un enlace a tu email</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.textTertiary}
                            value={email}
                            onChangeText={onEmailChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={commonStyles.button}
                        onPress={onSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={commonStyles.buttonText}>Enviar enlace</Text>
                    </TouchableOpacity>

                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>¿Recordaste tu contraseña? </Text>
                        <TouchableOpacity onPress={() => onNavigate('login')}>
                            <Text style={styles.loginLink}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    appTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 24,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginLinkText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});