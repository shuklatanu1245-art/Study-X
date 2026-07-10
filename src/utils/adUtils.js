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
  return new Promise((resolve, reject) => {
    const interstitial = InterstitialAd.createForAdRequest(
      INTERSTITIAL_AD_UNIT_ID,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    // Listener: ad loaded → show it
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      }
    );

    // Listener: ad closed → clean up and resolve
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        resolve(true);
      }
    );

    // Listener: ad failed to load → clean up and reject
    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        reject(error);
      }
    );

    // Kick off the ad request
    interstitial.load();
  });
}
