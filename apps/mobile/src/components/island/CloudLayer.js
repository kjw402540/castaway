import React from "react";
import { Animated } from "react-native";
import useCloudAnimation from "./hooks/useCloudAnimation";

export default function CloudLayer() {
  const c1 = useCloudAnimation();
  const c2 = useCloudAnimation();
  const c3 = useCloudAnimation();
  const c4 = useCloudAnimation();

  return (
    <>
      <Animated.Image
        source={require("../../../assets/cloud1.png")}
        style={{
          position: "absolute",
          top: c1.randomY,
          width: 160,
          height: 95,
          opacity: 0.7,
          transform: [{ translateX: c1.translateX }],
        }}
      />

      <Animated.Image
        source={require("../../../assets/cloud2.png")}
        style={{
          position: "absolute",
          top: c2.randomY,
          width: 120,
          height: 80,
          opacity: 0.65,
          transform: [{ translateX: c2.translateX }],
        }}
      />

      <Animated.Image
        source={require("../../../assets/cloud3.png")}
        style={{
          position: "absolute",
          top: c3.randomY,
          width: 180,
          height: 110,
          opacity: 0.75,
          transform: [{ translateX: c3.translateX }],
        }}
      />

      <Animated.Image
        source={require("../../../assets/cloud4.png")}
        style={{
          position: "absolute",
          top: c4.randomY,
          width: 140,
          height: 90,
          opacity: 0.8,
          transform: [{ translateX: c4.translateX }],
        }}
      />
    </>
  );
}
