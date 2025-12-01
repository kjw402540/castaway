// src/screens/Home/components/HomeEmotionCard.js

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EMOTION_MAP = {
  0: { label: "화남/혐오", icon: "emoticon-angry-outline", color: "#EF4444" },
  1: { label: "기쁨", icon: "emoticon-happy-outline", color: "#F59E0B" },
  2: { label: "평온함", icon: "emoticon-neutral-outline", color: "#10B981" },
  3: { label: "슬픔", icon: "emoticon-sad-outline", color: "#3B82F6" },
  4: { label: "놀람/불안", icon: "emoticon-confused-outline", color: "#8B5CF6" },
};

export default function HomeEmotionCard({ emotionResult, onClose }) {
  if (!emotionResult) return null;

  const { main_emotion, keyword_1, keyword_2, keyword_3, summary_text } =
    emotionResult;

  const emotionInfo = EMOTION_MAP[main_emotion] || EMOTION_MAP[2];
  const keywords = [keyword_1, keyword_2, keyword_3].filter(Boolean);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: emotionInfo.color }]}>
          오늘의 감정 분석
        </Text>
        <TouchableOpacity onPress={onClose}>
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
            이네요.
          </Text>

          {summary_text && (
            <Text style={styles.subText} numberOfLines={2}>
              {summary_text}
            </Text>
          )}
        </View>
      </View>

      {/* Keywords */}
      {keywords.length > 0 && (
        <View style={styles.keywordContainer}>
          {keywords.map((k, i) => (
            <View
              key={i}
              style={[
                styles.chip,
                { backgroundColor: emotionInfo.color + "22" }, // 감정 색 투명
              ]}
            >
              <Text style={[styles.chipText, { color: emotionInfo.color }]}>
                #{k}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
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
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
