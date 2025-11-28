// src/components/island/hooks/useCloudAnimation.js
import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function useCloudAnimation(speed, initialDelay = 0) {
  const x = useSharedValue(-width * 1.5);

  const randomY = Math.floor(Math.random() * 150) + 10;

  const animateOnce = () => {
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -width * 1.5 : width * 1.5;
    const endX = fromLeft ? width * 1.5 : -width * 1.5;

    const travel = speed + Math.random() * 12000;
    const rest = Math.random() * 8000 + 4000;

    x.value = startX;

    x.value = withTiming(
      endX,
      {
        duration: travel,
        easing: Easing.linear,
      },
      () => {
        runOnJS(() => {
          setTimeout(() => animateOnce(), rest);
        })();
      }
    );
  };

  useEffect(() => {
    const t = setTimeout(() => {
      animateOnce();
    }, initialDelay);

    return () => clearTimeout(t);
  }, [speed, initialDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return { animatedStyle, randomY };
}
