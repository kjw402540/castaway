import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";
import { useTheme } from "../../context/ThemeContext";

import IslandScene from "../../components/island/IslandScene";
import HomeInputBox from "./components/HomeInputBox";
import HomeBanner from "./components/HomeBanner";
import HomeEmotionPanel from "./components/HomeEmotionPanel";
import HomePredictionCard from "./components/HomePredictionCard";

import ObjectTodayModal from "../Object/ObjectTodayModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";
import DiaryWriteModal from "../Diary/DiaryWriteModal";

import useHomeFlow from "./hooks/useHomeFlow";

// 환경별 주소 설정 (안드로이드/iOS)
const BASE_URL = Platform.OS === 'android' ? "http://10.0.2.2:4000" : "http://localhost:4000";

function getLocalYMD() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function HomePage() {
  useBackExit();
  const { theme, setEmotion } = useTheme();
  const today = getLocalYMD();
  const storageKey = `emotionCardClosed_${today}`;

  // 훅에서 데이터 가져오기
  const { todayStatus, startAnalysis, todayDiary, todayPrediction } = useHomeFlow();

  // State
  const [writeVisible, setWriteVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);
  const [bannerClosed, setBannerClosed] = useState(false);
  const [showEmotionCard, setShowEmotionCard] = useState(true);

  // 초기화 및 테마 설정
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((v) => {
      if (v === "true") setShowEmotionCard(false);
    });
  }, []);

  useEffect(() => {
    const result = todayDiary?.emotionResult;
    if (!result) return;
    const key =
      result.main_emotion === 0 ? "Anger/Disgust"
      : result.main_emotion === 1 ? "Joy"
      : result.main_emotion === 2 ? "Neutral"
      : result.main_emotion === 3 ? "Sadness"
      : "Surprise/Fear";
    setEmotion(key);
  }, [todayDiary]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.skyBottom }]}
      edges={["top", "left", "right"]}
    >
      <View style={StyleSheet.absoluteFill}>
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

      {/* 🚨 [디버깅 영역] 화면 상단에 상태값 강제 표시 (빨간 글씨)
      <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 999, backgroundColor: 'rgba(0,0,0,0.7)', padding: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>🔍 디버깅 정보</Text>
        <Text style={{ color: '#ff5555' }}>Status: {todayStatus}</Text>
        <Text style={{ color: '#55ff55' }}>Prediction: {todayPrediction ? '있음(OK)' : '없음(NULL)'}</Text>
        {todayPrediction && (
            <Text style={{ color: '#ccccff', fontSize: 10 }}>
                {JSON.stringify(todayPrediction)}
            </Text>
        )}
      </View> */}

      <View style={styles.bottomOverlay}>
        
        {/* 👇 [조건 확인] 이 두 가지가 모두 맞아야 뜹니다 */}
        {todayStatus === "no_diary" && todayPrediction && (
          <HomePredictionCard prediction={todayPrediction} />
        )}

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
      <ObjectTodayModal visible={todayObjVisible} onClose={() => setTodayObjVisible(false)} />
      <TreeFortuneModal visible={treeVisible} onClose={() => setTreeVisible(false)} />
      <RockWorryModal visible={rockVisible} onClose={() => setRockVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bannerOverlay: { position: "absolute", top: 20, left: 16, right: 16, zIndex: 30 },
  bottomOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: 22, zIndex: 50 },
});