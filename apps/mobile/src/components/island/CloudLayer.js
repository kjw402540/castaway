// src/components/island/CloudLayer.js
import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import useCloudAnimation from "./hooks/useCloudAnimation";

const { width } = Dimensions.get("window");

const clouds = [
  { src: require("../../../assets/cloud/cloud1.png"), depth: 0 },
  { src: require("../../../assets/cloud/cloud2.png"), depth: 1 },
  { src: require("../../../assets/cloud/cloud3.png"), depth: 2 },
  { src: require("../../../assets/cloud/cloud4.png"), depth: 3 },
];

// 구름 간의 최소 등장 시간 간격 (밀리초)
const sequentialDelayUnit = 2500; 

export default function CloudLayer() {
  return (
    <View style={styles.container} pointerEvents="none">
      {clouds.map((c, idx) => {
        const baseSpeed = 26000 + idx * 8000;
        
        // **[수정]** 인덱스에 기반하여 순차적인 초기 지연 시간 부여
        const baseDelay = idx * sequentialDelayUnit + Math.random() * 1500; 

        const { animatedStyle, randomY } = useCloudAnimation(
          baseSpeed,
          baseDelay
        );

        const size = width * (0.75 + idx * 0.18);

        return (
          <Animated.Image
            key={idx}
            source={c.src}
            resizeMode="contain"
            style={[
              styles.cloud,
              animatedStyle,
              {
                top: randomY,
                width: size,
                height: size * 0.45,
                opacity: 0.95 - idx * 0.15,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 5,
  },
  cloud: {
    position: "absolute",
  },
});