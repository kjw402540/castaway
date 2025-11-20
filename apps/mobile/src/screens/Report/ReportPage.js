import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useReportModal } from "./hooks/useReportModal";
import { useHistoryReport } from "./hooks/useHistoryReport";
import HistoryReportModal from "./HistoryReportModal";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
// [SDK 52 대응] legacy 모듈
import * as FileSystem from "expo-file-system/legacy";

export default function ReportPage() {
  const navigation = useNavigation();
  const report = useReportModal();
  const historyList = useHistoryReport();

  const main = report.thisWeek?.top3?.[0] || { label: "분석 중", value: 0 };
  const [historyVisible, setHistoryVisible] = useState(false);

  /* ----------------------------------------------------
      PDF 공유 기능 (A4 풀 사이즈 문서 디자인)
  ---------------------------------------------------- */
  const shareReport = async () => {
    try {
      const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

    /* [핵심 변경] A4 용지에 맞춘 문서 스타일 */
    body {
      font-family: 'Pretendard', -apple-system, sans-serif;
      background-color: #ffffff; /* 전체 흰색 배경 */
      margin: 0;
      padding: 40px 50px; /* A4 여백 확보 */
      color: #1f2937;
    }

    /* 헤더 영역 */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 3px solid #111827;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 32px; /* 제목 크게 */
      font-weight: 900;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .date {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }

    /* 요약 섹션 (강조 박스) */
    .summary-box {
      background-color: #f3f4f6;
      border-left: 6px solid #2563eb; /* 파란색 포인트 */
      padding: 20px 25px;
      border-radius: 4px;
      margin-bottom: 35px;
    }
    .summary-text {
      font-size: 18px;
      line-height: 1.6;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 10px;
    }
    .main-emotion {
      font-size: 16px;
      color: #4b5563;
    }
    .highlight {
      color: #111827;
      font-weight: 900;
      font-size: 18px;
    }

    /* 섹션 제목 */
    h3 {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      margin-top: 40px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    h3::before {
      content: '';
      display: block;
      width: 6px;
      height: 20px;
      background-color: #2563eb;
      margin-right: 10px;
      border-radius: 3px;
    }

    /* 감정 맵 카드 (너비 꽉 채우기) */
    .card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
    }
    
    /* 점들을 중앙 정렬하고 간격 넓힘 */
    .week-row {
      display: flex;
      justify-content: space-around; /* 균등 분배 */
      align-items: center;
      margin-bottom: 20px;
      max-width: 500px; /* 점들이 너무 퍼지지 않게 중앙 제한 */
      margin-left: auto;
      margin-right: auto;
    }
    .day-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .dot {
      width: 24px; /* 점 크기 확대 */
      height: 24px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .day-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 600;
    }

    /* 비율 텍스트 */
    .ratio-row {
      display: flex;
      justify-content: center;
      gap: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .ratio-text {
      font-size: 16px;
      font-weight: 700;
      color: #374151;
    }

    /* 그리드 레이아웃 (키워드 & 지난주 대비를 나란히) */
    .grid-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    /* 키워드 태그 */
    .keyword-box {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .keyword-tag {
      background-color: #eff6ff;
      color: #1e40af;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      border: 1px solid #dbeafe;
    }

    /* 박스 리스트 스타일 (회색 박스) */
    .list-box {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #f3f4f6;
    }
    .list-item {
      font-size: 15px;
      margin-bottom: 8px;
      color: #4b5563;
      line-height: 1.5;
    }

    /* 지난주 대비 태그 */
    .diff-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .diff-tag {
      background-color: #f1f5f9;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #334155;
    }

    /* AI 리포트 */
    .ai-box {
      background-color: #eef2ff;
      padding: 25px;
      border-radius: 12px;
      font-size: 15px;
      line-height: 1.8;
      color: #374151;
      border: 1px solid #e0e7ff;
      text-align: justify;
    }

    /* 푸터 */
    .footer {
      margin-top: 60px;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      border-top: 1px solid #f3f4f6;
      padding-top: 20px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="title">주별 감정 리포트</div>
    <div class="date">AI Diary Analysis</div>
  </div>

  <div class="summary-box">
    <div class="summary-text">"${report.summary}"</div>
    <div class="main-emotion">
      이번 주를 지배한 감정: <span class="highlight">${main.label}</span> 😊
    </div>
  </div>

  <h3>📊 주간 감정 흐름</h3>
  <div class="card">
    <div class="week-row">
      ${report.thisWeek.daily.map(d => `
        <div class="day-col">
          <div class="dot" style="background-color: ${d.color};"></div>
          <div class="day-label">${d.day}</div>
        </div>
      `).join('')}
    </div>
    <div class="ratio-row">
      ${report.thisWeek.top3.map(t => `
        <div class="ratio-text">${t.label} ${t.value}%</div>
      `).join('')}
    </div>
  </div>

  <div class="grid-section">
    <div>
      <h3>🔑 이번 주 키워드</h3>
      <div class="keyword-box">
        ${report.keywords.map(k => `<span class="keyword-tag">#${k}</span>`).join('')}
      </div>
    </div>

    <div>
      <h3>📉 지난주 대비 변화</h3>
      <div class="diff-row">
        ${report.thisWeek.top3.map(t => {
          const diff = report.compare[t.label];
          const sign = diff > 0 ? "+" : "";
          return `<div class="diff-tag">${t.label} ${sign}${diff}%</div>`;
        }).join('')}
      </div>
    </div>
  </div>

  <h3>📍 감정 변화 포인트</h3>
  <div class="list-box">
    ${report.changePoints.map(c => `<div class="list-item">• ${c}</div>`).join('')}
  </div>

  <h3>🤖 AI 상세 분석</h3>
  <div class="ai-box">
    ${report.aiComment}
  </div>

  <h3>🔮 다음 주 예측</h3>
  <div class="list-box">
    ${report.prediction.map(p => `<div class="list-item">• ${p}</div>`).join('')}
  </div>

  <div class="footer">
    본 리포트는 AI Diary에 의해 자동 생성되었습니다. <br/>
    당신의 소중한 기록이 더 나은 내일을 만듭니다.
  </div>

</body>
</html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      
      // SDK 52 파일 복사 로직 유지
      const newFileUri = FileSystem.documentDirectory + "Weekly_Report.pdf";
      await FileSystem.copyAsync({ from: uri, to: newFileUri });

      await Sharing.shareAsync(newFileUri);

    } catch (error) {
      console.error("PDF Error:", error);
      Alert.alert("오류", "리포트 생성 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* 앱 화면 UI는 기존 그대로 유지 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>주별 리포트</Text>
          <TouchableOpacity onPress={shareReport}>
            <FontAwesome name="share-alt" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <Text style={styles.summaryTop}>{report.summary}</Text>
        <Text style={styles.subSummary}>
          이번 주 주요 감정은 <Text style={styles.bold}>{main.label}</Text> 😊 입니다
        </Text>

        <View style={styles.card}>
          <View style={styles.emotionWeekRow}>
            {report.thisWeek.daily.map((d) => (
              <View key={d.day} style={[styles.dot, { backgroundColor: d.color }]} />
            ))}
          </View>
          <View style={styles.emotionWeekRow}>
            {report.thisWeek.daily.map((d) => (
              <Text key={d.day} style={styles.dayLabel}>{d.day}</Text>
            ))}
          </View>
          <View style={styles.ratioRow}>
            {report.thisWeek.top3.map((t) => (
              <Text key={t.label} style={styles.ratioText}>{t.label} {t.value}%</Text>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>이번 주 키워드</Text>
        <View style={styles.keywordBox}>
          {report.keywords.map((k) => (
            <View key={k} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{k}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>감정 변화 포인트</Text>
        <View style={styles.changeBox}>
          {report.changePoints.map((c, idx) => (
            <Text key={idx} style={styles.changeText}>• {c}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>지난주 대비 변화</Text>
        <View style={styles.diffRow}>
          {report.thisWeek.top3.map((t) => (
            <View key={t.label} style={styles.diffTag}>
              <Text style={styles.diffText}>
                {t.label} {report.compare[t.label] > 0 ? "+" : ""}{report.compare[t.label]}%
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>AI 리포트</Text>
        <View style={styles.aiBox}>
          <Text style={styles.aiText}>{report.aiComment}</Text>
        </View>

        <Text style={styles.sectionTitle}>다음 주 감정 예측</Text>
        <View style={styles.predictBox}>
          {report.prediction.map((p, idx) => (
            <Text key={idx} style={styles.predictText}>• {p}</Text>
          ))}
        </View>

        <TouchableOpacity style={styles.historyButton} onPress={() => setHistoryVisible(true)}>
          <Text style={styles.historyText}>역대 리포트 보러가기</Text>
        </TouchableOpacity>

      </ScrollView>

      <HistoryReportModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        list={historyList}
      />
    </SafeAreaView>
  );
}

/* 앱 UI 스타일 (변경 없음) */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
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