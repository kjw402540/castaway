// apps/mobile/src/screens/Report/HistoryReportModal.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HistoryReportModal({ visible, onClose, list }) {
  const navigation = useNavigation();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>역대 리포트</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* 리스트 */}
          {list.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.row}
              onPress={() => {
               onClose(); // 모달 닫기
               console.log("👉 [Modal] 새 리포트 화면 띄우기:", item.startDate);
               navigation.push("Report", { date: item.startDate });
              }}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: item.color }
                ]}
              />
              <Text style={styles.rowText}>
                {item.year}년 {item.week}주차 — {item.mainEmotion} ({item.trend})
              </Text>
            </TouchableOpacity>
          ))}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rowText: {
    fontSize: 14,
    color: "#374151",
  },
});