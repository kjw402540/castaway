// src/screens/HomePage.js

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";

// 섬 & 입력박스
import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";

// 모달들
import DiaryWriteModal from "../Diary/DiaryWriteModal";
import ObjectTodayModal from "../Object/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";

// UX 컴포넌트
import HomeBanner from "./components/HomeBanner";

// 흐름 훅 (경로 수정)
import useHomeFlow from "./hooks/useHomeFlow";

// 가데이터
const DUMMY_OBJECT = {
  name: "빈티지 마이크",
  description: "오래된 녹음실에서 쓰이던 마이크입니다.\n당신의 목소리를 기록해보세요.",
  image: require("../../../assets/objects/mic.png"),
};

export default function HomePage() {
  useBackExit();

  const today = new Date().toISOString().split("T")[0];

  const {
    todayStatus,
    showAnalysis,
    showReward,
    startAnalysis,
    finishReward,
  } = useHomeFlow();

  // 모달 상태
  const [writeVisible, setWriteVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);

  // InputBox
  const [isInputOpen, setIsInputOpen] = useState(true);

  // 상단 배너 닫기
  const [bannerClosed, setBannerClosed] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>

      {/* 상단 배너 - "보러가기" 없음 + 닫기 가능 */}
      {!bannerClosed && (
        <View style={styles.bannerOverlay}>
          <HomeBanner
            status={todayStatus}
            onClose={() => setBannerClosed(true)}
          />
        </View>
      )}

      {/* 섬 - 더 아래로 확실하게 내림 */}
      <View style={styles.sceneContainer}>
        <IslandScene
          onPressChest={() => setTodayObjVisible(true)}
          onPressTree={() => setTreeVisible(true)}
          onPressRock={() => setRockVisible(true)}
        />
      </View>

      {/* InputBox → 모달 잘 열리도록 고침 */}
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
        onSaved={() => {
          setWriteVisible(false);
          startAnalysis();
        }}
      />

      {/* 오늘의 오브제 모달 */}
      <ObjectTodayModal
        visible={todayObjVisible}
        data={DUMMY_OBJECT}
        onClose={() => setTodayObjVisible(false)}
      />

      {/* 나무 / 바위 */}
      <TreeFortuneModal visible={treeVisible} onClose={() => setTreeVisible(false)} />
      <RockWorryModal visible={rockVisible} onClose={() => setRockVisible(false)} />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D8FF",
  },

  /* 섬 더 아래로 확실하게 내림 */
  sceneContainer: {
    flex: 1,
    marginTop: 120,  // ← 여기 조정하면 된다. 지금은 확실히 내려준 상태.
  },

  /* 배너는 화면 맨 위 겹치기 */
  bannerOverlay: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    zIndex: 30,
  },
});
