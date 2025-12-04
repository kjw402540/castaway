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
// ▼ [추가] 오브제 URL 생성 헬퍼 함수 import
import { getObjectImageUrl } from "../../services/objectService";
import WaveformPlayer from "./components/WaveformPlayer";

// ⚠️ API_BASE_URL은 apiConfig 등에서 가져오는 것이 좋지만, 
// 현재 파일에 하드코딩 되어 있다면 BGM 다운로드용으로만 쓰세요.
// 오브제 이미지는 getObjectImageUrl 함수가 알아서 주소를 만들어줍니다.
const API_BASE_URL = "http://3.23.124.215:4000"; 

const SCREEN_HEIGHT = Dimensions.get("window").height;

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

  const [displayKeywords, setDisplayKeywords] = useState([]);
  const [displayEmotion, setDisplayEmotion] = useState(null);
  const [displaySummary, setDisplaySummary] = useState("");
  const [displayBgmUrl, setDisplayBgmUrl] = useState(null);

  // ▼ [추가] 오브제 이미지 URL 상태
  const [displayObjectUrl, setDisplayObjectUrl] = useState(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (visible && initialData) {
      opacity.value = withTiming(1, { duration: 140 });
      scale.value = withTiming(1, { duration: 140 });

      setDiary(initialData);

      // 1. 감정 분석 결과
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

      // 2. BGM 데이터
      const bgmData = initialData.bgms || initialData.BGM || initialData.bgm; 
      const bgmItem = Array.isArray(bgmData) ? bgmData[0] : bgmData;

      if (bgmItem && bgmItem.bgm_url) {
        const filename = bgmItem.bgm_url.split('/').pop();
        const downloadUrl = `${API_BASE_URL}/api/bgm/download?filename=${filename}`;
        setDisplayBgmUrl(downloadUrl);
      } else {
        setDisplayBgmUrl(null);
      }

      // ▼▼▼ [추가] 3. 오브제 데이터 파싱 ▼▼▼
      // 백엔드에서 include: { objects: true } 또는 { object: true } 했는지 확인 필요
      // 보통 1:N 관계면 objects 배열로, 1:1이면 object 객체로 옴
      const objData = initialData.objects || initialData.object; 
      const objItem = Array.isArray(objData) ? objData[0] : objData;

      if (objItem && objItem.object_image) {
        // 서비스 함수 이용해서 전체 URL 생성
        const url = getObjectImageUrl(objItem.object_image);
        setDisplayObjectUrl(url);
        console.log("🖼️ 오브제 발견! URL:", url);
      } else {
        setDisplayObjectUrl(null);
      }

    } else {
      // 닫힐 때 초기화
      opacity.value = 0;
      scale.value = 0.96;
      setMenuVisible(false);
      setDiary(null);
      setDisplayKeywords([]);
      setDisplayEmotion(null);
      setDisplayBgmUrl(null);
      setDisplayObjectUrl(null); // 초기화
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

          {/* 메뉴 (생략) */}
          {menuVisible && (
             <View style={styles.menuBox}>
                {/* ... 기존 메뉴 코드 유지 ... */}
             </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            
            {/* 🎯 분석 결과 표시 영역 */}
            <View style={styles.analysisPanel}>
              
              {/* ▼ [수정] 감정 아이콘과 오브제 이미지를 나란히 배치 */}
              <View style={styles.visualRow}>
                
                {/* 1. 감정 아이콘 */}
                {displayEmotion && (
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
                )}

                {/* 2. 오브제 이미지 (있을 때만 표시) */}
                {displayObjectUrl && (
                  <View style={styles.objectBadge}>
                     <Image 
                        source={{ uri: displayObjectUrl }} 
                        style={styles.objectImage} 
                        resizeMode="cover"
                     />
                     <Text style={styles.objectLabel}>나의 오브제</Text>
                  </View>
                )}
              </View>

              {/* 🎵 BGM 플레이어 */}
              {displayBgmUrl && (
                <View style={styles.bgmContainer}>
                  <View style={styles.bgmLabelRow}>
                    <MaterialCommunityIcons name="music-note" size={16} color="#6366F1" />
                    <Text style={styles.bgmLabelText}>AI가 선물한 오늘의 무드</Text>
                  </View>
                  <WaveformPlayer audioUri={displayBgmUrl} />
                </View>
              )}

              {/* 키워드 */}
              {displayKeywords.length > 0 && (
                <View style={styles.keywordRow}>
                  {displayKeywords.map((k, idx) => (
                    <View key={idx} style={styles.keywordChip}>
                      <Text style={styles.keywordText}>#{k}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 요약 텍스트 */}
              {displaySummary ? (
                 <Text style={styles.summaryText}>"{displaySummary}"</Text>
              ) : null}

              {/* 녹음 파일 */}
              {diary?.audio && (
                <View style={{ marginTop: 10, width: '100%' }}>
                  <Text style={styles.subLabel}>나의 목소리</Text>
                  <WaveformPlayer audioUri={diary.audio} />
                </View>
              )}
            </View>

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
  // ... 기존 스타일 유지 ...
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
  headerIcons: { flexDirection: "row", alignItems: "center" },
  date: { fontSize: 20, fontWeight: "700", color: "#1E3A8A" },

  menuBox: {
    position: "absolute",
    top: 48, right: 20, backgroundColor: "white", borderRadius: 10, width: 110,
    shadowColor: "#000", shadowRadius: 6, shadowOpacity: 0.15, elevation: 20, zIndex: 999,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuText: { fontSize: 14, color: "#1E3A8A", fontWeight: "600" },
  menuDelete: { fontSize: 14, color: "#DC2626", fontWeight: "600" },

  analysisPanel: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
    width: '100%',
  },

  // ▼ [추가] 감정과 오브제를 나란히 놓을 컨테이너
  visualRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16, // 사이 간격
    marginBottom: 12,
  },

  emotionBadge: {
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    width: 100, // 크기 고정
    height: 110,
    borderRadius: 18,
    // marginBottom 제거 (row 안에 있으므로)
  },
  emotionLabel: { marginTop: 6, fontSize: 14, fontWeight: "bold" },

  // ▼ [추가] 오브제 스타일
  objectBadge: {
    width: 100, // emotionBadge와 동일 크기
    height: 110,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  objectImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 6,
  },
  objectLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // ... 나머지 스타일 동일 ...
  bgmContainer: {
    width: '100%', backgroundColor: '#EEF2FF', padding: 12, borderRadius: 12, marginBottom: 16, alignItems: 'center',
  },
  bgmLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  bgmLabelText: { fontSize: 14, color: '#6366F1', fontWeight: '700' },
  subLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4, marginLeft: 4 },
  keywordRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 12 },
  keywordChip: { backgroundColor: "#F3F4F6", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  keywordText: { fontSize: 13, fontWeight: "600", color: "#4B5563" },
  summaryText: { fontSize: 14, color: "#6B7280", fontStyle: 'italic', textAlign: 'center', marginBottom: 6, paddingHorizontal: 10 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 26, color: "#374151" },
});