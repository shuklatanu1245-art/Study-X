import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../utils/constants';

export default function StatCard({ title, value, icon, color }) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <View style={styles.header}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderTopWidth: 4,
    ...SHADOWS.card,
    flex: 1,
    margin: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  value: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
});
