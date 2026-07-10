// ============================================================
// Study X — Design-System Tokens
// ============================================================

/**
 * Typography scale following a modular type hierarchy.
 * Weights map to React Native fontWeight string values.
 */
export const FONTS = {
  // Heading sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,

  // Body sizes
  bodyLarge: 17,
  body: 15,
  bodySmall: 13,

  // Caption / utility sizes
  caption: 12,
  tiny: 10,

  // Font weights
  weightBold: '700',
  weightSemiBold: '600',
  weightMedium: '500',
  weightRegular: '400',
  weightLight: '300',
};

/**
 * Spacing scale (4-point grid).
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Border radius presets.
 */
export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * Shadow presets for elevated surfaces.
 * Compatible with both iOS (shadow*) and Android (elevation).
 */
export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 16,
    elevation: 10,
  },
};
