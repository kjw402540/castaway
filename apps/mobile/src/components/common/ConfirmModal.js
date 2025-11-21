// src/components/common/ConfirmModal.js

import React from "react";
import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmModal({
  visible,
  title,
  description,
  confirmText = "삭제하기",
  cancelText = "취소",
  onCancel,
  onConfirm,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.box}>
          <Text style={styles.title}>{title}</Text>

          {description ? (
            <Text style={styles.desc}>{description}</Text>
          ) : null}

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>{confirmText}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>{cancelText}</Text>
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
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  box: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
  },
  desc: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  confirmBtn: {
    marginTop: 22,
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    color: "#374151",
  },
});
