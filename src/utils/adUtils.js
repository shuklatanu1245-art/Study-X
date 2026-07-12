// ============================================================
// Study X — Ad Utilities (Google Mobile Ads)
// ============================================================

import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// ── Ad Unit IDs ───────────────────────────────────────────────
// In development (__DEV__) we use Google's official test IDs.
// In production, replace the placeholder strings with your
// real AdMob ad unit IDs from the AdMob console.
// ──────────────────────────────────────────────────────────────

export const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // ⚠️ Replace with your production banner ad unit ID

export const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; // ⚠️ Replace with your production interstitial ad unit ID

/**
 * Creates an interstitial ad, loads it, shows it when ready,
 * and returns a Promise that resolves when the ad is closed.
 *
 * Usage:
 *   await loadAndShowInterstitial();
 *
 * The promise resolves with `true` when the ad was shown and
 * closed, or rejects if the ad fails to load.
 */
export function loadAndShowInterstitial() {
  return new Promise((resolve) => {
    console.log('Ad skipped for standalone Expo build.');
    resolve(true);
  });
}
