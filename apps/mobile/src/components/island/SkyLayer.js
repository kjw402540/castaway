// src/components/island/SkyLayer.js

import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { emotionColors } from "../../utils/emotionMap";
import { islandStyles as s } from "./IslandSceneStyles";

export default function SkyLayer({ emotion }) {
  // 초기 색상 설정을 더 안전하게
  const getColorsForEmotion = (emotionKey) => {
    const color = emotionColors[emotionKey] || emotionColors.Neutral;
    return [color.skyTop, color.skyBottom];
  };

  const [currentSkyColors, setCurrentSkyColors] = useState(() =>
    getColorsForEmotion(emotion || "Neutral")
  );
  const [nextSkyColors, setNextSkyColors] = useState(currentSkyColors);

  // 애니메이션 값
  const currentSkyOpacity = useRef(new Animated.Value(1)).current;
  const nextSkyOpacity = useRef(new Animated.Value(0)).current;

  const animationDuration = 800;


  useEffect(() => {
    const emotionKey = emotion || "Neutral";
    const newColors = getColorsForEmotion(emotionKey);

    // 색상이 같으면 애니메이션 불필요
    if (JSON.stringify(newColors) === JSON.stringify(currentSkyColors)) {
      return;
    }

    // 다음 색상 설정
    setNextSkyColors(newColors);

    // 페이드 아웃 + 페이드 인
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
      // 애니 끝나면 현재 색상 갱신
      setCurrentSkyColors(newColors);
      currentSkyOpacity.setValue(1);
      nextSkyOpacity.setValue(0);
    });
  }, [emotion]); // currentSkyColors는 제외 (무한루프 방지)

  return (
    <View style={s.skyContainer} pointerEvents="none">
      {/* 현재 하늘 (페이드 아웃) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: currentSkyOpacity }]}
      >
        <LinearGradient
          colors={currentSkyColors}
          style={{ flex: 1 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* 다음 하늘 (페이드 인) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: nextSkyOpacity }]}
      >
        <LinearGradient
          colors={nextSkyColors}
          style={{ flex: 1 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}