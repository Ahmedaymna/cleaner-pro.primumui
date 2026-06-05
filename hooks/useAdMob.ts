import { useCallback, useRef, Platform } from "react";

const REWARDED_ID = "ca-app-pub-6718038985057828/7252441697";
const INTERSTITIAL_ID = "ca-app-pub-6718038985057828/4460277306";

export function useAdMob() {
  const interstitialRef = useRef<any>(null);
  const rewardedRef = useRef<any>(null);

  const showInterstitial = useCallback(async (onComplete?: () => void) => {
    if (Platform.OS === "web") { onComplete?.(); return; }
    try {
      const { InterstitialAd, AdEventType, TestIds } = require("react-native-google-mobile-ads");
      const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : INTERSTITIAL_ID;
      const ad = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });
      ad.addAdEventListener(AdEventType.LOADED, () => {
        ad.show();
        onComplete?.();
      });
      ad.addAdEventListener(AdEventType.ERROR, () => {
        onComplete?.();
      });
      ad.load();
      interstitialRef.current = ad;
    } catch {
      onComplete?.();
    }
  }, []);

  const showRewarded = useCallback(async (onRewarded?: () => void, onDismiss?: () => void) => {
    if (Platform.OS === "web") { onRewarded?.(); return; }
    try {
      const { RewardedAd, RewardedAdEventType, TestIds } = require("react-native-google-mobile-ads");
      const adUnitId = __DEV__ ? TestIds.REWARDED : REWARDED_ID;
      const ad = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });
      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        onRewarded?.();
      });
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        ad.show();
      });
      ad.addAdEventListener("closed", () => {
        onDismiss?.();
      });
      ad.load();
      rewardedRef.current = ad;
    } catch {
      onRewarded?.();
    }
  }, []);

  return { showInterstitial, showRewarded };
}
