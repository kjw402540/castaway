// apps/mobile/components/IslandScene.js
import React, { useEffect, useMemo } from 'react';
import { View, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing,
} from 'react-native-reanimated';

import rockPng from '../assets/rock.png';
import groundPng from '../assets/ground.png';
import turntablePng from '../assets/turntable.png';
import chestPng from '../assets/chest.png';

import Svg, { Defs, LinearGradient, Stop, Path, Rect } from 'react-native-svg';

const W = 300;     // 디자인 기준폭 (메인에서 scale로 확대)
const H = 560;     // 높이 약간 늘림

// 안전 범위 클램프
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// theme 기본값 (부모가 안 넘겨줘도 안전)
const FALLBACK_THEME = {
  sky: { top: '#CFEBFF', bottom: '#A4D6FF', cloudColor: '#FFFFFF', cloudSpeed: 0.6 },
  sea: { top: '#79D1FF', bottom: '#4FA9F3', waveAmplitude: 8, waveSpeed: 1.0 },
  island: { baseColor: '#EFD8A6', rockColor: '#9BA3AF' },
  palm: { trunkColor: '#C98347', leafColor: '#3CBF62', sway: 10, size: 1.0, leafCount: 5 },
};

export default function IslandScene({
  onPressChest = () => {},
  onPressTable = () => {},
  scale = 1,
  theme,
}) {
  // theme 병합(누락 키는 기본값으로)
  const t = useMemo(() => {
    const base = FALLBACK_THEME;
    const safe = theme ?? {};
    return {
      sky: {
        top: safe.sky?.top ?? base.sky.top,
        bottom: safe.sky?.bottom ?? base.sky.bottom,
        cloudColor: safe.sky?.cloudColor ?? base.sky.cloudColor,
        cloudSpeed: clamp(Number(safe.sky?.cloudSpeed ?? base.sky.cloudSpeed), 0.1, 3.0),
      },
      sea: {
        top: safe.sea?.top ?? base.sea.top,
        bottom: safe.sea?.bottom ?? base.sea.bottom,
        waveAmplitude: clamp(Number(safe.sea?.waveAmplitude ?? base.sea.waveAmplitude), 0, 20),
        waveSpeed: clamp(Number(safe.sea?.waveSpeed ?? base.sea.waveSpeed), 0.1, 3.0),
      },
      island: {
        baseColor: safe.island?.baseColor ?? base.island.baseColor,
        rockColor: safe.island?.rockColor ?? base.island.rockColor,
      },
      palm: {
        trunkColor: safe.palm?.trunkColor ?? base.palm.trunkColor,
        leafColor: safe.palm?.leafColor ?? base.palm.leafColor,
        sway: clamp(Number(safe.palm?.sway ?? base.palm.sway), 0, 25),
        size: clamp(Number(safe.palm?.size ?? base.palm.size), 0.6, 1.6),
        leafCount: clamp(Number(safe.palm?.leafCount ?? base.palm.leafCount), 1, 8),
      },
    };
  }, [theme]);

  // ─ animation values
  const palmSwing = useSharedValue(0);
  const cloudX1   = useSharedValue(0);
  const cloudX2   = useSharedValue(-120);
  const waveShift = useSharedValue(0);
  const palmSize  = useSharedValue(t.palm.size);

  // 베이스 duration (속도 1.0 기준)
  const CLOUD1_BASE_MS = 14000;
  const CLOUD2_BASE_MS = 18000;
  const WAVE_BASE_MS   = 4500;

  // theme 기반으로 애니메이션(속도/진폭)을 재설정
  useEffect(() => {
    // 클라우드: 속도를 duration 역비례로 반영
    const c1Dur = Math.max(800, CLOUD1_BASE_MS / t.sky.cloudSpeed);
    const c2Dur = Math.max(800, CLOUD2_BASE_MS / t.sky.cloudSpeed);

    cloudX1.value = 0;
    cloudX1.value = withRepeat(withTiming(120, { duration: c1Dur, easing: Easing.linear }), -1);

    cloudX2.value = -120;
    cloudX2.value = withRepeat(withTiming(240, { duration: c2Dur, easing: Easing.linear }), -1);

    // 파도: 속도 (duration 역비례)
    const wDur = Math.max(600, WAVE_BASE_MS / t.sea.waveSpeed);
    waveShift.value = 0;
    waveShift.value = withRepeat(withTiming(1, { duration: wDur, easing: Easing.inOut(Easing.ease) }), -1, true);

    // 야자수: 흔들림 진폭과 크기
    palmSwing.value = withRepeat(
      withTiming(t.palm.sway, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    palmSize.value = withTiming(t.palm.size, { duration: 400, easing: Easing.out(Easing.quad) });
  }, [t.sky.cloudSpeed, t.sea.waveSpeed, t.palm.sway, t.palm.size]);

  // 스타일: 흔들림/크기
  const palmStyle  = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-4 + palmSwing.value * 1.0}deg` }, // 중심각 -4~(+sway-4)
      { scale: palmSize.value },
    ],
  }));
  const cloud1Style= useAnimatedStyle(() => ({ transform: [{ translateX: cloudX1.value }] }));
  const cloud2Style= useAnimatedStyle(() => ({ transform: [{ translateX: cloudX2.value }] }));

  // 파도 진폭을 theme에서 반영 (기존 4/5/2를 비율로 스케일)
  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: (waveShift.value * 4) * (t.sea.waveAmplitude / 8) }],
    opacity: 0.7,
  }));
  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: (-waveShift.value * 5) * (t.sea.waveAmplitude / 8) }],
    opacity: 0.6,
  }));
  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: (waveShift.value * 2 - 1) * (t.sea.waveAmplitude / 8) }],
    opacity: 0.5,
  }));

  // 섬 PNG 크기/위치
  const GROUND_W = W * 2.8;
  const GROUND_H = GROUND_W / 2.5;
  const GROUND_LEFT = (W - GROUND_W) / 2;
  const GROUND_TOP  = H * 0.64 - GROUND_H * 0.42;

  return (
    <View style={{ alignItems: 'center', marginTop: 40 }}>
      <View style={{ width: W, height: H, overflow: 'visible', transform: [{ scale }] }}>
        {/* SKY + SEA background (전체 캔버스 채움) */}
        <Svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <Defs>
            <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={t.sky.top} />
              <Stop offset="1" stopColor={t.sky.bottom} />
            </LinearGradient>
            <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={t.sea.top} />
              <Stop offset="1" stopColor={t.sea.bottom} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={H} fill="url(#sky)" />
          <Rect x={0} y={H * 0.46} width={W} height={H} fill="url(#sea)" />
        </Svg>

        {/* Clouds */}
        <Animated.View style={[{ position: 'absolute', top: 40, left: 40 }, cloud1Style]}>
          <Cloud color={t.sky.cloudColor} />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', top: 90, left: 190, opacity: 0.85 }, cloud2Style]}>
          <Cloud color={t.sky.cloudColor} scale={0.9} />
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

        {/* BIG ISLAND PNG */}
        <Image
          source={groundPng}
          style={{
            position: 'absolute',
            width: GROUND_W,
            height: GROUND_H,
            left: GROUND_LEFT,
            top: GROUND_TOP,
            resizeMode: 'contain',
            // PNG 색상 전체 치환은 한계가 있으니, 섬 색 바꾸려면 SVG 전환을 추천.
          }}
        />

        {/* Palm (왼쪽) */}
        <Animated.View style={[
          { position: 'absolute', left: W * 0.12, top: H * 0.46, width: 90, height: 120 },
          palmStyle
        ]}>
          <Palm trunk={t.palm.trunkColor} leaf={t.palm.leafColor} />
        </Animated.View>

        {/* Rock */}
        <Image
          source={rockPng}
          style={{
            position: 'absolute',
            width: 120, height: 120, resizeMode: 'contain',
            left: W * 0.3, top: H * 0.55,
            // rockPng도 색 치환이 필요하면 SVG로 전환 권장
          }}
        />

        {/* Chest */}
        <Pressable onPress={onPressChest}
          style={{ position: 'absolute', left: W * 0.0, top: H * 0.66 }}>
          <Image source={chestPng} style={{ width: 150, height: 100, resizeMode: 'contain' }} />
        </Pressable>

        {/* Turntable */}
        <Pressable onPress={onPressTable}
          style={{ position: 'absolute', left: W * 0.55, top: H * 0.55 }}>
          <Image source={turntablePng} style={{ width: 150, height: 100, resizeMode: 'contain' }} />
        </Pressable>
      </View>
    </View>
  );
}

/* ======= SVG parts ======= */
function Cloud({ scale = 1, color = '#FFFFFF' }) {
  const w = 120 * scale, h = 48 * scale;
  // 하단을 살짝 파랗게 섞어서 입체감
  const bottomTint = color;
  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id="cloud" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="1" stopColor={bottomTint} stopOpacity="0.95" />
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

function Palm({ trunk = '#C98347', leaf = '#3CBF62' }) {
  return (
    <Svg width={90} height={120}>
      <Defs>
        <LinearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={trunk} />
          <Stop offset="1" stopColor={shade(trunk, -0.25)} />
        </LinearGradient>
        <LinearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={leaf} />
          <Stop offset="1" stopColor={shade(leaf, -0.25)} />
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

// 간단한 색상 톤 조절 (hex만 지원)
function shade(hex, ratio = -0.2) {
  try {
    const c = hex.replace('#','');
    const num = parseInt(c, 16);
    const r = clamp(((num >> 16) & 0xff) + Math.round(255 * ratio), 0, 255);
    const g = clamp(((num >> 8) & 0xff) + Math.round(255 * ratio), 0, 255);
    const b = clamp((num & 0xff) + Math.round(255 * ratio), 0, 255);
    return `#${((1 << 24) + (r<<16) + (g<<8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}
