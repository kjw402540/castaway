// components/input/InputBox.js
import React, { useState } from "react"; // 👈 useState import 추가
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet, 
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons"; 

// props에서 isCollapsed와 onToggleCollapse 삭제
export default function InputBox({ onPressDiary }) {
  
  // 💡 상태를 InputBox 내부에서 직접 관리합니다.
  const [isCollapsed, setIsCollapsed] = useState(false); 

  const onToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoiding}
    >
      <View
        style={[
          styles.inputContainer, 
          isCollapsed && styles.collapsedContainer,
        ]}
      >
        {/* 닫혔을 때: 중앙 연필 아이콘만 표시 */}
        {isCollapsed ? (
          <TouchableOpacity
            style={styles.collapsedButton}
            activeOpacity={0.8}
            onPress={onToggleCollapse} // 👈 내부 함수 사용
          >
            <FontAwesome name="pencil" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          /* 열렸을 때: 화살표 + 입력 상자 */
          <>
            {/* 토글 버튼 (왼쪽 화살표) */}
            <TouchableOpacity
              style={styles.toggleButton}
              activeOpacity={0.8}
              onPress={onToggleCollapse} // 👈 내부 함수 사용
            >
              <AntDesign 
                name="left" 
                size={24} 
                color="#9CA3AF" 
              />
            </TouchableOpacity>

            {/* 입력 상자 내용 */}
            <TouchableOpacity
              style={styles.diaryContent}
              activeOpacity={0.8}
              onPress={onPressDiary}
            >
              <Text style={styles.inputText}>
                오늘 기분이 어땠는지 적어주세요
              </Text>
              <FontAwesome name="pencil" size={20} color="#1E3A8A" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  collapsedContainer: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: "#1E3A8A", 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  collapsedButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaryContent: {
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center",
    paddingLeft: 8, 
  },
  inputText: { 
    flex: 1, 
    color: "#9CA3AF",
    fontSize: 14,
  },
});