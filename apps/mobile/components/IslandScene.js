// apps/mobile/components/IslandScene.js
import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Defs, LinearGradient as SvgLinearGradient, Stop, G, Path, Ellipse, Rect, Circle,
  Filter // TS hint noop
} from 'react-native-svg';

// 섬/바다 캔버스 크기(비율 유지용)
const W = 360;
const H = 300;

export default function IslandScene({
  onPressChest = () => {},
  onPressTable = () => {},
}) {
  // ──────────────────────────────
  // 애니메이션 공유값
  // ──────────────────────────────
  const palmSwing = useSharedValue(0);
  const cloudX1 = useSharedValue(0);
  const cloudX2 = useSharedValue(-120);
  const waveShift = useSharedValue(0);

  useEffect(() => {
    palmSwing.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    cloudX1.value = withRepeat(
      withTiming(120, { duration: 14000, easing: Easing.linear }),
      -1
    );
    cloudX2.value = withRepeat(
      withTiming(240, { duration: 18000, easing: Easing.linear }),
      -1
    );
    waveShift.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // 야자수 줄기 회전(밑동 기준)
  const palmStyle = useAnimatedStyle(() => {
    const deg = -4 + palmSwing.value * 8; // -4° ~ +4°
    return { transform: [{ rotate: `${deg}deg` }] };
  });

  // 구름 X 이동
  const cloud1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudX1.value }],
  }));
  const cloud2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudX2.value }],
  }));

  // 파도 위아래
  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: waveShift.value * 4 }],
    opacity: 0.7,
  }));
  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: -waveShift.value * 5 }],
    opacity: 0.6,
  }));
  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: waveShift.value * 2 - 1 }],
    opacity: 0.5,
  }));

  return (
    <View style={{ alignItems: 'center', marginTop: 80 }}>
      {/* 캔버스는 가운데 정렬 */}
      <View style={{ width: W, height: H, overflow: 'visible' }}>
        {/* ── 하늘 구름 ───────────────── */}
        <Animated.View style={[{ position: 'absolute', top: -10, left: 40 }, cloud1Style]}>
          <Cloud />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', top: 22, left: 180, opacity: 0.8 }, cloud2Style]}>
          <Cloud scale={0.85} />
        </Animated.View>

        {/* ── 바다(그라데이션 + 파도) ──── */}
        <Svg width={W} height={H} style={{ position: 'absolute', bottom: -16 }}>
          <Defs>
            <SvgLinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#79D1FF" />
              <Stop offset="1" stopColor="#4FA9F3" />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y={H * 0.45} width={W} height={H} fill="url(#sea)" />
        </Svg>

        {/* 파도 3겹 */}
        <Animated.View style={[{ position: 'absolute', left: 0, top: H * 0.55 }, wave1Style]}>
          <Wave width={W} color="#FFFFFF" alpha={0.18} />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', left: 0, top: H * 0.60 }, wave2Style]}>
          <Wave width={W} color="#FFFFFF" alpha={0.16} />
        </Animated.View>
        <Animated.View style={[{ position: 'absolute', left: 0, top: H * 0.65 }, wave3Style]}>
          <Wave width={W} color="#FFFFFF" alpha={0.14} />
        </Animated.View>

        {/* ── 섬(모래 + 잔디) ─────────── */}
        <Svg width={W} height={H} style={{ position: 'absolute' }}>
          <Defs>
            <SvgLinearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFE6A6" />
              <Stop offset="1" stopColor="#F4D289" />
            </SvgLinearGradient>
            <SvgLinearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#89D676" />
              <Stop offset="1" stopColor="#5BBE5E" />
            </SvgLinearGradient>
          </Defs>
          {/* 모래 타원 */}
          <Ellipse cx={W * 0.48} cy={H * 0.68} rx={120} ry={48} fill="url(#sand)" />
          {/* 잔디 타원(조금 작게) */}
          <Ellipse cx={W * 0.48} cy={H * 0.66} rx={100} ry={40} fill="url(#grass)" />
        </Svg>

        {/* ── 오브제: 야자수(왼쪽) ────── */}
        <Animated.View
          style={[
            { position: 'absolute', left: W * 0.20, top: H * 0.42, width: 90, height: 120, transformOrigin: 'bottom left' },
            palmStyle,
          ]}
        >
          <Palm />
        </Animated.View>

        {/* ── 바위(섬 중앙 오른쪽) ─────── */}
        <View style={{ position: 'absolute', left: W * 0.40, top: H * 0.48 }}>
          <Rock />
        </View>

        {/* ── 보물상자(왼쪽 앞) ───────── */}
        <Pressable
          onPress={onPressChest}
          style={{ position: 'absolute', left: W * 0.22 - 28, top: H * 0.60 - 30 }}
          hitSlop={10}
        >
          <TreasureChest />
        </Pressable>

        {/* ── 턴테이블(오른쪽 앞) ──────── */}
        <Pressable
          onPress={onPressTable}
          style={{ position: 'absolute', left: W * 0.62, top: H * 0.60 - 26 }}
          hitSlop={10}
        >
          <TurnTable />
        </Pressable>
      </View>
    </View>
  );
}

