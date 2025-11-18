import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator 
} from "react-native";
import BaseModal from "../../components/common/BaseModal";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useTurntable } from "./useTurntable";

/**
 * props:
 *  - visible
 *  - onClose
 *  - calendarModal (달력 모달 제어)
 */
export default function TurntableModal({ visible, onClose, calendarModal }) {
  const {
    date,
    setDate,
    noMusic,
    currentItem,
    audioItems,
    isLoading,
    error,
    handleNext,
    handlePrev,
    getVisibleItems,
    setSelectedIndex,
  } = useTurntable();

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isVisibleRef = useRef(visible);

  useEffect(() => {
    isVisibleRef.current = visible;
  }, [visible]);

  // 음악 변경될 때마다 로딩
  useEffect(() => {
    let newSound = null;

    const loadAudio = async () => {
      if (!currentItem || !currentItem.uri || !isVisibleRef.current) return;

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      try {
        const { sound: loaded } = await Audio.Sound.createAsync(
          currentItem.uri,
          { shouldPlay: false }
        );
        newSound = loaded;
        if (isVisibleRef.current) setSound(newSound);
      } catch (e) {
        console.error("Audio load error:", e);
      }
    };

    loadAudio();

    return () => {
      if (newSound) newSound.unloadAsync();
    };
  }, [currentItem, visible]);

  const togglePlayback = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // 로딩
  if (isLoading) {
    return (
      <BaseModal visible={visible} onClose={onClose}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>음악 불러오는 중...</Text>
        </View>
      </BaseModal>
    );
  }

  // 음악 없음 화면
  if (noMusic) {
    return (
      <BaseModal visible={visible} onClose={onClose}>
        <View style={styles.noMusicBox}>
          <Text style={styles.noMusicTitle}>오늘은 음악이 없어요 🎧</Text>
          <Text style={styles.noMusicSub}>
            다른 날짜를 선택해보세요.
          </Text>

          <TouchableOpacity
            style={styles.selectDateBtn}
            onPress={() => {
              calendarModal?.open();
            }}
          >
            <Text style={styles.selectDateText}>날짜 선택하기</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
    );
  }

  // 에러
  if (error || !currentItem) {
    return (
      <BaseModal visible={visible} onClose={onClose}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>오류: {error || "음악 없음"}</Text>
        </View>
      </BaseModal>
    );
  }

  const visibleItems = getVisibleItems();

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Music Box</Text>

        {/* 날짜 터치 → 달력 오픈 */}
        <TouchableOpacity onPress={() => calendarModal?.open()}>
          <Text style={styles.date}>{date}</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: "https://em-content.zobj.net/source/apple/354/bear_1f43b.png" }}
          style={styles.emotionAvatar}
        />

        {/* 태그 */}
        <View style={styles.tagRow}>
          <View style={styles.tag}><Text style={styles.tagText}>{currentItem.emotion} 기반</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>#{currentItem.name.split(" ")[0]}</Text></View>
        </View>

        {/* 플레이어 */}
        <View style={styles.audioPlayerContainer}>
          <Text style={styles.audioPlayerTitle}>{currentItem.name}</Text>
          <TouchableOpacity onPress={togglePlayback}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={54}
              color="#3B82F6"
            />
          </TouchableOpacity>
          <Text style={styles.audioPlayerStatus}>
            {isPlaying ? "재생 중" : "일시 정지"}
          </Text>
        </View>

        {/* 아래 목록 */}
        <Text style={styles.audioListTitle}>오디오 목록</Text>

        <View style={styles.audioListNavigation}>
          <TouchableOpacity onPress={handlePrev}><Ionicons name="chevron-back" size={28} /></TouchableOpacity>

          {visibleItems.map((it) => (
            <TouchableOpacity
              key={it.id}
              onPress={() => setSelectedIndex(audioItems.findIndex((x) => x.id === it.id))}
              style={styles.audioItem}
            >
              <Ionicons
                name={it.icon}
                size={it.isSelected ? 34 : 28}
                color={it.isSelected ? "#3B82F6" : "#000"}
              />
              <Text
                style={{
                  color: it.isSelected ? "#3B82F6" : "#000",
                  fontWeight: it.isSelected ? "600" : "400",
                }}
              >
                {it.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleNext}><Ionicons name="chevron-forward" size={28} /></TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { padding: 30, alignItems: "center" },
  loadingText: { marginTop: 10, color: "#6B7280" },
  errorText: { color: "red", marginTop: 20 },

  content: { alignItems: "center", paddingHorizontal: 22, paddingTop: 10, width: "100%" },

  closeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    padding: 6,
  },

  modalTitle: { fontSize: 24, fontWeight: "700", marginBottom: 4, color: "#1E293B" },
  date: { fontSize: 15, color: "#6B7280", marginBottom: 14 },

  emotionAvatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 14 },

  tagRow: { flexDirection: "row", gap: 10, marginBottom: 22 },
  tag: { backgroundColor: "#F0F2F5", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 6 },
  tagText: { fontSize: 14, fontWeight: "600", color: "#374151" },

  // 음악 없음 화면
  noMusicBox: { padding: 30, alignItems: "center" },
  noMusicTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  noMusicSub: { fontSize: 14, color: "#6B7280", marginBottom: 20 },

  selectDateBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  selectDateText: { color: "white", fontWeight: "700", fontSize: 15 },

  audioPlayerContainer: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  audioPlayerTitle: { fontSize: 17, fontWeight: "600", color: "#1E293B" },
  audioPlayerStatus: { fontSize: 14, color: "#6B7280", marginTop: 8 },

  audioListTitle: { fontSize: 17, fontWeight: "700", marginBottom: 15, color: "#1E293B" },

  audioListNavigation: { flexDirection: "row", alignItems: "center", gap: 12 },

  audioItem: { alignItems: "center", paddingHorizontal: 8 },
});
