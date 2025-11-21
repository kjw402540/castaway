import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileRow({
  label,
  value,
  onChangeText,
  onButtonPress,
  buttonText,
  editable = true,
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          style={[
            styles.input,
            { backgroundColor: editable ? "white" : "#F3F4F6", color: editable ? "#111827" : "#9CA3AF" },
          ]}
        />
        {buttonText && (
          <TouchableOpacity
            onPress={onButtonPress}
            disabled={!editable}
            style={[
              styles.button,
              { backgroundColor: editable ? "#1F2937" : "#D1D5DB" },
            ]}
          >
            <Text style={[styles.buttonText, { color: editable ? "#fff" : "#6B7280" }]}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontWeight: "600", color: "#374151", marginBottom: 6, fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 14,
  },
  button: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 11 },
  buttonText: { fontWeight: "600", fontSize: 13 },
});