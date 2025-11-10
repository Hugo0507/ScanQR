import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '../types';
import { colors } from '../styles/theme';

interface RoleBadgeProps {
    role: UserRole;
    size?: 'small' | 'medium';
}

export default function RoleBadge({ role, size = 'medium' }: RoleBadgeProps) {
    const getRoleConfig = () => {
        switch (role) {
            case 'admin':
                return { label: 'Admin', color: colors.danger, icon: '👑' };
            case 'operador':
                return { label: 'Operador', color: colors.primary, icon: '📱' };
        }
    };

    const config = getRoleConfig();
    const isSmall = size === 'small';

    return (
        <View style={[styles.badge, { backgroundColor: config.color }, isSmall && styles.badgeSmall]}>
            <Text style={[styles.icon, isSmall && styles.iconSmall]}>{config.icon}</Text>
            <Text style={[styles.label, isSmall && styles.labelSmall]}>{config.label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeSmall: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    icon: {
        fontSize: 14,
        marginRight: 6,
    },
    iconSmall: {
        fontSize: 12,
        marginRight: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    labelSmall: {
        fontSize: 10,
    },
});