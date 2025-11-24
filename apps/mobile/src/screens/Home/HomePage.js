// src/screens/HomePage.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, StyleSheet as RNStyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";
import { useEmotion } from "../../context/EmotionContext";

import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";

import DiaryWriteModal from "../Diary/DiaryWriteModal";
import ObjectTodayModal from "../Object/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";

import HomeBanner from "./components/HomeBanner";
import useHomeFlow from "./hooks/useHomeFlow";

const DUMMY_OBJECT = {
  name: "빈티지 마이크",
  description:
    "오래된 녹음실에서 쓰이던 마이크입니다.\n당신의 목소리를 기록해보세요.",
  image: require("../../../assets/objects/mic.png"),
};




export default function HomePage() {
  useBackExit();
  const { emotion } = useEmotion();
  

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;

  const { todayStatus, startAnalysis } = useHomeFlow();

  const [writeVisible, setWriteVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);

  const [isInputOpen, setIsInputOpen] = useState(true);
  const [bannerClosed, setBannerClosed] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={RNStyleSheet.absoluteFill}>
        <IslandScene
          onPressChest={() => setTodayObjVisible(true)}
          onPressTree={() => setTreeVisible(true)}
          onPressRock={() => setRockVisible(true)}
        />
      </View>

      {!bannerClosed && (
        <View style={styles.bannerOverlay}>
          <HomeBanner
            status={todayStatus}
            onClose={() => setBannerClosed(true)}
          />
        </View>
      )}

      {/* --- 입력 박스: 오늘 일기 없을 때만 --- */}
      {todayStatus === "no_diary" && (
        <View style={styles.inputWrapper}>
          <InputBox
            onPressDiary={() => {
              if (!writeVisible) setWriteVisible(true);
            }}
            isCollapsed={!isInputOpen}
            onToggleCollapse={() => setIsInputOpen(!isInputOpen)}
          />
        </View>
      )}


      <DiaryWriteModal
        visible={writeVisible}
        dateString={today}
        initialText=""
        onClose={() => setWriteVisible(false)}
        onSaved={() => {
          setWriteVisible(false);
          setIsInputOpen(false);     // ★ 추가: InputBox 강제로 닫아서 포커스 제거
          startAnalysis();
        }}
      />


      <ObjectTodayModal
        visible={todayObjVisible}
        data={DUMMY_OBJECT}
        onClose={() => setTodayObjVisible(false)}
      />

      <TreeFortuneModal
        visible={treeVisible}
        onClose={() => setTreeVisible(false)}
      />

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
    backgroundColor: "transparent",
  },

  bannerOverlay: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    zIndex: 30,
  },

  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    paddingBottom: 22,
    zIndex: 50,
  },
});
