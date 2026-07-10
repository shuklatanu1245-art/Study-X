import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const ACCENT_COLORS = ['#6C63FF', '#00C48C', '#FF6B6B', '#FFB74D'];

/**
 * SubjectCard — premium subject card with colored accent bar.
 * @param {{ title: string, classLevel: string, onPress: () => void, index: number }} props
 */
const SubjectCard = ({ title, classLevel, onPress, index = 0 }) => {
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      {/* Card body */}
      <View style={styles.body}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {classLevel ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: `${accentColor}26` },
              ]}
            >
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {classLevel}
              </Text>
            </View>
          ) : null}
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.textMuted}
          style={styles.arrow}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  arrow: {
    marginLeft: 4,
  },
});

export default SubjectCard;
