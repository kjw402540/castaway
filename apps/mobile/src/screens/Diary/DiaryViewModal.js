// src/screens/Diary/DiaryViewModal.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Alert,
  ScrollView 
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import { deleteDiary } from "../../services/diaryService";
import WaveformPlayer from "./components/WaveformPlayer";

const SCREEN_HEIGHT = Dimensions.get("window").height;

// ⚠️ [필수 수정] 본인의 Node.js API 서버 주소로 변경하세요!
// 에뮬레이터라면 'http://10.0.2.2:4000', 실기기라면 'http://192.168.x.x:4000'
const API_BASE_URL = "http://192.168.0.12:4000"; 

const EMOTIONS = {
  0: { label: "화남/혐오", icon: "emoticon-angry-outline", color: "#EF4444" },
  1: { label: "기쁨", icon: "emoticon-happy-outline", color: "#F59E0B" },
  2: { label: "평온함", icon: "emoticon-neutral-outline", color: "#10B981" },
  3: { label: "슬픔", icon: "emoticon-sad-outline", color: "#3B82F6" },
  4: { label: "놀람/불안", icon: "emoticon-confused-outline", color: "#8B5CF6" },
};

export default function DiaryViewModal({
  visible,
  dateString,
  onClose,
  onEdit,
  initialData,
  onDeleteSuccess
}) {
  const [diary, setDiary] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // 화면에 뿌려줄 데이터 상태
  const [displayKeywords, setDisplayKeywords] = useState([]);
  const [displayEmotion, setDisplayEmotion] = useState(null);
  const [displaySummary, setDisplaySummary] = useState("");
  
  // 🎵 BGM URL 상태 추가
  const [displayBgmUrl, setDisplayBgmUrl] = useState(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // 🔥 모달 열릴 때 데이터 연결
  useEffect(() => {
    if (visible && initialData) {
      opacity.value = withTiming(1, { duration: 140 });
      scale.value = withTiming(1, { duration: 140 });

      setDiary(initialData);

      // ✅ 1. 감정 분석 결과 파싱
      const result = initialData.emotionResult;
      if (result) {
        const emoId = result.main_emotion; 
        setDisplayEmotion(EMOTIONS[emoId] || EMOTIONS[2]); 

        const kList = [
          result.keyword_1,
          result.keyword_2,
          result.keyword_3
        ].filter((k) => k);
        setDisplayKeywords(kList);

        setDisplaySummary(result.summary_text || "");
      } else {
        setDisplayEmotion(null);
        setDisplayKeywords([]);
        setDisplaySummary("");
      }

      // ✅ 2. BGM 데이터 파싱 및 URL 생성
      // 백엔드에서 diary 조회 시 include: { BGM: true } (또는 bgm)이 되어있어야 데이터가 들어옵니다.
      const bgmData = initialData.BGM || initialData.bgm; // Prisma 모델명 대소문자 확인

      // 1:1 관계면 객체, 1:N이면 배열일 수 있으므로 처리
      const bgmItem = Array.isArray(bgmData) ? bgmData[0] : bgmData;

      if (bgmItem && bgmItem.bgm_url) {
        // DB 저장 경로(예: /home/ubuntu/.../bgm_123.wav)에서 파일명만 추출
        const filename = bgmItem.bgm_url.split('/').pop();
        
        // 다운로드 API URL 완성
        const downloadUrl = `${API_BASE_URL}/api/bgm/download?filename=${filename}`;
        setDisplayBgmUrl(downloadUrl);
        console.log("🎵 BGM URL 설정됨:", downloadUrl);
      } else {
        setDisplayBgmUrl(null);
      }

    } else {
      // 닫힐 때 초기화
      opacity.value = 0;
      scale.value = 0.96;
      setMenuVisible(false);
      setDiary(null);
      setDisplayKeywords([]);
      setDisplayEmotion(null);
      setDisplayBgmUrl(null); // 초기화
    }
  }, [visible, initialData]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.box, animatedStyle]}>

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.date}>{dateString}</Text>

            <View style={styles.headerIcons}>
              {diary && (
                <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
                  <FontAwesome name="ellipsis-h" size={20} color="#1E3A8A" />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={onClose} style={{ marginLeft: 14 }}>
                <FontAwesome name="close" size={22} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 메뉴 (수정/삭제) */}
          {menuVisible && (
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onClose();
                  onEdit?.();
                }}
              >
                <Text style={styles.menuText}>수정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert("일기 삭제", "정말로 삭제하시겠습니까?", [
                    { text: "취소", style: "cancel" },
                    {
                      text: "삭제",
                      style: "destructive",
                      onPress: async () => {
                        await deleteDiary(dateString);
                        onClose();
                        onDeleteSuccess?.();
                      },
                    },
                  ]);
                }}
              >
                <Text style={styles.menuDelete}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            
            {/* 🎯 분석 결과 표시 영역 */}
            <View style={styles.analysisPanel}>
              
              {/* 1. 감정 아이콘 & 라벨 */}
              {displayEmotion ? (
                <View style={[styles.emotionBadge, { backgroundColor: displayEmotion.color + "15" }]}>
                  <MaterialCommunityIcons 
                    name={displayEmotion.icon} 
                    size={32} 
                    color={displayEmotion.color} 
                  />
                  <Text style={[styles.emotionLabel, { color: displayEmotion.color }]}>
                    {displayEmotion.label}
                  </Text>
                </View>
              ) : (
                 diary?.object?.icon && (
                   <Image source={diary.object.icon} style={styles.objectIcon} resizeMode="contain" />
                 )
              )}

              {/* 🎵 2. 오늘의 BGM (BGM이 있을 때만 표시) */}
              {displayBgmUrl && (
                <View style={styles.bgmContainer}>
                  <View style={styles.bgmLabelRow}>
                    <MaterialCommunityIcons name="music-note" size={16} color="#6366F1" />
                    <Text style={styles.bgmLabelText}>AI가 선물한 오늘의 무드</Text>
                  </View>
                  {/* 기존 WaveformPlayer 재사용 */}
                  <WaveformPlayer audioUri={displayBgmUrl} />
                </View>
              )}

              {/* 3. 키워드 표시 */}
              {displayKeywords.length > 0 && (
                <View style={styles.keywordRow}>
                  {displayKeywords.map((k, idx) => (
                    <View key={idx} style={styles.keywordChip}>
                      <Text style={styles.keywordText}>#{k}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 4. 요약(원인) 텍스트 */}
              {displaySummary ? (
                 <Text style={styles.summaryText}>"{displaySummary}"</Text>
              ) : null}

              {/* 5. 사용자 녹음 파일 (있으면 표시) */}
              {diary?.audio && (
                <View style={{ marginTop: 10, width: '100%' }}>
                  <Text style={styles.subLabel}>나의 목소리</Text>
                  <WaveformPlayer audioUri={diary.audio} />
                </View>
              )}
            </View>

            {/* 본문 내용 표시 */}
            <View style={styles.divider} />
            
            <Text style={styles.body}>
              {diary?.text || diary?.original_text || "내용이 없습니다."}
            </Text>
          </ScrollView>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  box: {
    width: "95%",
    maxHeight: SCREEN_HEIGHT * 0.85, 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    zIndex: 1, 
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: { fontSize: 20, fontWeight: "700", color: "#1E3A8A" },

  menuBox: {
    position: "absolute",
    top: 48,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: 110,
    shadowColor: "#000",
    shadowRadius: 6,
    shadowOpacity: 0.15,
    elevation: 20, 
    zIndex: 999,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuText: { fontSize: 14, color: "#1E3A8A", fontWeight: "600" },
  menuDelete: { fontSize: 14, color: "#DC2626", fontWeight: "600" },

  // 분석 패널 스타일
  analysisPanel: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
    width: '100%',
  },
  
  emotionBadge: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginBottom: 12,
  },
  emotionLabel: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "bold",
  },
  objectIcon: { width: 40, height: 40, marginBottom: 8 },

  // 🎵 BGM 스타일 추가
  bgmContainer: {
    width: '100%',
    backgroundColor: '#EEF2FF', // 연한 보라/블루 계열
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  bgmLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  bgmLabelText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    marginLeft: 4,
  },

  keywordRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center",
    gap: 8, 
    marginBottom: 12 
  },
  keywordChip: {
    backgroundColor: "#F3F4F6", 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  keywordText: { fontSize: 13, fontWeight: "600", color: "#4B5563" },

  summaryText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 26, 
    color: "#374151",
  },
});