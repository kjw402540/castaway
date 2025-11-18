import React from "react";
import { Animated } from "react-native";

import useWaveAnimation from "../../domain/hooks/useWaveAnimation";
import { islandStyles as s } from "./IslandSceneStyles";

export default function WaveLayer() {
  const waveAnim = useWaveAnimation();

  return (
    <Animated.Image
      source={require("../../../assets/wave1.png")}
      style={[s.wave, waveAnim]}
    />
  );
}
