import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../styles/theme';
import { apiService } from '../services/apiService';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface OperatorManagementScreenProps {
    onClose: () => void;
    currentUserPassword: string;
}

interface Operator {
    id: string;
    username: string;
    name: string;
    email: string;
    createdAt: Date;
    scanCount: number;
}

export default function OperatorManagementScreen({ onClose, currentUserPassword }: OperatorManagementScreenProps) {
    const [operators, setOperators] = useState<Operator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(null);

    useEffect(() => {
        loadOperators();
    }, []);

    async function loadOperators() {
        setIsLoading(true);
        try {
            const data = await apiService.getOperators();
            setOperators(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los operadores');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateOperator() {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Debes completar todos los campos');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsCreating(true);
        try {
            const newOperator = await apiService.createOperator(username, password);
            setOperators(prev => [...prev, newOperator]);
            setUsername('');
            setPassword('');
            setShowCreateForm(false);
            Alert.alert('Éxito', `Operador "${username}" creado correctamente`);
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear el operador');
        } finally {
            setIsCreating(false);
        }
    }

    function handleDeletePress(operator: Operator) {
        setOperatorToDelete(operator);
        setDeleteModalVisible(true);
    }

    async function handleConfirmDelete(password: string): Promise<boolean> {
        if (password !== currentUserPassword) {
            return false;
        }

        if (!operatorToDelete) return false;

        try {
            await apiService.deleteOperator(operatorToDelete.id);
            setOperators(prev => prev.filter(op => op.id !== operatorToDelete.id));
            setDeleteModalVisible(false);
            setOperatorToDelete(null);
            Alert.alert('Éxito', `Operador "${operatorToDelete.username}" eliminado`);
            return true;
        } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el operador');
            return false;
        }
    }

    function formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Gestión de Operadores</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Create Button */}
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setShowCreateForm(!showCreateForm)}
                >
                    <Text style={styles.createButtonIcon}>{showCreateForm ? '✕' : '+'}</Text>
                    <Text style={styles.createButtonText}>
                        {showCreateForm ? 'Cancelar' : 'Crear Operador'}
                    </Text>
                </TouchableOpacity>

                {/* Create Form */}
                {showCreateForm && (
                    <View style={styles.createForm}>
                        <Text style={styles.formTitle}>Nuevo Operador</Text>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Nombre de usuario</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ej: operador3"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                editable={!isCreating}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!isCreating}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, isCreating && styles.submitButtonDisabled]}
                            onPress={handleCreateOperator}
                            disabled={isCreating}
                        >
                            {isCreating ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.submitButtonText}>Crear Operador</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Operators List */}
                <View style={styles.listSection}>
                    <Text style={styles.sectionTitle}>
                        Operadores ({operators.length})
                    </Text>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : operators.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>👥</Text>
                            <Text style={styles.emptyText}>No hay operadores</Text>
                        </View>
                    ) : (
                        operators.map(operator => (
                            <View key={operator.id} style={styles.operatorCard}>
                                <View style={styles.operatorIcon}>
                                    <Text style={styles.operatorIconText}>
                                        {operator.username.charAt(0).toUpperCase()}
                                    </Text>
                                </View>

                                <View style={styles.operatorInfo}>
                                    <Text style={styles.operatorName}>{operator.username}</Text>
                                    <Text style={styles.operatorEmail}>{operator.email}</Text>
                                    <View style={styles.operatorMeta}>
                                        <Text style={styles.metaText}>
                                            📅 Creado: {formatDate(operator.createdAt)}
                                        </Text>
                                        <Text style={styles.metaText}>
                                            📊 Escaneos: {operator.scanCount}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeletePress(operator)}
                                >
                                    <Text style={styles.deleteButtonText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                visible={deleteModalVisible}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteModalVisible(false);
                    setOperatorToDelete(null);
                }}
                itemDescription={`operador "${operatorToDelete?.username}"`}
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
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    createButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    createButtonIcon: {
        fontSize: 24,
        color: '#fff',
        marginRight: 8,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    createForm: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    inputLabel: {
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
    submitButton: {
        backgroundColor: colors.success,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    operatorCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
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
    operatorIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    operatorIconText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    operatorInfo: {
        flex: 1,
    },
    operatorName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    operatorEmail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    operatorMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    metaText: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    deleteButton: {
        padding: 12,
    },
    deleteButtonText: {
        fontSize: 24,
    },
});
