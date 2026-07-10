import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SPACING, FONTS, BORDER_RADIUS } from '../../utils/constants';

export default function ResultsScreen({ route, navigation }) {
  const { score, totalQuestions, quizTitle } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
      title: 'Results',
    });
  }, [navigation]);

  const percentage = Math.round((score / totalQuestions) * 100);
  
  let color = COLORS.danger;
  let message = 'Keep practicing!';
  
  if (percentage >= 70) {
    color = COLORS.accent;
    message = 'Excellent!';
  } else if (percentage >= 40) {
    color = COLORS.warning;
    message = 'Good job!';
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{quizTitle}</Text>
        
        <View style={[styles.badge, { borderColor: color }]}>
          <Text style={[styles.percentage, { color }]}>{percentage}%</Text>
        </View>

        <Text style={styles.scoreText}>
          You scored {score} out of {totalQuestions}
        </Text>
        
        <Text style={[styles.message, { color }]}>{message}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.buttonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.h2,
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  badge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  percentage: {
    fontSize: 48,
    fontWeight: FONTS.weights.bold,
  },
  scoreText: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
  },
  footer: {
    padding: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.body,
  }
});
