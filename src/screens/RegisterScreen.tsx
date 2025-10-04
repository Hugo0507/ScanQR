import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors, commonStyles } from '../styles/theme';
import { Screen } from '../types';

interface RegisterScreenProps {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    onNameChange: (name: string) => void;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onConfirmPasswordChange: (password: string) => void;
    onRegister: () => void;
    onNavigate: (screen: Screen) => void;
}

export default function RegisterScreen({
                                           name,
                                           email,
                                           password,
                                           confirmPassword,
                                           onNameChange,
                                           onEmailChange,
                                           onPasswordChange,
                                           onConfirmPasswordChange,
                                           onRegister,
                                           onNavigate,
                                       }: RegisterScreenProps) {
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
                            <Text style={styles.logoText}>QR</Text>
                        </View>
                        <Text style={styles.appTitle}>Crear Cuenta</Text>
                        <Text style={styles.appSubtitle}>Regístrate para empezar</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Nombre completo"
                            placeholderTextColor={colors.textTertiary}
                            value={name}
                            onChangeText={onNameChange}
                            autoCapitalize="words"
                        />

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

                        <TextInput
                            style={commonStyles.input}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor={colors.textTertiary}
                            value={confirmPassword}
                            onChangeText={onConfirmPasswordChange}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={commonStyles.button}
                        onPress={onRegister}
                        activeOpacity={0.8}
                    >
                        <Text style={commonStyles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>¿Ya tienes cuenta? </Text>
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