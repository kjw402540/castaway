import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function WavesLayer({
  offsetFromBottom = 130,
  height = 140,
}) {
  const { width } = Dimensions.get("window");

  const back = useSharedValue(0);
  const front = useSharedValue(0);

  useEffect(() => {
    back.value = withRepeat(
      withTiming(1, {
        duration: 9000,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true
    );

    front.value = withRepeat(
      withTiming(1, {
        duration: 6000,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      true
    );
  }, []);

  // 뒤쪽 파도
  const backProps = useAnimatedProps(() => {
    const p = back.value;
    const baseY = height * 0.45;
    const amp = 10;

    const mid = width / 2;
    const cp1x = mid * 0.5;
    const cp2x = mid * 1.5;

    const cp1y = baseY + Math.sin(p * 2 * Math.PI) * amp;
    const cp2y = baseY - Math.sin(p * 2 * Math.PI) * amp;
    const endY = baseY;

    const d = `M0 ${baseY}
      C ${cp1x} ${cp1y},
        ${cp2x} ${cp2y},
        ${width} ${endY}
      L ${width} ${height}
      L 0 ${height}
      Z`;

    return { d };
  });

  // 앞쪽 파도
  const frontProps = useAnimatedProps(() => {
    const p = front.value;
    const baseY = height * 0.48;
    const amp = 14;

    const mid = width / 2;
    const cp1x = mid * 0.5;
    const cp2x = mid * 1.5;

    const cp1y = baseY + Math.sin(p * 2 * Math.PI) * amp;
    const cp2y = baseY - Math.sin(p * 2 * Math.PI) * amp;
    const endY = baseY;

    const d = `M0 ${baseY}
      C ${cp1x} ${cp1y},
        ${cp2x} ${cp2y},
        ${width} ${endY}
      L ${width} ${height}
      L 0 ${height}
      Z`;

    return { d };
  });

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: offsetFromBottom,
        width,
        height,
      }}
    >
      <Svg width={width} height={height}>
        <Defs>
          {/* 뒤쪽 파도 gradient */}
          <LinearGradient id="backWave" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#7BAFDA" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#72AEE6" stopOpacity="0.35" />
          </LinearGradient>

          {/* 앞쪽 파도 gradient */}
          <LinearGradient id="frontWave" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#9EC9F7" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#72AEE6" stopOpacity="0.65" />
          </LinearGradient>
        </Defs>

        {/* 뒤 파도 */}
        <AnimatedPath animatedProps={backProps} fill="url(#backWave)" />

        {/* 앞 파도 */}
        <AnimatedPath animatedProps={frontProps} fill="url(#frontWave)" />
      </Svg>
    </View>
  );
}
