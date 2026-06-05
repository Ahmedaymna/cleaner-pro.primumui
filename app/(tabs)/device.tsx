import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { GradientCard } from "@/components/GradientCard";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { AdBanner } from "@/components/AdBanner";

interface FeatureItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
  badge?: string;
}

export default function DeviceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const device = useDeviceInfo();
  const [batteryLevel] = useState(84);
  const [ramUsed] = useState(71);
  const [storageUsed] = useState(67);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const features: FeatureItem[] = [
    {
      id: "wifi",
      label: "إعدادات الشبكة",
      icon: "wifi",
      color: "#00D4FF",
      action: () => {
        if (Platform.OS === "android") { Linking.openSettings(); }
      },
    },
    {
      id: "bluetooth",
      label: "البلوتوث",
      icon: "bluetooth",
      color: "#7B2FFF",
      action: () => Linking.openSettings(),
    },
    {
      id: "apps",
      label: "مدير التطبيقات",
      icon: "apps",
      color: "#FF6B35",
      action: () => Alert.alert("قريباً", "هذه الميزة ستكون متاحة قريباً"),
    },
    {
      id: "battery",
      label: "توفير البطارية",
      icon: "battery-charging",
      color: "#00FF88",
      action: () => Linking.openSettings(),
    },
    {
      id: "storage",
      label: "تفاصيل التخزين",
      icon: "database",
      color: "#FFB300",
      action: () => Alert.alert("التخزين", `المستخدم: ${storageUsed}٪\nالمتاح: ${100 - storageUsed}٪`),
    },
    {
      id: "display",
      label: "إعدادات الشاشة",
      icon: "monitor",
      color: "#FF2D78",
      action: () => Linking.openSettings(),
    },
    {
      id: "sound",
      label: "الصوت والاهتزاز",
      icon: "volume-high",
      color: "#00D4FF",
      action: () => Linking.openSettings(),
    },
    {
      id: "security",
      label: "الأمان والخصوصية",
      icon: "shield-check",
      color: "#00FF88",
      badge: "مهم",
      action: () => Linking.openSettings(),
    },
  ];

  const INFO_ROWS = [
    { label: "الماركة", value: device.brand, icon: "phone" },
    { label: "الموديل", value: device.modelName, icon: "cellphone" },
    { label: "نظام التشغيل", value: `${device.osName} ${device.osVersion}`, icon: "android" },
    { label: "الذاكرة الكلية", value: `${device.totalMemory} MB`, icon: "memory" },
    { label: "نوع الجهاز", value: device.deviceType, icon: "devices" },
    { label: "جهاز حقيقي", value: device.isDevice ? "نعم" : "لا (محاكي)", icon: "check-circle" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 16, paddingBottom: (Platform.OS === "web" ? 84 : 85) + bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>معلومات الجهاز</Text>

        {/* Hero Device Card */}
        <LinearGradient
          colors={["#0D1B3E", "#0F2050", "#091630"]}
          style={styles.deviceHero}
        >
          <View style={styles.deviceIconWrap}>
            <LinearGradient colors={["#00D4FF30", "#7B2FFF30"]} style={styles.deviceIconBg}>
              <MaterialCommunityIcons name="cellphone" size={52} color="#00D4FF" />
            </LinearGradient>
          </View>
          <Text style={styles.deviceBrand}>{device.brand}</Text>
          <Text style={styles.deviceModel}>{device.modelName}</Text>
          <Text style={styles.deviceOS}>{device.osName} {device.osVersion}</Text>
        </LinearGradient>

        {/* Resource Gauges */}
        <View style={styles.gaugesRow}>
          {[
            { label: "البطارية", value: batteryLevel, color: "#00FF88", icon: "battery-charging" },
            { label: "الذاكرة", value: ramUsed, color: "#00D4FF", icon: "memory" },
            { label: "التخزين", value: storageUsed, color: "#FF6B35", icon: "database" },
          ].map((g) => (
            <GradientCard key={g.label} style={styles.gaugeCard}>
              <MaterialCommunityIcons name={g.icon as any} size={20} color={g.color} />
              <Text style={[styles.gaugeValue, { color: g.color }]}>{g.value}٪</Text>
              <Text style={styles.gaugeLabel}>{g.label}</Text>
              <View style={styles.gaugeMiniBar}>
                <LinearGradient
                  colors={[g.color + "60", g.color]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.gaugeFill, { width: `${g.value}%` as any }]}
                />
              </View>
            </GradientCard>
          ))}
        </View>

        {/* Device Info Table */}
        <Text style={styles.sectionTitle}>مواصفات الجهاز</Text>
        <GradientCard colors={["#0F1729", "#131E35"]} style={styles.infoCard}>
          {INFO_ROWS.map((row, idx) => (
            <View key={row.label}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name={row.icon as any} size={18} color="#6B82A0" style={{ width: 24 }} />
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{row.value}</Text>
              </View>
              {idx < INFO_ROWS.length - 1 && <View style={styles.infoDivider} />}
            </View>
          ))}
        </GradientCard>

        {/* Feature Grid */}
        <Text style={styles.sectionTitle}>أدوات الإدارة</Text>
        <View style={styles.featuresGrid}>
          {features.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={styles.featureCard}
              onPress={() => { Haptics.selectionAsync(); f.action(); }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[f.color + "18", f.color + "08"]}
                style={[styles.featureCardInner, { borderColor: f.color + "30" }]}
              >
                {f.badge && (
                  <View style={[styles.badgeWrap, { backgroundColor: "#FF4757" }]}>
                    <Text style={styles.badgeText}>{f.badge}</Text>
                  </View>
                )}
                <View style={[styles.featureIcon, { backgroundColor: f.color + "22", borderColor: f.color + "40" }]}>
                  <MaterialCommunityIcons name={f.icon as any} size={24} color={f.color} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Tips */}
        <GradientCard colors={["#0A1022", "#0F1B33"]} style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={18} color="#FFB300" />
            <Text style={styles.tipsTitle}>نصائح لتحسين الأداء</Text>
          </View>
          {[
            "أعد تشغيل هاتفك مرة يومياً لتحسين الأداء",
            "احذف التطبيقات غير المستخدمة بانتظام",
            "أبق نسخة احتياطية دائماً من بياناتك",
            "لا تشحن هاتفك فوق 80٪ للحفاظ على البطارية",
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: "#FFB300" }]} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </GradientCard>

        {/* App Version */}
        <View style={styles.versionRow}>
          <MaterialCommunityIcons name="information" size={16} color="#6B82A0" />
          <Text style={styles.versionText}>Cleaner Pro v1.0.0</Text>
        </View>

        <AdBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  pageTitle: { fontSize: 26, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginBottom: 16 },
  deviceHero: { borderRadius: 24, padding: 28, alignItems: "center", gap: 8, marginBottom: 16, borderWidth: 1, borderColor: "#1E2D47" },
  deviceIconWrap: { marginBottom: 8 },
  deviceIconBg: { width: 88, height: 88, borderRadius: 44, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#00D4FF30" },
  deviceBrand: { fontSize: 14, color: "#6B82A0", fontFamily: "Inter_400Regular" },
  deviceModel: { fontSize: 22, color: "#E8F0FE", fontFamily: "Inter_700Bold" },
  deviceOS: { fontSize: 13, color: "#00D4FF", fontFamily: "Inter_500Medium" },
  gaugesRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  gaugeCard: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 14, borderRadius: 16 },
  gaugeValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  gaugeLabel: { fontSize: 10, color: "#6B82A0", fontFamily: "Inter_400Regular" },
  gaugeMiniBar: { width: "80%", height: 4, backgroundColor: "#1A2540", borderRadius: 2, overflow: "hidden", marginTop: 2 },
  gaugeFill: { height: "100%", borderRadius: 2 },
  sectionTitle: { fontSize: 17, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginBottom: 12 },
  infoCard: { borderRadius: 20, marginBottom: 20, paddingVertical: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 11, paddingHorizontal: 4 },
  infoLabel: { fontSize: 13, color: "#6B82A0", fontFamily: "Inter_400Regular", flex: 1, marginLeft: 8 },
  infoValue: { fontSize: 13, color: "#E8F0FE", fontFamily: "Inter_500Medium", maxWidth: "50%", textAlign: "right" },
  infoDivider: { height: 1, backgroundColor: "#1E2D47" },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  featureCard: { width: "47.5%", borderRadius: 18, overflow: "hidden" },
  featureCardInner: { alignItems: "center", padding: 16, gap: 10, borderWidth: 1, borderRadius: 18, position: "relative" },
  featureIcon: { width: 50, height: 50, borderRadius: 14, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  featureLabel: { fontSize: 12, color: "#E8F0FE", fontFamily: "Inter_500Medium", textAlign: "center" },
  badgeWrap: { position: "absolute", top: 8, right: 8, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 9, color: "#fff", fontFamily: "Inter_600SemiBold" },
  tipsCard: { borderRadius: 16, marginBottom: 12, gap: 8 },
  tipsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  tipsTitle: { fontSize: 15, color: "#FFB300", fontFamily: "Inter_700Bold" },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  tipText: { fontSize: 12, color: "#A0B4D0", fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },
  versionRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16 },
  versionText: { fontSize: 12, color: "#6B82A0", fontFamily: "Inter_400Regular" },
});
