// apps/mobile/components/IslandScene.js
import React, { useEffect } from 'react';
import { View, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing,
} from 'react-native-reanimated';

import rockPng from '../assets/rock.png';
import groundPng from '../assets/ground.png';
import turntablePng from '../assets/turntable.png';
import chestPng from '../assets/chest.png';

import Svg, { Defs, LinearGradient, Stop, Path, Rect, Circle } from 'react-native-svg';

const W = 300;     // 디자인 기준폭 (메인에서 scale로 확대)
const H = 560;     // 높이 약간 늘림

export default function IslandScene({
  onPressChest = () => {},
  onPressTable = () => {},
  scale = 1,
}) {
  // ─ animation values
  const palmSwing = useSharedValue(0);
  const cloudX1   = useSharedValue(0);
  const cloudX2   = useSharedValue(-120);
  const waveShift = useSharedValue(0);

  useEffect(() => {
    palmSwing.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
    cloudX1.value   = withRepeat(withTiming(120, { duration: 14000, easing: Easing.linear }), -1);
    cloudX2.value   = withRepeat(withTiming(240, { duration: 18000, easing: Easing.linear }), -1);
    waveShift.value = withRepeat(withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const palmStyle  = useAnimatedStyle(() => ({ transform: [{ rotate: `${-4 + palmSwing.value * 8}deg` }] }));
  const cloud1Style= useAnimatedStyle(() => ({ transform: [{ translateX: cloudX1.value }] }));
  const cloud2Style= useAnimatedStyle(() => ({ transform: [{ translateX: cloudX2.value }] }));
  const wave1Style = useAnimatedStyle(() => ({ transform: [{ translateY: waveShift.value * 4 }],  opacity: 0.7 }));
  const wave2Style = useAnimatedStyle(() => ({ transform: [{ translateY: -waveShift.value * 5 }], opacity: 0.6 }));
  const wave3Style = useAnimatedStyle(() => ({ transform: [{ translateY: waveShift.value * 2 - 1 }], opacity: 0.5 }));

  // 섬 PNG 크기/위치 (원본 비율 2.5:1 가정)
  const GROUND_W = W * 2.8;            // 가로를 2.2배
  const GROUND_H = GROUND_W / 2.5;     // 비율 유지
  const GROUND_LEFT = (W - GROUND_W) / 2;
  const GROUND_TOP  = H * 0.64 - GROUND_H * 0.42; // 살짝 아래

  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <View style={{ width: W, height: H, overflow: 'visible', transform: [{ scale }] }}>
        {/* SKY + SEA background (전체 캔버스 채움) */}
        <Svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#CFEBFF" />
              <Stop offset="1" stopColor="#A4D6FF" />
            </LinearGradient>
            <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#79D1FF" />
              <Stop offset="1" stopColor="#4FA9F3" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill="url(#sky)" />
          <Rect x={0} y={H * 0.46} width={W} height={H} fill="url(#sea)" />
        </Svg>

        {/* Clouds */}
        <Animated.View style={[{ position: 'absolute', top: 40, left: 40 }, cloud1Style]}>
          <Cloud />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', top: 90, left: 190, opacity: 0.85 }, cloud2Style]}>
          <Cloud scale={0.9} />
        </Animated.View>

        {/* Waves */}
        <Animated.View style={[{ position: 'absolute', left: 0, top: H * 0.56 }, wave1Style]}>
          <Wave width={W} color="#FFFFFF" alpha={0.18} />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', left: 0, top: H * 0.61 }, wave2Style]}>
          <Wave width={W} color="#FFFFFF" alpha={0.16} />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', left: 0, top: H * 0.66 }, wave3Style]}>
          <Wave width={W} color="#FFFFFF" alpha={0.14} />
        </Animated.View>

        {/* BIG ISLAND PNG (아래에 깔림) */}
        <Image
          source={groundPng}
          style={{
            position: 'absolute',
            width: GROUND_W,
            height: GROUND_H,
            left: GROUND_LEFT,
            top: GROUND_TOP,
            resizeMode: 'contain',
          }}
        />

        {/* Palm (왼쪽) */}
        <Animated.View style={[{ position: 'absolute', left: W * 0.12, top: H * 0.46, width: 90, height: 120, transformOrigin: 'bottom left' }, palmStyle]}>
          <Palm />
        </Animated.View>

        {/* Rock (섬 위 중앙-오른쪽) */}
        <Image
          source={rockPng}
          style={{
            position: 'absolute',
            width: 120, height: 120, resizeMode: 'contain',
            left: W * 0.3, top: H * 0.55,
          }}
        />

        {/* Chest (섬 위 왼쪽) */}
        <Pressable onPress={onPressChest}
          style={{ position: 'absolute', left: W * 0.0, top: H * 0.66 }}>
          <Image source={chestPng} style={{ width: 150, height: 100, resizeMode: 'contain' }} />
        </Pressable>

        {/* Turntable (섬 위 오른쪽) */}
        <Pressable onPress={onPressTable}
          style={{ position: 'absolute', left: W * 0.55, top: H * 0.55 }}>
          <Image source={turntablePng} style={{ width: 150, height: 100, resizeMode: 'contain' }} />
        </Pressable>
      </View>
    </View>
  );
}

/* ======= SVG parts ======= */
function Cloud({ scale = 1 }) {
  const w = 120 * scale, h = 48 * scale;
  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id="cloud" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="1" stopColor="#E8F6FF" stopOpacity="0.95" />
        </LinearGradient>
      </Defs>
      <Path
        d="M15 32c-12 0-12-18 2-18 3-10 18-12 26-4 10-6 26 0 26 12 16 0 16 22-4 22H15z"
        fill="url(#cloud)"
        transform={`scale(${scale})`}
      />
    </Svg>
  );
}

function Wave({ width, color, alpha }) {
  return (
    <Svg width={width} height={36}>
      <Path
        d="M0,18 C60,6 120,30 180,18 S300,6 360,18 S480,30 540,18 L540,36 L0,36 Z"
        fill={color}
        opacity={alpha}
      />
    </Svg>
  );
}

function Palm() {
  return (
    <Svg width={90} height={120}>
      <Defs>
        <LinearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C98347" />
          <Stop offset="1" stopColor="#9C5E2E" />
        </LinearGradient>
        <LinearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3CBF62" />
          <Stop offset="1" stopColor="#1F9E4A" />
        </LinearGradient>
      </Defs>
      <Path d="M40 110 C42 80, 40 50, 46 20" stroke="url(#trunk)" strokeWidth={12} strokeLinecap="round" />
      <Path d="M46 28 C10 30, 18 8, 8 6"   stroke="url(#leaf)" strokeWidth={10} strokeLinecap="round" />
      <Path d="M46 28 C14 16, 22 2, 14 0"  stroke="url(#leaf)" strokeWidth={10} strokeLinecap="round" />
      <Path d="M46 28 C32 8, 40 0, 34 -4"  stroke="url(#leaf)" strokeWidth={10} strokeLinecap="round" />
      <Path d="M46 28 C64 10, 78 0, 86 -2" stroke="url(#leaf)" strokeWidth={10} strokeLinecap="round" />
      <Path d="M46 28 C62 16, 84 12, 92 10" stroke="url(#leaf)" strokeWidth={10} strokeLinecap="round" />
    </Svg>
  );
}
