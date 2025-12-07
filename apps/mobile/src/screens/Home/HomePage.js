import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackExit } from "../../hooks/useBackExit";
import { useTheme } from "../../context/ThemeContext";

import IslandScene from "../../components/island/IslandScene";
import HomeInputBox from "./components/HomeInputBox";
import HomeBanner from "./components/HomeBanner";
import HomeEmotionPanel from "./components/HomeEmotionPanel";
import HomePredictionCard from "./components/HomePredictionCard";

import ObjectDetailModal from "../Object/ObjectDetailModal";
import TurntableModal from "../Object/TurntableModal";
import DiaryWriteModal from "../Diary/DiaryWriteModal";
import TreeFortuneModal from "./components/TreeFortuneModal";
import RockWorryModal from "./components/RockWorryModal";
import ObjectTodayModal from "../Object/ObjectTodayModal";

import useHomeFlow from "./hooks/useHomeFlow";

// 👇 [추가] ObjectsPage에서 쓰던 이미지 주소 변환 함수 가져오기!
import { getObjectImageUrl } from "../../services/objectService";

// (이 BASE_URL은 API 호출용이고, 이미지용은 objectService 안에서 처리됨)
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

  const { todayStatus, startAnalysis, todayDiary, todayPrediction } = useHomeFlow();

  const [writeVisible, setWriteVisible] = useState(false);
  const [treeVisible, setTreeVisible] = useState(false);
  const [rockVisible, setRockVisible] = useState(false);
  const [bannerClosed, setBannerClosed] = useState(false);
  const [showEmotionCard, setShowEmotionCard] = useState(true);

  const [chestVisible, setChestVisible] = useState(false);
  const [turntableVisible, setTurntableVisible] = useState(false);
  const [todayObjVisible, setTodayObjVisible] = useState(false);

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

  // ----------------------------------------------------------------
  // 🧩 데이터 준비
  // ----------------------------------------------------------------
  
  // 1. 오브제 데이터
  const todayObject = todayDiary?.object; 
  const objectForModal = todayObject ? {
      date: today,
      // 👇 [수정] 수동으로 합치지 말고, 서비스 함수 사용! (ObjectsPage와 동일하게)
      imageUrl: getObjectImageUrl(todayObject.object_image), 
      emoji: "🎁", 
      ...todayObject
  } : null;

  // 2. BGM 데이터
  const todayBgmData = todayDiary?.bgms && todayDiary.bgms.length > 0 
      ? todayDiary.bgms[0] 
      : null;
      
  const bgmForModal = todayBgmData ? {
      title: "오늘의 감정 BGM",
      emoji: "💿",
      // 👇 [참고] BGM도 주소 변환 함수가 있다면 써야 하지만, 보통 로컬/URL 그대로 씀
      // 만약 소리가 안 나면 여기도 확인 필요
      audioUri: todayBgmData.bgm_url 
  } : null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.skyBottom }]}
      edges={["top", "left", "right"]}
    >
      <View style={StyleSheet.absoluteFill}>
        <IslandScene
          onPressChestDetail={() => {
             if (todayObject) {
                 setChestVisible(true);
             } else {
                 if(todayStatus === 'no_diary') Alert.alert("아직 없어요", "일기를 쓰면 선물이 도착해요!");
                 else setTodayObjVisible(true);
             }
          }}
          
          onPressTurntableDetail={() => {
             if (todayBgmData) {
                 setTurntableVisible(true);
             } else {
                 if(todayStatus === 'no_diary') Alert.alert("음악이 없어요", "일기를 쓰면 음악을 만들어드려요!");
             }
          }}

          onPressTree={() => setTreeVisible(true)}
        />
      </View>

      {!bannerClosed && (
        <View style={styles.bannerOverlay}>
          <HomeBanner status={todayStatus} onClose={() => setBannerClosed(true)} />
        </View>
      )}

      <View style={styles.bottomOverlay}>
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

      {/* 모달 연결 */}
      <ObjectDetailModal
        visible={chestVisible}
        object={objectForModal}
        onClose={() => setChestVisible(false)}
        onPrev={() => {}}
        onNext={() => {}}
        onOpenDiary={() => {}}
      />

      <TurntableModal
        visible={turntableVisible}
        item={bgmForModal}
        onClose={() => setTurntableVisible(false)}
      />

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