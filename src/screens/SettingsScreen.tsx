import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { settingsService, AppSettings } from '../services/settingsService';
import { UserRole } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SettingsScreenProps {
    onClose: () => void;
    onLogout: () => void;
    onOpenOperatorManagement?: () => void;
    userRole: UserRole;
}

export default function SettingsScreen({ onClose, onLogout, onOpenOperatorManagement, userRole }: SettingsScreenProps) {
    const { theme, colors, toggleTheme } = useTheme();
    const [settings, setSettings] = useState<AppSettings>({
        soundEnabled: true,
        vibrationEnabled: true,
        theme: 'light',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        const loadedSettings = await settingsService.getSettings();
        setSettings(loadedSettings);
    }

    async function handleToggleSound(value: boolean) {
        const newSettings = { ...settings, soundEnabled: value };
        setSettings(newSettings);
        await settingsService.saveSettings(newSettings);

        if (value) {
            await settingsService.playSuccessSound();
        }
    }

    async function handleToggleVibration(value: boolean) {
        const newSettings = { ...settings, vibrationEnabled: value };
        setSettings(newSettings);
        await settingsService.saveSettings(newSettings);

        if (value) {
            await settingsService.vibrate('success');
        }
    }

    async function handleToggleTheme() {
        toggleTheme();
        const newTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
        const newSettings: AppSettings = { ...settings, theme: newTheme };
        setSettings(newSettings);
        await settingsService.saveSettings(newSettings);
    }

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Configuración</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Sonidos */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Audio y Vibración</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Sonidos de confirmación</Text>
                            <Text style={styles.settingDescription}>
                                Reproduce un sonido al escanear QR
                            </Text>
                        </View>
                        <Switch
                            value={settings.soundEnabled}
                            onValueChange={handleToggleSound}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Vibración</Text>
                            <Text style={styles.settingDescription}>
                                Vibra al escanear o detectar errores
                            </Text>
                        </View>
                        <Switch
                            value={settings.vibrationEnabled}
                            onValueChange={handleToggleVibration}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Tema */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Apariencia</Text>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleToggleTheme}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Tema</Text>
                            <Text style={styles.settingDescription}>
                                {theme === 'light' ? 'Claro' : 'Oscuro'}
                            </Text>
                        </View>
                        <Text style={styles.themeIcon}>
                            {theme === 'light' ? '☀️' : '🌙'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Administración (Admin only) */}
                {userRole === 'admin' && onOpenOperatorManagement && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Administración</Text>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={onOpenOperatorManagement}
                        >
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Gestionar Operadores</Text>
                                <Text style={styles.settingDescription}>
                                    Crear, ver y eliminar operadores
                                </Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Información */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información</Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Versión de la app</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={onLogout}
                    >
                        <Text style={styles.logoutIcon}>🚪</Text>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeButton: {
        fontSize: 28,
        color: colors.textSecondary,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    themeIcon: {
        fontSize: 24,
    },
    infoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        padding: 16,
        borderRadius: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    chevron: {
        fontSize: 28,
        color: colors.textTertiary,
        fontWeight: '300',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.dangerLight,
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    logoutIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});