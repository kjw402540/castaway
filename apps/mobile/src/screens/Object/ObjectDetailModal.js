import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export default function ObjectDetailModal({
  visible,
  object,
  onClose,
  onPrev,
  onNext,
  onOpenDiary,
  onPlace,
  onSaveAudio,
  onDeleteRequest,
}) {
  const captureRef = useRef();

  if (!visible || !object) return null;

  const handleShare = async () => {
    try {
      const uri = await captureRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log(e);
    }
  };

  const onSwipe = (event) => {
    const dx = event.nativeEvent.translationX;
    if (dx > 80) onPrev();
    if (dx < -80) onNext();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        {/* 닫기 */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={{ fontSize: 26 }}>✕</Text>
        </TouchableOpacity>

        <PanGestureHandler onGestureEvent={onSwipe}>
          <View style={{ alignItems: "center", width: "100%" }}>
            {/* 날짜 + 좌우 이동 */}
            <View style={styles.dateRow}>
              <TouchableOpacity onPress={onPrev}>
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>

              <Text style={styles.date}>{object.date}</Text>

              <TouchableOpacity onPress={onNext}>
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* 오브제 */}
            <ViewShot ref={captureRef}>
              <View style={styles.circle}>
                <Text style={styles.emoji}>{object.emoji}</Text>
              </View>
            </ViewShot>

            {/* 재생 버튼 (더 작게) */}
            <TouchableOpacity style={styles.playBtn}>
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </PanGestureHandler>

        {/* 2×2 버튼 */}
        <View style={styles.grid}>
          <TouchableOpacity style={styles.btn} onPress={onOpenDiary}>
            <Text style={styles.btnText}>일기 조회하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={onPlace}>
            <Text style={styles.btnText}>섬에 배치하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={handleShare}>
            <Text style={styles.btnText}>이미지 저장</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={onSaveAudio}>
            <Text style={styles.btnText}>오디오 저장</Text>
          </TouchableOpacity>
        </View>

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

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "78%",
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 28,
    paddingTop: 32,
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  arrow: {
    fontSize: 20,
    color: "#374151",
    padding: 12,
  },

  date: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginHorizontal: 10,
  },

  circle: {
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 10,
    marginBottom: 16,
  },

  emoji: {
    fontSize: 140,
  },

  playBtn: {
    padding: 6,
  },

  playIcon: {
    fontSize: 30,
    color: "#0F172A",
  },

  grid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },

  btn: {
    width: "48%",
    backgroundColor: "#0F172A",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  deleteBtn: {
    width: "100%",
    borderWidth: 1.4,
    borderColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },

  deleteText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "600",
  },
});
