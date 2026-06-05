import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { GradientCard } from "@/components/GradientCard";
import { useAdMob } from "@/hooks/useAdMob";
import { AdBanner } from "@/components/AdBanner";

interface JunkCategory {
  id: string;
  name: string;
  size: string;
  sizeMB: number;
  icon: string;
  color: string;
  selected: boolean;
  description: string;
}

const INITIAL_CATEGORIES: JunkCategory[] = [
  { id: "cache", name: "ملفات الكاش", size: "856 MB", sizeMB: 856, icon: "cached", color: "#00D4FF", selected: true, description: "ملفات مؤقتة من التطبيقات" },
  { id: "thumbnails", name: "الصور المصغرة", size: "423 MB", sizeMB: 423, icon: "image-multiple", color: "#7B2FFF", selected: true, description: "صور مصغرة قديمة وغير ضرورية" },
  { id: "downloads", name: "ملفات محملة قديمة", size: "612 MB", sizeMB: 612, icon: "download", color: "#FF6B35", selected: false, description: "ملفات تم تحميلها ولم تُستخدم منذ شهر" },
  { id: "duplicates", name: "ملفات مكررة", size: "234 MB", sizeMB: 234, icon: "content-copy", color: "#FFB300", selected: true, description: "نسخ مكررة من الصور والملفات" },
  { id: "apk", name: "ملفات APK", size: "178 MB", sizeMB: 178, icon: "android", color: "#00FF88", selected: false, description: "تطبيقات تم تثبيتها مسبقاً" },
  { id: "logs", name: "ملفات السجلات", size: "89 MB", sizeMB: 89, icon: "file-document", color: "#FF2D78", selected: true, description: "سجلات النظام والتطبيقات" },
];

type Phase = "idle" | "scanning" | "cleaning" | "done";

