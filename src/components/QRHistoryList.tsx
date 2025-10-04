import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScannedQR } from '../types';
import QRHistoryItem from './QRHistoryItem';
import { colors } from '../styles/theme';

interface QRHistoryListProps {
    scannedQRs: ScannedQR[];
    onDeleteQR: (id: string) => void;
    onClearAll: () => void;
}

export default function QRHistoryList({ scannedQRs, onDeleteQR, onClearAll }: QRHistoryListProps) {
    function formatDate(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffDays < 7) return `Hace ${diffDays} días`;

        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function handleDeleteQR(id: string) {
        Alert.alert(
            'Eliminar QR',
            '¿Estás seguro de que quieres eliminar este código?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => onDeleteQR(id)
                }
            ]
        );
    }

    function handleClearAll() {
        if (scannedQRs.length === 0) return;

        Alert.alert(
            'Limpiar historial',
            '¿Estás seguro de que quieres eliminar todos los códigos escaneados?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar todos',
                    style: 'destructive',
                    onPress: onClearAll
                }
            ]
        );
    }

    if (scannedQRs.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                    Aún no has escaneado ningún código QR
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>
                    Historial ({scannedQRs.length})
                </Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearAllText}>Limpiar todo</Text>
                </TouchableOpacity>
            </View>

            {scannedQRs.map((qr) => (
                <QRHistoryItem
                    key={qr.id}
                    qr={qr}
                    onDelete={handleDeleteQR}
                    formatDate={formatDate}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    historyContainer: {
        width: '100%',
        marginTop: 8,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    clearAllText: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: colors.textTertiary,
        textAlign: 'center',
    },
});