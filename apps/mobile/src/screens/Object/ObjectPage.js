import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  getAllObjects,
  deleteObject,
} from "../../services/objectService";

import DiaryViewModal from "../Diary/DiaryViewModal";
import ObjectDetailModal from "./ObjectDetailModal";
import { useBackExit } from "../../hooks/useBackExit";
import { useNavigation } from "@react-navigation/native";

export default function ObjectsPage() {
  const [groups, setGroups] = useState({});
  const [flatList, setFlatList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [diaryModalVisible, setDiaryModalVisible] = useState(false);
  const [diaryDate, setDiaryDate] = useState(null);

  const navigation = useNavigation();

  useBackExit();

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    const list = await getAllObjects();

    setFlatList(list);

    const grouped = {};
    list.forEach((item) => {
      if (!grouped[item.emotion]) grouped[item.emotion] = [];
      grouped[item.emotion].push(item);
    });

    setGroups(grouped);
  };

  // 이전
  const handlePrev = () => {
    if (!selectedItem) return;
    const idx = flatList.findIndex((i) => i.id === selectedItem.id);
    if (idx > 0) setSelectedItem(flatList[idx - 1]);
  };

  // 다음
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

  // 일기 이동 -> 일기 모달 바로 띄우기
  const handleOpenDiary = (date) => {
    setSelectedItem(null);        
    setDiaryDate(date);           
    setDiaryModalVisible(true);   
  };

  // 섬 배치 (나중에 구현)
  const handlePlace = () => {
    console.log("섬 배치 기능은 추후 구현");
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => setSelectedItem(item)}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.date}>{item.date}</Text>

      <View style={styles.playButton}>
        <Text style={styles.playIcon}>▶</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {Object.entries(groups).map(([emotion, items]) => (
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

      {selectedItem && (
        <ObjectDetailModal
          visible={true}
          object={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          onOpenDiary={() => handleOpenDiary(selectedItem.date)}
          onPlace={handlePlace}
          onSaveAudio={() => {}}
          onDeleteRequest={() => handleDelete(selectedItem.id)}
        />
      )}

    <DiaryViewModal
      visible={diaryModalVisible}
      dateString={diaryDate}              
      onClose={() => setDiaryModalVisible(false)}
      onEdit={undefined}                   
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
    height: 130,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  emoji: {
    fontSize: 36,
    marginTop: 2,
  },

  date: {
    fontSize: 11,
    color: "#8A8F99",
    marginTop: 2,
  },

  playButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  playIcon: {
    color: "#0C2F55",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 2,
  },
});
