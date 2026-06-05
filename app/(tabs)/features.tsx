import React, { useEffect, useState } from "react";
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
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { Card3D } from "@/components/Card3D";
import { Icon3D } from "@/components/Icon3D";

const { width } = Dimensions.get("window");

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: "daily" | "storage" | "performance" | "security";
}

const FEATURES: Feature[] = [
  {
    id: "app-cache",
    title: "تنظيف ذاكرة التطبيقات",
    description: "حذف ملفات الكاش لجميع التطبيقات بدون فقدان البيانات",
    icon: "broom",
    color: "#00D4FF",
    category: "daily",
  },
  {
    id: "duplicate-files",
    title: "حذف الملفات المكررة",
    description: "البحث عن الصور والملفات المتكررة وحذفها",
    icon: "duplicate",
    color: "#00FF88",
    category: "storage",
  },
  {
    id: "large-files",
    title: "إدارة الملفات الكبيرة",
    description: "العثور على أكبر الملفات وحذف غير المهم منها",
    icon: "folder-multiple",
    color: "#FF6B35",
    category: "storage",
  },
  {
    id: "battery-optimizer",
    title: "محسّن البطارية",
    description: "إيقاف التطبيقات غير الضرورية وتوفير استهلاك الطاقة",
    icon: "battery-charging",
    color: "#FFB300",
    category: "performance",
  },
  {
    id: "ram-cleaner",
    title: "تنظيف الذاكرة العشوائية",
    description: "تحرير الذاكرة من التطبيقات غير المستخدمة",
    icon: "memory",
    color: "#7B2FFF",
    category: "performance",
  },
  {
    id: "startup-apps",
    title: "إدارة تطبيقات البدء",
    description: "تعطيل التطبيقات التي تبطئ بدء التشغيل",
    icon: "lightning-bolt",
    color: "#FF4757",
    category: "performance",
  },
  {
    id: "privacy-cleaner",
    title: "تنظيف السجلات",
    description: "حذف سجل البحث والاتصالات والرسائل المحذوفة",
    icon: "shield-account",
    color: "#2ED573",
    category: "security",
  },
  {
    id: "auto-backup",
    title: "النسخ الاحتياطي الذاتي",
    description: "احفظ بيانات مهمة تلقائياً على السحابة",
    icon: "cloud-upload",
    color: "#1E90FF",
    category: "security",
  },
];

const CATEGORIES = [
  { id: "daily", label: "الاستخدام اليومي", icon: "calendar" },
  { id: "storage", label: "إدارة التخزين", icon: "database" },
  { id: "performance", label: "الأداء", icon: "speedometer" },
  { id: "security", label: "الأمان", icon: "lock" },
];

export default function FeaturesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>("daily");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const filteredFeatures = FEATURES.filter(
    (f) => f.category === selectedCategory
  );

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 16, paddingBottom: 100 + bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>المميزات المتقدمة</Text>
          <Text style={styles.subtitle}>
            أدوات احترافية لتحسين جهازك يومياً
          </Text>
        </View>

        {/* Category Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryBtn,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? colors.cyan + "20"
                      : colors.card,
                  borderColor:
                    selectedCategory === category.id
                      ? colors.cyan
                      : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={category.icon as any}
                size={16}
                color={
                  selectedCategory === category.id ? colors.cyan : "#6B82A0"
                }
              />
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color:
                      selectedCategory === category.id
                        ? colors.cyan
                        : "#6B82A0",
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          {filteredFeatures.map((feature) => (
            <Animated.View
              key={feature.id}
              style={[
                styles.featureWrapper,
                expandedId === feature.id ? scaleStyle : {},
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  setExpandedId(expandedId === feature.id ? null : feature.id)
                }
                activeOpacity={0.9}
              >
                <Card3D colors={["#0D1B3E", "#0F2050", "#091630"]}>
                  <View style={styles.featureHeader}>
                    <Icon3D
                      name={feature.icon}
                      size={40}
                      color={feature.color}
                      intensity="medium"
                    />
                    <View style={styles.featureInfo}>
                      <Text
                        style={[styles.featureName, { color: feature.color }]}
                      >
                        {feature.title}
                      </Text>
                      <Text style={styles.featureCategory}>
                        {CATEGORIES.find((c) => c.id === feature.category)
                          ?.label}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name={expandedId === feature.id ? "chevron-up" : "chevron-down"}
                      size={24}
                      color={colors.cyan}
                    />
                  </View>

                  {expandedId === feature.id && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          { borderColor: feature.color },
                        ]}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={[feature.color + "22", feature.color + "0A"]}
                          style={styles.actionBtnInner}
                        >
                          <Text style={[styles.actionBtnText, { color: feature.color }]}>
                            تفعيل الآن
                          </Text>
                          <MaterialCommunityIcons
                            name="arrow-right"
                            size={16}
                            color={feature.color}
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </Card3D>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Daily Tip Card */}
        <Card3D
          colors={["#1A0A2E", "#250D45", "#1A0A2E"]}
          style={styles.tipCard}
        >
          <View style={styles.tipContent}>
            <View style={styles.tipIcon}>
              <FontAwesome5 name="lightbulb" size={20} color="#FFD700" />
            </View>
            <View style={styles.tipText}>
              <Text style={styles.tipTitle}>💡 نصيحة اليوم</Text>
              <Text style={styles.tipDescription}>
                قم بتشغيل "محسّن البطارية" كل صباح لتحقيق أفضل أداء طوال اليوم
              </Text>
            </View>
          </View>
        </Card3D>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  header: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#E8F0FE",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#6B82A0",
  },
  categoriesScroll: { marginBottom: 20 },
  categoriesContent: { gap: 8 },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  featuresContainer: { gap: 12, marginBottom: 24 },
  featureWrapper: { width: "100%" },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureInfo: { flex: 1 },
  featureName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  featureCategory: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#6B82A0",
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1A2540",
  },
  featureDescription: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#A0B4D0",
    marginBottom: 12,
    lineHeight: 20,
  },
  actionBtn: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  actionBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  tipCard: { marginBottom: 16 },
  tipContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFD70020",
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: { flex: 1 },
  tipTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFD700",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#A0B4D0",
    lineHeight: 18,
  },
});
