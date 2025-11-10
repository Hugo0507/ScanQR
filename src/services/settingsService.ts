import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import { Audio } from 'expo-av';

const SETTINGS_KEY = '@app_settings';

export interface AppSettings {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    theme: 'light' | 'dark';
}

const defaultSettings: AppSettings = {
    soundEnabled: true,
    vibrationEnabled: true,
    theme: 'light',
};

export const settingsService = {
    async getSettings(): Promise<AppSettings> {
        try {
            const settings = await AsyncStorage.getItem(SETTINGS_KEY);
            return settings ? JSON.parse(settings) : defaultSettings;
        } catch (error) {
            console.error('Error getting settings:', error);
            return defaultSettings;
        }
    },

    async saveSettings(settings: AppSettings): Promise<void> {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    },

    async toggleSound(): Promise<boolean> {
        const settings = await this.getSettings();
        settings.soundEnabled = !settings.soundEnabled;
        await this.saveSettings(settings);
        return settings.soundEnabled;
    },

    async toggleVibration(): Promise<boolean> {
        const settings = await this.getSettings();
        settings.vibrationEnabled = !settings.vibrationEnabled;
        await this.saveSettings(settings);
        return settings.vibrationEnabled;
    },

    async toggleTheme(): Promise<'light' | 'dark'> {
        const settings = await this.getSettings();
        settings.theme = settings.theme === 'light' ? 'dark' : 'light';
        await this.saveSettings(settings);
        return settings.theme;
    },

    // Reproducir sonido de éxito
    async playSuccessSound(): Promise<void> {
        const settings = await this.getSettings();
        if (settings.soundEnabled) {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/succes.wav'), // Necesitarás agregar este archivo
                    { shouldPlay: true }
                );
                await sound.playAsync();
            } catch (error) {
                console.log('Error playing sound:', error);
            }
        }
    },

    // Reproducir sonido de error
    async playErrorSound(): Promise<void> {
        const settings = await this.getSettings();
        if (settings.soundEnabled) {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/sounds/error.wav'), // Necesitarás agregar este archivo
                    { shouldPlay: true }
                );
                await sound.playAsync();
            } catch (error) {
                console.log('Error playing sound:', error);
            }
        }
    },

    // Vibrar dispositivo
    async vibrate(pattern: 'success' | 'error' | 'warning'): Promise<void> {
        const settings = await this.getSettings();
        if (settings.vibrationEnabled) {
            switch (pattern) {
                case 'success':
                    Vibration.vibrate(200);
                    break;
                case 'error':
                    Vibration.vibrate([0, 100, 100, 100]);
                    break;
                case 'warning':
                    Vibration.vibrate([0, 200, 100, 200]);
                    break;
            }
        }
    },
};