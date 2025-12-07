import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  ActivityIndicator
} from "react-native";
import { Audio } from "expo-av";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TurntableModal({ visible, item, onClose }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 💿 LP판 회전 애니메이션 값
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && item?.audioUri) {
      loadSound();
      startSpinning();
    } else {
      stopSound();
      spinValue.setValue(0); // 모달 닫히면 회전 초기화
    }
    // Cleanup
    return () => stopSound();
  }, [visible, item]);

  // 🎵 사운드 로드 & 재생
  const loadSound = async () => {
    try {
      setIsLoading(true);
      const { sound: s } = await Audio.Sound.createAsync(
        { uri: item.audioUri },
        { shouldPlay: true, isLooping: true } // 반복 재생 설정
      );
      setSound(s);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.log("오디오 로드 실패:", error);
      setIsLoading(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      stopSpinning(); // 멈춤
    } else {
      await sound.playAsync();
      startSpinning(); // 다시 회전
    }
    setIsPlaying(!isPlaying);
  };

  // 🌀 애니메이션 로직
  const startSpinning = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000, // 6초에 한 바퀴
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinning = () => {
    spinValue.stopAnimation();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible || !item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.sheetTitle}>Now Playing</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* 💿 턴테이블 영역 */}
        <View style={styles.vinylContainer}>
          <Animated.View style={[styles.vinylDisk, { transform: [{ rotate: spin }] }]}>
             <View style={styles.vinylLabel}>
                <Text style={{fontSize: 30}}>{item.emoji || "🎵"}</Text>
             </View>
          </Animated.View>
          {/* 톤암 (LP 바늘) */}
          <View style={[styles.toneArm, { transform: [{ rotate: isPlaying ? '25deg' : '0deg' }] }]} />
        </View>

        {/* 곡 정보 */}
        <Text style={styles.title}>{item.title || "오늘의 BGM"}</Text>
        <Text style={styles.subTitle}>AI가 생성한 오늘의 감정 음악</Text>

        {/* 재생 컨트롤 */}
        <View style={styles.controls}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
              <MaterialCommunityIcons 
                name={isPlaying ? "pause" : "play"} 
                size={40} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: "55%",
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 24,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  // LP 디자인
  vinylContainer: {
    width: 220, height: 220,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  vinylDisk: {
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#333',
    elevation: 5,
  },
  vinylLabel: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 15, borderColor: '#111',
  },
  toneArm: {
    position: 'absolute',
    top: -20, right: 0,
    width: 15, height: 100,
    backgroundColor: '#888',
    borderTopRightRadius: 5,
    transformOrigin: 'top right', // RN 최신버전 지원, 안되면 margin으로 조절
  },
  title: {
    fontSize: 20, fontWeight: "bold", color: "#111",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14, color: "#666", marginBottom: 30,
  },
  controls: {
    marginBottom: 20,
  },
  playBtn: {
    width: 70, height: 70,
    borderRadius: 35,
    backgroundColor: "#0F172A",
    justifyContent: "center", alignItems: "center",
    elevation: 5,
  }
});