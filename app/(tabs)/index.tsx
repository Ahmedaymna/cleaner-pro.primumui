import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { CircularProgress } from "@/components/CircularProgress";
import { GradientCard } from "@/components/GradientCard";
import { AdBanner } from "@/components/AdBanner";

const { width } = Dimensions.get("window");

const QUICK_ACTIONS = [
  { id: "cleaner", label: "Quick Clean", icon: "broom", color: "#00D4FF", route: "/cleaner" },
  { id: "boost", label: "RAM Boost", icon: "lightning-bolt", color: "#00FF88", route: "/cleaner" },
  { id: "freefire", label: "FF Settings", icon: "crosshairs-gps", color: "#FF6B35", route: "/freefire" },
  { id: "files", label: "File Manager", icon: "folder-open", color: "#7B2FFF", route: "/files" },
];

const STAT_ITEMS = [
  { label: "Storage Used", value: "67%", icon: "database", color: "#00D4FF" },
  { label: "RAM Usage", value: "71%", icon: "memory", color: "#00FF88" },
  { label: "Battery", value: "84%", icon: "battery-charging", color: "#FFB300" },
  { label: "Junk Files", value: "2.3 GB", icon: "delete-sweep", color: "#FF4757" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [healthScore] = useState(73);
  const pulseAnim = useSharedValue(1);
  const glowAnim = useSharedValue(0.6);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.out(Easing.sin) }),
        withTiming(1.0, { duration: 1500, easing: Easing.in(Easing.sin) })
      ),
      -1,
      false
    );
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
  }));

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>مرحباً بك 👋</Text>
            <Text style={styles.appName}>Cleaner Pro</Text>
          </View>
          <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="settings" size={20} color={colors.cyan} />
          </TouchableOpacity>
        </View>

        {/* Health Score */}
        <GradientCard
          colors={["#0D1B3E", "#0F2050", "#091630"]}
          style={styles.healthCard}
        >
          <Animated.View style={[styles.glowRing, glowStyle]} />
          <Text style={styles.healthTitle}>حالة الجهاز</Text>
          <Animated.View style={pulseStyle}>
            <CircularProgress
              size={180}
              strokeWidth={14}
              progress={healthScore}
              color="#00D4FF"
              trackColor="#1A2540"
              label={`${healthScore}`}
              sublabel="نقاط الصحة"
            />
          </Animated.View>
          <Text style={styles.healthStatus}>
            {healthScore >= 80 ? "ممتاز" : healthScore >= 60 ? "جيد – يحتاج تنظيف" : "سيئ – تنظيف فوري"}
          </Text>
          <TouchableOpacity
            style={styles.optimizeBtn}
            onPress={() => router.push("/cleaner")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#00D4FF", "#0090FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.optimizeBtnInner}
            >
              <Text style={styles.optimizeBtnText}>تحسين الآن</Text>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </GradientCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STAT_ITEMS.map((item) => (
            <GradientCard key={item.id} style={styles.statCard}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </GradientCard>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[action.color + "22", action.color + "0A"]}
                style={styles.actionCardInner}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + "20", borderColor: action.color + "40" }]}>
                  <MaterialCommunityIcons name={action.icon as any} size={26} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tip Card */}
        <GradientCard colors={["#1A0A2E", "#250D45"]} style={styles.tipCard}>
          <View style={styles.tipRow}>
            <Ionicons name="information-circle" size={20} color="#7B2FFF" />
            <Text style={styles.tipTitle}>نصيحة اليوم</Text>
          </View>
          <Text style={styles.tipText}>
            احذف ملفات التخزين المؤقت بانتظام لتحسين أداء هاتفك وتوفير المساحة.
          </Text>
        </GradientCard>

        <AdBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 14, color: "#6B82A0", fontFamily: "Inter_400Regular" },
  appName: { fontSize: 24, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginTop: 2 },
  settingsBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  healthCard: { alignItems: "center", marginBottom: 16, paddingVertical: 24, borderRadius: 24, position: "relative", overflow: "hidden" },
  glowRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: "#00D4FF33",
    top: "50%",
    left: "50%",
    marginTop: -110,
    marginLeft: -110,
  },
  healthTitle: { fontSize: 13, color: "#6B82A0", fontFamily: "Inter_500Medium", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" },
  healthStatus: { fontSize: 15, color: "#A0B4D0", fontFamily: "Inter_500Medium", marginTop: 12, marginBottom: 16 },
  optimizeBtn: { borderRadius: 14, overflow: "hidden", width: "80%", marginTop: 4 },
  optimizeBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 8 },
  optimizeBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statCard: { width: (width - 32 - 10) / 2, alignItems: "center", gap: 6, paddingVertical: 16 },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, color: "#6B82A0", fontFamily: "Inter_400Regular", textAlign: "center" },
  sectionTitle: { fontSize: 17, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginBottom: 12 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  actionCard: { width: (width - 32 - 10) / 2, borderRadius: 20, overflow: "hidden" },
  actionCardInner: { alignItems: "center", padding: 18, gap: 10, borderWidth: 1, borderColor: "#1E2D47", borderRadius: 20 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  actionLabel: { fontSize: 13, color: "#E8F0FE", fontFamily: "Inter_600SemiBold", textAlign: "center" },
  tipCard: { marginBottom: 16 },
  tipRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  tipTitle: { fontSize: 14, color: "#7B2FFF", fontFamily: "Inter_600SemiBold" },
  tipText: { fontSize: 13, color: "#A0B4D0", fontFamily: "Inter_400Regular", lineHeight: 20 },
});
