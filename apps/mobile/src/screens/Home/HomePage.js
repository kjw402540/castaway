import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";
import { useTheme } from "../../context/ThemeContext";
import IslandScene from "../../components/island/IslandScene";
import HomeInputBox from "./components/HomeInputBox";
import HomeBanner from "./components/HomeBanner";
import ObjectTodayModal from "../Object/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";
import DiaryWriteModal from "../Diary/DiaryWriteModal";
import useHomeFlow from "./hooks/useHomeFlow";
import HomeEmotionPanel from "./components/HomeEmotionPanel";


function getLocalYMD() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function HomePage() {
  useBackExit();

  const { theme, setEmotion } = useTheme();
  const today = getLocalYMD();
  const storageKey = `emotionCardClosed_${today}`;

  const { todayStatus, startAnalysis, todayDiary } = useHomeFlow();

  const [writeVisible, setWriteVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);

  const [bannerClosed, setBannerClosed] = useState(false);
  const [showEmotionCard, setShowEmotionCard] = useState(true);

  // 감정카드 복원
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((v) => {
      if (v === "true") setShowEmotionCard(false);
    });
  }, []);

  // 감정 테마 업데이트
  useEffect(() => {
    const result = todayDiary?.emotionResult;
    if (!result) return;

    const key =
      result.main_emotion === 0
        ? "Anger/Disgust"
        : result.main_emotion === 1
        ? "Joy"
        : result.main_emotion === 2
        ? "Neutral"
        : result.main_emotion === 3
        ? "Sadness"
        : "Surprise/Fear";

    setEmotion(key);
  }, [todayDiary]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.skyBottom }]}
      edges={["top", "left", "right"]}
    >
      {/* 섬 레이어 */}
      <View style={StyleSheet.absoluteFill}>
        <IslandScene
          onPressChest={() => setTodayObjVisible(true)}
          onPressTree={() => setTreeVisible(true)}
          onPressRock={() => setRockVisible(true)}
        />
      </View>

      {/* 배너 */}
      {!bannerClosed && (
        <View style={styles.bannerOverlay}>
          <HomeBanner
            status={todayStatus}
            onClose={() => setBannerClosed(true)}
          />
        </View>
      )}

      {/* 입력 + 감정 카드 패널 */}
      <View style={styles.bottomOverlay}>
        {todayStatus === "no_diary" && (
          <HomeInputBox onPressDiary={() => setWriteVisible(true)} />
        )}

        <HomeEmotionPanel
          today={today}
          todayStatus={todayStatus}
          todayDiary={todayDiary}
          showEmotionCard={showEmotionCard}
          setShowEmotionCard={setShowEmotionCard}
        />
      </View>

      {/* 모달 */}
      <DiaryWriteModal
        visible={writeVisible}
        dateString={today}
        onClose={() => setWriteVisible(false)}
        initialText=""
        onSaved={() => {
          startAnalysis();
          setWriteVisible(false);
        }}
      />

      <ObjectTodayModal
        visible={todayObjVisible}
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
  container: { flex: 1 },
  bannerOverlay: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    zIndex: 30,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 22,
    zIndex: 50,
  },
});
