// IslandScene.js
import React, { useEffect } from "react";
import { View } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

import { islandStyles as s } from "./IslandSceneStyles";

import SkyLayer from "./SkyLayer";
import CloudLayer from "./CloudLayer";
import SeaLayer from "./SeaLayer";
import IslandObjectsLayer from "./IslandObjectsLayer";

function IslandScene({ 
  onPressChest, 
  onPressTurntable, 
  onPressTree, 
  onPressRock 
}) {
  const { emotion } = useEmotion();


  const normalizedEmotion = emotion || "Neutral";

  return (
    <View style={s.container} pointerEvents="box-none">
      <SkyLayer emotion={normalizedEmotion} />
      <CloudLayer />
      <SeaLayer emotion={normalizedEmotion} />

      <IslandObjectsLayer
        onPressChest={onPressChest}
        onPressTurntable={onPressTurntable}
        onPressTree={onPressTree}
        onPressRock={onPressRock}
      />
    </View>
  );
}

export default IslandScene;