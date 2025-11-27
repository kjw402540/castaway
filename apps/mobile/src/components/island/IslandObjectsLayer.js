import React, { useRef, useState } from "react";
import { View, Image, Pressable, Animated } from "react-native";

import useMoveAnimation from "./hooks/useMoveAnimation";
import { islandStyles as s } from "./IslandSceneStyles";
import TreeLayer from "./TreeLayer";

export default function IslandObjectsLayer({
  onPressChestDetail,
  onPressTurntableDetail,
  onPressTree,
}) {
  const moveAnim = useMoveAnimation();

  // 🔹 이미지 상태
  const [chestOpen, setChestOpen] = useState(false);
  const [turntableOpen, setTurntableOpen] = useState(false);

  // 🔹 Scale 애니메이션 (빠르고 즉각적)
  const scaleChest = useRef(new Animated.Value(1)).current;
  const scaleTurntable = useRef(new Animated.Value(1)).current;
  const scaleTree = useRef(new Animated.Value(1)).current;

  const animateScale = (scaleValue) => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.12,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔹 Chest 토글
  const handleChest = () => {
    setChestOpen((prev) => !prev);
    animateScale(scaleChest);
    onPressChestDetail?.();
  };

  // 🔹 Turntable 토글
  const handleTurntable = () => {
    setTurntableOpen((prev) => !prev);
    animateScale(scaleTurntable);
    onPressTurntableDetail?.();
  };

  /* -----------------------------------------
     🪨 Rock: 점프 + 좌우 툭툭 튀기기 복구!!!
  ----------------------------------------- */
  const rockJump = useRef(new Animated.Value(0)).current;
  const rockShift = useRef(new Animated.Value(0)).current;
  const rockDirection = useRef(1); // 방향 스위치

  const handleRockPress = () => {
    rockDirection.current *= -1; // 좌 ↔ 우 전환
    const shiftValue = 16 * rockDirection.current;

    rockJump.setValue(0);
    rockShift.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(rockJump, {
          toValue: -38, // 높이감
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(rockJump, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(rockShift, {
          toValue: shiftValue,
          duration: 210,
          useNativeDriver: true,
        }),
        Animated.timing(rockShift, {
          toValue: 0,
          duration: 210,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <View style={s.islandWrapper} pointerEvents="box-none">
      
      {/* 🌴 Tree */}
      <Pressable
        onPress={onPressTree}
        onPressIn={() => animateScale(scaleTree)}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleTree }] }}>
          <TreeLayer />
        </Animated.View>
      </Pressable>

      {/* 🟫 Ground */}
      <Image
        source={require("../../../assets/ground.png")}
        style={s.ground}
        pointerEvents="none"
      />

      {/* 🪨 Rock */}
      <Pressable onPress={handleRockPress} style={s.rock}>
        <Animated.Image
          source={require("../../../assets/rock.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
            transform: [
              { translateY: rockJump },
              { translateX: rockShift },
            ],
          }}
        />
      </Pressable>

      {/* 🧰 Chest */}
      <Pressable onPress={handleChest} style={s.chestWrapper}>
        <Animated.Image
          source={
            chestOpen
              ? require("../../../assets/chest_open.png")
              : require("../../../assets/chest_close.png")
          }
          style={[s.chest, { transform: [{ scale: scaleChest }] }]}
        />
      </Pressable>

      {/* 🎵 Turntable */}
      <Pressable onPress={handleTurntable} style={s.turntableWrapper}>
        <Animated.Image
          source={
            turntableOpen
              ? require("../../../assets/turntable_open.png")
              : require("../../../assets/turntable_close.png")
          }
          style={[s.turntable, { transform: [{ scale: scaleTurntable }] }]}
        />
      </Pressable>

      {/* ✨ Move Effect — 열려 있을 때만 표시 */}
      {(turntableOpen) && (
        <Animated.Image
          source={require("../../../assets/move.png")}
          style={[s.moveEffect, { transform: moveAnim.transform }]}
          pointerEvents="none"
        />
      )}
    </View>
  );
}
