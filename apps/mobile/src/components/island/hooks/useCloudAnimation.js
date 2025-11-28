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
      const endX = fromLeft ? width * 1.5 : -width * 1.5;

      x.value = startX;

      x.value = withRepeat(
        withTiming(endX, {
          duration: speed + Math.random() * 12000,
          easing: Easing.linear,
        }),
        -1, // infinite
        true // reverse
      );
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, [speed, initialDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return { animatedStyle, randomY };
}
