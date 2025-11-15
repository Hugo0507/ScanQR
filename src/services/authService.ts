import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export interface UserData {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    token: string;
}

export const authService = {
    async saveAuth(userData: UserData): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, userData.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving auth:', error);
            throw error;
        }
    },

    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    async getUserData(): Promise<UserData | null> {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return token !== null;
    },

    async logout(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    },

    // Login con backend real
    async login(email: string, password: string): Promise<UserData> {
        try {
            console.log('🔐 Attempting login to:', 'https://qr.asimetria.ai/api/auth/login/');
            console.log('📧 Username:', email);

            const response = await fetch('https://qr.asimetria.ai/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);

                if (response.status === 400 || response.status === 401) {
                    throw new Error('Credenciales inválidas');
                }
                throw new Error(`Error del servidor (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Login successful:', data);

            // Map backend response to UserData (based on API schema)
            const userData: UserData = {
                id: data.user_id?.toString() || '',
                email: data.username || email,
                name: data.username || email,
                role: 'admin', // Por ahora todos como admin, ajustar si el backend envía rol
                token: data.token || '',
            };

            return userData;
        } catch (error) {
            console.error('❌ Login error:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    },
};