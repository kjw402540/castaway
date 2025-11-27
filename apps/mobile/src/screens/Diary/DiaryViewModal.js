// src/screens/Diary/DiaryViewModal.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

import { deleteDiary } from "../../services/diaryService";
import WaveformPlayer from "./components/WaveformPlayer";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DiaryViewModal({
  visible,
  dateString,
  onClose,
  onEdit,
  initialData, // ✅ 부모(DiaryPage)가 넘겨준 데이터를 받습니다.
}) {
  const [diary, setDiary] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.96);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // 🔥 모달 열릴 때 처리
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 140 });
      scale.value = withTiming(1, { duration: 140 });

      console.log("👀 [Modal] 받은 데이터:", initialData);
      setDiary(initialData || null);
      
    } else {
      opacity.value = 0;
      scale.value = 0.96;
      setMenuVisible(false);
      setDiary(null);
    }
  }, [visible, initialData]); 

  if (!visible) return null;

  const keywords = diary?.keywords?.slice(0, 2) || [];

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.box, animatedStyle]}>

          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.date}>{dateString}</Text>

            <View style={styles.headerIcons}>
              {diary && (
                <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
                  <FontAwesome name="ellipsis-h" size={20} color="#1E3A8A" />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={onClose} style={{ marginLeft: 14 }}>
                <FontAwesome name="close" size={22} color="#1E3A8A" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 메뉴 (수정/삭제) */}
          {menuVisible && (
            <View style={styles.menuBox}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  Alert.alert(
                    "일기 삭제",
                    "정말로 삭제하시겠습니까?",
                    [
                      { text: "취소", style: "cancel" },
                      {
                        text: "삭제",
                        style: "destructive",
                        onPress: async () => {
                          await deleteDiary(dateString);
                          onClose();
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.menuText}>수정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={async () => {
                  setMenuVisible(false);
                  await deleteDiary(dateString);
                  onClose();
                }}
              >
                <Text style={styles.menuDelete}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 중앙 패널 (아이콘, 키워드, 오디오) */}
          <View style={styles.centerPanel}>
            {diary?.object?.icon && (
              <Image
                source={diary.object.icon}
                style={styles.objectIcon}
                resizeMode="contain"
              />
            )}

            {keywords.length > 0 && (
              <View style={styles.keywordRow}>
                {keywords.map((k) => (
                  <View key={k} style={styles.keywordChip}>
                    <Text style={styles.keywordText}>#{k}</Text>
                  </View>
                ))}
              </View>
            )}

            {diary?.audio && <WaveformPlayer audioUri={diary.audio} />}
          </View>

          {/* 감정 표시 (안전하게 처리) */}
          {diary?.emotion && (
            <Text style={styles.emotion}>
              감정: <Text style={styles.emotionValue}>
                 {/* 객체면 label, 문자열이면 그대로 출력 */}
                 {typeof diary.emotion === 'object' ? diary.emotion.label : diary.emotion}
              </Text>
            </Text>
          )}

          {/* ✅ [핵심 수정] 본문 내용 표시 (text가 없으면 original_text 사용) */}
          <Text style={styles.body}>
            {diary?.text || diary?.original_text || "내용이 없습니다."}
          </Text>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  box: {
    width: "95%",
    maxHeight: SCREEN_HEIGHT * 0.9,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: { fontSize: 20, fontWeight: "700", color: "#1E3A8A" },

  menuBox: {
    position: "absolute",
    top: 48,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: 110,
    shadowColor: "#000",
    shadowRadius: 6,
    shadowOpacity: 0.15,
    elevation: 10,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  menuDelete: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "600",
  },

  centerPanel: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  objectIcon: { width: 32, height: 32, marginBottom: 8 },

  keywordRow: { flexDirection: "row", marginTop: 4, marginBottom: 10 },
  keywordChip: {
    backgroundColor: "#DDE7FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginHorizontal: 4,
  },
  keywordText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  emotion: {
    marginTop: 4,
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "700",
  },
  emotionValue: { fontWeight: "700" },

  body: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#111827",
  },
});