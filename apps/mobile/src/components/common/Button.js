import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

/**
 * 범용 버튼 컴포넌트
 * 
 * props:
 *  - title: 버튼 텍스트
 *  - onPress: 클릭 핸들러
 *  - type: "primary" | "secondary" | "text"
 *  - disabled: 비활성화 여부
 *  - style: 추가 스타일
 */
export default function Button({ title, onPress, type = "primary", disabled = false, style }) {
  const buttonStyles = [
    styles.base,
    type === "primary" && styles.primary,
    type === "secondary" && styles.secondary,
    type === "text" && styles.text,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.textBase,
    type === "primary" && styles.textPrimary,
    type === "secondary" && styles.textSecondary,
    type === "text" && styles.textLink,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={!disabled ? onPress : null}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#1E3A8A", // 메인 파랑
  },
  secondary: {
    backgroundColor: "#E5E7EB", // 회색 배경
  },
  text: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: 15,
    fontWeight: "600",
  },
  textPrimary: {
    color: "#FFF",
  },
  textSecondary: {
    color: "#111",
  },
  textLink: {
    color: "#1E3A8A",
    fontWeight: "700",
  },
});
