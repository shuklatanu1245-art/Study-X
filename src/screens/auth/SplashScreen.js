import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { COLORS } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

/**
 * SplashScreen — Premium full-screen loading screen shown during
 * initial auth state resolution.
 */
export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const spinnerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(spinnerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Decorative gradient-like circles in background */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* App icon area */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>📚</Text>
        </View>

        {/* App Name */}
        <Text style={styles.title}>Study X</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Learn. Practice. Excel.</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View style={[styles.spinnerContainer, { opacity: spinnerOpacity }]}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </Animated.View>

      {/* Bottom branding */}
      <Animated.View style={[styles.footer, { opacity: spinnerOpacity }]}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>Premium Learning Platform</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Decorative Background ──────────────────────────────────
  bgCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.secondary,
    opacity: 0.04,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: COLORS.accent,
    opacity: 0.03,
    bottom: -width * 0.15,
    left: -width * 0.15,
  },

  // ── Main Content ───────────────────────────────────────────
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // ── Spinner ────────────────────────────────────────────────
  spinnerContainer: {
    position: 'absolute',
    bottom: height * 0.18,
  },

  // ── Footer ─────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  footerLine: {
    width: 32,
    height: 2,
    backgroundColor: COLORS.secondary,
    opacity: 0.5,
    borderRadius: 1,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
