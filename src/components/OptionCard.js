import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

/**
 * OptionCard — quiz answer option with multi-state visual feedback.
 *
 * States:
 *   default      → neutral dark card
 *   selected     → indigo highlight
 *   correct      → green highlight (after submission)
 *   wrong        → red highlight (selected but incorrect, after submission)
 *
 * @param {{
 *   label: string,
 *   text: string,
 *   selected: boolean,
 *   correct: boolean,
 *   showResult: boolean,
 *   onPress: () => void,
 * }} props
 */
const OptionCard = ({ label, text, selected, correct, showResult, onPress }) => {
  // ── Resolve visual state ───────────────────────────────────
  const getStateStyles = () => {
    if (showResult && correct) {
      return {
        cardBorder: COLORS.accent,
        cardBg: 'rgba(0, 196, 140, 0.1)',
        circleBorder: COLORS.accent,
        circleBg: 'rgba(0, 196, 140, 0.15)',
        labelColor: COLORS.accent,
        icon: 'checkmark',
        iconColor: COLORS.accent,
      };
    }
    if (showResult && selected && !correct) {
      return {
        cardBorder: COLORS.danger,
        cardBg: 'rgba(255, 107, 107, 0.1)',
        circleBorder: COLORS.danger,
        circleBg: 'rgba(255, 107, 107, 0.15)',
        labelColor: COLORS.danger,
        icon: 'close',
        iconColor: COLORS.danger,
      };
    }
    if (selected) {
      return {
        cardBorder: COLORS.secondary,
        cardBg: 'rgba(108, 99, 255, 0.1)',
        circleBorder: COLORS.secondary,
        circleBg: 'rgba(108, 99, 255, 0.15)',
        labelColor: COLORS.secondary,
        icon: null,
        iconColor: null,
      };
    }
    // Default
    return {
      cardBorder: COLORS.border,
      cardBg: COLORS.surfaceLight,
      circleBorder: COLORS.border,
      circleBg: 'transparent',
      labelColor: COLORS.textSecondary,
      icon: null,
      iconColor: null,
    };
  };

  const state = getStateStyles();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: state.cardBorder,
          backgroundColor: state.cardBg,
        },
      ]}
      onPress={onPress}
      activeOpacity={showResult ? 1 : 0.7}
      disabled={showResult}
    >
      {/* Label circle */}
      <View
        style={[
          styles.labelCircle,
          {
            borderColor: state.circleBorder,
            backgroundColor: state.circleBg,
          },
        ]}
      >
        {state.icon ? (
          <Ionicons name={state.icon} size={18} color={state.iconColor} />
        ) : (
          <Text style={[styles.labelText, { color: state.labelColor }]}>
            {label}
          </Text>
        )}
      </View>

      {/* Option text */}
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
  },
  labelCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    lineHeight: 21,
  },
});

export default OptionCard;
