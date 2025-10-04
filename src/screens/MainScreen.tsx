import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import QRScanner from '../components/QRScanner';
import QRHistoryList from '../components/QRHistoryList';
import { ScannedQR } from '../types';
import { colors } from '../styles/theme';

interface MainScreenProps {
    userName: string;
    scannedQRs: ScannedQR[];
    onLogout: () => void;
    onQRScanned: (data: string) => void;
    onDeleteQR: (id: string) => void;
    onClearAll: () => void;
}

export default function MainScreen({
                                       userName,
                                       scannedQRs,
                                       onLogout,
                                       onQRScanned,
                                       onDeleteQR,
                                       onClearAll,
                                   }: MainScreenProps) {
    const [modalIsVisible, setModalIsVisible] = React.useState(false);
    const [isScanning, setIsScanning] = React.useState(true);
    const [permission, requestPermission] = useCameraPermissions();

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
            setModalIsVisible(true);
        } catch (error) {
            console.error(error);
        }
    }

    function handleBarcodeScanned(scanningResult: any) {
        if (!isScanning) return;

        setIsScanning(false);
        const qrData = scanningResult.data;
        onQRScanned(qrData);

        Alert.alert(
            'QR Escaneado',
            `Contenido: ${qrData}`,
            [
                {
                    text: 'Escanear otro',
                    onPress: () => setIsScanning(true)
                },
                {
                    text: 'Cerrar',
                    onPress: () => setModalIsVisible(false)
                }
            ]
        );
    }

    function handleCloseCamera() {
        setModalIsVisible(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>¡Hola, {userName}!</Text>
                <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.mainContent}>
                <View style={styles.iconContainer}>
                    <View style={styles.qrIcon}>
                        <Text style={styles.qrIconText}>📱</Text>
                    </View>
                </View>

                <Text style={styles.mainTitle}>Escanear Código QR</Text>
                <Text style={styles.mainSubtitle}>
                    Presiona el botón para abrir la cámara y escanear
                </Text>

                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={handleOpenCamera}
                    activeOpacity={0.8}
                >
                    <Text style={styles.scanButtonText}>🔍 Escanear QR</Text>
                </TouchableOpacity>

                <QRHistoryList
                    scannedQRs={scannedQRs}
                    onDeleteQR={onDeleteQR}
                    onClearAll={onClearAll}
                />
            </ScrollView>

            <QRScanner
                visible={modalIsVisible}
                isScanning={isScanning}
                onBarcodeScanned={handleBarcodeScanned}
                onClose={handleCloseCamera}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: '#fff',
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
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
    },
    logoutButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    logoutText: {
        color: colors.primary,
        fontSize: 14,
    },
    mainScrollView: {
        flex: 1,
    },
    mainContent: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 40,
    },
    iconContainer: {
        marginBottom: 24,
        marginTop: 20,
    },
    qrIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrIconText: {
        fontSize: 48,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    mainSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    scanButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 48,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 32,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});