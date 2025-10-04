import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors, commonStyles } from '../styles/theme';
import { Screen } from '../types';

interface LoginScreenProps {
    email: string;
    password: string;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onLogin: () => void;
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
                        <Text style={styles.appTitle}>Scanner</Text>
                        <Text style={styles.appSubtitle}>Escanea códigos QR fácilmente</Text>
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

                        <TextInput
                            style={commonStyles.input}
                            placeholder="Contraseña"
                            placeholderTextColor={colors.textTertiary}
                            value={password}
                            onChangeText={onPasswordChange}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={commonStyles.button}
                        onPress={onLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={commonStyles.buttonText}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => onNavigate('forgotPassword')}
                    >
                        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>o</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => onNavigate('register')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.registerButtonText}>Crear cuenta nueva</Text>
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
    forgotPassword: {
        alignItems: 'center',
        marginBottom: 16,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: 16,
        color: colors.textTertiary,
        fontSize: 14,
    },
    registerButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    registerButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});