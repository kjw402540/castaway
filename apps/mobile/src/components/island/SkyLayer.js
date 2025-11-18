import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, StyleSheet, Easing, View } from "react-native";

// emotion 별 하늘 이미지 맵을 가정합니다.
// 예시: emotionColors.js 파일에 다음과 같이 정의되어 있다고 가정
/* const emotionColors = {
  neutral: require('../../../assets/sky_day.png'),
  happy: require('../../../assets/sky_clear.png'),
  sad: require('../../../assets/sky_night.png'),
  // ... 기타 감정
};
*/
import { emotionColors } from "../../utils/emotionMap"; // emotionColors을 가져온다고 가정
import { islandStyles as s } from "./IslandSceneStyles";

// 기본 하늘 이미지 (emotionColors에 'neutral'이 없다면 사용할 대비책)
const DEFAULT_SKY = require("../../../assets/day.png"); 

export default function SkyLayer({ emotion }) {
  // 현재 활성화된 하늘 이미지 (초기값: 기본값)
  const [currentSkySource, setCurrentSkySource] = useState(
    emotionColors.neutral || DEFAULT_SKY
  );
  // 다음으로 전환될 하늘 이미지
  const [nextSkySource, setNextSkySource] = useState(currentSkySource);

  // 현재 하늘의 투명도 애니메이션
  const currentSkyOpacity = useRef(new Animated.Value(1)).current;
  // 다음 하늘의 투명도 애니메이션
  const nextSkyOpacity = useRef(new Animated.Value(0)).current;

  // 페이드 애니메이션 듀레이션 (바다 레이어와 통일)
  const animationDuration = 800;

  useEffect(() => {
    // emotion이 유효하지 않으면 'neutral'로 간주하거나 아무것도 하지 않음
    if (!emotion) return;

    const newEmotionKey = emotion || "neutral";
    const newSource = emotionColors[newEmotionKey] || DEFAULT_SKY;

    // 새 이미지가 현재 이미지와 같으면 전환 불필요
    if (newSource === currentSkySource) {
      return;
    }

    // 1. 다음 이미지로 변경 설정
    setNextSkySource(newSource);

    // 2. 현재 이미지를 페이드 아웃시키고, 다음 이미지를 페이드 인 시키는 애니메이션 시작
    Animated.parallel([
      Animated.timing(currentSkyOpacity, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(nextSkyOpacity, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션 완료 후:
      // 다음 이미지를 현재 이미지로 업데이트
      setCurrentSkySource(newSource);
      // 투명도 초기화 (다음 전환을 위해 준비)
      currentSkyOpacity.setValue(1);
      nextSkyOpacity.setValue(0);
    });

  }, [emotion]); // emotion 값이 바뀔 때마다 실행

  return (
    <Animated.View style={s.skyContainer} pointerEvents="none">
      {/* 현재 하늘 이미지 (페이드 아웃될 하늘) */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: currentSkyOpacity }]}>
        <ImageBackground
          source={currentSkySource}
          style={{ flex: 1, width: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* 다음 하늘 이미지 (페이드 인될 하늘) */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: nextSkyOpacity }]}>
        <ImageBackground
          source={nextSkySource}
          style={{ flex: 1, width: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>
    </Animated.View>
  );
}
import React from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

export default function SkyLayer({ prevColors, nextColors, animatedOpacity }) {
  const safePrev = Array.isArray(prevColors) ? prevColors : ["#DDE6F5", "#C8D5EA"];
  const safeNext = Array.isArray(nextColors) ? nextColors : ["#DDE6F5", "#C8D5EA"];

  return (
    <>
      <LinearGradient
        colors={safePrev}
        style={styles.sky}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Animated.View style={[styles.sky, { opacity: animatedOpacity }]}>
        <LinearGradient
          colors={safeNext}
          style={styles.sky}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
    </>
  );
}
