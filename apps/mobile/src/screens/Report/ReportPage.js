import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

import { useReportModal } from "./hooks/useReportModal";

export default function ReportPage({ navigation }) {
  const report = useReportModal();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <FontAwesome name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>주별 리포트</Text>
          <View style={{ width: 20 }} />
        </View>

        {/* 요약 */}
        <Text style={styles.summaryText}>{report.summary}</Text>

        {/* 감정 변화 */}
        <Text style={styles.sectionTitle}>감정 변화</Text>
        <Text style={styles.comment}>
          월요일에는 중립적인 감정이 많았고, 주중에는 기쁨이 점점 늘어났습니다. 금요일 이후에는 감정의 진폭이 줄며 차분한 상태를 유지했습니다.
        </Text>

        {/* 감정 분포 */}
        <Text style={styles.sectionTitle}>감정 분포</Text>
        <View style={styles.emotionBox}>
          {report.emotions.map((emo, i) => (
            <View key={emo} style={styles.emotionRow}>
              <Text style={styles.emotionLabel}>{emo}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${report.values[i]}%` }]} />
              </View>
              <Text style={styles.valueText}>{report.values[i]}%</Text>
            </View>
          ))}
        </View>

        {/* AI 리포트 */}
        <Text style={styles.sectionTitle}>AI 리포트</Text>
        <Text style={styles.comment}>{report.aiComment}</Text>

        {/* 메인으로 돌아가기 */}
        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: "#3B82F6" }]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.mainBtnText}>메인으로 돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  summaryText: { fontSize: 16, marginVertical: 10, color: "#1E3A8A", fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#111827", marginTop: 20, marginBottom: 10 },
  emotionBox: { marginTop: 5 },
  emotionRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  emotionLabel: { width: 60, fontWeight: "600", color: "#374151" },
  barTrack: { flex: 1, height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, marginHorizontal: 8 },
  barFill: { height: 8, borderRadius: 4, backgroundColor: "#60A5FA" },
  valueText: { width: 40, textAlign: "right", color: "#6B7280" },
  comment: { color: "#374151", backgroundColor: "#F3F4F6", padding: 12, borderRadius: 10, lineHeight: 20 },
  mainBtn: { marginTop: 30, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  mainBtnText: { color: "white", fontWeight: "600", fontSize: 15 },
});
