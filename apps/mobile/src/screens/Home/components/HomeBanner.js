import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeBanner({ status, onClose }) {
  let title = "";
  let sub = "";

  if (status === "no_diary") {
    title = "오늘 일기를 아직 안 썼어요";
    sub = "일기를 쓰면 감정 분석과 오브제가 생성돼요.";
  } else if (status === "analyzing") {
    title = "감정 분석 중...";
    sub = "잠시만 기다려주세요.";
  } else if (status === "object_created") {
    title = "새 오브제가 도착했어요";
    sub = "오늘 생성된 오브제를 확인해보세요.";
  } else if (status === "done") {
    title = "감정 분석 완료";
  }

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {sub !== "" && <Text style={styles.sub}>{sub}</Text>}
      </View>

      {/* 닫기 버튼만 존재 */}
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
