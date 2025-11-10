import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PersonData } from '../types';
import { colors } from '../styles/theme';

interface PersonInfoModalProps {
    visible: boolean;
    personData: PersonData | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function PersonInfoModal({
    visible,
    personData,
    onClose,
    onConfirm,
}: PersonInfoModalProps) {
    if (!personData) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Información del Asistente</Text>
                        <Text style={styles.subtitle}>
                            {personData.ingreso ? '⚠️ Ya ingresó' : '✅ Listo para ingresar'}
                        </Text>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.infoSection}>
                            <InfoRow label="Nombre" value={personData.name} />
                            <InfoRow label="Email" value={personData.email} />

                            {personData.phone && (
                                <InfoRow label="Teléfono" value={personData.phone} />
                            )}

                            {personData.cedula && (
                                <InfoRow label="Cédula" value={personData.cedula} />
                            )}

                            {personData.colectivo && (
                                <InfoRow label="Colectivo" value={personData.colectivo} />
                            )}

                            <View style={styles.statusRow}>
                                <Text style={styles.label}>Estado:</Text>
                                <View style={[
                                    styles.statusBadge,
                                    personData.ingreso ? styles.statusUsed : styles.statusValid
                                ]}>
                                    <Text style={styles.statusText}>
                                        {personData.ingreso ? 'Ya ingresó' : 'Sin ingresar'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statusRow}>
                                <Text style={styles.label}>QR Enviado:</Text>
                                <Text style={styles.value}>
                                    {personData.qr_sent ? '✅ Sí' : '❌ No'}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.dateSection}>
                                <Text style={styles.dateLabel}>Registrado:</Text>
                                <Text style={styles.dateValue}>
                                    {formatDate(personData.created_at)}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        {!personData.ingreso && (
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={onConfirm}
                            >
                                <Text style={styles.confirmButtonText}>Confirmar Ingreso</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingTop: 20,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    infoSection: {
        padding: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    value: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusValid: {
        backgroundColor: colors.success + '20',
    },
    statusUsed: {
        backgroundColor: colors.warning + '20',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e5e5',
        marginVertical: 16,
    },
    dateSection: {
        paddingTop: 8,
    },
    dateLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 14,
        color: colors.textTertiary,
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
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
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
