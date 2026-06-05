import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  noPadding?: boolean;
}

export function GradientCard({
  children,
  style,
  colors: gradColors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  noPadding = false,
}: GradientCardProps) {
  const colors = useColors();

  return (
    <LinearGradient
      colors={gradColors ?? ["#0F1729", "#1A2540"]}
      start={start}
      end={end}
      style={[styles.card, noPadding ? {} : styles.padded, { borderColor: colors.border }, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  padded: {
    padding: 16,
  },
});
