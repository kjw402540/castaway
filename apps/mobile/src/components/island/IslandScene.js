import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

import SkyLayer from "./SkyLayer";
import OceanLayer from "./OceanLayer";
import WavesLayer from "./WavesLayer";

import { styles } from "./styles";

export default function IslandScene() {
  const { emotion } = useEmotion();

  const opacity = useRef(new Animated.Value(0)).current;

  const currentEmotion = emotion || "neutral";
  const nextGradients = emotionGradients[currentEmotion];

  const [prevGradients, setPrevGradients] = useState({
    sky: ["#DDE6F5", "#C8D5EA"],
    ocean: ["#8FBEEA", "#72AEE6"],
  });

  useEffect(() => {
    setPrevGradients(nextGradients);

    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [emotion]);

  return (
    <View style={styles.container}>

      {/* 하늘 */}
      <SkyLayer
        prevColors={prevGradients.sky}
        nextColors={nextGradients.sky}
        animatedOpacity={opacity}
      />

      {/* 바다 */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "38%" }}>
        <OceanLayer
          prevColors={prevGradients.ocean}
          nextColors={nextGradients.ocean}
          animatedOpacity={opacity}
        />
      </View>

      {/* 파도 — 바다 위로 고정 */}
      <WavesLayer height={50} offsetFromBottom={330} />


    </View>
  );

}

const emotionGradients = {
  joy: {
    sky: ["#E9F4FF", "#CFE3FF"],
    ocean: ["#9EC9F7", "#7AB6F3"],
  },
  sadness: {
    sky: ["#BFC7D4", "#A7AFBF"],
    ocean: ["#607A9B", "#4A5C75"],
  },
  neutral: {
    sky: ["#DDE6F5", "#C8D5EA"],
    ocean: ["#8FBEEA", "#72AEE6"],
  },
};
