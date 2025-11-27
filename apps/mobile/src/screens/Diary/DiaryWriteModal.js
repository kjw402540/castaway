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
  Keyboard, // 키보드 내리기용
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { saveDiary } from "../../services/diaryService";
// import { addMail } from "../../services/mailService"; // 메일도 서버에서 보내는 게 좋아서 일단 주석 처리 (원하면 푸세요)
// import { generateMailFromDiary } from "../../services/generateMailFromDiary"; 

import { formatKoreanDate } from "../../utils/formatKoreanDate";

export default function DiaryWriteModal({
  visible,
  onClose,
  onSaved,
  dateString,
  initialText = "",
}) {
  const [diaryText, setDiaryText] = useState("");

  useEffect(() => {
    if (visible) setDiaryText(initialText || "");
    else setDiaryText("");
  }, [visible, initialText]);

  // ❌ [삭제] useDebouncedEmotion (범인 체포 완료)

  const handleSave = async () => {
    if (!diaryText.trim()) return;

    Keyboard.dismiss(); // 저장 누르면 키보드 내리기

    // null byte 제거
    const cleanText = diaryText.replace(/\0/g, "");

    // ❌ [삭제] 프론트에서 AI 분석 대기하는 코드 삭제
    // const emotion = await analyzeEmotion(cleanText); 

    try {
      // ✅ [수정] 오직 저장 요청만 보냄! (분석은 서버가 비동기로 함)
      await saveDiary({
        text: cleanText,
        date: dateString,
        // emotion 값은 보내지 않습니다. (서버에서 null로 저장 후 분석 시작)
      });

      // 편지 보내기 기능도 원래는 서버에서 처리하는 게 맞습니다.
      // 일단 에러 방지를 위해 이 부분은 잠시 주석 처리하거나, 
      // 꼭 필요하다면 emotion 자리에 null을 넣어서 호출해야 합니다.
      // await addMail(generateMailFromDiary(cleanText, "Neutral", dateString));

      onSaved?.(cleanText);
      onClose();
    } catch (err) {
      console.error("일기 저장 실패:", err);
      // 여기에 에러 토스트 등을 띄울 수 있음
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
            // autoFocus={true} // 필요하면 추가
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
    textAlignVertical: 'top', // 안드로이드에서 텍스트 위로 정렬
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