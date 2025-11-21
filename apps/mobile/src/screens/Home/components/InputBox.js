// src/screens/Home/components/InputBox.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function InputBox({ onPressDiary }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.box}
        onPress={onPressDiary}
      >
        <Text style={styles.placeholder}>오늘 기분이 어땠는지 적어주세요</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#A7D8FF",
  },
  box: {
    height: 52,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 20,
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
