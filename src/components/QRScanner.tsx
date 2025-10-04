import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { CameraView } from 'expo-camera';
import { colors } from '../styles/theme';

interface QRScannerProps {
    visible: boolean;
    isScanning: boolean;
    onBarcodeScanned: (result: any) => void;
    onClose: () => void;
}

export default function QRScanner({ visible, isScanning, onBarcodeScanned, onClose }: QRScannerProps) {
    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={isScanning ? onBarcodeScanned : undefined}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                />

                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.instructionText}>
                        Apunta la cámara al código QR
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 3,
        borderColor: '#00ff00',
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    instructionText: {
        marginTop: 20,
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 12,
        borderRadius: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 32,
        left: 32,
        right: 32,
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});