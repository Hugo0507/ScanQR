export type Screen = 'login' | 'register' | 'forgotPassword' | 'main';

export interface ScannedQR {
    id: string;
    data: string;
    timestamp: Date;
}

export interface AuthData {
    email: string;
    password: string;
    name?: string;
}