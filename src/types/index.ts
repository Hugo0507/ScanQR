export type Screen = 'login' | 'forgotPassword' | 'main' | 'attendeeDetail';

export type UserRole = 'admin' | 'operador';

export interface UserData {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    token: string;
}

export interface ScannedQR {
    id: string;
    qrCode: string;
    attendeeName: string;
    totalTickets: number;
    purchaseId: string;
    timestamp: Date;
    status?: 'valid' | 'used' | 'invalid';
    alreadyScanned?: boolean;
    scannedBy?: string; // ID del operador que escaneó
    operatorName?: string; // Nombre del operador
}

export interface PersonData {
    id: number | string;
    name: string;
    email: string;
    phone: string | null;
    cedula: string | null;
    colectivo: string | null;
    ingreso: boolean;
    qr_sent: boolean;
    created_at: string;
    updated_at: string;
}

export interface AttendeeData {
    qrCode: string;
    attendeeName: string;
    totalTickets: number;
    purchaseId: string;
    status?: 'valid' | 'used' | 'invalid';
    hasEntered?: boolean;
    personData?: PersonData;
}

export interface SearchResult {
    attendeeName: string;
    totalTickets: number;
    purchaseId: string;
    hasEntered: boolean;
    qrCode?: string;
    cedula?: string;
}

export interface AppSettings {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    theme: 'light' | 'dark';
}