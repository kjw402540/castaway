import { View } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

import { islandStyles as s } from "./IslandSceneStyles";

import SkyLayer from "./SkyLayer";
import CloudLayer from "./CloudLayer";
import SeaLayer from "./SeaLayer";
// import WaveLayer from "./WaveLayer";
import IslandObjectsLayer from "./IslandObjectsLayer";

export default function IslandScene() {
  const { emotion } = useEmotion();

  // chest, turntable 버튼 핸들러 (필요하면 수정)
  const onPressChest = () => {
    console.log("Chest pressed");
  };

  const onPressTurntable = () => {
    console.log("Turntable pressed");
  };

  return (
    <View style={s.container} pointerEvents="box-none">
      {/* Sky → 뒤 */}
      <SkyLayer emotion={emotion} />

      {/* Clouds */}
      <CloudLayer />

      {/* Sea */}
      <SeaLayer emotion={emotion} />

      {/* Waves (지금은 off) */}
      {/* <WaveLayer /> */}

      {/* Objects on island */}
      <IslandObjectsLayer
        onPressChest={onPressChest}
        onPressTurntable={onPressTurntable}
      />
    </View>
  );
}
