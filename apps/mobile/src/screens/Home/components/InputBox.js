// src/screens/Home/components/InputBox.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function InputBox({ onPressDiary }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.box}
        onPress={onPressDiary}
      >
        <Text style={styles.placeholder}>오늘 하루는 어땠나요?</Text>

        {/* 연필 아이콘 (오른쪽 정렬) */}
        <Feather name="edit-3" size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  box: {
    height: 52,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  placeholder: {
    fontSize: 14,
    color: "#6B7280",
  },
});
