import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

export default function WaveformPlayer({ audioUri }) {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const durationRef = useRef(0);

  const progress = useSharedValue(0); // 0 → 1

  const play = async () => {
    if (!audioUri) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });

      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(audioUri);
        soundRef.current = sound;
        const status = await sound.getStatusAsync();
        durationRef.current = status.durationMillis || 0;

        await sound.playAsync();
        setIsPlaying(true);

        animateProgress(durationRef.current);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);

        animateProgress(durationRef.current);
      }

      soundRef.current.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          resetPlayer();
        }
      });

    } catch (err) {
      console.log("Audio play error:", err);
    }
  };

  const animateProgress = (duration) => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration,
      easing: Easing.linear,
    });
  };

  const pause = async () => {
    if (!soundRef.current) return;
    await soundRef.current.pauseAsync();
    setIsPlaying(false);
    progress.value = progress.value; // 멈춤
  };

  const resetPlayer = async () => {
    setIsPlaying(false);
    progress.value = withTiming(0, { duration: 200 });

    try {
      await soundRef.current?.stopAsync();
      await soundRef.current?.setPositionAsync(0);
    } catch {}
  };

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={isPlaying ? pause : play}
        style={styles.iconBtn}
      >
        <FontAwesome
          name={isPlaying ? "pause" : "play"}
          size={18}
          color="#1E3A8A"
        />
      </TouchableOpacity>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  iconBtn: {
    marginRight: 12,
  },
  track: {
    width: 180,
    height: 10,
    backgroundColor: "#E5ECFF",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  fill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#4F8CFF",
    borderRadius: 10,
    transformOrigin: "left",
  },
});
