import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native"; // View와 Easing 추가!
import { LinearGradient } from "expo-linear-gradient";

// import useFadeAnimation from "../../domain/hooks/useFadeAnimation"; // 기존 페이드 훅 (사용하지 않으므로 주석 처리 또는 삭제)
import { emotionColors } from "../../utils/emotionMap"; // emotionColors는 이미 있다고 가정
import { islandStyles as s } from "./IslandSceneStyles";

export default function SeaLayer({ emotion }) {
  // 현재 활성화된 그라데이션 색상 (초기값은 'neutral' 바다색)
  const [currentSeaColors, setCurrentSeaColors] = useState(
    emotionColors.neutral ? ["#66C2FF", emotionColors.neutral.sea] : ["#66C2FF", "#ADD8E6"] // 기본값 추가
  );
  // 다음으로 전환될 그라데이션 색상
  const [nextSeaColors, setNextSeaColors] = useState(currentSeaColors);

  // 현재 바다의 투명도 애니메이션 (페이드 아웃 용도)
  const currentSeaOpacity = useRef(new Animated.Value(1)).current;
  // 다음 바다의 투명도 애니메이션 (페이드 인 용도)
  const nextSeaOpacity = useRef(new Animated.Value(0)).current;

  // 페이드 애니메이션 듀레이션
  const animationDuration = 800;

  useEffect(() => {
    // emotion이 유효하지 않으면 아무것도 하지 않음
    if (!emotion) return;

    const newEmotionKey = emotion || "neutral";
    const newColors = emotionColors[newEmotionKey]
      ? ["#66C2FF", emotionColors[newEmotionKey].sea]
      : ["#66C2FF", "#ADD8E6"]; // 안전한 기본값

    // 새 색상이 현재 색상과 같으면 전환 불필요
    if (JSON.stringify(newColors) === JSON.stringify(currentSeaColors)) {
      return;
    }

    // 1. 다음 색상으로 변경 설정
    setNextSeaColors(newColors);

    // 2. 현재 색상을 페이드 아웃시키고, 다음 색상을 페이드 인 시키는 애니메이션 시작
    Animated.parallel([
      Animated.timing(currentSeaOpacity, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(nextSeaOpacity, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후:
      // 다음 색상을 현재 색상으로 업데이트
      setCurrentSeaColors(newColors);
      // 현재 바다의 투명도를 다시 1로, 다음 바다의 투명도를 0으로 초기화
      currentSeaOpacity.setValue(1);
      nextSeaOpacity.setValue(0);
    });

  }, [emotion]); // emotion 값이 바뀔 때마다 실행

  return (
    <View style={s.seaContainer} pointerEvents="none">
      {/* 현재 바다 그라데이션 (페이드 아웃될 바다) */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: currentSeaOpacity }]}>
        <LinearGradient
          style={{ flex: 1 }}
          colors={currentSeaColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* 다음 바다 그라데이션 (페이드 인될 바다) */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: nextSeaOpacity }]}>
        <LinearGradient
          style={{ flex: 1 }}
          colors={nextSeaColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}