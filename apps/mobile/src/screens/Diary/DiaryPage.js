// src/screens/Diary/DiaryPage.js
import React, { useEffect, useState } from "react";
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

import {
  getAllDiaries,
  deleteDiary,
  subscribeDiaryUpdate,
} from "../../services/diaryService";

import DiaryViewModal from "./DiaryViewModal";
import DiaryWriteModal from "./DiaryWriteModal";

function getLocalYMD(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
}

export default function DiaryPage() {
  const navigation = useNavigation();
  useBackExit();

  const today = getLocalYMD();
  const [selectedDate, setSelectedDate] = useState(today);
  const [diaryMap, setDiaryMap] = useState({});

  const [viewVisible, setViewVisible] = useState(false);
  const [writeVisible, setWriteVisible] = useState(false);

  useEffect(() => {
    getAllDiaries().then((data) => setDiaryMap(data));
  }, []);

  useEffect(() => {
    const unsub = subscribeDiaryUpdate(() => {
      getAllDiaries().then((data) => setDiaryMap(data));
    });
    return unsub;
  }, []);

  const diary = diaryMap[selectedDate];
  const diaryText = diary?.text || "";
  const diaryExists = !!diaryText;

  const handleDelete = async () => {
    await deleteDiary(selectedDate);
  };

  const marked = {};
  marked[selectedDate] = {
    customStyles: {
      container: { backgroundColor: "#1E3A8A", borderRadius: 14 },
      text: { color: "#fff" },
    },
  };

  Object.keys(diaryMap).forEach((d) => {
    if (d !== selectedDate) {
      marked[d] = {
        customStyles: {
          container: { backgroundColor: "#C7D9FF", borderRadius: 14 },
          text: { color: "#1E3A8A" },
        },
      };
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          <Calendar
            selected={selectedDate}
            markedDates={marked}
            maxDate={today}
            onSelectDate={(day) =>
              setSelectedDate(getLocalYMD(new Date(day.dateString)))
            }
          />
        </View>

        <SummaryBox
          date={selectedDate}
          diaryText={diaryText}
          diaryExists={diaryExists}
          onWrite={() => setWriteVisible(true)}
          onOpenFull={() => setViewVisible(true)}
          onEdit={() => setWriteVisible(true)}
          onDelete={handleDelete}
          onMoveDate={(step) => {
            const cur = new Date(selectedDate);
            cur.setDate(cur.getDate() + step);
            const newDate = getLocalYMD(cur);
            if (newDate > today) return;
            setSelectedDate(newDate);
          }}
          isNextDisabled={selectedDate >= today}
        />

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={styles.reportButtonText}>지난주 주별 리포트 보기</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <DiaryViewModal
        visible={viewVisible}
        dateString={selectedDate}
        onClose={() => setViewVisible(false)}
        onEdit={() => {
          setViewVisible(false);
          setWriteVisible(true);
        }}
      />

      <DiaryWriteModal
        key={selectedDate}
        visible={writeVisible}
        dateString={selectedDate}
        initialText={diaryText}
        onClose={() => setWriteVisible(false)}
        onSaved={() => setWriteVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#BEE1FF" },
  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 15,
    borderRadius: 18,
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
