// src\screens\Home\components\HomeBanner.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeBanner({ status, onClose }) {
  // no_diary가 아니면 렌더 자체를 하지 않음
  if (status !== "no_diary") return null;

  const title = "오늘 일기를 아직 안 썼어요";
  const sub = "일기를 쓰면 감정 분석과 오브제가 생성돼요.";

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  closeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  closeText: {
    fontSize: 18,
    color: "#6B7280",
  },
});
