// src/screens/HomePage.js

import React, { useState } from "react";
import { View, StyleSheet, StyleSheet as RNStyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";
import { useEmotion } from "../../context/EmotionContext";

import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";
import EmotionResultCard from "./components/EmotionResultCard"; // ✅ 추가

import DiaryWriteModal from "../Diary/DiaryWriteModal";
import ObjectTodayModal from "../Object/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";

import HomeBanner from "./components/HomeBanner";
import useHomeFlow from "./hooks/useHomeFlow";

// 안드로이드 애니메이션 활성화
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DUMMY_OBJECT = {
  name: "빈티지 마이크",
  description: "오래된 녹음실에서 쓰이던 마이크입니다.\n당신의 목소리를 기록해보세요.",
  image: require("../../../assets/objects/mic.png"),
};

function getLocalYMD() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? '0'+m : m}-${day < 10 ? '0'+day : day}`;
}

export default function HomePage() {
  useBackExit();
  // const { emotion } = useEmotion(); // 필요 시 사용

  const today = getLocalYMD();

  // ✅ todayDiary 가져오기
  const { todayStatus, startAnalysis, todayDiary } = useHomeFlow();

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

      {/* --- 하단 영역 (입력창 OR 감정분석 결과) --- */}
      <View style={styles.inputWrapper}>
        
        {/* Case 1: 일기가 없을 때 -> 입력창 표시 */}
        {todayStatus === "no_diary" && (
          <InputBox
            onPressDiary={() => {
              if (!writeVisible) setWriteVisible(true);
            }}
            isCollapsed={!isInputOpen}
            onToggleCollapse={() => setIsInputOpen(!isInputOpen)}
          />
        )}

        {/* Case 2: 일기가 있을 때 (done or object_created) -> 분석 결과 카드 표시 */}
        {/* todayDiary가 있고, 그 안에 emotionResult가 있어야 보여줌 */}
        {(todayStatus === "done" || todayStatus === "object_created") && todayDiary?.emotionResult && (
           <EmotionResultCard emotionResult={todayDiary.emotionResult} />
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
          setIsInputOpen(false); // 작성 후 닫기
          startAnalysis(); // 분석 시작 (여기서 끝나면 데이터 갱신됨)
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