// src/components/island/hooks/useCloudAnimation.js
import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function useCloudAnimation(speed, initialDelay = 0) {
  const x = useSharedValue(-width * 1.5);

  const randomY = Math.floor(Math.random() * 150) + 10;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -width * 1.5 : width * 1.5;
      const endX = fromLeft ? width * 1.8 : -width * 1.8;

      x.value = startX;

      x.value = withRepeat(
        withTiming(endX, {
          duration: speed * 1.25 + Math.random() * 8000, // ← 속도만 조정
          easing: Easing.linear,
        }),
        -1,
        true // 왕복 유지
      );
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [speed, initialDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return { animatedStyle, randomY };
}
