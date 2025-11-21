import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function useWindLeafAnimation(zIndex, index) {
  const rotate = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  // 흔들림 강도 (index 높을수록 조금 더 천천히/약하게)
  const baseRotate = 4; // 4deg
  const rotateAmount = baseRotate - index * 0.3;

  const baseMove = 3;
  const moveAmount = baseMove - index * 0.2;

  const duration = 2000 + index * 150;

  useEffect(() => {
    // 회전
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 좌우 흔들림
    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: duration + 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: duration + 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return {
    transform: [
      {
        rotate: rotate.interpolate({
          inputRange: [0, 1],
          outputRange: [`-${rotateAmount}deg`, `${rotateAmount}deg`],
        }),
      },
      {
        translateX: sway.interpolate({
          inputRange: [0, 1],
          outputRange: [-moveAmount, moveAmount],
        }),
      },
    ],
    zIndex,
  };
}
