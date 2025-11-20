import React, { useRef } from "react";
import { View, Image, Pressable, Animated } from "react-native";

import useMoveAnimation from "./hooks/useMoveAnimation";
import { islandStyles as s } from "./IslandSceneStyles";
import TreeLayer from "./TreeLayer";

export default function IslandObjectsLayer({
  onPressChest,
  onPressTurntable,
  onPressTree,
  onPressRock,
}) {
  const moveAnim = useMoveAnimation();

  // --- 애니메이션 값 ---
  const scaleChest = useRef(new Animated.Value(1)).current;
  const scaleTurntable = useRef(new Animated.Value(1)).current;
  const scaleTree = useRef(new Animated.Value(1)).current;
  const scaleRock = useRef(new Animated.Value(1)).current;

  // --- 애니메이션 핸들러 ---
  const animatePress = (animValue, toValue) => {
    Animated.spring(animValue, {
      toValue: toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={s.islandWrapper} pointerEvents="box-none">
      
      {/* ------------------------------------------------------
          🌴 Tree (나무) - 디자인상 맨 뒤(코드 상단)에 배치
          - style에 width/height 100%를 줘서 화면 전체를 덮게 함
          - 하지만 zIndex를 낮추거나 코드 상단에 두어 시각적으로는 뒤로 감
         ------------------------------------------------------ */}
      <Pressable
        onPress={onPressTree}
        onPressIn={() => animatePress(scaleTree, 1.02)}
        onPressOut={() => animatePress(scaleTree, 1)}
        // 👇 여기가 핵심: 
        // 화면 전체를 채우되, 뒤에 깔려있게 함.
        // 이파리가 어디에 있든 TreeLayer 안이면 다 눌림.
        style={{ position: 'absolute', width: '100%', height: '100%' }} 
      >
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleTree }] }}>
          <TreeLayer />
        </Animated.View>
      </Pressable>


      {/* ------------------------------------------------------
          🟫 Ground (땅)
          - 👇 [핵심 해결책] pointerEvents="none"
          - 디자인상 나무보다 앞에(코드 아래) 있어서 나무를 가리지만,
          - 터치는 "투과"시켜서 뒤에 있는 나무가 눌리게 해줍니다.
         ------------------------------------------------------ */}
      <Image 
        source={require("../../../assets/ground.png")} 
        style={s.ground} 
        pointerEvents="none" 
      />


      {/* ------------------------------------------------------
          🪨 Rock (바위)
         ------------------------------------------------------ */}
      <Pressable
        onPress={onPressRock}
        onPressIn={() => animatePress(scaleRock, 1.06)}
        onPressOut={() => animatePress(scaleRock, 1)}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        style={s.rock}
      >
        <Animated.Image
          source={require("../../../assets/rock.png")}
          style={{ 
            width: "100%", 
            height: "100%", 
            resizeMode: "contain",
            transform: [{ scale: scaleRock }] 
          }}
        />
      </Pressable>


      {/* ------------------------------------------------------
          🎁 Chest (보물상자)
         ------------------------------------------------------ */}
      <Pressable
        onPress={onPressChest}
        onPressIn={() => animatePress(scaleChest, 1.06)}
        onPressOut={() => animatePress(scaleChest, 1)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={s.chestWrapper}
      >
        <Animated.Image
          source={require("../../../assets/chest.png")}
          style={[s.chest, { transform: [{ scale: scaleChest }] }]}
        />
      </Pressable>


      {/* ------------------------------------------------------
          🎵 Turntable (턴테이블)
         ------------------------------------------------------ */}
      <Pressable
        onPress={onPressTurntable}
        onPressIn={() => animatePress(scaleTurntable, 1.06)}
        onPressOut={() => animatePress(scaleTurntable, 1)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={s.turntableWrapper}
      >
        <Animated.Image
          source={require("../../../assets/turntable.png")}
          style={[s.turntable, { transform: [{ scale: scaleTurntable }] }]}
        />
      </Pressable>


      {/* Move Effect (터치 불필요하므로 통과시킴) */}
      <Animated.Image
        source={require("../../../assets/move.png")}
        style={[s.moveEffect, { transform: moveAnim.transform }]}
        pointerEvents="none"
      />
    </View>
  );
}