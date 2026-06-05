import { Tabs } from "expo-router";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/hooks/useColors";

function TabBarBackground() {
  const colors = useColors();
  if (Platform.OS === "ios") {
    return <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />;
  }
  return (
    <LinearGradient
      colors={["#0A1022", "#0F1729"]}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : "#0A1022",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: Platform.OS === "web" ? 84 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
        },
        tabBarBackground: () => <TabBarBackground />,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cleaner"
        options={{
          title: "Cleaner",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="broom" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="features"
        options={{
          title: "Features",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="star-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="freefire"
        options={{
          title: "Free Fire",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="crosshairs-gps" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Files",
          tabBarIcon: ({ color, size }) => (
            <Feather name="folder" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

