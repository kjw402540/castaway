// src/screens/Music/MusicDetailModal.js

import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function MusicDetailModal({ visible, music, onClose }) {
  if (!visible || !music) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>{music.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={22} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          <Text style={styles.icon}>{music.icon}</Text>
          <Text style={styles.emotion}>Emotion: {music.emotion}</Text>
          <Text style={styles.duration}>Duration: {music.duration}</Text>
          <Text style={styles.desc}>{music.description}</Text>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  icon: {
    fontSize: 42,
    textAlign: "center",
    marginVertical: 10,
  },
  emotion: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
  },
  duration: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    color: "#374151",
    marginTop: 10,
  },
});
