import { AttendeeData, SearchResult } from '../types';
import { authService } from './authService';

const API_BASE_URL = 'https://qr.asimetria.ai/api';

async function getAuthHeaders(): Promise<Record<string, string>> {
    const token = await authService.getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {}),
    };
}

export const apiService = {
    // Búsqueda en tiempo real con autocompletado
    async searchAttendeeRealtime(query: string): Promise<SearchResult[]> {
        if (!query || query.length < 2) return [];

        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/personas-ingresadas/?search=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Error en búsqueda');
            }

            const data = await response.json();

            // Map the Django response to SearchResult format
            return data.map((item: any) => ({
                attendeeName: item.name || item.nombre_completo,
                totalTickets: 1,
                purchaseId: item.id?.toString() || '',
                hasEntered: item.ingreso || false,
                qrCode: item.qr_code || '',
                cedula: item.cedula,
            }));
        } catch (error) {
            throw new Error('Error al buscar asistente');
        }
    },

    // Obtener todos los registros (para supervisor/admin)
    async getAllScans(operatorId?: string): Promise<any[]> {
        try {
            const headers = await getAuthHeaders();
            const url = `${API_BASE_URL}/personas-ingresadas/`;

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Error obteniendo registros');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al obtener registros');
        }
    },

    // Validar QR
    async validateQR(qrCode: string): Promise<AttendeeData> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/qr/validar/`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ code: qrCode }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 404) {
                    throw new Error('QR Inválido / No Registrado');
                } else if (response.status === 400) {
                    // Error 400 significa que ya ingresó anteriormente
                    // Intentar extraer datos de la respuesta de error si los hay
                    if (errorData.data || errorData.qr) {
                        const qrData = errorData.data || errorData.qr || errorData;
                        const peopleData = qrData.people || errorData.people || {};

                        return {
                            qrCode: qrData.code || qrCode,
                            attendeeName: peopleData.name || 'Sin nombre',
                            totalTickets: peopleData.cantidad || 1,
                            purchaseId: qrData.id?.toString() || peopleData.id?.toString() || '',
                            status: 'used',
                            hasEntered: true, // Definitivamente ya ingresó
                            personData: {
                                id: peopleData.id,
                                name: peopleData.name,
                                email: peopleData.email,
                                phone: peopleData.phone,
                                cedula: peopleData.cedula,
                                colectivo: peopleData.colectivo,
                                ingreso: true,
                                qr_sent: true,
                                created_at: qrData.created_at || new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            },
                        };
                    }
                    throw new Error(errorData.message || errorData.error || 'Entrada ya utilizada');
                }
                throw new Error('Error al validar QR');
            }

            const responseData = await response.json();

            // Success 200 significa que es la PRIMERA VEZ que escanea (ingreso recién registrado)
            if (!responseData.success || !responseData.data) {
                throw new Error(responseData.message || 'Respuesta inválida del servidor');
            }

            const qrData = responseData.data;
            const peopleData = qrData.people || {};

            // Si el backend devuelve HTTP 200, significa que SÍ permitió la operación
            // Entonces es la primera vez, independientemente del valor de ingreso
            const attendeeData = {
                qrCode: qrData.code || qrCode,
                attendeeName: peopleData.name || 'Sin nombre',
                totalTickets: peopleData.cantidad || 1,
                purchaseId: qrData.id?.toString() || peopleData.id?.toString() || '',
                status: 'valid',
                hasEntered: false, // Primera vez (el backend permitió la operación)
                personData: {
                    id: peopleData.id,
                    name: peopleData.name,
                    email: peopleData.email,
                    phone: peopleData.phone,
                    cedula: peopleData.cedula,
                    colectivo: peopleData.colectivo,
                    ingreso: false,
                    qr_sent: true,
                    created_at: qrData.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            };

            return attendeeData;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    },

    // Marcar entrada como usada (ya se marca automáticamente al validar)
    async markAsUsed(qrCode: string, purchaseId: string, operatorId: string): Promise<void> {
        // El endpoint /qr/validar/ ya marca automáticamente el ingreso
        // Este método se mantiene por compatibilidad pero no hace nada adicional
        return Promise.resolve();
    },

    // Get statistics
    async getStats(): Promise<any> {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/personas-ingresadas/stats/`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error('Error obteniendo estadísticas');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al obtener estadísticas');
        }
    },

    // SIMULACIONES (eliminar cuando conectes el backend)
    async validateQRMock(qrCode: string): Promise<AttendeeData> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (qrCode.includes('invalid')) {
            throw new Error('QR Inválido / No Registrado');
        }
        if (qrCode.includes('used')) {
            throw new Error('Entrada ya utilizada');
        }

        const mockPersonData = {
            id: 123,
            name: 'Pedro Pérez',
            email: 'pedro@example.com',
            phone: '+1234567890',
            cedula: '12345678',
            colectivo: 'VIP',
            ingreso: false,
            qr_sent: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        return {
            qrCode: qrCode,
            attendeeName: mockPersonData.name,
            totalTickets: 1,
            purchaseId: mockPersonData.id.toString(),
            status: 'valid',
            hasEntered: false,
            personData: mockPersonData,
        };
    },

    async searchAttendeeRealtimeMock(query: string): Promise<SearchResult[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const mockData: SearchResult[] = [
            {
                attendeeName: 'Pedro Pérez',
                totalTickets: 1,
                purchaseId: 'COMP-12345',
                hasEntered: false,
                qrCode: 'QR001',
                cedula: '1234567890'
            },
            {
                attendeeName: 'María García',
                totalTickets: 2,
                purchaseId: 'COMP-12346',
                hasEntered: false,
                qrCode: 'QR002',
                cedula: '2345678901'
            },
            {
                attendeeName: 'Juan López',
                totalTickets: 3,
                purchaseId: 'COMP-12347',
                hasEntered: false,
                qrCode: 'QR003',
                cedula: '3456789012'
            },
            {
                attendeeName: 'Laura Martínez',
                totalTickets: 10,
                purchaseId: 'COMP-12348',
                hasEntered: false,
                qrCode: 'QR004',
                cedula: '4567890123'
            },
            {
                attendeeName: 'Carlos Sánchez',
                totalTickets: 12,
                purchaseId: 'COMP-12349',
                hasEntered: false,
                qrCode: 'QR005',
                cedula: '5678901234'
            },
        ];

        return mockData.filter(item =>
            item.attendeeName.toLowerCase().includes(query.toLowerCase()) ||
            item.purchaseId.toLowerCase().includes(query.toLowerCase()) ||
            item.cedula?.includes(query)
        );
    },

    // Verificar conexión con el servidor
    async checkConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/health/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    // OPERATOR MANAGEMENT (Admin only)
    async getOperators(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/operators/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error obteniendo operadores');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al obtener operadores');
        }
    },

    async createOperator(username: string, password: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/operators/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Error creando operador');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Error al crear operador');
        }
    },

    async deleteOperator(operatorId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/operators/${operatorId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error eliminando operador');
            }
        } catch (error) {
            throw new Error('Error al eliminar operador');
        }
    },

    // Mock data for operator management (remove when backend is ready)
    async getOperatorsMock(): Promise<any[]> {
        await new Promise(resolve => setTimeout(resolve, 500));

        return [
            {
                id: 'op_001',
                username: 'operador1',
                name: 'Juan Pérez',
                email: 'operador@evento.com',
                createdAt: new Date('2025-01-15'),
                scanCount: 45,
            },
            {
                id: 'op_002',
                username: 'operador2',
                name: 'María González',
                email: 'maria@evento.com',
                createdAt: new Date('2025-01-20'),
                scanCount: 32,
            },
        ];
    },

    async createOperatorMock(username: string, password: string): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            id: `op_${Date.now()}`,
            username,
            name: username,
            email: `${username}@evento.com`,
            createdAt: new Date(),
            scanCount: 0,
        };
    },

    async deleteOperatorMock(operatorId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    },
};