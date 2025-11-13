import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileRow({ label, value, onChangeText, buttonText, onButtonPress, editable = true }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ marginTop: 10, fontWeight: "600", color: "#111827" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, { color: editable ? "#111827" : "#9CA3AF" }]}
          editable={editable}
        />
        {buttonText && (
          <TouchableOpacity style={[styles.button, { backgroundColor: editable ? "#000" : "#D1D5DB" }]} onPress={onButtonPress}>
            <Text style={{ color: editable ? "white" : "#4B5563", fontWeight: "600" }}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
