// src/components/island/HorizonWaveLayer.js
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const WAVE_WIDTH = width * 1.5;
const WAVE_HEIGHT = 40;

// 포인트 수 감소 (50 → 24)
// 시각 차이 거의 없지만 연산량 대폭 감소
const NUM_POINTS = 24;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function HorizonWaveLayer({ color = "#66C2FF" }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // 속도 조금 느리게 (4000 → 6500)
    // easing 단순화
    progress.value = withRepeat(
      withTiming(1, {
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: false, // SVG path 필수
      }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    const phase = p * Math.PI * 2;

    const points = [];

    for (let i = 0; i <= NUM_POINTS; i++) {
      const ratio = i / NUM_POINTS;
      const x = WAVE_WIDTH * ratio;

      const base = ratio * Math.PI * 2;

      // 1,2,3차 파형 모두 유지 (디테일 유지)
      const wave1 = Math.sin(base + phase * 1) * 7;
      const wave2 = Math.sin(base * 2 + phase * 2) * 3;
      const wave3 = Math.sin(base * 3 + phase * 3) * 1.5;

      const y = WAVE_HEIGHT / 2 + wave1 + wave2 + wave3;
      points.push({ x, y });
    }

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const n = points[i + 1];
      d += ` L ${n.x},${n.y}`;
    }

    d += ` L ${WAVE_WIDTH},${WAVE_HEIGHT} L 0,${WAVE_HEIGHT} Z`;
    return { d };
  });

  return (
    <Svg
      width={WAVE_WIDTH}
      height={WAVE_HEIGHT}
      style={styles.svg}
      pointerEvents="none"
    >
      <AnimatedPath animatedProps={animatedProps} fill={color} opacity={1} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    top: "-8%",
    transform: [{ translateX: -width * 0.25 }],
    zIndex: 0,
  },
});
