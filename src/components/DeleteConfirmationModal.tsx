import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DeleteConfirmationModalProps {
    visible: boolean;
    onConfirm: (password: string) => Promise<boolean>;
    onCancel: () => void;
    itemCount?: number;
    itemDescription?: string;
}

export default function DeleteConfirmationModal({
    visible,
    onConfirm,
    onCancel,
    itemCount = 1,
    itemDescription = 'registro'
}: DeleteConfirmationModalProps) {
    const { colors } = useTheme();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleConfirm() {
        if (!password.trim()) {
            setError('Debes ingresar tu contraseña');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const success = await onConfirm(password);
            if (success) {
                setPassword('');
                setError('');
            } else {
                setError('Contraseña incorrecta');
            }
        } catch (err) {
            setError('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    }

    function handleCancel() {
        setPassword('');
        setError('');
        onCancel();
    }

    const styles = createStyles(colors);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.icon}>⚠️</Text>
                        <Text style={styles.title}>Confirmar eliminación</Text>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.message}>
                            Estás a punto de eliminar {itemCount > 1 ? `${itemCount} ${itemDescription}s` : `1 ${itemDescription}`}.
                        </Text>
                        <Text style={styles.submessage}>
                            Esta acción no se puede deshacer.
                        </Text>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Ingresa tu contraseña para confirmar:</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null]}
                                placeholder="Contraseña"
                                secureTextEntry
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError('');
                                }}
                                editable={!isLoading}
                                autoFocus
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>

                        {/* Audit Info */}
                        <View style={styles.auditInfo}>
                            <Text style={styles.auditText}>
                                📋 Esta acción quedará registrada en el historial de auditoría
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                            disabled={isLoading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton, isLoading && styles.buttonDisabled]}
                            onPress={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Eliminar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 24,
    },
    icon: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    content: {
        padding: 24,
    },
    message: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
    },
    submessage: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.inputBackground,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputError: {
        borderColor: colors.danger,
        backgroundColor: '#FEE2E2',
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    auditInfo: {
        backgroundColor: colors.backgroundDark,
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.info,
    },
    auditText: {
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        padding: 24,
        paddingTop: 0,
    },
    button: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: colors.backgroundDark,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: colors.danger,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
