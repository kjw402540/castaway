// src/screens/Home/components/HomeSceneLayer.js
import React from "react";
import { View, StyleSheet } from "react-native";
import IslandScene from "../../../components/island/IslandScene";

export default function HomeSceneLayer({
  onPressChest,
  onPressTree,
  onPressRock,
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <IslandScene
        onPressChestDetail={onPressChest}
        onPressTree={onPressTree}
        onPressRock={onPressRock}
      />
    </View>
  );
}
