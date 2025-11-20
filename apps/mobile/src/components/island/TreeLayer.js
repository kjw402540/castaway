import React from "react";
import { View, Image, Animated } from "react-native";
import useWindLeafAnimation from "./hooks/useWindLeafAnimation";
import { treeStyles as s } from "./TreeStyles";

export default function TreeLayer() {
  const swing1 = useWindLeafAnimation(s.leaf1.zIndex, 0);
  const swing2 = useWindLeafAnimation(s.leaf2.zIndex, 1);
  const swing3 = useWindLeafAnimation(s.leaf3.zIndex, 2);
  const swing4 = useWindLeafAnimation(s.leaf4.zIndex, 3);
  const swing5 = useWindLeafAnimation(s.leaf5.zIndex, 4);
  const swing6 = useWindLeafAnimation(s.leaf6.zIndex, 5);
  const swing7 = useWindLeafAnimation(s.leaf7.zIndex, 6);

  return (
    <View style={s.treeContainer}>
      <Image source={require("../../../assets/tree.png")} style={s.tree} />

      <Animated.Image source={require("../../../assets/leaf1.png")} style={[s.leaf1, swing1]} />
      <Animated.Image source={require("../../../assets/leaf2.png")} style={[s.leaf2, swing2]} />
      <Animated.Image source={require("../../../assets/leaf3.png")} style={[s.leaf3, swing3]} />
      <Animated.Image source={require("../../../assets/leaf4.png")} style={[s.leaf4, swing4]} />
      <Animated.Image source={require("../../../assets/leaf5.png")} style={[s.leaf5, swing5]} />
      <Animated.Image source={require("../../../assets/leaf6.png")} style={[s.leaf6, swing6]} />
      <Animated.Image source={require("../../../assets/leaf7.png")} style={[s.leaf7, swing7]} />
    </View>
  );
}
