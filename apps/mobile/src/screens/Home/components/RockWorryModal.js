import React, { useState } from "react";
import { 
  Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, 
  TouchableWithoutFeedback, TextInput, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function RockWorryModal({ visible, onClose }) {
  const [text, setText] = useState("");

  const handleBury = () => {
    if (!text.trim()) return;
    
    // 여기에 저장 로직 없음 -> 그냥 초기화하고 닫음 (삭제 효과)
    Alert.alert("완료", "걱정을 바위 밑에 깊이 묻어두었습니다.", [
      { 
        text: "가벼워졌다!", 
        onPress: () => {
          setText("");
          onClose();
        } 
      }
    ]);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            
            <Ionicons name="cube" size={50} color="#9CA3AF" style={{ marginBottom: 16 }} />
            
            <Text style={styles.title}>감정 쓰레기통</Text>
            <Text style={styles.desc}>
              잊고 싶은 기억이나 걱정이 있나요?{"\n"}여기에 적고 바위 밑에 묻어버리세요.{"\n"}
              <Text style={styles.caption}>(어디에도 저장되지 않고 사라집니다)</Text>
            </Text>

            <TextInput
              style={styles.input}
              placeholder="걱정을 입력하세요..."
              multiline
              value={text}
              onChangeText={setText}
            />

            <TouchableOpacity 
              style={[styles.btn, !text.trim() && styles.btnDisabled]} 
              onPress={handleBury}
              disabled={!text.trim()}
            >
              <Text style={styles.btnText}>묻어두기</Text>
            </TouchableOpacity>

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContainer: { 
    width: width * 0.85, backgroundColor: "white", borderRadius: 24, padding: 24, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#374151", marginBottom: 10 },
  desc: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 20, lineHeight: 20 },
  caption: { fontSize: 12, color: "#EF4444" },
  input: { 
    width: "100%", height: 100, backgroundColor: "#F3F4F6", borderRadius: 12, 
    padding: 16, marginBottom: 20, textAlignVertical: "top", fontSize: 14 
  },
  btn: { width: "100%", paddingVertical: 16, backgroundColor: "#4B5563", borderRadius: 14, alignItems: "center" },
  btnDisabled: { backgroundColor: "#E5E7EB" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});