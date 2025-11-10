import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';
import { apiService } from '../services/apiService';

export default function ConnectionStatus() {
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    useEffect(() => {
        checkConnection();
        const interval = setInterval(checkConnection, 30000); // Verificar cada 30 seg
        return () => clearInterval(interval);
    }, []);

    async function checkConnection() {
        setIsSyncing(true);
        const connected = await apiService.checkConnection();
        setIsConnected(connected);
        setIsSyncing(false);
    }

    return (
        <View style={styles.container}>
            <View style={[
                styles.indicator,
                { backgroundColor: isSyncing ? colors.warning : (isConnected ? colors.success : colors.danger) }
            ]} />
            <Text style={styles.text}>
                {isSyncing ? 'Sincronizando...' : (isConnected ? 'Conectado' : 'Sin conexión')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        position: 'absolute',
        top: 10,
        right: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    text: {
        fontSize: 11,
        color: colors.text,
        fontWeight: '500',
    },
});