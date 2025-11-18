import React, { useRef } from "react";
import { View, Image, Pressable, Animated } from "react-native";

import useMoveAnimation from "../../domain/hooks/useMoveAnimation";
import { islandStyles as s } from "./IslandSceneStyles";
import TreeLayer from "./TreeLayer";

export default function IslandObjectsLayer({
  onPressChest,
  onPressTurntable,
}) {
  const moveAnim = useMoveAnimation();

  const scaleChest = useRef(new Animated.Value(1)).current;
  const scaleTurntable = useRef(new Animated.Value(1)).current;

  const handleChestPressIn = () =>
    Animated.spring(scaleChest, {
      toValue: 1.06,
      friction: 5,
      useNativeDriver: true,
    }).start();

  const handleChestPressOut = () =>
    Animated.spring(scaleChest, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

  const handleTurntablePressIn = () =>
    Animated.spring(scaleTurntable, {
      toValue: 1.06,
      friction: 5,
      useNativeDriver: true,
    }).start();

  const handleTurntablePressOut = () =>
    Animated.spring(scaleTurntable, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

  return (
    <View style={s.islandWrapper} pointerEvents="box-none">
      {/* Tree Component */}
      <TreeLayer />

      {/* Ground & Rock */}
      <Image source={require("../../../assets/ground.png")} style={s.ground} />
      <Image source={require("../../../assets/rock.png")} style={s.rock} />

      {/* Chest */}
      <Pressable
        onPress={onPressChest}
        onPressIn={handleChestPressIn}
        onPressOut={handleChestPressOut}
        style={s.chestWrapper}
      >
        <Animated.Image
          source={require("../../../assets/chest.png")}
          style={[s.chest, { transform: [{ scale: scaleChest }] }]}
        />
      </Pressable>

      {/* Turntable */}
      <Pressable
        onPress={onPressTurntable}
        onPressIn={handleTurntablePressIn}
        onPressOut={handleTurntablePressOut}
        style={s.turntableWrapper}
      >
        <Animated.Image
          source={require("../../../assets/turntable.png")}
          style={[s.turntable, { transform: [{ scale: scaleTurntable }] }]}
        />
      </Pressable>

      {/* Move Effect */}
      <Animated.Image
        source={require("../../../assets/move.png")}
        style={[s.moveEffect, { transform: moveAnim.transform }]}
      />
    </View>
  );
}