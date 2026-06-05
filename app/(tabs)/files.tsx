import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";
import { GradientCard } from "@/components/GradientCard";
import { AdBanner } from "@/components/AdBanner";

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uri: string;
  date: string;
  mimeType?: string;
}

type ViewMode = "grid" | "list";
type Section = "all" | "documents" | "images" | "audio" | "video" | "archives";

const SECTION_ICONS: Record<Section, string> = {
  all: "folder-open",
  documents: "file-document",
  images: "image",
  audio: "music",
  video: "video",
  archives: "zip-box",
};

const SECTION_COLORS: Record<Section, string> = {
  all: "#00D4FF",
  documents: "#7B2FFF",
  images: "#FF2D78",
  audio: "#00FF88",
  video: "#FF6B35",
  archives: "#FFB300",
};

const SECTIONS: { key: Section; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "documents", label: "مستندات" },
  { key: "images", label: "صور" },
  { key: "audio", label: "صوت" },
  { key: "video", label: "فيديو" },
  { key: "archives", label: "مضغوط" },
];

function getFileIcon(mimeType?: string, name?: string): { icon: string; color: string } {
  if (!mimeType && name) {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext ?? "")) return { icon: "image", color: "#FF2D78" };
    if (["mp4", "mkv", "avi", "mov"].includes(ext ?? "")) return { icon: "video", color: "#FF6B35" };
    if (["mp3", "wav", "flac", "aac", "m4a"].includes(ext ?? "")) return { icon: "music", color: "#00FF88" };
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext ?? "")) return { icon: "zip-box", color: "#FFB300" };
    if (["pdf"].includes(ext ?? "")) return { icon: "file-pdf-box", color: "#FF4757" };
    if (["doc", "docx"].includes(ext ?? "")) return { icon: "file-word", color: "#2196F3" };
    if (["xls", "xlsx"].includes(ext ?? "")) return { icon: "file-excel", color: "#4CAF50" };
    if (["ppt", "pptx"].includes(ext ?? "")) return { icon: "file-powerpoint", color: "#FF5722" };
    if (["txt"].includes(ext ?? "")) return { icon: "file-document", color: "#7B2FFF" };
    if (["apk"].includes(ext ?? "")) return { icon: "android", color: "#00FF88" };
  }
  if (!mimeType) return { icon: "file", color: "#6B82A0" };
  if (mimeType.startsWith("image/")) return { icon: "image", color: "#FF2D78" };
  if (mimeType.startsWith("video/")) return { icon: "video", color: "#FF6B35" };
  if (mimeType.startsWith("audio/")) return { icon: "music", color: "#00FF88" };
  if (mimeType === "application/pdf") return { icon: "file-pdf-box", color: "#FF4757" };
  if (mimeType.includes("zip") || mimeType.includes("archive")) return { icon: "zip-box", color: "#FFB300" };
  if (mimeType.includes("word")) return { icon: "file-word", color: "#2196F3" };
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return { icon: "file-excel", color: "#4CAF50" };
  return { icon: "file-document", color: "#7B2FFF" };
}

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [section, setSection] = useState<Section>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const pickFiles = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets) {
        const newFiles: FileItem[] = result.assets.map((a, i) => ({
          id: Date.now().toString() + i,
          name: a.name,
          size: formatSize(a.size),
          type: a.mimeType ?? "unknown",
          uri: a.uri,
          date: new Date().toLocaleDateString("ar"),
          mimeType: a.mimeType,
        }));
        setFiles((prev) => [...newFiles, ...prev]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {
      Alert.alert("خطأ", "لم يتم فتح الملف");
    }
  }, []);

  const openFile = useCallback(async (file: FileItem) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri);
      }
    } catch {}
  }, []);

  const deleteFile = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFile?.id === id) setSelectedFile(null);
  }, [selectedFile]);

  const sectionFiles = files.filter((f) => {
    if (section === "all") return true;
    if (section === "images") return f.type.startsWith("image/");
    if (section === "video") return f.type.startsWith("video/");
    if (section === "audio") return f.type.startsWith("audio/");
    if (section === "documents") return (
      f.type.includes("pdf") || f.type.includes("word") || f.type.includes("text") || f.type.includes("document") || f.type.includes("spreadsheet")
    );
    if (section === "archives") return f.type.includes("zip") || f.type.includes("archive") || f.type.includes("rar");
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topArea, { paddingTop: topPad + 12 }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>مدير الملفات</Text>
            <Text style={styles.pageSubtitle}>{files.length} ملف محمول</Text>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity
              style={[styles.iconBtn, { borderColor: colors.border }]}
              onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              <Feather name={viewMode === "list" ? "grid" : "list"} size={18} color={colors.cyan} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addBtn]}
              onPress={pickFiles}
              activeOpacity={0.8}
            >
              <LinearGradient colors={["#00D4FF", "#0090FF"]} style={styles.addBtnInner}>
                <Feather name="plus" size={18} color="#fff" />
                <Text style={styles.addBtnText}>إضافة</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionsScroll} contentContainerStyle={styles.sectionsContent}>
          {SECTIONS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sectionTab, section === s.key && { backgroundColor: SECTION_COLORS[s.key] + "25", borderColor: SECTION_COLORS[s.key] + "60" }]}
              onPress={() => setSection(s.key)}
            >
              <MaterialCommunityIcons name={SECTION_ICONS[s.key] as any} size={14} color={section === s.key ? SECTION_COLORS[s.key] : "#6B82A0"} />
              <Text style={[styles.sectionTabText, section === s.key && { color: SECTION_COLORS[s.key] }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {sectionFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="folder-open" size={72} color="#1E2D47" />
          <Text style={styles.emptyTitle}>لا توجد ملفات</Text>
          <Text style={styles.emptyText}>اضغط "إضافة" لاستيراد ملفاتك</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={pickFiles} activeOpacity={0.8}>
            <LinearGradient colors={["#00D4FF", "#0090FF"]} style={styles.emptyBtnInner}>
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>استيراد ملفات</Text>
            </LinearGradient>
          </TouchableOpacity>
          <AdBanner />
        </View>
      ) : (
        <FlatList
          data={sectionFiles}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: (Platform.OS === "web" ? 84 : 85) + bottomPad },
          ]}
          renderItem={({ item }) => {
            const { icon, color } = getFileIcon(item.mimeType, item.name);
            if (viewMode === "grid") {
              return (
                <TouchableOpacity style={styles.gridCard} onPress={() => openFile(item)} onLongPress={() => deleteFile(item.id)} activeOpacity={0.7}>
                  <GradientCard style={styles.gridCardInner} noPadding>
                    <View style={{ alignItems: "center", padding: 16, gap: 8 }}>
                      <MaterialCommunityIcons name={icon as any} size={40} color={color} />
                      <Text style={styles.gridFileName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.fileSize}>{item.size}</Text>
                    </View>
                  </GradientCard>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity onPress={() => openFile(item)} onLongPress={() => deleteFile(item.id)} activeOpacity={0.7} style={styles.listItem}>
                <GradientCard style={styles.listCardInner}>
                  <View style={[styles.fileIconWrap, { backgroundColor: color + "20" }]}>
                    <MaterialCommunityIcons name={icon as any} size={26} color={color} />
                  </View>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.fileMeta}>{item.size} · {item.date}</Text>
                  </View>
                  <TouchableOpacity onPress={() => openFile(item)}>
                    <Feather name="share-2" size={16} color="#6B82A0" />
                  </TouchableOpacity>
                </GradientCard>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<AdBanner />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topArea: { paddingHorizontal: 16, backgroundColor: "#080C1A" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  pageTitle: { fontSize: 24, color: "#E8F0FE", fontFamily: "Inter_700Bold" },
  pageSubtitle: { fontSize: 12, color: "#6B82A0", fontFamily: "Inter_400Regular", marginTop: 2 },
  headerBtns: { flexDirection: "row", gap: 10, alignItems: "center" },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F1729" },
  addBtn: { borderRadius: 12, overflow: "hidden" },
  addBtnInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, gap: 6 },
  addBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 13 },
  sectionsScroll: { marginBottom: 10 },
  sectionsContent: { gap: 8, paddingRight: 16 },
  sectionTab: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: "#1E2D47", backgroundColor: "#0F1729" },
  sectionTabText: { fontSize: 12, color: "#6B82A0", fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 16, paddingTop: 10 },
  listItem: { marginBottom: 8 },
  listCardInner: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14 },
  fileIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, color: "#E8F0FE", fontFamily: "Inter_500Medium" },
  fileMeta: { fontSize: 11, color: "#6B82A0", fontFamily: "Inter_400Regular", marginTop: 2 },
  fileSize: { fontSize: 11, color: "#6B82A0", fontFamily: "Inter_400Regular" },
  gridCard: { flex: 1, margin: 5 },
  gridCardInner: { borderRadius: 16 },
  gridFileName: { fontSize: 12, color: "#E8F0FE", fontFamily: "Inter_500Medium", textAlign: "center" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, paddingBottom: 80 },
  emptyTitle: { fontSize: 18, color: "#A0B4D0", fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, color: "#6B82A0", fontFamily: "Inter_400Regular" },
  emptyBtn: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
  emptyBtnInner: { paddingHorizontal: 28, paddingVertical: 13 },
});
