// src/screens/Music/MusicDetailModal.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const { width } = Dimensions.get("window");

export default function MusicDetailModal({ visible, music, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    if (visible && music?.audio) loadAudio();
    return () => unloadAudio();
  }, [visible]);

  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        music.audio,
        { shouldPlay: false },
      );
      soundRef.current = sound;
    } catch (err) {
      console.log("Audio load error:", err);
    }
  };

  const unloadAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  if (!visible || !music) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Music Box</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="chevron-down" size={28} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <View style={styles.albumCover}>
            <Text style={styles.albumIcon}>{music.icon}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.title}>{music.title}</Text>
            <Text style={styles.artist}>AI Generated • 2025.11.09</Text>
            <View style={styles.tagWrapper}>
              <Text style={styles.emotionTag}>{music.emotion}</Text>
            </View>
          </View>

          <View style={styles.playerControls}>
            <View style={styles.progressBar}>
              <View
                style={{
                  width: "40%",
                  height: "100%",
                  backgroundColor: "#3B82F6",
                  borderRadius: 2,
                }}
              />
            </View>

            <View style={styles.timeRow}>
              <Text style={styles.timeText}>0:00</Text>
              <Text style={styles.timeText}>{music.duration}</Text>
            </View>

            <View style={styles.controlButtons}>
              <TouchableOpacity>
                <Ionicons name="play-skip-back" size={30} color="#1E3A8A" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={36}
                  color="white"
                  style={{ marginLeft: isPlaying ? 0 : 4 }}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="play-skip-forward" size={30} color="#1E3A8A" />
              </TouchableOpacity>
            </View>

            {!music.audio && (
              <Text
                style={{
                  marginTop: 20,
                  color: "#9CA3AF",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                아직 준비되지 않은 오디오예요.
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "85%",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  albumCover: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 8,
  },
  albumIcon: {
    fontSize: 100,
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  artist: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 15,
  },
  tagWrapper: {
    flexDirection: "row",
  },
  emotionTag: {
    backgroundColor: "#EFF6FF",
    color: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  playerControls: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 20,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  playButton: {
    width: 70,
    height: 70,
    backgroundColor: "#3B82F6",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
