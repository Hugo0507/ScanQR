import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/theme';
import { apiService } from '../services/apiService';
import { SearchResult } from '../types';

interface AttendeeSearchProps {
    onSelectAttendee: (result: SearchResult) => void;
    onClose: () => void;
}

export default function AttendeeSearch({ onSelectAttendee, onClose }: AttendeeSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    // Búsqueda en tiempo real con debounce
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.length >= 2) {
                handleRealtimeSearch();
            } else {
                setResults([]);
            }
        }, 300); // Espera 300ms después de que el usuario deje de escribir

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    async function handleRealtimeSearch() {
        setIsSearching(true);
        try {
            const searchResults = await apiService.searchAttendeeRealtime(searchQuery);
            setResults(searchResults);
        } catch (error) {
            console.error('Error en búsqueda:', error);
        } finally {
            setIsSearching(false);
        }
    }

    function renderSearchResult(item: SearchResult) {
        return (
            <TouchableOpacity
                style={[
                    styles.resultCard,
                    item.hasEntered && styles.resultCardDisabled
                ]}
                onPress={() => {
                    if (item.hasEntered) {
                        Alert.alert(
                            'Ya ingresó',
                            `${item.attendeeName} ya registró su entrada al evento.\n\nID: ${item.purchaseId}\nEntradas: ${item.totalTickets}`,
                            [{ text: 'OK' }]
                        );
                    } else {
                        onSelectAttendee(item);
                    }
                }}
                disabled={item.hasEntered}
            >
                <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{item.attendeeName}</Text>
                    <Text style={styles.resultDetail}>
                        🎫 {item.totalTickets} entrada{item.totalTickets > 1 ? 's' : ''}
                    </Text>
                    <View style={styles.resultMetaRow}>
                        <Text style={styles.resultMeta}>ID: {item.purchaseId}</Text>
                        {item.cedula && (
                            <>
                                <Text style={styles.resultMeta}> • </Text>
                                <Text style={styles.resultMeta}>CC: {item.cedula}</Text>
                            </>
                        )}
                    </View>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.hasEntered ? colors.danger : colors.success }
                    ]}>
                        <Text style={styles.statusBadgeText}>
                            {item.hasEntered ? '❌ Ya ingresó' : '✅ Disponible'}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.arrow, item.hasEntered && styles.arrowDisabled]}>
                    {item.hasEntered ? '🔒' : '→'}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Búsqueda Manual</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
                Busca por nombre, ID de compra o cédula
            </Text>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Escribe para buscar..."
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isSearching && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.primary} />
                    <Text style={styles.loadingText}>Buscando...</Text>
                </View>
            )}

            {!isSearching && searchQuery.length >= 2 && results.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyText}>No se encontraron resultados</Text>
                    <Text style={styles.emptySubtext}>
                        Intenta con otro término de búsqueda
                    </Text>
                </View>
            )}

            {results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => `${item.purchaseId}-${index}`}
                    renderItem={({ item }) => renderSearchResult(item)}
                    style={styles.resultsList}
                />
            )}

            {searchQuery.length < 2 && (
                <View style={styles.helpContainer}>
                    <Text style={styles.helpTitle}>💡 Ayuda</Text>
                    <Text style={styles.helpText}>• Busca por nombre completo</Text>
                    <Text style={styles.helpText}>• Busca por ID de compra (ej: COMP-12345)</Text>
                    <Text style={styles.helpText}>• Busca por número de cédula</Text>
                    <Text style={styles.helpText}>• Escribe al menos 2 caracteres</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeButton: {
        fontSize: 28,
        color: colors.textSecondary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 20,
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: colors.text,
    },
    clearIcon: {
        fontSize: 20,
        color: colors.textTertiary,
        padding: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginLeft: 12,
        fontSize: 14,
        color: colors.textSecondary,
    },
    resultsList: {
        flex: 1,
    },
    resultCard: {
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
    resultContent: {
        flex: 1,
    },
    resultName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    resultDetail: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    resultMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    resultMeta: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    resultStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    arrow: {
        fontSize: 20,
        color: colors.textTertiary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textTertiary,
    },
    helpContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    helpText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    resultCardDisabled: {
        opacity: 0.6,
        backgroundColor: '#f5f5f5',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
    arrowDisabled: {
        opacity: 0.3,
    },
});