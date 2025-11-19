// src/screens/Music/MusicPage.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

import { getAllMusic } from "./MusicService";
import MusicDetailModal from "./MusicDetailModal";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music</Text>

      <FlatList
        data={musicList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.icon}>{item.icon}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.emotion}>{item.emotion}</Text>
            </View>

            <Text style={styles.duration}>{item.duration}</Text>
          </TouchableOpacity>
        )}
      />

      <MusicDetailModal
        visible={!!selected}
        music={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D8FF",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  emotion: {
    color: "#6B7280",
    marginTop: 2,
    fontSize: 13,
  },
  duration: {
    fontSize: 12,
    color: "#6B7280",
  },
});
