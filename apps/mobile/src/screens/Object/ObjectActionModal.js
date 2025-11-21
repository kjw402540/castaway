// components/object/ObjectActionModal.js

import React from "react";
import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from "react-native";

export default function ObjectActionModal({ visible, onClose, onViewDiary, onPlace, onDelete }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.box}>
          <Text style={styles.title}>오브제 옵션</Text>

          <TouchableOpacity style={styles.menuBtn} onPress={onViewDiary}>
            <Text style={styles.menuText}>일기 보기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuBtn} onPress={onPlace}>
            <Text style={styles.menuText}>섬에 배치하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>삭제하기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 26,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  menuBtn: {
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 15,
    color: "#111827",
  },
  deleteBtn: {
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 15,
    color: "#DC2626",
    fontWeight: "600",
  },
});
