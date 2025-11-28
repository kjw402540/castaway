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

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function HorizonWaveLayer({ color = "#66C2FF" }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.linear,
        // ★ SVG Path 애니메이션에 꼭 필요
        useNativeDriver: false,
      }),
      -1,   // 무한 반복
      false // 왕복 X, 한 방향
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    const points = [];
    const numPoints = 50;

    // p: 0 → 1 사이에서 "정확히 한/여러 바퀴" 돌아야
    // 0일 때 모양과 1일 때 모양이 딱 맞아서 끊김이 줄어댐
    const phase = p * Math.PI * 2; // 0 → 2π

    for (let i = 0; i <= numPoints; i++) {
      const ratio = i / numPoints;
      const x = WAVE_WIDTH * ratio;

      // 기본 위치에 따른 베이스 각도
      const base = ratio * Math.PI * 2;

      // 모두 2π의 정수배만 쓰도록 조정
      const wave1 = Math.sin(base + phase * 1) * 7;   // 1바퀴
      const wave2 = Math.sin(base * 2 + phase * 2) * 3; // 2바퀴
      const wave3 = Math.sin(base * 3 + phase * 3) * 1.5; // 3바퀴

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
      <AnimatedPath
        animatedProps={animatedProps}
        fill={color}
        opacity={1}
      />
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
