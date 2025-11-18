import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

// 훅에 zIndex와 함께 index(0부터 시작)를 인자로 받도록 수정
export default function useWindLeafAnimation(zIndex = 10, index = 0) {
  const rotate = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  // 1. Z-Index 기반 흔들림 강화 계수 계산 (유지)
  const MAX_Z_INDEX = 10;
  const multiplier = 1 + (MAX_Z_INDEX - zIndex) * 0.1;

  // 2. 🔴 제거됨: index 2, 3에 대한 추가적인 감소 계수 로직 (targetDampener) 제거

  // 3. 진폭 계산: 기본 진폭은 움직임이 잘 보이는 수준으로 유지
  const baseRotationAmplitude = Math.random() * 0.7 + 1; // 0.8 ~ 1.5deg
  const baseSwayAmplitude = Math.random() * 0.5 + 1;     // 0.5 ~ 1.0px

  // 최종 진폭 = 기본 진폭 * zIndex 보정 계수 (multiplier만 적용)
  const rotationAmplitude = baseRotationAmplitude * multiplier;
  const swayAmplitude = baseSwayAmplitude * multiplier;

  const delay = Math.random() * 900;
  const duration = Math.random() * 1000 + 2000;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotate, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(rotate, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(sway, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ]),
      { delay }
    ).start();
  }, [zIndex, index]);

  const rotateInterpolation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: [`-${rotationAmplitude}deg`, `${rotationAmplitude}deg`],
  });

  const swayInterpolation = sway.interpolate({
    inputRange: [0, 1],
    outputRange: [
      -swayAmplitude,
      swayAmplitude,
    ],
  });

  return {
    transform: [
      { rotate: rotateInterpolation },
      { translateY: swayInterpolation },
    ],
  };
}