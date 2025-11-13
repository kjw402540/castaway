import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BaseModal from "../../components/common/BaseModal";

export default function TurntableModal({ visible, onClose }) {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={styles.title}>턴테이블 재생</Text>
        <Text style={styles.text}>
          감정 기반 BGM을 재생하시겠습니까? 🎧
        </Text>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#3B82F6" }]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>예</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#9CA3AF" }]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>아니오</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", marginTop: 30 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  btnRow: { flexDirection: "row", gap: 10 },
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: { color: "white", fontWeight: "600" },
});
