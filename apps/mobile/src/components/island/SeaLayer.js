// src/components/island/SeaLayer.js
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext"; // 🔥 변경된 부분
import { islandStyles as s } from "./IslandSceneStyles";
import WaveLayer from "./WaveLayer";
import HorizonWaveLayer from "./HorizonWaveLayer";

export default function SeaLayer() {
  const { theme } = useTheme(); // 🔥 감정 기반 theme 자동 적용

  const getSeaColors = () => {
    return ["#66C2FF", theme.sea]; // 🔥 하늘과 자연스럽게 연결되는 색
  };

  const [currentSeaColors, setCurrentSeaColors] = useState(getSeaColors());
  const [nextSeaColors, setNextSeaColors] = useState(currentSeaColors);

  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  const duration = 800;

  useEffect(() => {
    const newColors = getSeaColors();

    if (JSON.stringify(newColors) === JSON.stringify(currentSeaColors)) return;
    setNextSeaColors(newColors);

    Animated.parallel([
      Animated.timing(currentOpacity, {
        toValue: 0,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSeaColors(newColors);
      currentOpacity.setValue(1);
      nextOpacity.setValue(0);
    });
  }, [theme]); // 🔥 감정 변경될 때만 실행

  return (
    <View style={s.seaContainer} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: currentOpacity }]}>
        <LinearGradient style={{ flex: 1 }} colors={currentSeaColors} />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: nextOpacity }]}>
        <LinearGradient style={{ flex: 1 }} colors={nextSeaColors} />
      </Animated.View>

      {/* 위쪽 수평 파도 경계 */}
      <HorizonWaveLayer color={currentSeaColors[0]} />
      {/* 하단 파도 */}
      <WaveLayer />
    </View>
  );
}
