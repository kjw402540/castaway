// src/screens/Home/components/HomePredictionCard.js

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// 기존 감정 카드와 동일한 매핑
const EMOTION_MAP = {
  0: { label: "화남/혐오", icon: "emoticon-angry-outline", color: "#EF4444" },
  1: { label: "기쁨", icon: "emoticon-happy-outline", color: "#F59E0B" },
  2: { label: "평온함", icon: "emoticon-neutral-outline", color: "#10B981" },
  3: { label: "슬픔", icon: "emoticon-sad-outline", color: "#3B82F6" },
  4: { label: "놀람/불안", icon: "emoticon-confused-outline", color: "#8B5CF6" },
};

// 👇 [핵심] 이제 props로 prediction 데이터를 받습니다!
export default function HomePredictionCard({ prediction }) {
  // 데이터가 없으면 아무것도 안 그림
  if (!prediction) return null;

  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  // 데이터 매핑
  const emotionInfo = EMOTION_MAP[prediction.emotion_id] || EMOTION_MAP[2];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: emotionInfo.color }]}>
          ☁️ 오늘의 감정 예보
        </Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <MaterialCommunityIcons
            name="close"
            size={20}
            color="#6B7280"
            style={{ padding: 4 }}
          />
        </TouchableOpacity>
      </View>

      {/* Emotion row */}
      <View style={styles.emotionRow}>
        <MaterialCommunityIcons
          name={emotionInfo.icon}
          size={36}
          color={emotionInfo.color}
        />
        <View style={styles.emotionTextContainer}>
          <Text style={styles.mainEmotionText}>
            오늘의 기분은{" "}
            <Text style={{ color: emotionInfo.color, fontWeight: "800" }}>
              {emotionInfo.label}
            </Text>{" "}
            이 될 것 같아요.
          </Text>

          <Text style={styles.subText} numberOfLines={2}>
            AI가 지난 기록을 분석해 미리 예측했어요.
          </Text>
        </View>
      </View>

      {/* Tag Chips */}
      <View style={styles.keywordContainer}>
         <View style={[styles.chip, { backgroundColor: emotionInfo.color + "22" }]}>
            <Text style={[styles.chipText, { color: emotionInfo.color }]}>
              #AI예측
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: emotionInfo.color + "22" }]}>
            <Text style={[styles.chipText, { color: emotionInfo.color }]}>
              #오늘의운세
            </Text>
          </View>
      </View>
    </View>
  );
}

// 스타일은 HomeEmotionCard와 100% 동일
const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  title: { fontSize: 13, fontWeight: "700" },
  emotionRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  emotionTextContainer: { marginLeft: 12, flex: 1 },
  mainEmotionText: { fontSize: 17, fontWeight: "700", color: "#1F2937" },
  subText: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  keywordContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 },
  chip: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 },
  chipText: { fontSize: 13, fontWeight: "600" },
});