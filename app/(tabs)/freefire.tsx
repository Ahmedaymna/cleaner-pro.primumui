import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { GradientCard } from "@/components/GradientCard";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { useAdMob } from "@/hooks/useAdMob";
import { AdBanner } from "@/components/AdBanner";

const { width } = Dimensions.get("window");

interface FFSettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  awm: number;
  freeLook: number;
  dpi: number;
  gamepad: string;
}

interface DevicePreset {
  name: string;
  tier: "low" | "mid" | "high";
  settings: FFSettings;
  description: string;
}

function getPresetForDevice(brand: string, model: string, ram: number): DevicePreset {
  const b = brand.toLowerCase();
  const m = model.toLowerCase();

  if (b === "samsung" && (m.includes("s23") || m.includes("s24") || m.includes("s22"))) {
    return {
      name: "Samsung Flagship",
      tier: "high",
      description: "أفضل إعدادات للهواتف الرائدة",
      settings: { general: 80, redDot: 85, scope2x: 80, scope4x: 75, awm: 72, freeLook: 88, dpi: 400, gamepad: "حساسية عالية جداً" },
    };
  }
  if (b === "xiaomi" || b === "redmi") {
    if (m.includes("note") || ram < 6144) {
      return {
        name: "Xiaomi Mid-Range",
        tier: "mid",
        description: "إعدادات متوازنة للهواتف المتوسطة",
        settings: { general: 72, redDot: 76, scope2x: 72, scope4x: 68, awm: 65, freeLook: 80, dpi: 320, gamepad: "حساسية متوسطة" },
      };
    }
    return {
      name: "Xiaomi Premium",
      tier: "high",
      description: "إعدادات مُحسَّنة لمعالج Snapdragon",
      settings: { general: 78, redDot: 82, scope2x: 78, scope4x: 73, awm: 70, freeLook: 85, dpi: 380, gamepad: "حساسية عالية" },
    };
  }
  if (b === "oppo" || b === "realme" || b === "oneplus") {
    return {
      name: "OPPO/Realme Series",
      tier: "mid",
      description: "إعدادات مُحسَّنة لمعالج MediaTek/SD",
      settings: { general: 70, redDot: 74, scope2x: 70, scope4x: 66, awm: 63, freeLook: 78, dpi: 300, gamepad: "حساسية متوسطة" },
    };
  }
  if (b === "apple") {
    return {
      name: "iPhone Pro Series",
      tier: "high",
      description: "أفضل إعدادات لمعالج Apple A-Series",
      settings: { general: 83, redDot: 87, scope2x: 83, scope4x: 78, awm: 75, freeLook: 90, dpi: 420, gamepad: "حساسية عالية جداً" },
    };
  }
  if (ram < 4096) {
    return {
      name: "هاتف اقتصادي",
      tier: "low",
      description: "إعدادات مُحسَّنة للأجهزة ذات الكفاءة المنخفضة",
      settings: { general: 55, redDot: 60, scope2x: 55, scope4x: 50, awm: 48, freeLook: 65, dpi: 200, gamepad: "حساسية منخفضة" },
    };
  }
  return {
    name: "هاتف متوسط",
    tier: "mid",
    description: "إعدادات عامة متوازنة",
    settings: { general: 68, redDot: 72, scope2x: 68, scope4x: 64, awm: 60, freeLook: 75, dpi: 280, gamepad: "حساسية متوسطة" },
  };
}

const SETTINGS_LABELS: { key: keyof FFSettings; label: string; icon: string }[] = [
  { key: "general", label: "حساسية عامة", icon: "gesture-swipe" },
  { key: "redDot", label: "النقطة الحمراء (1x)", icon: "circle-small" },
  { key: "scope2x", label: "منظار 2x", icon: "magnify" },
  { key: "scope4x", label: "منظار 4x", icon: "magnify-plus" },
  { key: "awm", label: "قناص AWM", icon: "crosshairs" },
  { key: "freeLook", label: "النظر الحر", icon: "eye" },
];

function SensBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={sensStyles.barBg}>
      <LinearGradient
        colors={[color + "99", color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[sensStyles.barFill, { width: `${value}%` as any }]}
      />
    </View>
  );
}

const sensStyles = StyleSheet.create({
  barBg: { flex: 1, height: 6, backgroundColor: "#1A2540", borderRadius: 3, overflow: "hidden", marginHorizontal: 8 },
  barFill: { height: "100%", borderRadius: 3 },
});

