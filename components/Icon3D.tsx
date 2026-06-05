import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Icon3DProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  intensity?: "low" | "medium" | "high";
}

export const Icon3D: React.FC<Icon3DProps> = ({
  name,
  size = 48,
  color = "#00D4FF",
  style,
  intensity = "medium",
}) => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const intensityMap = {
    low: { duration: 4000, range: 20 },
    medium: { duration: 3000, range: 30 },
    high: { duration: 2000, range: 45 },
  };

  const config = intensityMap[intensity];

  useEffect(() => {
    rotateX.value = withRepeat(
      withTiming(1, { duration: config.duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    rotateY.value = withRepeat(
      withTiming(1, { duration: config.duration * 0.8, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    rotateZ.value = withRepeat(
      withTiming(1, { duration: config.duration * 1.2, easing: Easing.linear }),
      -1,
      false
    );
  }, [intensity]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotX = interpolate(rotateX.value, [0, 1], [-config.range, config.range]);
    const rotY = interpolate(rotateY.value, [0, 1], [-config.range, config.range]);
    const rotZ = interpolate(rotateZ.value, [0, 1], [0, 360]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotX}deg` },
        { rotateY: `${rotY}deg` },
        { rotateZ: `${rotZ}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size + 16,
          height: size + 16,
        },
        animatedStyle,
        style,
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={name as any}
          size={size * 0.6}
          color={color}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    perspective: 1000,
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.3)",
  },
});
