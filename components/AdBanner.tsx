import React from "react";
import { View, StyleSheet, Platform } from "react-native";

const BANNER_ID = "ca-app-pub-6718038985057828/5364644957";
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

export function AdBanner() {
  if (Platform.OS === "web") return null;

  try {
    const { BannerAd, BannerAdSize, TestIds } = require("react-native-google-mobile-ads");
    const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : BANNER_ID;

    return (
      <View style={styles.container}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        />
      </View>
    );
  } catch {
    return <View style={styles.placeholder} />;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  placeholder: {
    height: 0,
  },
});
