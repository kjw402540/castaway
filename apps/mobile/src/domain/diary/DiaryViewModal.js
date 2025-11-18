// src/domain/diary/DiaryViewModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function DiaryViewModal({
  visible,
  onClose,
  date,
  diary,
  object,
  onEdit,
}) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>

          <View style={styles.header}>
            <Text style={styles.title}>{date}</Text>

            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {object && (
            <View style={styles.objectBox}>
              <Image
                source={object}
                style={{ width: 60, height: 60, resizeMode: "contain" }}
              />
            </View>
          )}

          <Text style={styles.diaryText}>{diary}</Text>

          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => onEdit(date)}
          >
            <Text style={{ color: "#1E3A8A", fontWeight: "600", textAlign: "right" }}>
              수정하기
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  objectBox: {
    alignItems: "center",
    marginBottom: 15,
  },
  diaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
});
