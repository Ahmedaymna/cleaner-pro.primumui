import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

declare global {
  var gapi: any;
}

export const AdBanner: React.FC = () => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const opacityAnim = useSharedValue(1);
  const slideAnim = useSharedValue(0);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        // محاكاة تحميل الإعلانات
        setTimeout(() => {
          setAdLoaded(true);
          setAdError(null);
        }, 1000);
      } else {
        // على الويب
        if (typeof window !== "undefined" && window.document) {
          const script = document.createElement("script");
          script.async = true;
          script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
          script.onload = () => {
            setAdLoaded(true);
          };
          script.onerror = () => {
            setAdError("Failed to load ads");
          };
          document.head.appendChild(script);
        }
      }
    } catch (error) {
      setAdError("Unable to load advertisements");
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    opacityAnim.value = withTiming(0, { duration: 300 });
    slideAnim.value = withTiming(-100, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  if (isClosing || !adLoaded) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={["#1E2D47", "#152038", "#0D1B3E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.adContainer}
      >
        {/* Ad Header */}
        <View style={styles.adHeader}>
          <View style={styles.adLabel}>
            <MaterialCommunityIcons
              name="advertisement"
              size={14}
              color="#6B82A0"
            />
            <Text style={styles.adText}>إعلان مدعوم</Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="close" size={18} color="#6B82A0" />
          </TouchableOpacity>
        </View>

        {/* Ad Content */}
        <TouchableOpacity
          style={styles.adContent}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              "Opening advertisement",
              "This would open the advertiser's link in a web browser"
            );
          }}
        >
          <View style={styles.adIconContainer}>
            <MaterialCommunityIcons
              name="star-circle"
              size={40}
              color="#00D4FF"
            />
          </View>

          <View style={styles.adTextContainer}>
            <Text style={styles.adTitle}>Get Premium Pro</Text>
            <Text style={styles.adDescription}>
              Unlock all features and remove ads
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#00D4FF"
          />
        </TouchableOpacity>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert("Success", "Thank you for viewing this advertisement!");
          }}
        >
          <LinearGradient
            colors={["#00D4FF", "#0090FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButtonInner}
          >
            <Text style={styles.ctaButtonText}>View Now</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={16}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Border Glow */}
        <View
          style={[
            styles.borderGlow,
            { borderColor: "#00D4FF", opacity: adError ? 0 : 0.3 },
          ]}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export const InterstitialAd: React.FC<{
  onClose: () => void;
  visible: boolean;
}> = ({ onClose, visible }) => {
  const opacityAnim = useSharedValue(visible ? 1 : 0);
  const scaleAnim = useSharedValue(visible ? 1 : 0.8);

  useEffect(() => {
    if (visible) {
      opacityAnim.value = withTiming(1, { duration: 300 });
      scaleAnim.value = withTiming(1, { duration: 300 });
    } else {
      opacityAnim.value = withTiming(0, { duration: 300 });
      scaleAnim.value = withTiming(0.8, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.fullScreenAd}>
      <View style={styles.adBackdrop} />
      <Animated.View
        style={[styles.adModalContent, animatedStyle]}
      >
        <LinearGradient
          colors={["#1E2D47", "#152038"]}
          style={styles.adModal}
        >
          <TouchableOpacity
            style={styles.adCloseButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={24}
              color="#E8F0FE"
            />
          </TouchableOpacity>

          <View style={styles.adModalIcon}>
            <MaterialCommunityIcons
              name="gift-outline"
              size={60}
              color="#00D4FF"
            />
          </View>

          <Text style={styles.adModalTitle}>Special Offer!</Text>
          <Text style={styles.adModalDescription}>
            Click below to see our exclusive offers and discounts
          </Text>

          <TouchableOpacity
            style={styles.adModalButton}
            onPress={() => {
              Alert.alert("Offer", "Thank you for your interest!");
              onClose();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#00FF88", "#00D4FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.adModalButtonInner}
            >
              <Text style={styles.adModalButtonText}>See Offer</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Banner Ad Styles
  container: { marginVertical: 12, marginHorizontal: 0 },
  adContainer: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
    borderWidth: 1,
    borderColor: "#00D4FF30",
  },
  adHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  adLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  adText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#6B82A0",
    letterSpacing: 0.5,
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  adIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#00D4FF10",
    justifyContent: "center",
    alignItems: "center",
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#E8F0FE",
    marginBottom: 2,
  },
  adDescription: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#6B82A0",
  },
  ctaButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  ctaButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  ctaButtonText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  borderGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1,
    pointerEvents: "none",
  },

  // Interstitial Ad Styles
  fullScreenAd: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  adBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  adModalContent: {
    zIndex: 1001,
    width: "85%",
    maxWidth: 350,
  },
  adModal: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00D4FF30",
  },
  adCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  adModalIcon: {
    marginTop: 24,
    marginBottom: 20,
  },
  adModalTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#E8F0FE",
    marginBottom: 8,
  },
  adModalDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#A0B4D0",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  adModalButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  adModalButtonInner: {
    paddingVertical: 14,
    alignItems: "center",
  },
  adModalButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#6B82A0",
  },
});
