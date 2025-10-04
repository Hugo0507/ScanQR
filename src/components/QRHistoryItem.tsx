import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScannedQR } from '../types';
import { colors } from '../styles/theme';

interface QRHistoryItemProps {
    qr: ScannedQR;
    onDelete: (id: string) => void;
    formatDate: (date: Date) => string;
}

export default function QRHistoryItem({ qr, onDelete, formatDate }: QRHistoryItemProps) {
    return (
        <View style={styles.qrItem}>
            <View style={styles.qrItemContent}>
                <View style={styles.qrItemIcon}>
                    <Text style={styles.qrItemIconText}>📋</Text>
                </View>
                <View style={styles.qrItemText}>
                    <Text style={styles.qrItemData} numberOfLines={2}>
                        {qr.data}
                    </Text>
                    <Text style={styles.qrItemTime}>
                        {formatDate(qr.timestamp)}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => onDelete(qr.id)}
                style={styles.deleteButton}
            >
                <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    qrItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    qrItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    qrItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    qrItemIconText: {
        fontSize: 20,
    },
    qrItemText: {
        flex: 1,
    },
    qrItemData: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
        marginBottom: 4,
    },
    qrItemTime: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    deleteButton: {
        padding: 8,
    },
    deleteButtonText: {
        fontSize: 20,
    },
});