// src/screens/HomePage.js

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StyleSheet as RNStyleSheet,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";
import { useTheme } from "../../context/ThemeContext";

import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";
import EmotionResultCard from "./components/EmotionResultCard";
import DiaryWriteModal from "../Diary/DiaryWriteModal";
import ObjectTodayModal from "../Object/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";
import HomeBanner from "./components/HomeBanner";
import useHomeFlow from "./hooks/useHomeFlow";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function getLocalYMD() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? "0" + m : m}-${
    day < 10 ? "0" + day : day
  }`;
}

export default function HomePage() {
  useBackExit();

  const { theme } = useTheme();
  const today = getLocalYMD();
  const { todayStatus, startAnalysis, todayDiary } = useHomeFlow();

  const [writeVisible, setWriteVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(true);
  const [bannerClosed, setBannerClosed] = useState(false);

  // 🔥 감정 카드 표시 여부 관리
  const [showEmotionCard, setShowEmotionCard] = useState(true);

  // 🔥 status 변하면 카드 다시 열기 (분석 완료 시)
  useEffect(() => {
    if (todayStatus === "done" || todayStatus === "object_created") {
      setShowEmotionCard(true);
    }
  }, [todayStatus]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.skyBottom }]}
      edges={["top", "left", "right"]}
    >
      <View style={RNStyleSheet.absoluteFill}>
        <IslandScene
          onPressChest={() => setTodayObjVisible(true)}
          onPressTree={() => setTreeVisible(true)}
          onPressRock={() => setRockVisible(true)}
        />
      </View>

      {!bannerClosed && (
        <View style={styles.bannerOverlay}>
          <HomeBanner status={todayStatus} onClose={() => setBannerClosed(true)} />
        </View>
      )}

      {/* --- 하단 영역 --- */}
      <View style={styles.inputWrapper}>
        {todayStatus === "no_diary" && (
          <InputBox
            onPressDiary={() => setWriteVisible(true)}
            isCollapsed={!isInputOpen}
            onToggleCollapse={() => setIsInputOpen((prev) => !prev)}
          />
        )}

        {(todayStatus === "done" || todayStatus === "object_created") &&
          todayDiary?.emotionResult &&
          showEmotionCard && (
            <EmotionResultCard
              emotionResult={todayDiary.emotionResult}
              onClose={() => setShowEmotionCard(false)} // 👈 닫기 버튼 작동!!!
            />
          )}
      </View>

      {/* --- Modals --- */}
      <DiaryWriteModal
        visible={writeVisible}
        dateString={today}
        initialText=""
        onClose={() => setWriteVisible(false)}
        onSaved={() => {
          setWriteVisible(false);
          setIsInputOpen(false);
          startAnalysis(); // 분석 실행 → 성공하면 위에서 showEmotionCard=true됨
        }}
      />

      <ObjectTodayModal
        visible={todayObjVisible}
        data={{
          name: "빈티지 마이크",
          description: "오래된 녹음실에서 쓰이던 마이크입니다.\n당신의 목소리를 기록해보세요.",
          image: require("../../../assets/objects/mic.png"),
        }}
        onClose={() => setTodayObjVisible(false)}
      />

      <TreeFortuneModal visible={treeVisible} onClose={() => setTreeVisible(false)} />
      <RockWorryModal visible={rockVisible} onClose={() => setRockVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
