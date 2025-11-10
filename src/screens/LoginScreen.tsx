import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/theme';
import { Screen } from '../types';
import { isValidEmail } from '../utils/validation';

interface LoginScreenProps {
    email: string;
    password: string;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onLogin: () => Promise<void>;
    onNavigate: (screen: Screen) => void;
}

export default function LoginScreen({
                                        email,
                                        password,
                                        onEmailChange,
                                        onPasswordChange,
                                        onLogin,
                                        onNavigate,
                                    }: LoginScreenProps) {
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function validateEmail(value: string) {
        onEmailChange(value);
        if (value && !isValidEmail(value)) {
            setEmailError('Ingresa un email válido');
        } else {
            setEmailError('');
        }
    }

    function validatePassword(value: string) {
        onPasswordChange(value);
        if (value && value.length < 6) {
            setPasswordError('Mínimo 6 caracteres');
        } else {
            setPasswordError('');
        }
    }

    async function handleLogin() {
        let hasError = false;

        if (!email) {
            setEmailError('El email es requerido');
            hasError = true;
        } else if (!isValidEmail(email)) {
            setEmailError('Ingresa un email válido');
            hasError = true;
        }

        if (!password) {
            setPasswordError('La contraseña es requerida');
            hasError = true;
        } else if (password.length < 6) {
            setPasswordError('Mínimo 6 caracteres');
            hasError = true;
        }

        if (hasError) return;

        setIsLoading(true);
        try {
            await onLogin();
        } catch (error) {
            Alert.alert('Error', 'No se pudo iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={commonStyles.card}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>QR</Text>
                        </View>
                        <Text style={styles.appTitle}>Event Check-in</Text>
                        <Text style={styles.appSubtitle}>Control de acceso a eventos</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[
                                commonStyles.input,
                                emailError ? styles.inputError : null
                            ]}
                            placeholder="Email"
                            placeholderTextColor={colors.textTertiary}
                            value={email}
                            onChangeText={validateEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        {emailError ? (
                            <Text style={styles.errorText}>{emailError}</Text>
                        ) : null}

                        <TextInput
                            style={[
                                commonStyles.input,
                                passwordError ? styles.inputError : null
                            ]}
                            placeholder="Contraseña"
                            placeholderTextColor={colors.textTertiary}
                            value={password}
                            onChangeText={validatePassword}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        {passwordError ? (
                            <Text style={styles.errorText}>{passwordError}</Text>
                        ) : null}
                    </View>

                    <TouchableOpacity
                        style={[
                            commonStyles.button,
                            isLoading && styles.buttonDisabled
                        ]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={commonStyles.buttonText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => onNavigate('forgotPassword')}
                        disabled={isLoading}
                    >
                        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
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
        color: '#fff',
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
    inputError: {
        borderColor: colors.danger,
        borderWidth: 2,
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
        marginLeft: 4,
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});