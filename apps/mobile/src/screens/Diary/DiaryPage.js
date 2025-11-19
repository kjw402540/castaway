import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import PageTitle from "../../components/common/PageTitle";
import Calendar from "./components/Calendar";
import DiaryViewModal from "./DiaryViewModal";
import { getAllDiaries } from "./DiaryService";

export default function DiaryPage() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [viewVisible, setViewVisible] = useState(false);
  const [diaryMap, setDiaryMap] = useState({});

  useEffect(() => {
    getAllDiaries().then((data) => setDiaryMap(data));
  }, []);

  // === markedDates 생성 ===
  const marked = {};

  // 1) 선택된 날짜
  marked[selectedDate] = {
    customStyles: {
      container: {
        backgroundColor: "#1E3A8A",
        borderRadius: 20,
      },
      text: {
        color: "#FFFFFF",
        fontWeight: "700",
      },
    },
  };

  // 2) 일기 있는 날짜 → 작은 원
  Object.keys(diaryMap).forEach((date) => {
    // 선택된 날짜 이미 처리했으면 skip
    if (date === selectedDate) return;

    marked[date] = {
      customStyles: {
        container: {
          backgroundColor: "#C7D9FF",
          width: 28,
          height: 28,
          borderRadius: 14,
          alignSelf: "center",
          justifyContent: "center",
        },
        text: {
          color: "#1E3A8A",
          fontWeight: "600",
        },
      },
    };
  });

  return (
    <View style={styles.container}>
      <PageTitle icon="calendar" title="Calendar" />

      <View style={styles.card}>
        <Calendar
          selected={selectedDate}
          markedDates={marked}
          onSelectDate={(day) => {
            setSelectedDate(day.dateString);
            setViewVisible(true);
          }}
        />
      </View>

      <DiaryViewModal
        visible={viewVisible}
        dateString={selectedDate}
        onClose={() => setViewVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BEE1FF",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
