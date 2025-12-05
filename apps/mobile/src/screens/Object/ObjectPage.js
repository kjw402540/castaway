// src/pages/Main/ObjectsPage.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  getAllObjects,
  deleteObject,
  getObjectImageUrl,
} from "../../services/objectService";

import DiaryViewModal from "../Diary/DiaryViewModal";
import ObjectDetailModal from "./ObjectDetailModal";
import { useBackExit } from "../../hooks/useBackExit";
import { useNavigation } from "@react-navigation/native";
import { getDiaryByDate } from "../../services/diaryService";

// 감정 ID를 텍스트로 변환하는 맵
const EMOTION_MAP = {
  0: "Anger & Disgust", // 분노/혐오
  1: "Joy & Happiness", // 기쁨
  2: "Neutral",         // 중립
  3: "Sadness",         // 슬픔
  4: "Surprise & Fear", // 놀람/공포
};

// ▼ [추가] UTC 시간을 한국 시간(KST) 날짜 문자열(YYYY-MM-DD)로 변환하는 함수
const getKSTDateString = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ObjectsPage() {
  const [groups, setGroups] = useState({});
  const [flatList, setFlatList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [diaryModalVisible, setDiaryModalVisible] = useState(false);
  const [diaryDate, setDiaryDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentDiary, setCurrentDiary] = useState(null);
  
  const navigation = useNavigation();
  useBackExit();

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    setLoading(true);
    const data = await getAllObjects();
    
    // 1. 데이터 가공 (DB 포맷 -> UI 포맷)
    const processedList = data.map((item) => {
        const emotionCode = item.emotion ? item.emotion.main_emotion : 2; 
        const emotionLabel = EMOTION_MAP[emotionCode] || "Unknown";
        
        // ▼▼▼ [수정] 날짜 로직 개선 ▼▼▼
        // 1. 일기(diary) 정보가 있으면 그 날짜를 우선 사용
        // 2. KST 변환 함수를 거쳐서 "어제 날짜"로 나오는 문제 해결
        const targetDateStr = item.diary ? item.diary.created_date : item.created_date;
        const displayDate = getKSTDateString(targetDateStr);

        return {
            id: item.object_id,
            date: displayDate, // 수정된 날짜 적용
            imageUrl: getObjectImageUrl(item.object_image),
            emotion: emotionLabel,
            rawItem: item, 
        };
    });

    setFlatList(processedList);

    // 2. 감정별 그룹화
    const grouped = {};
    processedList.forEach((item) => {
      if (!grouped[item.emotion]) grouped[item.emotion] = [];
      grouped[item.emotion].push(item);
    });

    setGroups(grouped);
    setLoading(false);
  };

  // 이전 오브제 보기
  const handlePrev = () => {
    if (!selectedItem) return;
    const idx = flatList.findIndex((i) => i.id === selectedItem.id);
    if (idx > 0) setSelectedItem(flatList[idx - 1]);
  };

  // 다음 오브제 보기
  const handleNext = () => {
    if (!selectedItem) return;
    const idx = flatList.findIndex((i) => i.id === selectedItem.id);
    if (idx < flatList.length - 1) setSelectedItem(flatList[idx + 1]);
  };

  // 삭제
  const handleDelete = async (id) => {
    await deleteObject(id);
    await loadObjects(); 
    setSelectedItem(null);
  };

  // 일기 조회 핸들러
  const handleOpenDiary = async (date) => {
    try {
      // 1. 오브제 상세 모달 닫기
      setSelectedItem(null);
      setLoading(true);

      // 2. [병렬 실행] API 요청 + 최소 딜레이
      // 300ms -> 100ms로 단축 (훨씬 빨라짐)
      const [diaryData] = await Promise.all([
        getDiaryByDate(date),
        new Promise(resolve => setTimeout(resolve, 100)) 
      ]);

      // 3. 데이터 세팅 및 모달 오픈
      setCurrentDiary(diaryData);
      setDiaryDate(date);
      setDiaryModalVisible(true);

    } catch (error) {
      console.error("일기 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlace = () => {
    console.log("섬 배치 기능은 추후 구현");
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.imageContainer}>
          {item.imageUrl ? (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.objectImage} 
                resizeMode="cover"
              />
          ) : (
              <Text style={styles.noImageText}>No Image</Text>
          )}
      </View>
      
      <Text style={styles.date}>{item.date}</Text>

      <View style={styles.playButton}>
        <Text style={styles.playIcon}>●</Text> 
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {loading && <ActivityIndicator size="large" color="#0B2A40" style={{marginTop: 20}} />}

      {!loading && Object.entries(groups).map(([emotion, items]) => (
        <View key={emotion} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {emotion} <Text style={styles.count}>{items.length}</Text>
          </Text>

          <FlatList
            data={items}
            horizontal
            keyExtractor={(i) => String(i.id)}
            renderItem={renderCard}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 14 }}
          />
        </View>
      ))}

      {/* 오브제 상세 모달 */}
      {selectedItem && (
        <ObjectDetailModal
          visible={true}
          object={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          onOpenDiary={() => handleOpenDiary(selectedItem.date)}
          onPlace={handlePlace}
          onDeleteRequest={() => handleDelete(selectedItem.id)}
        />
      )}

      {/* 일기 모달 */}
      <DiaryViewModal
        visible={diaryModalVisible}
        dateString={diaryDate}
        onClose={() => setDiaryModalVisible(false)}
        initialData={currentDiary}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D8FF",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B2A40",
    marginBottom: 12,
  },
  count: {
    fontSize: 16,
    color: "#4A5B6C",
  },
  card: {
    width: 120,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
  },
  objectImage: {
      width: '100%',
      height: '100%',
  },
  noImageText: {
      color: '#ccc',
      fontSize: 12,
  },
  date: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
    fontWeight: "600",
  },
  playButton: {
    marginTop: 2,
  },
  playIcon: {
    color: "#A7D8FF",
    fontSize: 10,
  },
});