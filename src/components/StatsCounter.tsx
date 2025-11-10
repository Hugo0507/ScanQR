import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

interface StatsCounterProps {
    totalPeopleEntered: number;
    totalScans: number;
}

export default function StatsCounter({ totalPeopleEntered, totalScans }: StatsCounterProps) {
    return (
        <View style={styles.container}>
            <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalPeopleEntered}</Text>
                <Text style={styles.statLabel}>Personas ingresadas</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
                <Text style={styles.statNumber}>{totalScans}</Text>
                <Text style={styles.statLabel}>Total escaneos</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: colors.border,
        marginHorizontal: 16,
    },
});