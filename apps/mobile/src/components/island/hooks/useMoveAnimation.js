import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

export default function useMoveAnimation() {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(offset, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return offset.interpolate({
    inputRange: [0, 1],
    outputRange: [-3, 3],
  });
}
