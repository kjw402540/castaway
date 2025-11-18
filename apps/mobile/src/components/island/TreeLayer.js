import React from "react";
import { View, Image, Animated } from "react-native";
// 훅 이름은 useWindLeafAnimation으로 통일하여 사용
import useWindLeafAnimation from "../../domain/hooks/useWindLeafAnimation"; 
import { treeStyles as s } from "./TreeStyles";

export default function TreeLayer() {
  // 🔴 각 나뭇잎의 zIndex와 함께 index(0부터)를 전달
  const swing1 = useWindLeafAnimation(s.leaf1.zIndex, 0); // leaf1: index 0
  const swing2 = useWindLeafAnimation(s.leaf2.zIndex, 1); // leaf2: index 1
  const swing3 = useWindLeafAnimation(s.leaf3.zIndex, 2); // leaf3: index 2 (덜 흔들릴 타겟)
  const swing4 = useWindLeafAnimation(s.leaf4.zIndex, 3); // leaf4: index 3
  const swing5 = useWindLeafAnimation(s.leaf5.zIndex, 4); // leaf5: index 4
  const swing6 = useWindLeafAnimation(s.leaf6.zIndex, 5); // leaf6: index 5
  const swing7 = useWindLeafAnimation(s.leaf7.zIndex, 6); // leaf7: index 6

  return (
    <View style={s.treeContainer}>
      {/* Tree trunk */}
      <Image source={require("../../../assets/tree.png")} style={s.tree} />

      {/* Leaves */}
      <Animated.Image
        source={require("../../../assets/leaf1.png")}
        style={[s.leaf1, swing1]}
      />
      <Animated.Image
        source={require("../../../assets/leaf2.png")}
        style={[s.leaf2, swing2]}
      />
      <Animated.Image
        source={require("../../../assets/leaf3.png")}
        style={[s.leaf3, swing3]}
      />
      <Animated.Image
        source={require("../../../assets/leaf4.png")}
        style={[s.leaf4, swing4]}
      />
      <Animated.Image
        source={require("../../../assets/leaf5.png")}
        style={[s.leaf5, swing5]}
      />
      <Animated.Image
        source={require("../../../assets/leaf6.png")}
        style={[s.leaf6, swing6]}
      />
      <Animated.Image
        source={require("../../../assets/leaf7.png")}
        style={[s.leaf7, swing7]}
      />
    </View>
  );
}