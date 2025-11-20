import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 컴포넌트
import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";

// 모달들
import DiaryWriteModal from "../Diary/DiaryWriteModal";
import ObjectTodayModal from "../Objects/ObjectTodayModal";
import MusicTodayModal from "../Music/MusicTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal"; // 🌴 나무 모달
import RockWorryModal from "./components/RockWorryModal";     // 🪨 바위 모달

// ---------------------------------------------------------
// [가데이터 로드] 
// 이 부분이 있어야 모달에 내용이 뜹니다.
// ---------------------------------------------------------
const DUMMY_OBJECT = {
  name: "빈티지 마이크",
  description: "오래된 녹음실에서 쓰이던 마이크입니다.\n당신의 목소리를 기록해보세요.",
  // 이미지가 없으면 아이콘으로 뜨게 처리했으므로, 파일이 없어도 에러는 안 납니다.
  image: require("../../../assets/objects/mic.png"), 
};

const DUMMY_MUSIC = {
  title: "Sample Audio Track",
  artist: "Unknown Artist",
  description: "발견된 오디오 트랙입니다.",
  // 오디오 파일 경로 (파일이 없으면 재생만 안 됨)
  source: require("../../../assets/audio/sample_audio.wav"), 
};

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0];

  // 1. 모달 상태 관리 (총 5개)
  const [writeVisible, setWriteVisible] = useState(false);       // 일기 쓰기
  const [todayObjVisible, setTodayObjVisible] = useState(false); // 🎁 상자 (오브제)
  const [todayMusicVisible, setTodayMusicVisible] = useState(false); // 🎵 턴테이블 (음악)
  const [treeVisible, setTreeVisible] = useState(false);         // 🌴 나무 (오늘의 운세)
  const [rockVisible, setRockVisible] = useState(false);         // 🪨 바위 (걱정 쓰레기통)

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: "#A7D8FF" }}
      edges={['top', 'left', 'right']} 
    >
      <View style={{ flex: 1 }}>
        <IslandScene 
          // 각 오브제 클릭 시 해당 모달 열기
          onPressChest={() => setTodayObjVisible(true)} 
          onPressTurntable={() => setTodayMusicVisible(true)}
          onPressTree={() => setTreeVisible(true)} 
          onPressRock={() => setRockVisible(true)} 
        />
      </View>

      {/* 입력창 */}
      <InputBox onPressDiary={() => setWriteVisible(true)} />

      {/* --- 모달 리스트 --- */}

      {/* 1. 일기 작성 */}
      <DiaryWriteModal
        visible={writeVisible}
        mode="write"
        targetDate={today}
        onClose={() => setWriteVisible(false)}
        onSaved={() => setWriteVisible(false)}
      />

      {/* 2. 오늘의 오브제 (가데이터 전달) */}
      <ObjectTodayModal
        visible={todayObjVisible}
        data={DUMMY_OBJECT}  
        onClose={() => setTodayObjVisible(false)}
      />

      {/* 3. 오늘의 음악 (가데이터 전달 + 생성 로직 연결) */}
      <MusicTodayModal
        visible={todayMusicVisible}
        musicData={DUMMY_MUSIC} 
        onClose={() => setTodayMusicVisible(false)}
        onPressCreate={() => {
           setTodayMusicVisible(false); // 음악 모달 닫고
           setWriteVisible(true);       // 일기 쓰기 열기
        }}
      />

      {/* 4. 나무 (힐링 문구) */}
      <TreeFortuneModal 
        visible={treeVisible} 
        onClose={() => setTreeVisible(false)} 
      />

      {/* 5. 바위 (걱정 삭제) */}
      <RockWorryModal 
        visible={rockVisible} 
        onClose={() => setRockVisible(false)} 
      />

    </SafeAreaView>
  );
}