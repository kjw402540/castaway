import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useReportModal } from "./hooks/useReportModal";
import { useHistoryReport } from "./hooks/useHistoryReport";
import HistoryReportModal from "./HistoryReportModal";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

export default function ReportPage() {
  const navigation = useNavigation();
  
  // ============================================================
  // 1. 모든 Hooks는 무조건 최상단에 선언 (순서 변경 절대 금지)
  // ============================================================
  const report = useReportModal();
  const historyList = useHistoryReport(); 
  
  // 아까 에러난 이유: 이 useState가 if문 밑에 있었을 확률이 높음
  const [historyVisible, setHistoryVisible] = useState(false);

  // ============================================================
  // 2. 데이터 가공 (Hooks 아님)
  // ============================================================
  const main = report.thisWeek?.top3?.[0] || { label: "분석 중", value: 0 };

  // ============================================================
  // 3. 로딩 및 예외 처리 (Hooks 선언이 다 끝난 뒤에 해야 함!)
  // ============================================================
  
  // 데이터가 없거나 로딩 중일 때 표시할 화면
  if (!report.thisWeek || !report.thisWeek.daily || report.thisWeek.daily.length === 0) {
     return (
       <SafeAreaView style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#3B82F6" />
         <Text style={styles.loadingText}>{report.summary || "리포트 분석 중..."}</Text>
       </SafeAreaView>
     );
  }

  /* ----------------------------------------------------
      PDF 공유 기능
  ---------------------------------------------------- */
  const shareReport = async () => {
    try {
      // PDF 디자인 HTML (기존과 동일하게 유지)
      const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    body { font-family: 'Pretendard', sans-serif; padding: 40px; color: #1f2937; }
    .header { border-bottom: 3px solid #111827; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 32px; font-weight: 900; }
    .date { font-size: 14px; color: #6b7280; }
    .summary-box { background: #f3f4f6; border-left: 6px solid #2563eb; padding: 20px; margin-bottom: 30px; }
    .summary-text { font-size: 18px; font-weight: 700; color: #1e3a8a; margin-bottom: 10px; }
    h3 { font-size: 20px; font-weight: 800; margin-top: 40px; border-left: 5px solid #2563eb; padding-left: 10px; }
    .ai-box { background: #eef2ff; padding: 20px; border-radius: 10px; line-height: 1.6; }
    .list-item { margin-bottom: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">주별 감정 리포트</div>
    <div class="date">AI Diary Analysis</div>
  </div>
  <div class="summary-box">
    <div class="summary-text">"${report.summary}"</div>
    <div>주요 감정: <strong>${main.label}</strong></div>
  </div>

  <h3>📊 주간 흐름</h3>
  <div style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;">
    ${report.thisWeek.daily.map(d => 
      `<div style="text-align: center;">
         <div style="width: 20px; height: 20px; background: ${d.color}; border-radius: 50%; margin: 0 auto 5px;"></div>
         <div style="font-size: 12px; color: #666;">${d.day}</div>
       </div>`
    ).join('')}
  </div>

  <h3>🔑 키워드</h3>
  <div>
    ${report.keywords.map(k => `<span style="background:#eff6ff; color:#1e40af; padding:5px 10px; border-radius:15px; margin-right:5px; font-weight:bold;">#${k}</span>`).join('')}
  </div>

  <h3>🤖 AI 상세 분석</h3>
  <div class="ai-box">${report.aiComment}</div>

  <h3>🔮 조언 및 예측</h3>
  <div style="background:#f9fafb; padding:20px; border-radius:10px;">
    ${report.prediction.map(p => `<div class="list-item">• ${p}</div>`).join('')}
  </div>
</body>
</html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      const newFileUri = FileSystem.documentDirectory + "Weekly_Report.pdf";
      await FileSystem.copyAsync({ from: uri, to: newFileUri });
      await Sharing.shareAsync(newFileUri);

    } catch (error) {
      console.error("PDF Error:", error);
      Alert.alert("오류", "리포트 공유 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>주별 리포트</Text>
          <TouchableOpacity onPress={shareReport}>
            <FontAwesome name="share-alt" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* 요약 멘트 */}
        <Text style={styles.summaryTop}>{report.summary}</Text>
        <Text style={styles.subSummary}>
          이번 주 주요 감정은 <Text style={styles.bold}>{main.label}</Text> {main.icon || "😊"} 입니다
        </Text>

        {/* 감정 그래프 카드 */}
        <View style={styles.card}>
          <View style={styles.emotionWeekRow}>
            {report.thisWeek.daily.map((d, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: d.color }]} />
            ))}
          </View>
          <View style={styles.emotionWeekRow}>
            {report.thisWeek.daily.map((d, i) => (
              <Text key={i} style={styles.dayLabel}>{d.day}</Text>
            ))}
          </View>
          <View style={styles.ratioRow}>
            {report.thisWeek.top3.map((t, i) => (
              <Text key={i} style={styles.ratioText}>{t.label} {t.value}%</Text>
            ))}
          </View>
        </View>

        {/* 키워드 */}
        <Text style={styles.sectionTitle}>이번 주 키워드</Text>
        <View style={styles.keywordBox}>
          {report.keywords.map((k, i) => (
            <View key={i} style={styles.keywordTag}>
              <Text style={styles.keywordText}>#{k}</Text>
            </View>
          ))}
        </View>

        {/* 감정 변화 포인트 */}
        <Text style={styles.sectionTitle}>감정 변화 포인트</Text>
        <View style={styles.changeBox}>
          {report.changePoints.map((c, idx) => (
            <Text key={idx} style={styles.changeText}>• {c}</Text>
          ))}
        </View>

        {/* 지난주 대비 */}
        <Text style={styles.sectionTitle}>지난주 대비 변화</Text>
        <View style={styles.diffRow}>
          {report.thisWeek.top3.map((t, i) => (
            <View key={i} style={styles.diffTag}>
              <Text style={styles.diffText}>
                {t.label} {report.compare[t.label] > 0 ? "+" : ""}{report.compare[t.label]}%
              </Text>
            </View>
          ))}
        </View>

        {/* AI 리포트 (총평) */}
        <Text style={styles.sectionTitle}>AI 리포트</Text>
        <View style={styles.aiBox}>
          <Text style={styles.aiText}>{report.aiComment}</Text>
        </View>

        {/* 다음 주 예측 */}
        <Text style={styles.sectionTitle}>다음 주 감정 예측</Text>
        <View style={styles.predictBox}>
          {report.prediction.map((p, idx) => (
            <Text key={idx} style={styles.predictText}>• {p}</Text>
          ))}
        </View>

        {/* 히스토리 버튼 */}
        <TouchableOpacity style={styles.historyButton} onPress={() => setHistoryVisible(true)}>
          <Text style={styles.historyText}>역대 리포트 보러가기</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 히스토리 모달 */}
      <HistoryReportModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        list={historyList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" },
  loadingText: { marginTop: 10, color: "#6B7280", fontSize: 14 },
  
  header: { marginTop: 5, marginBottom: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  summaryTop: { fontSize: 15, color: "#1E3A8A", fontWeight: "700", marginBottom: 8 },
  subSummary: { fontSize: 14, color: "#374151", marginBottom: 18 },
  bold: { fontWeight: "800" },
  card: { backgroundColor: "#F3F4F6", paddingVertical: 18, paddingHorizontal: 18, borderRadius: 14, alignItems: "center", marginBottom: 22 },
  emotionWeekRow: { flexDirection: "row", justifyContent: "space-between", width: "90%", marginBottom: 6 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  dayLabel: { fontSize: 11, color: "#6B7280", width: 20, textAlign: "center" },
  ratioRow: { flexDirection: "row", justifyContent: "center", gap: 18, marginTop: 10 },
  ratioText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1F2937", marginBottom: 10, marginTop: 6 },
  keywordBox: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  keywordTag: { backgroundColor: "#DBEAFE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  keywordText: { color: "#1E3A8A", fontWeight: "600" },
  changeBox: { backgroundColor: "#F1F5F9", padding: 14, borderRadius: 10, marginBottom: 22 },
  changeText: { fontSize: 13, color: "#475569", marginBottom: 4 },
  diffRow: { flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 22 },
  diffTag: { backgroundColor: "#E2E8F0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  diffText: { fontWeight: "600", color: "#334155" },
  aiBox: { backgroundColor: "#EEF2FF", padding: 14, borderRadius: 12, marginBottom: 22 },
  aiText: { color: "#374151", fontSize: 13, lineHeight: 19 },
  predictBox: { backgroundColor: "#F8FAFC", padding: 14, borderRadius: 12, marginBottom: 25 },
  predictText: { fontSize: 13, color: "#475569", marginBottom: 4 },
  historyButton: { backgroundColor: "#E0F2FE", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  historyText: { color: "#0369A1", fontWeight: "700", fontSize: 15 },
});