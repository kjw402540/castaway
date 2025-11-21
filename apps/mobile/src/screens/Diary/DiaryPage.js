import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBackExit } from "../../hooks/useBackExit";

import Calendar from "./components/Calendar";
import SummaryBox from "./components/SummaryBox";

import { getAllDiaries, deleteDiary } from "../../services/diaryService";

// 모달들
import DiaryViewModal from "./DiaryViewModal";
import DiaryWriteModal from "./DiaryWriteModal";

/* ---------------------------------------------------------
   ★ 한국 기준 YYYY-MM-DD (UTC 완전 차단 버전)
   --------------------------------------------------------- */
function getLocalYMD(date = new Date()) {
  // ❌ 여기 있던 toISOString() 들어간 함수 삭제

  // ⬇️ 이걸로 교체
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${y}-${pad(m)}-${pad(d)}`;
}


export default function DiaryPage() {
  const navigation = useNavigation();
  useBackExit();

  // ★ 오늘 날짜 (UTC 쓰지 않음)
  const today = getLocalYMD();

  // ★ 선택된 날짜 초기값도 로컬 기준
  const [selectedDate, setSelectedDate] = useState(today);

  const [diaryMap, setDiaryMap] = useState({});

  const [viewVisible, setViewVisible] = useState(false);
  const [writeVisible, setWriteVisible] = useState(false);

  /* ---------------------------------------------------------
     일기 전체 불러오기
     --------------------------------------------------------- */
  useEffect(() => {
    getAllDiaries().then((data) => setDiaryMap(data));
  }, []);

  
  /* ---------------------------------------------------------
     ★ markedDates 생성 (선택 날짜 + 작성된 날짜 표시)
     --------------------------------------------------------- */
  const marked = {};

  // 선택 날짜 강조
  marked[selectedDate] = {
    customStyles: {
      container: {
        backgroundColor: "#1E3A8A",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
      },
      text: {
        color: "#fff",
        fontWeight: "700",
      },
    },
  };

  // 작성된 날짜들 강조
  Object.keys(diaryMap).forEach((date) => {
    if (date === selectedDate) return;
    marked[date] = {
      customStyles: {
        container: {
          backgroundColor: "#C7D9FF",
          width: 28,
          height: 28,
          borderRadius: 14,
          justifyContent: "center",
          alignItems: "center",
        },
        text: { color: "#1E3A8A", fontWeight: "600" },
      },
    };
  });

  /* ---------------------------------------------------------
     ★ 날짜 이동 함수 (이전/다음 버튼)
     --------------------------------------------------------- */
  const moveDate = (step) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + step);

    const newDate = getLocalYMD(cur);

    if (newDate > today) return; // 미래는 이동 금지
    setSelectedDate(newDate);
  };

  /* ---------------------------------------------------------
     날짜별 일기
     --------------------------------------------------------- */
  const diaryData = diaryMap[selectedDate];
  const diaryText = diaryData?.text || "";
  const diaryExists = !!diaryText;

  /* ---------------------------------------------------------
     삭제
     --------------------------------------------------------- */
  const handleDelete = async () => {
    await deleteDiary(selectedDate);
    const updated = { ...diaryMap };
    delete updated[selectedDate];
    setDiaryMap(updated);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 캘린더 */}
        <View style={styles.card}>
          <Calendar
            selected={selectedDate}
            markedDates={marked}
            maxDate={today}
            onSelectDate={(day) => {
              const local = getLocalYMD(new Date(day.dateString)); 
              setSelectedDate(local);
            }}
          />
        </View>

        {/* 요약 박스 */}
        <SummaryBox
          date={selectedDate}
          diaryText={diaryText}
          diaryExists={diaryExists}
          onWrite={() => setWriteVisible(true)}
          onOpenFull={() => setViewVisible(true)}
          onEdit={() => setWriteVisible(true)}
          onDelete={handleDelete}
          onMoveDate={moveDate}
          isNextDisabled={selectedDate >= today}
        />

        {/* 리포트 버튼 */}
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={styles.reportButtonText}>지난주 주별 리포트 보기</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 일기 전체보기 */}
      <DiaryViewModal
        visible={viewVisible}
        dateString={selectedDate}
        onClose={() => setViewVisible(false)}
      />

      {/* 작성/수정 */}
      <DiaryWriteModal
        visible={writeVisible}
        dateString={selectedDate}
        initialText={diaryText}
        onClose={() => setWriteVisible(false)}
        onSaved={async () => {
          setWriteVisible(false);
          const updated = await getAllDiaries();
          setDiaryMap(updated);
        }}
      />
    </View>
  );
}

/* ---------------------------------------------------------
   스타일
   --------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BEE1FF",
    paddingTop: 20,
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  reportButton: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#254F87",
    borderRadius: 12,
    alignItems: "center",
  },

  reportButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
