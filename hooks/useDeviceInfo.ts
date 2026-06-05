import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

export interface DeviceInfo {
  brand: string;
  modelName: string;
  osName: string;
  osVersion: string;
  deviceType: string;
  totalMemory: number;
  isDevice: boolean;
  manufacturer: string;
}

export function useDeviceInfo() {
  const [info, setInfo] = useState<DeviceInfo>(() => {
    const nativeBrand = (Constants.deviceName ?? "Unknown").split(" ")[0];
    return {
      brand: nativeBrand,
      modelName: Constants.deviceName ?? "Unknown Device",
      osName:
        Platform.OS === "android"
          ? "Android"
          : Platform.OS === "ios"
          ? "iOS"
          : "Web",
      osVersion: String(Platform.Version ?? "Unknown"),
      deviceType: "Smartphone",
      totalMemory: 4096,
      isDevice: !__DEV__,
      manufacturer: nativeBrand,
    };
  });

  return info;
}
