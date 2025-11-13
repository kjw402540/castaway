import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useDiary } from "../../context/DiaryContext";

export default function DiaryModal({
  visible,
  onClose,
  defaultText = "",
  defaultObject = null,
  mode = "write",
  targetDate = null,
  onSaved,
}) {
  const { saveDiary } = useDiary();

  const [text, setText] = useState(defaultText);
  const [object, setObject] = useState(defaultObject);

  useEffect(() => {
    if (visible) {
      setText(defaultText || "");
      setObject(defaultObject || null);
    }
  }, [visible, defaultText, defaultObject]);


  if (!visible) return null;

  const handleSave = async () => {
    if (!text.trim()) return;

    const dateToSave =
      mode === "edit"
        ? targetDate
        : targetDate || new Date().toISOString().split("T")[0];

    await saveDiary(dateToSave, text, object);

    if (onSaved) onSaved(dateToSave, text, object);

    onClose();
  };


  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>

          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === "edit" ? "일기 수정" : "일기 작성"}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={22} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="오늘 있었던 일을 적어주세요"
            value={text}
            onChangeText={setText}
            style={styles.textInput}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>저장하기</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  textInput: {
    height: 150,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F3F4F6",
    textAlignVertical: "top",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
