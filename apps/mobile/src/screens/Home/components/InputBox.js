// components/input/InputBox.js
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function InputBox({ onPressDiary }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        position: "absolute",
        bottom: 90,                    // ★ 여기 수정
        width: "100%",
        alignItems: "center",
        zIndex: 20,                     // ★ 탭바 위로 오게
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          width: "85%",
          borderRadius: 25,
          padding: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          activeOpacity={0.8}
          onPress={onPressDiary}
        >
          <Text style={{ flex: 1, color: "#9CA3AF" }}>
            오늘 기분이 어땠는지 적어주세요
          </Text>
          <FontAwesome name="pencil" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
