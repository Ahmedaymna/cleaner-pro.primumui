import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

interface Card3DProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  intensity?: number;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  style,
  colors = ["#0D1B3E", "#0F2050", "#091630"],
  intensity = 1,
}) => {
  const shadowAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    shadowAnim.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    glowAnim.value = withRepeat(
      withTiming(1, { duration: 2500 }),
      -1,
      true
    );
  }, []);

  const shadowStyle = useAnimatedStyle(() => {
    const shadowOpacity = interpolate(
      shadowAnim.value,
      [0, 0.5, 1],
      [0.1, 0.25, 0.1],
      Extrapolate.CLAMP
    );

    const elevation = interpolate(
      shadowAnim.value,
      [0, 0.5, 1],
      [8, 16, 8],
      Extrapolate.CLAMP
    );

    return {
      shadowOpacity,
      elevation,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(
      glowAnim.value,
      [0, 0.5, 1],
      [0, 0.15, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: glowOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        shadowStyle,
        {
          shadowColor: colors[0],
          shadowOffset: { width: 0, height: intensity * 8 },
          shadowRadius: intensity * 12,
        },
        style,
      ]}
    >
      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowLayer,
          glowStyle,
          {
            borderColor: colors[0],
            backgroundColor: colors[0],
          },
        ]}
      />

      {/* Main Content */}
      <View
        style={[
          styles.innerContent,
          {
            borderColor: colors[1],
            backgroundColor: colors[2],
          },
        ]}
      >
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  glowLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 1,
  },
  innerContent: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
});
