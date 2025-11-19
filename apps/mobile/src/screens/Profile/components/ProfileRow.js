import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileRow({
  label,
  value,
  onChangeText,    // 입력용
  onButtonPress,   // 저장용
  buttonText,
  editable = true,
}) {
  return (
    <View style={styles.wrapper}>
      {/* 라벨 */}
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        {/* 입력창 */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={editable ? "" : "수정 불가"}
          style={[
            styles.input,
            { color: editable ? "#111827" : "#9CA3AF" },
          ]}
        />

        {/* 버튼 (ex: 수정) */}
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
  wrapper: {
    marginBottom: 12,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
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
    paddingVertical: 8,
  },
  buttonText: {
    fontWeight: "600",
  },
});
