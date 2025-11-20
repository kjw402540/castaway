// src/screens/Music/MusicPage.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { getAllMusic } from "./MusicService";
import MusicDetailModal from "./MusicDetailModal";

const { width } = Dimensions.get("window");

export default function MusicPage() {
  const [musicList, setMusicList] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadMusic();
  }, []);

  const loadMusic = async () => {
    const data = await getAllMusic();
    setMusicList(data);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelected(item)}
      activeOpacity={0.9}
    >
      <View
        style={[
          styles.coverArt,
          { backgroundColor: getEmotionColor(item.emotion) },
        ]}
      >
        <Text style={styles.icon}>{item.icon}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.date}>2025.11.09</Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>#{item.emotion}</Text>
          <Text style={styles.tagText}>#AI추천</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Audio Archive</Text>
      <Text style={styles.subHeader}>감정의 조각들을 모아뒀어요.</Text>

      <FlatList
        data={musicList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />

      <MusicDetailModal
        visible={!!selected}
        music={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

// 감정 색상
const getEmotionColor = (emotion) => {
  switch (emotion) {
    case "joy":
      return "#FFF4E0";
    case "sadness":
      return "#E0F2F1";
    case "calm":
      return "#E3F2FD";
    default:
      return "#F3F4F6";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 25,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    width: (width - 50) / 2,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  coverArt: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 50,
  },
  infoContainer: {
    alignItems: "flex-start",
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagText: {
    fontSize: 11,
    color: "#3B82F6",
    marginRight: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
