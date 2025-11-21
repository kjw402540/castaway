import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// 힐링 문구 리스트
const QUOTES = [
  "잠시 쉬어가도 괜찮아요. 파도 소리를 들어보세요.",
  "당신은 오늘 충분히 잘했습니다.",
  "걱정은 파도에 흘려보내요.",
  "내일은 오늘보다 더 맑은 날이 될 거예요.",
  "가끔은 아무것도 하지 않는 시간이 필요해요.",
];

export default function TreeFortuneModal({ visible, onClose }) {
  const [quote, setQuote] = useState("");

  // 모달이 열릴 때마다 랜덤 문구 뽑기
  useEffect(() => {
    if (visible) {
      const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setQuote(random);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            
            <Ionicons name="leaf" size={50} color="#4ADE80" style={{ marginBottom: 16 }} />
            
            <Text style={styles.title}>오늘의 마음 한 조각</Text>
            
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>"{quote}"</Text>
            </View>

            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>마음에 담기</Text>
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
    width: width * 0.8, backgroundColor: "white", borderRadius: 24, padding: 30, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 20 },
  quoteBox: { marginBottom: 24, paddingHorizontal: 10 },
  quoteText: { fontSize: 18, color: "#374151", textAlign: "center", lineHeight: 28, fontStyle: "italic" },
  btn: { paddingVertical: 12, paddingHorizontal: 30, backgroundColor: "#A7D8FF", borderRadius: 20 },
  btnText: { color: "#1E3A8A", fontWeight: "bold", fontSize: 15 },
});