// IslandScene.js
import React from "react";
import { View } from "react-native";
import { useEmotion } from "../../context/EmotionContext";
import { islandStyles as s } from "./IslandSceneStyles";

import SkyLayer from "./SkyLayer";
import CloudLayer from "./CloudLayer";
import SeaLayer from "./SeaLayer";
import IslandObjectsLayer from "./IslandObjectsLayer";

function IslandScene({
  onPressChestDetail,
  onPressTurntableDetail,
  onPressTree,
}) {
  const { emotion } = useEmotion();
  const normalizedEmotion = emotion || "Neutral";

  return (
    <View style={s.container} pointerEvents="box-none">
      <SkyLayer emotion={normalizedEmotion} />
      <CloudLayer />
      <SeaLayer emotion={normalizedEmotion} />

      <IslandObjectsLayer
        onPressChestDetail={onPressChestDetail}
        onPressTurntableDetail={onPressTurntableDetail}
        onPressTree={onPressTree}
      />
    </View>
  );
}

export default IslandScene;
