import React from "react";
import { View } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

import { islandStyles as s } from "./IslandSceneStyles";

import SkyLayer from "./SkyLayer";
import CloudLayer from "./CloudLayer";
import SeaLayer from "./SeaLayer";
// import WaveLayer from "./WaveLayer";
import IslandObjectsLayer from "./IslandObjectsLayer";

export default function IslandScene({ 
  onPressChest, 
  onPressTurntable, 
  onPressTree, 
  onPressRock 
}) {
  const { emotion } = useEmotion();

  return (
    <View style={s.container} pointerEvents="box-none">
      <SkyLayer emotion={emotion} />
      <CloudLayer />
      <SeaLayer emotion={emotion} />
      {/* <WaveLayer /> */}

      <IslandObjectsLayer
        onPressChest={onPressChest}
        onPressTurntable={onPressTurntable}
        onPressTree={onPressTree}
        onPressRock={onPressRock}
      />
    </View>
  );
}