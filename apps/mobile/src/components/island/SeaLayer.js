// src/components/island/SeaLayer.js
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { emotionColors } from "../../utils/emotionMap";
import { islandStyles as s } from "./IslandSceneStyles";

export default function SeaLayer({ emotion }) {
  
  // 감정 → 바다 색상 배열을 가져오는 안전한 함수
  const getSeaColors = (emotionKey) => {
    const data = emotionColors[emotionKey] || emotionColors.Neutral;
    return ["#66C2FF", data.sea];
  };

  // 초기 색상
  const [currentSeaColors, setCurrentSeaColors] = useState(() =>
    getSeaColors(emotion || "Neutral")
  );
  const [nextSeaColors, setNextSeaColors] = useState(currentSeaColors);

  // 애니메이션용 opacity
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  const duration = 800;

  useEffect(() => {
    const emotionKey = emotion || "Neutral";
    const newColors = getSeaColors(emotionKey);

    // 색상이 같으면 애니메이션 불필요
    if (JSON.stringify(newColors) === JSON.stringify(currentSeaColors)) return;

    // 다음 색상 설정
    setNextSeaColors(newColors);

    // 페이드 아웃 / 인 애니메이션
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
      // 애니 끝나면 색상 갱신
      setCurrentSeaColors(newColors);
      currentOpacity.setValue(1);
      nextOpacity.setValue(0);
    });
  }, [emotion]); // currentSeaColors를 deps에 넣지 않는 게 중요!



  return (
    <View style={s.seaContainer} pointerEvents="none">
      {/* 현재 바다 */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: currentOpacity }]}
      >
        <LinearGradient
          style={{ flex: 1 }}
          colors={currentSeaColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* 다음 바다 */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: nextOpacity }]}
      >
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
