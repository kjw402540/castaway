import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getDiaryByDate, deleteDiary } from "./DiaryService";
import DiaryWriteModal from "./DiaryWriteModal";

export default function DiaryViewModal({
  visible,
  dateString,
  onClose,
}) {
  const [diary, setDiary] = useState(null);
  const [editVisible, setEditVisible] = useState(false);

  const loadDiary = async () => {
    if (dateString) {
      const data = await getDiaryByDate(dateString);
      setDiary(data);
    }
  };

  useEffect(() => {
    if (visible) loadDiary();
  }, [visible, dateString]);

  const handleDelete = () => {
    Alert.alert(
      "삭제할까요?",
      "이 날짜의 일기를 삭제합니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            await deleteDiary(dateString);
            onClose();
          },
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{dateString}</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={22} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {diary ? (
            <>
              <Text style={styles.emotion}>감정: {diary.emotion}</Text>
              <Text style={styles.text}>{diary.text}</Text>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditVisible(true)}
                >
                  <Text style={styles.editText}>수정하기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.none}>등록된 일기가 없습니다.</Text>
          )}

        </View>
      </View>

      {/* 수정 모달 */}
      <DiaryWriteModal
        visible={editVisible}
        dateString={dateString}
        initialText={diary?.text}
        onClose={() => setEditVisible(false)}
        onSaved={async () => {
          setEditVisible(false);
          await loadDiary(); // 저장 후 자동 갱신
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  emotion: {
    marginTop: 12,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  text: {
    marginTop: 8,
    lineHeight: 22,
  },
  none: {
    marginTop: 15,
    fontStyle: "italic",
    color: "#6B7280",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  editText: {
    color: "white",
    fontWeight: "700",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "700",
  },
});
