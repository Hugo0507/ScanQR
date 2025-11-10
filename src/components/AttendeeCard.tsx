import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScannedQR } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AttendeeCardProps {
    attendee: ScannedQR;
    onDelete?: (id: string) => void;
    showDelete?: boolean;
    showOperator?: boolean; // Para supervisor/admin
}

export default function AttendeeCard({
                                         attendee,
                                         onDelete,
                                         showDelete = true,
                                         showOperator = false
                                     }: AttendeeCardProps) {
    const { colors } = useTheme();

    function formatTime(date: Date): string {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const styles = createStyles(colors);

    return (
        <View style={[
            styles.card,
            attendee.alreadyScanned && styles.cardDuplicate
        ]}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                    {attendee.alreadyScanned ? '⚠️' : '✅'}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{attendee.attendeeName}</Text>
                <View style={styles.detailsRow}>
                    <Text style={styles.detail}>🎫 {attendee.totalTickets} entrada{attendee.totalTickets > 1 ? 's' : ''}</Text>
                    <Text style={styles.detail}>•</Text>
                    <Text style={styles.detail}>ID: {attendee.purchaseId}</Text>
                </View>
                <Text style={styles.time}>⏰ {formatTime(attendee.timestamp)}</Text>

                {showOperator && attendee.operatorName && (
                    <Text style={styles.operator}>👤 Registrado por: {attendee.operatorName}</Text>
                )}

                {attendee.alreadyScanned && (
                    <Text style={styles.duplicateWarning}>⚠️ Ya escaneado previamente</Text>
                )}
            </View>

            {showDelete && onDelete && (
                <TouchableOpacity
                    onPress={() => onDelete(attendee.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardDuplicate: {
        backgroundColor: '#FFF3CD',
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    detail: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    time: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    operator: {
        fontSize: 11,
        color: colors.primary,
        marginTop: 4,
        fontStyle: 'italic',
    },
    duplicateWarning: {
        fontSize: 12,
        color: colors.warning,
        fontWeight: '600',
        marginTop: 4,
    },
    deleteButton: {
        padding: 8,
    },
    deleteIcon: {
        fontSize: 20,
    },
});