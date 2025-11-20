import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { saveDiary } from "../../services/diaryService";


export default function DiaryWriteModal({
  visible,
  onClose,
  onSaved,
  targetDate, // 'YYYY-MM-DD' 형식의 날짜
  mode = "write",
}) {
  const [diaryText, setDiaryText] = useState("");

  const handleSave = async () => {
    if (!diaryText.trim()) return;

    await saveDiary({
      date: targetDate,
      text: diaryText
    });

    onSaved();
    setDiaryText("");
  };


  // 💡 오늘 날짜를 한국어 감성 형식으로 변환 (예: 2025년 11월 20일 목요일)
  const today = new Date(targetDate);
  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long', // 요일 추가
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.centeredView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalView}>

          {/* 1. 헤더 (날짜 및 닫기 버튼) */}
          <View style={styles.header}>
            <View>
              {/* 💡 날짜 표시 */}
              <Text style={styles.dateText}>{formattedDate}</Text>
              {/* 💡 제목 */}
              <Text style={styles.title}>오늘의 일기</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <AntDesign name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* 2. 입력 박스 영역 */}
          <TextInput
            style={styles.inputBox}
            placeholder="오늘 있었던 일이나 감정을 따뜻하게 적어보세요..." // 💡 감성적 문구로 변경
            placeholderTextColor="#B0B5BB"
            multiline={true}
            value={diaryText}
            onChangeText={setDiaryText}
            editable={mode === "write"}
          />

          {/* 3. 저장 버튼 */}
          {mode === "write" && (
            <>
              {/* 💡 감성 문구 추가 */}
              <Text style={styles.savePrompt}>
                오늘의 소중한 기록을 섬에 남겨보세요
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.8}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>기억 저장하기</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ----------------------------------------------------
// 🎨 스타일시트 (감성 디자인 적용)
// ----------------------------------------------------

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 배경을 조금 더 어둡게
  },

  modalView: {
    width: '90%',
    // 💡 모달 높이 확장 (화면의 75% 차지)
    height: '75%',
    // 💡 배경색을 약간 따뜻한 톤으로 변경 (종이 느낌)
    backgroundColor: '#FAF9F6',
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 }, // 그림자를 더 깊게
    shadowOpacity: 0.3,
    shadowRadius: 8.0,
    elevation: 15,
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // 상단 정렬
    marginBottom: 20,
  },

  // 💡 날짜 스타일 (감성적인 폰트 느낌)
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },

  // 💡 제목 스타일
  title: {
    fontSize: 24,
    fontWeight: '800', // 더 굵게
    color: '#1F2937',
  },

  // 💡 입력 박스 스타일
  inputBox: {
    // 모달 배경색과 유사하게 또는 투명하게
    backgroundColor: 'transparent',
    width: '100%',
    flex: 1, // 남은 공간을 모두 차지하도록
    minHeight: 150,
    padding: 0, // padding은 modalView에서 충분
    fontSize: 16,
    lineHeight: 24, // 줄 간격 추가로 가독성 및 감성 확보
    color: '#374151',
  },

  // 💡 감성 문구 스타일
  savePrompt: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 10,
  },

  // 💡 저장 버튼 스타일 (문구 변경에 맞게)
  saveButton: {
    backgroundColor: '#1E3A8A',
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 5,
  }
});