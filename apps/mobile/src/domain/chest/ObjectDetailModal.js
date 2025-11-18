import React from "react";
import { View, Image, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ObjectDetailModal({ visible, onClose, diary, object }) {
  if (!visible || !diary) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>

          {/* DiaryService에서 저장된 object 이미지 */}
          {diary.object && (
            <Image
              source={diary.object}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          {/* 날짜 */}
          <Text style={styles.date}>{object?.diaryId}</Text>

          {/* 일기 내용 */}
          <Text style={styles.diaryText}>
            {diary?.text || "(작성된 일기가 없습니다)"}
          </Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>닫기</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  image: { width: 180, height: 180, marginBottom: 15 },
  date: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#6B7280" },
  diaryText: {
    fontSize: 15,
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: "#1E3A8A",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeText: { color: "white", fontWeight: "600" },
});
