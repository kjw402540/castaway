// src/components/island/SeaLayer.js
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { emotionColors } from "../../utils/emotionMap";
import { islandStyles as s } from "./IslandSceneStyles";
import WaveLayer from "./WaveLayer";
import HorizonWaveLayer from "./HorizonWaveLayer";

export default function SeaLayer({ emotion }) {
  const getSeaColors = (emotionKey) => {
    const data = emotionColors[emotionKey] || emotionColors.Neutral;
    return ["#66C2FF", data.sea];
  };

  const [currentSeaColors, setCurrentSeaColors] = useState(() =>
    getSeaColors(emotion || "Neutral")
  );
  const [nextSeaColors, setNextSeaColors] = useState(currentSeaColors);

  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  const duration = 800;

  useEffect(() => {
    const newColors = getSeaColors(emotion || "Neutral");
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
  }, [emotion, currentSeaColors]);

  return (
    <View style={s.seaContainer} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: currentOpacity }]}>
        <LinearGradient style={{ flex: 1 }} colors={currentSeaColors} />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: nextOpacity }]}>
        <LinearGradient style={{ flex: 1 }} colors={nextSeaColors} />
      </Animated.View>

      <HorizonWaveLayer color={currentSeaColors[0]} />
      <WaveLayer />
    </View>
  );
}
