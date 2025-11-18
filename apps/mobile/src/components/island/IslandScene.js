import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import React from "react";
import { View } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

import { islandStyles as s } from "./IslandSceneStyles";

import SkyLayer from "./SkyLayer";
import CloudLayer from "./CloudLayer";
import SeaLayer from "./SeaLayer";
import WaveLayer from "./WaveLayer";
import IslandObjectsLayer from "./IslandObjectsLayer";

export default function IslandScene() {
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
      />
    </View>
  );

}

const emotionGradients = {
  joy: {
    sky: ["#E9F4FF", "#CFE3FF"],
    ocean: ["#9EC9F7", "#7AB6F3"],
  },
  sadness: {
    sky: ["#BFC7D4", "#A7AFBF"],
    ocean: ["#607A9B", "#4A5C75"],
  },
  neutral: {
    sky: ["#DDE6F5", "#C8D5EA"],
    ocean: ["#8FBEEA", "#72AEE6"],
  },
};
