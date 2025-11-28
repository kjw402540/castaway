// src/screens/Home/components/EmotionResultCard.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// 감정 ID(0~4) 매핑
const EMOTION_MAP = {
  0: { label: "화남/혐오", icon: "emoticon-angry-outline", color: "#EF4444" },
  1: { label: "기쁨", icon: "emoticon-happy-outline", color: "#F59E0B" },
  2: { label: "평온함", icon: "emoticon-neutral-outline", color: "#10B981" },
  3: { label: "슬픔", icon: "emoticon-sad-outline", color: "#3B82F6" },
  4: { label: "놀람/불안", icon: "emoticon-confused-outline", color: "#8B5CF6" },
};

export default function EmotionResultCard({ emotionResult }) {
  if (!emotionResult) return null;

  const { main_emotion, keyword_1, keyword_2, keyword_3, summary_text } = emotionResult;
  
  // 데이터가 없을 경우 기본값(평온함) 처리
  const emotionInfo = EMOTION_MAP[main_emotion] || EMOTION_MAP[2];
  
  // 키워드 배열로 변환 (null 제외)
  const keywords = [keyword_1, keyword_2, keyword_3].filter(k => k);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>오늘의 감정 분석</Text>
        <MaterialCommunityIcons name="auto-fix" size={16} color="#6B7280" />
      </View>

      {/* 감정 아이콘 & 텍스트 */}
      <View style={styles.emotionRow}>
        <MaterialCommunityIcons 
          name={emotionInfo.icon} 
          size={36} 
          color={emotionInfo.color} 
        />
        <View style={styles.emotionTextContainer}>
          <Text style={styles.mainEmotionText}>
            오늘의 기분은 <Text style={{ color: emotionInfo.color }}>{emotionInfo.label}</Text> 이네요.
          </Text>
          {summary_text ? (
            <Text style={styles.subText} numberOfLines={2}>{summary_text}</Text>
          ) : null}
        </View>
      </View>

      {/* 키워드 칩 */}
      {keywords.length > 0 && (
        <View style={styles.keywordContainer}>
          {keywords.map((k, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>#{k}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)", // 살짝 반투명
    borderRadius: 20,
    padding: 20,
    // 그림자 효과
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  emotionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  emotionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  mainEmotionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
});