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
  ActivityIndicator, // 👈 [추가] 로딩 뱅글뱅글 아이콘
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { saveDiary } from "../../services/diaryService";
import { formatKoreanDate } from "../../utils/formatKoreanDate";

export default function DiaryWriteModal({
  visible,
  onClose,
  onSaved,
  dateString,
  initialText = "",
}) {
  const [diaryText, setDiaryText] = useState("");
  
  // 👇 [추가] 저장 중인지 체크하는 상태
  const [isSaving, setIsSaving] = useState(false); 

  useEffect(() => {
    if (visible) {
      setDiaryText(initialText || "");
      setIsSaving(false); // 모달 열릴 때 로딩 상태 초기화
    } else {
      setDiaryText("");
    }
  }, [visible, initialText]);

  const handleSave = async () => {
    if (!diaryText.trim()) return;
    
    // 이미 저장 중이면 함수 종료 (중복 클릭 방지)
    if (isSaving) return;

    Keyboard.dismiss();
    
    // 👇 저장 시작! 로딩 상태 켜기
    setIsSaving(true);

    const cleanText = diaryText.replace(/\0/g, "");

    try {
      await saveDiary({
        text: cleanText,
        date: dateString,
      });

      onSaved?.(); // 저장 완료 알림
      onClose();   // 모달 닫기
    } catch (err) {
      console.error("일기 저장 실패:", err);
      // 에러 나면 다시 누를 수 있게 풀어줌
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
            {/* 저장 중엔 닫기 버튼도 막는 게 안전함 */}
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
            editable={!isSaving} // 저장 중엔 수정 불가
          />

          {/* 👇 버튼 UI 변경 */}
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSaving} // 물리적 클릭 차단
          >
            {isSaving ? (
              // 저장 중일 땐 뱅글뱅글 아이콘
              <ActivityIndicator size="small" color="white" />
            ) : (
              // 평소엔 텍스트
              <Text style={styles.buttonText}>기억 저장하기</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... (기존 스타일 유지) ...
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
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    height: 56,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  // 👇 [추가] 비활성화 스타일 (약간 흐리게)
  saveButtonDisabled: {
    backgroundColor: "#1E3A8A",
    opacity: 0.7, 
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
});