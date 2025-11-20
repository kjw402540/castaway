// src/domain/objects/ObjectDetailModal.js

import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export default function ObjectDetailModal({
  visible,
  onClose,
  object,
  onOpenDiary,
  onPlace,
  onDeleteRequest,
}) {
  const captureRefView = useRef();

  if (!visible || !object) return null;

  const handleShareImage = async () => {
    try {
      const uri = await captureRefView.current.capture(); // ViewShot 사용

      await Sharing.shareAsync(uri, {
        dialogTitle: "오브제 이미지 공유",
      });
    } catch (error) {
      console.log("Image share failed:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modalBox}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={{ fontSize: 20 }}>✕</Text>
        </TouchableOpacity>

        {/* 여기 ViewShot으로 래핑해야 정상 캡처됨 */}
        <ViewShot
          ref={captureRefView}
          options={{ format: "png", quality: 1 }}
          style={styles.imageWrapper}
        >
          <View style={styles.imageCircle}>
            <Text style={styles.bigIcon}>{object.icon}</Text>
          </View>
        </ViewShot>

        <Text style={styles.date}>{object.acquiredAt}</Text>

        <TouchableOpacity style={styles.btn} onPress={onOpenDiary}>
          <Text style={styles.btnText}>일기 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={onPlace}>
          <Text style={styles.btnText}>섬에 배치하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleShareImage}>
          <Text style={styles.btnText}>이미지로 저장하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={onDeleteRequest}>
          <Text style={styles.deleteText}>삭제하기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F8F9FC",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 24,
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    padding: 8,
  },

  imageWrapper: {
    marginTop: 10,
    marginBottom: 12,
    alignItems: "center",
  },

  imageCircle: {
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  bigIcon: {
    fontSize: 90,
  },

  date: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 18,
  },

  btn: {
    width: "100%",
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  deleteBtn: {
    marginTop: 6,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#DC2626",
    alignItems: "center",
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },
});
