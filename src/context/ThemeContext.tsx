

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lightColors, darkColors } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    colors: typeof lightColors;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeMode>('light');

    useEffect(() => {
        loadTheme();
    }, []);

    async function loadTheme() {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeState(savedTheme);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }

    async function saveTheme(newTheme: ThemeMode) {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

    function setTheme(newTheme: ThemeMode) {
        setThemeState(newTheme);
        saveTheme(newTheme);
    }

    function toggleTheme() {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    const colors = theme === 'light' ? lightColors : darkColors;

    const value: ThemeContextType = {
        theme,
        colors,
        toggleTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
