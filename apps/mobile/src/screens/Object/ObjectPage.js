import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image, // 👈 이미지 컴포넌트 추가
  ActivityIndicator,
} from "react-native";

import {
  getAllObjects,
  deleteObject,
  getObjectImageUrl, // 👈 URL 생성 함수 import
} from "../../services/objectService";

import DiaryViewModal from "../Diary/DiaryViewModal";
import ObjectDetailModal from "./ObjectDetailModal";
import { useBackExit } from "../../hooks/useBackExit";
import { useNavigation } from "@react-navigation/native";

// 감정 ID를 텍스트로 변환하는 맵
const EMOTION_MAP = {
  0: "Anger & Disgust", // 분노/혐오
  1: "Joy & Happiness", // 기쁨
  2: "Neutral",         // 중립
  3: "Sadness",         // 슬픔
  4: "Surprise & Fear", // 놀람/공포
};

export default function ObjectsPage() {
  const [groups, setGroups] = useState({});
  const [flatList, setFlatList] = useState([]); // 전체 리스트 (앞뒤 이동용)
  const [selectedItem, setSelectedItem] = useState(null);
  const [diaryModalVisible, setDiaryModalVisible] = useState(false);
  const [diaryDate, setDiaryDate] = useState(null);
  const [loading, setLoading] = useState(false);

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
        // item.emotion이 없을 수도 있으므로 안전하게 처리
        const emotionCode = item.emotion ? item.emotion.main_emotion : 2; 
        const emotionLabel = EMOTION_MAP[emotionCode] || "Unknown";
        
        return {
            id: item.object_id,
            date: item.created_date.split('T')[0], // YYYY-MM-DD
            imageUrl: getObjectImageUrl(item.object_image), // 이미지 URL 생성
            emotion: emotionLabel,
            rawItem: item, // 원본 데이터 보존
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
    await loadObjects(); // 목록 새로고침
    setSelectedItem(null);
  };

  const handleOpenDiary = (date) => {
    setSelectedItem(null);
    setDiaryDate(date);
    setDiaryModalVisible(true);
  };

  const handlePlace = () => {
    console.log("섬 배치 기능은 추후 구현");
  };

  // 카드 렌더링 (이미지 표시)
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

      {/* 재생 버튼 아이콘 (오브제 느낌을 위해 유지하거나 제거 가능) */}
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

      {/* 상세 모달 */}
      {selectedItem && (
        <ObjectDetailModal
          visible={true}
          object={selectedItem} // 상세 모달에서도 imageUrl 사용 가능
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
    height: 150, // 이미지 때문에 높이 약간 증가
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