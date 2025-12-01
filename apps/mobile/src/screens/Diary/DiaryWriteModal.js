// src/screens/Diary/DiaryWriteModal.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { saveDiary } from "../../services/diaryService";
import { formatKoreanDate } from "../../utils/formatKoreanDate";

// 🔥 ThemeContext 적용
import { useTheme } from "../../context/ThemeContext";

export default function DiaryWriteModal({
  visible,
  onClose,
  onSaved,
  dateString,
  initialText = "",
}) {
  const [diaryText, setDiaryText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { setEmotion } = useTheme();

  useEffect(() => {
    if (visible) {
      setDiaryText(initialText || "");
      setIsSaving(false);
    } else {
      setDiaryText("");
    }
  }, [visible, initialText]);

  const handleSave = async () => {
    if (!diaryText.trim() || isSaving) return;

    Keyboard.dismiss();
    setIsSaving(true);

    try {
      const result = await saveDiary({
        text: diaryText.replace(/\0/g, ""),
        date: dateString,
      });

      // 🔥 감정 기반 화면 테마 변경
      if (result?.emotion_label) {
        setEmotion(result.emotion_label);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error("일기 저장 실패:", err);
      setIsSaving(false);
    }
  };

  const formatted = formatKoreanDate(dateString);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalView}>
          <View style={styles.header}>
            <View>
              <Text style={styles.dateText}>{formatted}</Text>
              <Text style={styles.title}>오늘의 일기</Text>
            </View>
            <TouchableOpacity onPress={onClose} disabled={isSaving}>
              <AntDesign name="close" size={24} color={isSaving ? "#D1D5DB" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.inputBox}
            placeholder="오늘 있었던 일을 적어보세요..."
            placeholderTextColor="#B0B5BB"
            multiline
            value={diaryText}
            onChangeText={setDiaryText}
            editable={!isSaving}
          />

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>기억 저장하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: "90%",
    height: "75%",
    backgroundColor: "#FAF9F6",
    borderRadius: 20,
    padding: 24,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateText: { fontSize: 14, color: "#6B7280" },
  title: { fontSize: 24, fontWeight: "800", color: "#1F2937" },
  inputBox: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    height: 56,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
