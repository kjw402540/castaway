// WaveLayer.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import useSceneActive from "../../hooks/useSceneActive"; // 추가

const waveImages = [
  require("../../../assets/wave/wave1.png"),
  require("../../../assets/wave/wave2.png"),
  require("../../../assets/wave/wave3.png"),
  require("../../../assets/wave/wave4.png"),
];

const wavePositions = [
  { bottom: -20, height: 220, left: "-5%", width: "115%" },
  { bottom:  30, height: 250, left: "-8%", width: "110%" },
  { bottom: 160, height: 145, left: "-35%", width: "100%" },
  { bottom: 110, height: 120, left: "60%", width: "40%" },
];

const waveConfigs = [
  { type: "far",   ampY: 6,  ampX: 6,  duration: 4000, delay: 0 },
  { type: "mid",   ampY: 8,  ampX: 8,  duration: 3500, delay: 200 },
  { type: "near",  ampY: 10, ampX: 10, duration: 3000, delay: 400 },
  { type: "shore", ampY: 12, ampX: 12, duration: 2600, delay: 600 },
];

function WaveImage({ source, position, opacity, zIndex, config }) {
  const animValue = useRef(new Animated.Value(0)).current;

  const play = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    const timer = setTimeout(play, config.delay);
    return () => {
      clearTimeout(timer);
      animValue.stopAnimation();
    };
  }, []);

  // focus 상태에 따라 pause/resume 적용
  useSceneActive([
    {
      value: animValue,
      resume: play,
    },
  ]);

  const getTransform = () => {
    switch (config.type) {
      case "far":
        return {
          transform: [
            { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -config.ampY] }) },
            { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, config.ampX * 2] }) },
          ],
        };
      case "mid":
        return {
          transform: [
            { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -config.ampY * 1.3] }) },
            { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, config.ampX * 2.5] }) },
            { scaleY: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) },
          ],
        };
      case "near":
        return {
          transform: [
            { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, config.ampX * 2] }) },
            { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -config.ampY * 0.2] }) },
          ],
        };
      case "shore":
        return {
          transform: [
            { translateX: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, config.ampX * 3] }) },
            { translateY: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -config.ampY * 0.1] }) },
          ],
        };
      default:
        return { transform: [] };
    }
  };

  return (
    <Animated.Image
      source={source}
      style={[
        styles.wave,
        getTransform(),
        {
          bottom: position.bottom,
          height: position.height,
          left: position.left,
          width: position.width,
          opacity,
          zIndex,
        },
      ]}
      resizeMode="stretch"
    />
  );
}

export default function WaveLayer() {
  const opacities = [0.45, 1, 0.3, 0.1];

  return (
    <View style={styles.container} pointerEvents="none">
      {waveImages.map((src, idx) => (
        <WaveImage
          key={idx}
          source={src}
          position={wavePositions[idx]}
          opacity={opacities[idx]}
          zIndex={idx}
          config={waveConfigs[idx]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  wave: {
    position: "absolute",
  },
});
