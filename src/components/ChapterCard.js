import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

/**
 * ChapterCard — chapter list item with order circle and content indicators.
 * @param {{ title: string, order: number, hasContent: boolean, hasPdf: boolean, onPress: () => void }} props
 */
const ChapterCard = ({ title, order, hasContent, hasPdf, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Order circle */}
      <View style={styles.orderCircle}>
        <Text style={styles.orderText}>{order}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {/* Content indicators */}
      <View style={styles.indicators}>
        {hasContent ? (
          <Ionicons
            name="document-text-outline"
            size={18}
            color={COLORS.textSecondary}
            style={styles.indicatorIcon}
          />
        ) : null}
        {hasPdf ? (
          <Ionicons
            name="download-outline"
            size={18}
            color={COLORS.textSecondary}
            style={styles.indicatorIcon}
          />
        ) : null}
      </View>

      {/* Right arrow */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.textMuted}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  orderCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 12,
    letterSpacing: 0.2,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 8,
  },
  indicatorIcon: {
    // individual icon style if needed
  },
});

export default ChapterCard;
