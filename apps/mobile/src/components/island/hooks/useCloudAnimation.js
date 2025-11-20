import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function useCloudAnimation() {
  const translateX = useRef(new Animated.Value(0)).current;

  // 랜덤 Y (구름 높이)
  const randomY = Math.floor(Math.random() * 200) + 20;

  // 출발 방향 랜덤
  const direction = Math.random() < 0.5 ? "left" : "right";
  const startX = direction === "left" ? -200 : screenWidth + 200;
  const endX = direction === "left" ? screenWidth + 200 : -200;

  useEffect(() => {
    translateX.setValue(startX);

    Animated.loop(
      Animated.timing(translateX, {
        toValue: endX,
        duration: 35000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return { translateX, randomY };
}
