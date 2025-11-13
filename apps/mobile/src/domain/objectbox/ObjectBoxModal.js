import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BaseModal from "../../components/common/BaseModal";

export default function ChestModal({ visible, onClose }) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={styles.title}>보물상자 발견!</Text>
        <Text style={styles.text}>오늘의 감정 오브제를 획득했습니다 🎁</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.btnText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", marginTop: 30 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  button: {
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: { color: "white", fontWeight: "600" },
});
