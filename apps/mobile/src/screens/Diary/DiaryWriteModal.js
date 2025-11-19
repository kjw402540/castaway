import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { saveDiary } from "./DiaryService";

export default function DiaryWriteModal({
  visible,
  dateString,
  initialText = "",
  onClose,
  onSaved,
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (visible) {
      setText(initialText || "");
    }
  }, [visible, initialText]);

  const handleSave = async () => {
    await saveDiary(dateString, text);
    onSaved(); // 부모에서 갱신 처리
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{dateString} 일기</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={22} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="일기를 입력하세요"
            placeholderTextColor="#9CA3AF"
          />

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  input: {
    marginTop: 15,
    height: 140,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 15,
  },
  saveBtn: {
    marginTop: 15,
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "700",
  },
});
