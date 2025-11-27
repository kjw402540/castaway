// src/context/SoundContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const soundRef = useRef(null);
  const [bgmEnabled, setBgmEnabled] = useState(true);

  // 앱 실행 시 저장된 설정 불러오기
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("bgmEnabled");
      if (saved !== null) setBgmEnabled(saved === "true");
    })();
  }, []);

  // BGM 로드 + 루프 재생
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/default_bgm.wav"), // 기본 배경음
          { isLooping: true, volume: 0.3 }
        );

        soundRef.current = sound;
        if (bgmEnabled) sound.playAsync();
      } catch (e) {
        console.log("BGM 로드 실패", e);
      }
    })();

    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  // BGM ON/OFF 즉시 반영 + 저장
  useEffect(() => {
    if (!soundRef.current) return;
    bgmEnabled ? soundRef.current.playAsync() : soundRef.current.pauseAsync();
    AsyncStorage.setItem("bgmEnabled", String(bgmEnabled));
  }, [bgmEnabled]);

  return (
    <SoundContext.Provider value={{ bgmEnabled, setBgmEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
