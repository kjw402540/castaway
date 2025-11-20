// IslandScene.js
import React from "react";
import { View } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

// 스타일 파일 (사용자님의 코드에 따라 가정)
import { islandStyles as s } from "./IslandSceneStyles";

// 자식 컴포넌트들
import SkyLayer from "./SkyLayer";
import CloudLayer from "./CloudLayer";
import SeaLayer from "./SeaLayer";
// import WaveLayer from "./WaveLayer"; // 주석 처리된 상태 유지
import IslandObjectsLayer from "./IslandObjectsLayer";

/**
 * IslandScene 컴포넌트
 * 감정 상태에 따라 배경과 오브젝트를 렌더링합니다.
 * React.memo로 감싸서, props가 변경되지 않으면 리렌더링을 방지합니다.
 */
function IslandScene({ 
  onPressChest, 
  onPressTurntable, 
  onPressTree, 
  onPressRock 
}) {
  // EmotionContext에서 현재 감정 상태를 가져옵니다.
  const { emotion } = useEmotion();

  // 모든 레이어를 감싸는 컨테이너
  return (
    <View style={s.container} pointerEvents="box-none">
      {/* 1. 하늘 레이어 (감정에 따라 변화) */}
      <SkyLayer emotion={emotion} />
      
      {/* 2. 구름 레이어 */}
      <CloudLayer />
      
      {/* 3. 바다 레이어 (감정에 따라 변화) */}
      <SeaLayer emotion={emotion} />
      
      {/* 4. 파도 레이어 (현재 주석 처리됨) */}
      {/* <WaveLayer /> */}

      {/* 5. 섬 오브젝트 레이어 (터치 이벤트를 처리) */}
      <IslandObjectsLayer
        onPressChest={onPressChest}
        onPressTurntable={onPressTurntable}
        onPressTree={onPressTree}
        onPressRock={onPressRock}
      />
    </View>
  );
}

// React.memo를 사용하여 props가 변경되지 않으면 불필요한 리렌더링을 방지합니다.
export default React.memo(IslandScene);