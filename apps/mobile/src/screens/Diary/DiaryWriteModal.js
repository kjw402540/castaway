import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { saveDiary } from "./DiaryService";

export default function DiaryWriteModal({
  visible,
  dateString,
  initialText = "",
  onClose,
  onSaved,
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (visible) {
      setText(initialText || "");
    }
  }, [visible, initialText]);

  const handleSave = async () => {
    await saveDiary(dateString, text);
    onSaved();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>일기</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.close}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Date */}
          <Text style={styles.dateText}>{dateString}</Text>

          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="오늘 있었던 일이나 감정을 적어보세요"
            placeholderTextColor="#9CA3AF"
          />

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveText}>저장</Text>
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
    width: "86%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  close: {
    fontSize: 28,
    color: "#6B7280",
    lineHeight: 28,
  },

  dateText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    marginLeft: 2,
  },

  input: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    textAlignVertical: "top",
    fontSize: 15.5,
    color: "#1F2937",
    backgroundColor: "#F8FAFC",
    marginBottom: 18,
  },

  saveBtn: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