export default function CleanerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { showInterstitial } = useAdMob();
  const [categories, setCategories] = useState<JunkCategory[]>(INITIAL_CATEGORIES);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [cleanedMB, setCleanedMB] = useState(0);

  const spinAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);
  const successAnim = useSharedValue(0);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const selectedMB = categories.filter((c) => c.selected).reduce((s, c) => s + c.sizeMB, 0);
  const selectedSize = selectedMB > 1024 ? `${(selectedMB / 1024).toFixed(1)} GB` : `${selectedMB} MB`;

  const toggleCategory = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const startScan = useCallback(() => {
    setPhase("scanning");
    spinAnim.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
    progressAnim.value = 0;
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setPhase("idle");
        spinAnim.value = withTiming(0, { duration: 300 });
      }
      setProgress(Math.round(p));
    }, 200);
  }, []);

  const startClean = useCallback(() => {
    if (phase !== "idle") return;
    const total = selectedMB;
    if (total === 0) {
      Alert.alert("تنبيه", "اختر فئات للتنظيف أولاً");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase("cleaning");
    spinAnim.value = withRepeat(withTiming(1, { duration: 800 }), -1, false);
    setProgress(0);
    setCleanedMB(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setCleanedMB(total);
        setPhase("done");
        spinAnim.value = withTiming(0);
        successAnim.value = withSpring(1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showInterstitial();
        setCategories((prev) => prev.map((c) => (c.selected ? { ...c, sizeMB: 0, size: "0 MB" } : c)));
      }
      setProgress(Math.round(p));
    }, 150);
  }, [phase, selectedMB, showInterstitial]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinAnim.value * 360}deg` }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successAnim.value }],
    opacity: successAnim.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 16, paddingBottom: (Platform.OS === "web" ? 84 : 85) + bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>منظف الهاتف</Text>
        <Text style={styles.pageSubtitle}>احذف الملفات غير الضرورية وحرر المساحة</Text>

        {/* Main Cleaner Card */}
        <GradientCard colors={["#0A1830", "#0D1E3A"]} style={styles.mainCard}>
          {phase === "done" ? (
            <Animated.View style={[styles.successContainer, successStyle]}>
              <LinearGradient colors={["#00FF88", "#00B060"]} style={styles.successIcon}>
                <MaterialCommunityIcons name="check-bold" size={48} color="#fff" />
              </LinearGradient>
              <Text style={styles.successTitle}>تم التنظيف بنجاح!</Text>
              <Text style={styles.successSub}>
                تم حذف{" "}
                <Text style={{ color: "#00FF88", fontFamily: "Inter_700Bold" }}>
                  {cleanedMB} MB
                </Text>{" "}
                من الهاتف
              </Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setPhase("idle");
                  setCategories(INITIAL_CATEGORIES);
                  successAnim.value = 0;
                }}
              >
                <Text style={{ color: "#00D4FF", fontFamily: "Inter_600SemiBold" }}>فحص مجدد</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statBig, { color: "#FF4757" }]}>{selectedSize}</Text>
                  <Text style={styles.statSmall}>للتنظيف</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statBig, { color: "#00FF88" }]}>
                    {categories.filter((c) => c.selected).length}
                  </Text>
                  <Text style={styles.statSmall}>فئة محددة</Text>
                </View>
              </View>

              {(phase === "scanning" || phase === "cleaning") && (
                <View style={styles.progressContainer}>
                  <Animated.View style={spinStyle}>
                    <MaterialCommunityIcons
                      name="loading"
                      size={32}
                      color={phase === "scanning" ? "#00D4FF" : "#00FF88"}
                    />
                  </Animated.View>
                  <Text style={styles.progressText}>
                    {phase === "scanning" ? "جارٍ الفحص..." : "جارٍ التنظيف..."}
                  </Text>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={phase === "scanning" ? ["#00D4FF", "#0090FF"] : ["#00FF88", "#00CC60"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${progress}%` as any }]}
                    />
                  </View>
                  <Text style={styles.progressPct}>{progress}%</Text>
                </View>
              )}

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: "#00D4FF40" }]}
                  onPress={startScan}
                  disabled={phase !== "idle"}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="radar" size={18} color="#00D4FF" />
                  <Text style={[styles.actionBtnText, { color: "#00D4FF" }]}>فحص</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cleanBtn, { opacity: phase !== "idle" ? 0.6 : 1 }]}
                  onPress={startClean}
                  disabled={phase !== "idle"}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#00FF88", "#00CC60"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cleanBtnInner}
                  >
                    <MaterialCommunityIcons name="broom" size={20} color="#080C1A" />
                    <Text style={styles.cleanBtnText}>تنظيف الآن</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </GradientCard>

        {/* Categories */}
        <Text style={styles.sectionTitle}>فئات الملفات</Text>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => toggleCategory(cat.id)}
            activeOpacity={0.7}
          >
            <GradientCard style={[styles.categoryCard, cat.selected && { borderColor: cat.color + "40" }]}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + "20" }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catDesc}>{cat.description}</Text>
              </View>
              <View style={styles.catRight}>
                <Text style={[styles.catSize, { color: cat.color }]}>{cat.size}</Text>
                <View style={[styles.checkbox, cat.selected && { backgroundColor: cat.color, borderColor: cat.color }]}>
                  {cat.selected && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
                </View>
              </View>
            </GradientCard>
          </TouchableOpacity>
        ))}

        <AdBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  pageTitle: { fontSize: 26, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: "#6B82A0", fontFamily: "Inter_400Regular", marginBottom: 20 },
  mainCard: { marginBottom: 20, borderRadius: 24, paddingVertical: 24 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginBottom: 20 },
  statItem: { alignItems: "center" },
  statBig: { fontSize: 30, fontFamily: "Inter_700Bold" },
  statSmall: { fontSize: 12, color: "#6B82A0", fontFamily: "Inter_400Regular", marginTop: 4 },
  divider: { width: 1, height: 50, backgroundColor: "#1E2D47" },
  btnRow: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, borderRadius: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, gap: 6 },
  actionBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cleanBtn: { flex: 2, borderRadius: 14, overflow: "hidden" },
  cleanBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, gap: 8 },
  cleanBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#080C1A" },
  progressContainer: { alignItems: "center", marginBottom: 16, gap: 8 },
  progressText: { color: "#A0B4D0", fontFamily: "Inter_500Medium", fontSize: 13 },
  progressBar: { width: "90%", height: 6, backgroundColor: "#1A2540", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressPct: { color: "#6B82A0", fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 17, color: "#E8F0FE", fontFamily: "Inter_700Bold", marginBottom: 12 },
  categoryCard: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 12, borderRadius: 16 },
  catIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  catInfo: { flex: 1 },
  catName: { fontSize: 14, color: "#E8F0FE", fontFamily: "Inter_600SemiBold" },
  catDesc: { fontSize: 11, color: "#6B82A0", fontFamily: "Inter_400Regular", marginTop: 2 },
  catRight: { alignItems: "flex-end", gap: 6 },
  catSize: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: "#1E2D47", justifyContent: "center", alignItems: "center" },
  successContainer: { alignItems: "center", gap: 12, paddingVertical: 16 },
  successIcon: { width: 88, height: 88, borderRadius: 44, justifyContent: "center", alignItems: "center" },
  successTitle: { fontSize: 22, color: "#E8F0FE", fontFamily: "Inter_700Bold" },
  successSub: { fontSize: 14, color: "#A0B4D0", fontFamily: "Inter_400Regular", textAlign: "center" },
  resetBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#00D4FF40", marginTop: 8 },
});
