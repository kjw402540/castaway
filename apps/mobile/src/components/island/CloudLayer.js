import React from "react";
import { Animated } from "react-native";

import useCloudAnimation from "../../domain/hooks/useCloudAnimation";

export default function CloudLayer() {
  // useCloudAnimation 훅을 사용하여 각 구름의 애니메이션 속성을 가져옵니다.
  const c1 = useCloudAnimation(0);
  const c2 = useCloudAnimation(1);
  const c3 = useCloudAnimation(2);
  const c4 = useCloudAnimation(3);
  const c5 = useCloudAnimation(4);

  return (
    <>
      <Animated.Image
        source={require("../../../assets/cloud1.png")}
        style={{
          position: "absolute",
          top: c1.randomY,
          width: 160,
          height: 95,
          opacity: 0.7, // 배경과 분리되도록 opacity 조정
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
          opacity: 0.65, // opacity 조정
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
          opacity: 0.75, // opacity 조정
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
          opacity: 0.8, // opacity 조정
          transform: [{ translateX: c4.translateX }],
        }}
      />

      {/* <Animated.Image
        source={require("../../../assets/cloud5.png")}
        style={{
          position: "absolute",
          top: c5.randomY,
          width: 150,
          height: 100,
          opacity: 0.7, // opacity 조정
          transform: [{ translateX: c5.translateX }],
        }}
      /> */}
    </>
  );
}