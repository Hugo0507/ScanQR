import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import QRScanner from '../components/QRScanner';
import AttendeeCard from '../components/AttendeeCard';
import AttendeeSearch from '../components/AttendeeSearch';
import StatsCounter from '../components/StatsCounter';
import RoleBadge from '../components/RoleBadge';
import SettingsScreen from './SettingsScreen';
import { ScannedQR, AttendeeData, SearchResult, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { settingsService } from '../services/settingsService';
import { useTheme } from '../context/ThemeContext';

interface MainScreenProps {
    userName: string;
    userRole: UserRole;
    userId: string;
    scannedQRs: ScannedQR[];
    onLogout: () => void;
    onQRScanned: (attendeeData: AttendeeData) => void;
    onDeleteQR: (id: string) => void;
    onClearAll: () => void;
    onOpenOperatorManagement?: () => void;
}

export default function MainScreen({
                                       userName,
                                       userRole,
                                       userId,
                                       scannedQRs,
                                       onLogout,
                                       onQRScanned,
                                       onDeleteQR,
                                       onClearAll,
                                       onOpenOperatorManagement,
                                   }: MainScreenProps) {
    const { colors } = useTheme();
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid' | 'duplicate'>('idle');
    const [permission, requestPermission] = useCameraPermissions();

    // Calcular total de personas ingresadas
    const totalPeopleEntered = scannedQRs
        .filter(qr => !qr.alreadyScanned)
        .reduce((sum, qr) => sum + qr.totalTickets, 0);

    // Verificar permisos según rol
    const canDeleteRecords = true; // Both admin and operador can delete
    const canSeeAllRecords = userRole === 'admin';
    const showOperatorInfo = canSeeAllRecords;

    async function handleOpenCamera() {
        try {
            if (!permission?.granted) {
                const { granted } = await requestPermission();
                if (!granted) {
                    Alert.alert('Permisos denegados', 'Necesitas dar permisos de cámara');
                    return;
                }
            }
            setIsScanning(true);
            setValidationStatus('idle');
            setModalIsVisible(true);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleBarcodeScanned(scanningResult: any) {
        if (!isScanning) return;

        setIsScanning(false);
        setValidationStatus('validating');

        const qrCode = scanningResult.data;

        try {
            const attendeeData = await apiService.validateQR(qrCode);
            const alreadyScannedInSession = scannedQRs.some(qr => qr.qrCode === qrCode);

            // Si ya ingresó (desde el backend o en esta sesión)
            if (attendeeData.hasEntered || alreadyScannedInSession) {
                setValidationStatus('duplicate');
                await settingsService.vibrate('warning');
                await settingsService.playErrorSound();

                setTimeout(() => {
                    setModalIsVisible(false);
                    onQRScanned(attendeeData); // Enviar a App.tsx para que muestre AttendeeDetailScreen
                }, 1000);
            } else {
                // QR válido y primera entrada
                setValidationStatus('valid');
                await settingsService.vibrate('success');
                await settingsService.playSuccessSound();

                setTimeout(() => {
                    setModalIsVisible(false);
                    onQRScanned(attendeeData); // Enviar a App.tsx para que muestre AttendeeDetailScreen
                }, 1000);
            }
        } catch (error) {
            setValidationStatus('invalid');
            await settingsService.vibrate('error');
            await settingsService.playErrorSound();

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

            setTimeout(() => {
                Alert.alert(
                    '❌ Error de validación',
                    errorMessage,
                    [
                        {
                            text: 'Buscar manualmente',
                            onPress: () => {
                                setModalIsVisible(false);
                                setSearchModalVisible(true);
                            }
                        },
                        {
                            text: 'Reintentar',
                            onPress: () => {
                                setIsScanning(true);
                                setValidationStatus('idle');
                            }
                        },
                        {
                            text: 'Cancelar',
                            onPress: () => setModalIsVisible(false)
                        }
                    ]
                );
            }, 1000);
        }
    }

    function handleCloseCamera() {
        setModalIsVisible(false);
        setValidationStatus('idle');
    }

    function handleSelectFromSearch(result: SearchResult) {
        setSearchModalVisible(false);

        if (result.hasEntered) {
            Alert.alert(
                '⚠️ Ya ingresó',
                `${result.attendeeName} ya registró su ingreso previamente.`,
                [{ text: 'OK' }]
            );
        } else {
            const attendeeData: AttendeeData = {
                qrCode: result.qrCode || '',
                attendeeName: result.attendeeName,
                totalTickets: result.totalTickets,
                purchaseId: result.purchaseId,
                hasEntered: result.hasEntered,
            };
            onQRScanned(attendeeData);
        }
    }

    function handleClearHistory() {
        Alert.alert(
            'Limpiar historial',
            '¿Estás seguro de que quieres eliminar todo el historial? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: onClearAll
                }
            ]
        );
    }

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerTop}>
                        <Text style={styles.welcomeText}>Hola, {userName}</Text>
                        <RoleBadge role={userRole} size="small" />
                    </View>
                    <Text style={styles.subtitle}>Control de acceso</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => setSettingsModalVisible(true)}
                        style={styles.iconButton}
                    >
                        <Text style={styles.iconButtonText}>⚙️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <StatsCounter
                    totalPeopleEntered={totalPeopleEntered}
                    totalScans={scannedQRs.length}
                />

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.scanButtonLarge}
                        onPress={handleOpenCamera}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.scanIcon}>📷</Text>
                        <Text style={styles.scanButtonText}>Escanear QR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => setSearchModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.searchIcon}>🔍</Text>
                        <Text style={styles.searchButtonText}>Búsqueda Manual</Text>
                    </TouchableOpacity>
                </View>

                {/* Historial */}
                {scannedQRs.length > 0 && (
                    <View style={styles.historySection}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.historyTitle}>
                                {canSeeAllRecords ? 'Todos los registros' : 'Mis registros'}
                            </Text>
                            {canDeleteRecords && (
                                <TouchableOpacity onPress={handleClearHistory}>
                                    <Text style={styles.clearAllText}>Limpiar</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {scannedQRs.map((qr) => (
                            <AttendeeCard
                                key={qr.id}
                                attendee={qr}
                                onDelete={canDeleteRecords ? onDeleteQR : undefined}
                                showDelete={canDeleteRecords}
                                showOperator={showOperatorInfo}
                            />
                        ))}
                    </View>
                )}

                {scannedQRs.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyText}>Aún no hay registros</Text>
                        <Text style={styles.emptySubtext}>
                            Escanea un código QR para comenzar
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal de escáner */}
            <QRScanner
                visible={modalIsVisible}
                isScanning={isScanning}
                onBarcodeScanned={handleBarcodeScanned}
                onClose={handleCloseCamera}
                validationStatus={validationStatus}
            />

            {/* Modal de búsqueda */}
            <Modal
                visible={searchModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <AttendeeSearch
                    onSelectAttendee={handleSelectFromSearch}
                    onClose={() => setSearchModalVisible(false)}
                />
            </Modal>

            {/* Modal de configuración */}
            <Modal
                visible={settingsModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SettingsScreen
                    onClose={() => setSettingsModalVisible(false)}
                    onLogout={onLogout}
                    userRole={userRole}
                    onOpenOperatorManagement={onOpenOperatorManagement}
                />
            </Modal>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.cardBackground,
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerLeft: {
        flex: 1,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonText: {
        fontSize: 18,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    actionButtons: {
        gap: 12,
        marginBottom: 24,
    },
    scanButtonLarge: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    scanIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    searchButton: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    searchButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    historySection: {
        marginTop: 8,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    clearAllText: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textTertiary,
    },
});