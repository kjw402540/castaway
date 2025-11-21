// src/components/common/OptionMenu.js

import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

export default function OptionMenu({ options = [], style }) {
  return (
    <View style={[styles.menu, style]}>
      {options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.item}
          onPress={opt.onPress}
        >
          <Text style={[styles.text, opt.destructive && styles.destructive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    backgroundColor: "white",
    paddingVertical: 8,
    width: 140,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  text: {
    fontSize: 14,
    color: "#1F2937",
  },
  destructive: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
