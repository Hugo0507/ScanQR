import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/theme';
import { AttendeeData } from '../types';

interface AttendeeDetailScreenProps {
    attendeeData: AttendeeData;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function AttendeeDetailScreen({
                                                 attendeeData,
                                                 onConfirm,
                                                 onCancel,
                                             }: AttendeeDetailScreenProps) {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header con estado */}
                <View style={[
                    styles.statusCard,
                    { backgroundColor: attendeeData.hasEntered ? '#FFF3CD' : '#D4EDDA' }
                ]}>
                    <Text style={styles.statusIcon}>
                        {attendeeData.hasEntered ? '⚠️' : '✅'}
                    </Text>
                    <Text style={styles.statusText}>
                        {attendeeData.hasEntered ? 'Entrada ya registrada' : 'Entrada válida'}
                    </Text>
                </View>

                {/* Información del asistente */}
                <View style={styles.infoCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {attendeeData.attendeeName.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.name}>{attendeeData.attendeeName}</Text>

                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Entradas</Text>
                            <Text style={styles.detailValue}>🎫 {attendeeData.totalTickets}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>ID Compra</Text>
                            <Text style={styles.detailValue}>{attendeeData.purchaseId}</Text>
                        </View>
                    </View>

                    {/* Información adicional */}
                    <View style={styles.extraInfo}>
                        <Text style={styles.extraInfoText}>
                            {attendeeData.hasEntered
                                ? '⚠️ Esta entrada ya fue registrada previamente. Si deseas registrarla nuevamente, contacta al supervisor.'
                                : `✅ Se registrarán ${attendeeData.totalTickets} ${attendeeData.totalTickets === 1 ? 'persona' : 'personas'} como ingresadas al evento.`
                            }
                        </Text>
                    </View>
                </View>

                {/* Mensaje de advertencia si ya ingresó */}
                {attendeeData.hasEntered && (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                        <Text style={styles.warningText}>
                            Este QR ya fue utilizado. Verifica con el supervisor antes de permitir el ingreso.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Botones de acción */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onCancel}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        attendeeData.hasEntered && styles.confirmButtonDisabled
                    ]}
                    onPress={onConfirm}
                    disabled={attendeeData.hasEntered}
                >
                    <Text style={styles.confirmButtonText}>
                        {attendeeData.hasEntered ? 'Ya registrado' : '✓ Confirmar ingreso'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
        paddingTop: 60,
    },
    statusCard: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
    },
    statusIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    divider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: 16,
    },
    extraInfo: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        width: '100%',
    },
    extraInfoText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    warningBox: {
        backgroundColor: '#FFF3CD',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
    },
    warningIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    warningText: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: colors.success,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: colors.textTertiary,
        opacity: 0.5,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});