const TIER_COLORS = { low: "#FFB300", mid: "#00D4FF", high: "#00FF88" };
const TIER_LABELS = { low: "منخفض", mid: "متوسط", high: "عالٍ" };

export default function FreeFireScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const device = useDeviceInfo();
  const { showRewarded } = useAdMob();
  const [unlockedPremium, setUnlockedPremium] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<"auto" | "pro" | "sniper">("auto");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const preset = getPresetForDevice(device.brand, device.modelName, device.totalMemory);
  const tierColor = TIER_COLORS[preset.tier];

  const proSettings: FFSettings = {
    ...preset.settings,
    general: Math.min(100, preset.settings.general + 8),
    redDot: Math.min(100, preset.settings.redDot + 6),
    scope2x: Math.min(100, preset.settings.scope2x + 8),
    scope4x: Math.min(100, preset.settings.scope4x + 7),
    awm: Math.min(100, preset.settings.awm + 5),
    freeLook: Math.min(100, preset.settings.freeLook + 6),
    dpi: preset.settings.dpi + 60,
    gamepad: "نمط المحترف",
  };

  const sniperSettings: FFSettings = {
    ...preset.settings,
    general: Math.max(10, preset.settings.general - 10),
    redDot: preset.settings.redDot,
    scope2x: Math.max(10, preset.settings.scope2x - 8),
    scope4x: Math.max(10, preset.settings.scope4x - 5),
    awm: Math.min(100, preset.settings.awm + 15),
    freeLook: Math.max(10, preset.settings.freeLook - 10),
    dpi: Math.max(150, preset.settings.dpi - 60),
    gamepad: "نمط القناص",
  };

  const activeSettings =
    selectedProfile === "auto"
      ? preset.settings
      : selectedProfile === "pro"
      ? proSettings
      : sniperSettings;

  const handleUnlockPremium = () => {
    showRewarded(
      () => setUnlockedPremium(true),
      () => {}
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 16, paddingBottom: (Platform.OS === "web" ? 84 : 85) + bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={["#2D0A00", "#450F00", "#1A0500"]}
          style={styles.ffHeader}
        >
          <MaterialCommunityIcons name="fire" size={36} color="#FF6B35" />
          <View style={{ flex: 1 }}>
            <Text style={styles.ffTitle}>Free Fire</Text>
            <Text style={styles.ffSub}>إعدادات مُحسَّنة لجهازك</Text>
          </View>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + "20", borderColor: tierColor + "50" }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{TIER_LABELS[preset.tier]}</Text>
          </View>
        </LinearGradient>

        {/* Device Card */}
        <GradientCard colors={["#0F1729", "#1A2540"]} style={styles.deviceCard}>
          <MaterialCommunityIcons name="cellphone" size={28} color={tierColor} />
          <View style={{ flex: 1 }}>
            <Text style={styles.deviceName}>{device.brand} {device.modelName}</Text>
            <Text style={styles.deviceSub}>{device.osName} {device.osVersion} · RAM: {device.totalMemory} MB</Text>
          </View>
          <View style={[styles.tierDot, { backgroundColor: tierColor }]} />
        </GradientCard>

        {/* Profile Selector */}
        <Text style={styles.sectionTitle}>نمط الإعدادات</Text>
        <View style={styles.profileRow}>
          {(["auto", "pro", "sniper"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.profileBtn, selectedProfile === p && styles.profileBtnActive]}
              onPress={() => {
                if ((p === "pro" || p === "sniper") && !unlockedPremium) {
                  handleUnlockPremium();
                  return;
                }
                setSelectedProfile(p);
                Haptics.selectionAsync();
              }}
              activeOpacity={0.7}
            >
              {(p === "pro" || p === "sniper") && !unlockedPremium ? (
                <Ionicons name="lock-closed" size={14} color="#FFB300" />
              ) : null}
              <Text style={[styles.profileBtnText, selectedProfile === p && { color: "#FF6B35" }]}>
                {p === "auto" ? "تلقائي" : p === "pro" ? "محترف" : "قناص"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(!unlockedPremium && selectedProfile === "auto") && (
          <TouchableOpacity onPress={handleUnlockPremium} activeOpacity={0.8}>
            <LinearGradient colors={["#5C1A00", "#7D2500"]} style={styles.unlockBanner}>
              <Ionicons name="lock-closed" size={18} color="#FFB300" />
              <Text style={styles.unlockText}>شاهد إعلاناً لإلغاء الأنماط المتقدمة</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#FFB300" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* DPI Card */}
        <GradientCard colors={["#1A0A00", "#2A1200"]} style={styles.dpiCard}>
          <View style={styles.dpiRow}>
            <MaterialCommunityIcons name="mouse" size={24} color="#FF6B35" />
            <View style={{ flex: 1 }}>
              <Text style={styles.dpiLabel}>DPI الموصى به</Text>
              <Text style={styles.dpiValue}>{activeSettings.dpi}</Text>
            </View>
            <View style={styles.dpiInfo}>
              <Text style={styles.dpiGamepad}>{activeSettings.gamepad}</Text>
            </View>
          </View>
        </GradientCard>

        {/* Sensitivity Settings */}
        <Text style={styles.sectionTitle}>إعدادات الحساسية</Text>
        <GradientCard colors={["#0F1729", "#131E35"]} style={styles.sensCard}>
          {SETTINGS_LABELS.map((item, idx) => {
            const val = activeSettings[item.key] as number;
            return (
              <View key={item.key}>
                <View style={styles.sensRow}>
                  <MaterialCommunityIcons name={item.icon as any} size={18} color="#FF6B35" style={{ width: 22 }} />
                  <Text style={styles.sensLabel}>{item.label}</Text>
                  <SensBar value={val} color="#FF6B35" />
                  <Text style={styles.sensValue}>{val}</Text>
                </View>
                {idx < SETTINGS_LABELS.length - 1 && <View style={styles.sensDiv} />}
              </View>
            );
          })}
        </GradientCard>

        {/* Tips */}
        <GradientCard colors={["#1A0A00", "#250E00"]} style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>نصائح للعب أفضل</Text>
          {[
            "قم بضبط الحساسية تدريجياً ولا تغيرها بشكل مفاجئ",
            "جرب الإعدادات في وضع التدريب أولاً",
            "ضبط DPI مناسب يقلل من الارتعاش أثناء التصويب",
            "استخدم الجايروسكوب لتحسين الدقة (إن توفر)",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={14} color="#FF6B35" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </GradientCard>

        <AdBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  ffHeader: { borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14, borderWidth: 1, borderColor: "#FF6B3530" },
  ffTitle: { fontSize: 22, color: "#FF6B35", fontFamily: "Inter_700Bold" },
  ffSub: { fontSize: 12, color: "#A0B4D0", fontFamily: "Inter_400Regular", marginTop: 2 },
  tierBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  tierText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  deviceCard: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16, borderRadius: 16 },
  deviceName: { fontSize: 15, color: "#E8F0FE", fontFamily: "Inter_600SemiBold" },
  deviceSub: { fontSize: 11, color: "#6B82A0", fontFamily: "Inter_400Regular", marginTop: 2 },
  tierDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 17, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginBottom: 10 },
  profileRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  profileBtn: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: "#1E2D47", paddingVertical: 10, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 4, backgroundColor: "#0F1729" },
  profileBtnActive: { borderColor: "#FF6B3570", backgroundColor: "#2A1200" },
  profileBtnText: { fontSize: 13, color: "#A0B4D0", fontFamily: "Inter_600SemiBold" },
  unlockBanner: { borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14, borderWidth: 1, borderColor: "#FFB30030" },
  unlockText: { flex: 1, color: "#FFB300", fontFamily: "Inter_500Medium", fontSize: 13 },
  dpiCard: { borderRadius: 16, marginBottom: 14, paddingVertical: 18 },
  dpiRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  dpiLabel: { fontSize: 12, color: "#6B82A0", fontFamily: "Inter_400Regular" },
  dpiValue: { fontSize: 32, color: "#FF6B35", fontFamily: "Inter_700Bold" },
  dpiInfo: { alignItems: "flex-end" },
  dpiGamepad: { fontSize: 12, color: "#A0B4D0", fontFamily: "Inter_500Medium" },
  sensCard: { borderRadius: 20, marginBottom: 14, paddingVertical: 8 },
  sensRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 4 },
  sensLabel: { fontSize: 12, color: "#A0B4D0", fontFamily: "Inter_500Medium", width: 100 },
  sensValue: { fontSize: 15, color: "#FF6B35", fontFamily: "Inter_700Bold", width: 30, textAlign: "right" },
  sensDiv: { height: 1, backgroundColor: "#1E2D47", marginHorizontal: 4 },
  tipsCard: { borderRadius: 16, marginBottom: 16, gap: 8 },
  tipsTitle: { fontSize: 15, color: "#FF6B35", fontFamily: "Inter_700Bold", marginBottom: 4 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  tipText: { fontSize: 12, color: "#A0B4D0", fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },
});