/** ─────────────────────────────────────────────
 *  SVG 파트 (벡터 일러스트)
 *  ────────────────────────────────────────────*/
function Cloud({ scale = 1 }) {
  const w = 120 * scale;
  const h = 48 * scale;
  return (
    <Svg width={w} height={h}>
      <Defs>
        <SvgLinearGradient id="cloud" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="1" stopColor="#E8F6FF" stopOpacity="0.95" />
        </SvgLinearGradient>
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
  // 간단한 베지어 곡선 파도
  return (
    <Svg width={width} height={36}>
      <Path
        d={`M0,18 C60,6 120,30 180,18 S300,6 360,18 S480,30 540,18 L540,36 L0,36 Z`}
        fill={color}
        opacity={alpha}
      />
    </Svg>
  );
}

function Palm() {
  return (
    <Svg width={90} height={120}>
      {/* 줄기 */}
      <Defs>
        <SvgLinearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C98347" />
          <Stop offset="1" stopColor="#9C5E2E" />
        </SvgLinearGradient>
        <SvgLinearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3CBF62" />
          <Stop offset="1" stopColor="#1F9E4A" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M40 110 C42 80, 40 50, 46 20" stroke="url(#trunk)" strokeWidth="12" strokeLinecap="round" />
      {/* 잎 5장 */}
      <Path d="M46 28 C10 30, 18 8, 8 6" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" />
      <Path d="M46 28 C14 16, 22 2, 14 0" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" />
      <Path d="M46 28 C32 8, 40 0, 34 -4" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" />
      <Path d="M46 28 C64 10, 78 0, 86 -2" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" />
      <Path d="M46 28 C62 16, 84 12, 92 10" stroke="url(#leaf)" strokeWidth="10" strokeLinecap="round" />
    </Svg>
  );
}

function Rock() {
  return (
    <Svg width={90} height={70}>
      <Defs>
        <SvgLinearGradient id="rock" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#8E9496" />
          <Stop offset="1" stopColor="#5D6468" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M10 60 C8 40, 26 12, 46 8 C66 6, 82 26, 80 44 C78 60, 40 66, 10 60 Z"
        fill="url(#rock)"
      />
    </Svg>
  );
}

function TreasureChest() {
  return (
    <Svg width={72} height={56}>
      <Defs>
        <SvgLinearGradient id="chestBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F9B84A" />
          <Stop offset="1" stopColor="#D78A2C" />
        </SvgLinearGradient>
        <SvgLinearGradient id="chestLid" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F4C46B" />
          <Stop offset="1" stopColor="#E39E3E" />
        </SvgLinearGradient>
      </Defs>
      {/* 몸통 */}
      <Rect x="6" y="22" width="60" height="26" rx="6" fill="url(#chestBody)" />
      {/* 뚜껑 */}
      <Path d="M6 22 C12 8, 60 8, 66 22 Z" fill="url(#chestLid)" />
      {/* 테두리/자물쇠 */}
      <Rect x="32" y="30" width="8" height="10" rx="2" fill="#8C5A1E" />
      <Circle cx="36" cy="36" r="1.8" fill="#EAD7AA" />
    </Svg>
  );
}

function TurnTable() {
  return (
    <Svg width={92} height={64}>
      <Defs>
        <SvgLinearGradient id="plinth" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#2E2F34" />
          <Stop offset="1" stopColor="#1E1F24" />
        </SvgLinearGradient>
      </Defs>
      {/* 본체 */}
      <Rect x="6" y="10" width="80" height="44" rx="8" fill="url(#plinth)" />
      {/* 레코드 */}
      <Circle cx="42" cy="32" r="14" fill="#111" />
      <Circle cx="42" cy="32" r="6" fill="#E14B3D" />
      <Circle cx="42" cy="32" r="2.4" fill="#111" />
      {/* 톤암 */}
      <Path d="M68 18 L72 22 L56 34" stroke="#B9BDC6" strokeWidth="3" strokeLinecap="round" />
      <Circle cx="72" cy="22" r="3" fill="#B9BDC6" />
      {/* 다리 */}
      <Circle cx="18" cy="54" r="3" fill="#0F1012" />
      <Circle cx="74" cy="54" r="3" fill="#0F1012" />
    </Svg>
  );
}
