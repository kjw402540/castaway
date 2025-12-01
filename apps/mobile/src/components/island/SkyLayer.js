// src/components/island/SkyLayer.js

import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// 🔥 ThemeContext 사용
import { useTheme } from "../../context/ThemeContext";
import { islandStyles as s } from "./IslandSceneStyles";

export default function SkyLayer() {
  const { theme } = useTheme(); // 🔥 감정 기반 색상 자동 매핑

  const [currentSkyColors, setCurrentSkyColors] = useState([
    theme.skyTop,
    theme.skyBottom,
  ]);
  const [nextSkyColors, setNextSkyColors] = useState(currentSkyColors);

  const currentSkyOpacity = useRef(new Animated.Value(1)).current;
  const nextSkyOpacity = useRef(new Animated.Value(0)).current;

  const animationDuration = 800;

  useEffect(() => {
    const newColors = [theme.skyTop, theme.skyBottom];

    // 색 변화 없으면 애니메이션 skip
    if (
      JSON.stringify(newColors) === JSON.stringify(currentSkyColors)
    ) {
      return;
    }

    setNextSkyColors(newColors);

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
      setCurrentSkyColors(newColors);
      currentSkyOpacity.setValue(1);
      nextSkyOpacity.setValue(0);
    });
  }, [theme]); // 🔥 감정 변화 감지 → 애니메이션 실행

  return (
    <View style={s.skyContainer} pointerEvents="none">
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
