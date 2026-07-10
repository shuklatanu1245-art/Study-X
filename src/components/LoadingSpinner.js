import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

/**
 * LoadingSpinner — full-screen loader with optional message.
 * @param {{ message?: string }} props
 */
const LoadingSpinner = ({ message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
});

export default LoadingSpinner;
