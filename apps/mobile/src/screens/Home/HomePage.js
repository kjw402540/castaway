// src/screens/HomePage.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";

// 컴포넌트
import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";

// 모달들
import DiaryWriteModal from "../Diary/DiaryWriteModal";
import ObjectTodayModal from "../Objects/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";

// 가데이터
const DUMMY_OBJECT = {
  name: "빈티지 마이크",
  description: "오래된 녹음실에서 쓰이던 마이크입니다.\n당신의 목소리를 기록해보세요.",
  image: require("../../../assets/objects/mic.png"), 
};

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  
  // 모달 상태 관리
  const [writeVisible, setWriteVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);
  
  // InputBox 열림/닫힘 상태
  const [isInputOpen, setIsInputOpen] = useState(true);
  
  // 앱 종료 훅
  useBackExit();
  
  return (
    <SafeAreaView 
      style={styles.container}
      edges={['top', 'left', 'right']} 
    >
      <View style={styles.sceneContainer}>
        <IslandScene 
          onPressChest={() => setTodayObjVisible(true)} 
          onPressTree={() => setTreeVisible(true)} 
          onPressRock={() => setRockVisible(true)} 
        />
      </View>

      {/* 입력창 */}
      <InputBox 
        onPressDiary={() => setWriteVisible(true)} 
        isCollapsed={!isInputOpen} 
        onToggleCollapse={() => setIsInputOpen(!isInputOpen)} 
      />

      {/* 일기 작성 모달 */}
      <DiaryWriteModal
        visible={writeVisible}
        mode="write"
        targetDate={today}
        onClose={() => setWriteVisible(false)}
        onSaved={() => setWriteVisible(false)}
      />

      {/* 오늘의 오브제 모달 */}
      <ObjectTodayModal
        visible={todayObjVisible}
        data={DUMMY_OBJECT}  
        onClose={() => setTodayObjVisible(false)}
      />

      {/* 나무 모달 */}
      <TreeFortuneModal 
        visible={treeVisible} 
        onClose={() => setTreeVisible(false)} 
      />

      {/* 바위 모달 */}
      <RockWorryModal 
        visible={rockVisible} 
        onClose={() => setRockVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D8FF",
  },
  sceneContainer: {
    flex: 1,
  },
});