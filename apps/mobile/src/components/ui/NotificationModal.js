import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BaseModal from "../common/BaseModal";
import { useNavigation } from "@react-navigation/native";

export default function NotificationModal({ visible, onClose }) {
  const navigation = useNavigation();

  const handleCheck = () => {
    onClose();
    setTimeout(() => navigation.navigate("Report"), 100); // 안전하게 비동기 처리
  };

  if (!visible) return null; // invisible일 때 렌더링 차단

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.box}>
        <Text style={styles.title}>알림</Text>

        <View style={styles.itemRow}>
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>주별 리포트가 도착했어요.</Text>
            <Text style={styles.itemDesc}>
              11월 4주차에는 어떤 감정을 느꼈는지 확인해보세요.
            </Text>
          </View>

          <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
            <Text style={styles.checkText}>확인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  itemDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  checkBtn: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  checkText: { color: "white", fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
  },
});
