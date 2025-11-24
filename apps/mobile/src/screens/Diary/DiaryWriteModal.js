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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

// import { saveDiary } from "../../services/diaryService";
import { addMail } from "../../services/mailService";
import { useEmotion } from "../../context/EmotionContext";
import { analyzeEmotion } from "../../services/emotionService";
import { diaryApi } from "../../api/diaryApi";

import { generateMailFromDiary } from "../../services/generateMailFromDiary";
import { useDebouncedEmotion } from "./hooks/useDebouncedEmotion";
import { formatKoreanDate } from "../../utils/formatKoreanDate";

export default function DiaryWriteModal({
  visible,
  onClose,
  onSaved,
  dateString,
  initialText = "",
}) {
  const [diaryText, setDiaryText] = useState("");
  const { setEmotion } = useEmotion();

  useEffect(() => {
    if (visible) setDiaryText(initialText || "");
    else setDiaryText("");
  }, [visible, initialText]);

  useDebouncedEmotion({
    text: diaryText,
    visible,
    setEmotion,
    delay: 500,
  });

const handleSave = async () => {
  if (!diaryText.trim()) return;

  // null byte 제거
  const cleanText = diaryText.replace(/\0/g, "");

  const emotion = await analyzeEmotion(cleanText);

  await diaryApi.save({
    text: cleanText,
    date: dateString,
  });

  await addMail(generateMailFromDiary(cleanText, emotion, dateString));

  onSaved?.(cleanText);
  onClose();
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
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.inputBox}
            placeholder="오늘 있었던 일을 적어보세요..."
            placeholderTextColor="#B0B5BB"
            multiline
            value={diaryText}
            onChangeText={setDiaryText}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>기억 저장하기</Text>
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
    lineHeight: 24,
    color: "#374151",
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    height: 56,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
});
