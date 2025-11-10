import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { CameraView } from 'expo-camera';
import { colors } from '../styles/theme';
import ConnectionStatus from './ConnectionStatus';

interface QRScannerProps {
    visible: boolean;
    isScanning: boolean;
    onBarcodeScanned: (result: any) => void;
    onClose: () => void;
    validationStatus?: 'idle' | 'validating' | 'valid' | 'invalid' | 'duplicate';
}

export default function QRScanner({
                                      visible,
                                      isScanning,
                                      onBarcodeScanned,
                                      onClose,
                                      validationStatus = 'idle'
                                  }: QRScannerProps) {
    const [pulseAnim] = useState(new Animated.Value(1));

    React.useEffect(() => {
        if (validationStatus === 'validating') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [validationStatus]);

    function getFrameColor() {
        switch (validationStatus) {
            case 'validating':
                return colors.warning;
            case 'valid':
                return colors.success;
            case 'invalid':
                return colors.danger;
            case 'duplicate':
                return colors.warning;
            default:
                return '#00ff00';
        }
    }

    function getStatusMessage() {
        switch (validationStatus) {
            case 'validating':
                return '⏳ Validando...';
            case 'valid':
                return '✅ QR Válido';
            case 'invalid':
                return '❌ QR Inválido';
            case 'duplicate':
                return '⚠️ Entrada ya utilizada';
            default:
                return 'Apunta la cámara al código QR';
        }
    }

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

                {/* Indicador de conexión */}
                <ConnectionStatus />

                {/* Overlay con marco animado */}
                <View style={styles.overlay}>
                    <Animated.View
                        style={[
                            styles.scanFrame,
                            {
                                borderColor: getFrameColor(),
                                transform: [{ scale: pulseAnim }]
                            }
                        ]}
                    >
                        {/* Esquinas del marco */}
                        <View style={[styles.corner, styles.cornerTopLeft, { borderColor: getFrameColor() }]} />
                        <View style={[styles.corner, styles.cornerTopRight, { borderColor: getFrameColor() }]} />
                        <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: getFrameColor() }]} />
                        <View style={[styles.corner, styles.cornerBottomRight, { borderColor: getFrameColor() }]} />
                    </Animated.View>

                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getFrameColor() }
                    ]}>
                        <Text style={styles.instructionText}>
                            {getStatusMessage()}
                        </Text>
                    </View>
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
        backgroundColor: '#000',
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
        width: 280,
        height: 280,
        borderWidth: 2,
        borderRadius: 20,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderWidth: 4,
    },
    cornerTopLeft: {
        top: -2,
        left: -2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 20,
    },
    cornerTopRight: {
        top: -2,
        right: -2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 20,
    },
    cornerBottomLeft: {
        bottom: -2,
        left: -2,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 20,
    },
    cornerBottomRight: {
        bottom: -2,
        right: -2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 20,
    },
    statusBadge: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    instructionText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
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