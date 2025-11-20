import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useHistoryReport } from "./hooks/useHistoryReport";

export default function HistoryReportPage({ navigation }) {
  const list = useHistoryReport();

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>역대 리포트</Text>
        <View style={{ width: 20 }} />
      </View>

      {list.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.row}
          onPress={() =>
            navigation.navigate("Report", { year: item.year, week: item.week })
          }
        >
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          <Text style={styles.rowText}>
            {item.year}년 {item.week}주차 — {item.mainEmotion} ({item.trend})
          </Text>
        </TouchableOpacity>
      ))}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "white",
    paddingHorizontal: 20, paddingTop: 10,
  },

  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },

  title: {
    fontSize: 18, fontWeight: "bold", color: "#111827",
  },

  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
  },

  colorDot: {
    width: 14, height: 14, borderRadius: 7,
    marginRight: 12,
  },

  rowText: {
    fontSize: 14, color: "#374151",
  },
});
 