import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function SummaryBox({
  date,
  diaryText,
  diaryExists,
  onOpenFull,
  onEdit,
  onDelete,
  onWrite,
  onMoveDate,
  isNextDisabled,   // ← 미래면 true
}) {
  // ===== 스와이프 제스처 =====
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dx) > 15,

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 40) {
        onMoveDate(-1); // 왼쪽으로 스와이프 → 전날
      } else if (gesture.dx < -40) {
        if (!isNextDisabled) onMoveDate(1); // 오른쪽 스와이프 → 다음날
      }
    },
  });

  return (
    <View style={styles.box} {...panResponder.panHandlers}>
      {/* ===== 날짜 + 화살표 ===== */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => onMoveDate(-1)}>
          <FontAwesome name="chevron-left" size={18} color="#1E3A8A" />
        </TouchableOpacity>

        <Text style={styles.dateText}>{date}</Text>

        <TouchableOpacity
          disabled={isNextDisabled}
          onPress={() => onMoveDate(1)}
        >
          <FontAwesome
            name="chevron-right"
            size={18}
            color={isNextDisabled ? "#9CA3AF" : "#1E3A8A"}
          />
        </TouchableOpacity>
      </View>

      {/* ===== 내용 요약 ===== */}
      {diaryExists ? (
        <Text style={styles.summary} numberOfLines={1}>
          {diaryText}
        </Text>
      ) : (
        <Text style={styles.noDiary}>작성된 일기가 없습니다.</Text>
      )}

      {/* ===== 액션 버튼 ===== */}
      <View style={styles.actionRow}>
        {diaryExists ? (
          <>
            <TouchableOpacity onPress={onOpenFull}>
              <Text style={styles.actionBlue}>전체보기</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.actionGray}>수정</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete}>
              <Text style={styles.actionRed}>삭제</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={onWrite}>
            <Text style={styles.actionBlue}>작성하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 14,               // 기존 20 → 14 (달력과 간격 줄이기)
    paddingHorizontal: 18,
    paddingVertical: 14,         // 기존 20 → 14 (전체 여백 줄이기)
    borderRadius: 14,            // 조금 더 단단하게
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,             // 날짜와 텍스트 사이 간격 줄임
  },

  dateText: {
    fontSize: 15,                // 기존 16 → 아래 요소와 균형 맞춤
    fontWeight: "700",
    color: "#1E3A8A",
  },

  summary: {
    marginTop: 4,                // 기존 10 → 4 (여백을 줄여 조밀하게)
    fontSize: 14,
    color: "#111827",
  },

  noDiary: {
    marginTop: 4,
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,               // 기존 14 → 조금만 줄임
    gap: 20,
  },

  actionBlue: { color: "#1E3A8A", fontWeight: "700" },
  actionGray: { color: "#4B5563", fontWeight: "700" },
  actionRed: { color: "#DC2626", fontWeight: "700" },
});
