// src/context/SoundContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const soundRef = useRef(null);
  // 👇 1. 초기값을 false로 변경 (앱 시작 시 BGM 꺼짐)
  const [bgmEnabled, setBgmEnabled] = useState(false);

  // 👇 2. 저장된 설정을 불러오는 부분을 주석 처리
  // (이전에 BGM을 켜둔 기록이 있어도, 앱을 켤 때는 무조건 꺼진 상태로 시작하기 위함)
  /*
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("bgmEnabled");
      if (saved !== null) setBgmEnabled(saved === "true");
    })();
  }, []);
  */

  // BGM 로드 + 루프 재생
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/default_bgm.wav"), 
          { isLooping: true, volume: 0.3 }
        );

        soundRef.current = sound;
        // 👇 3. bgmEnabled가 false이므로 여기서 playAsync()가 실행되지 않음
        if (bgmEnabled) sound.playAsync();
      } catch (e) {
        console.log("BGM 로드 실패", e);
      }
    })();

    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []); // 의존성 배열 비워둠 (최초 1회만 로드)

  // BGM ON/OFF 상태 변경 감지
  useEffect(() => {
    if (!soundRef.current) return;
    
    // 상태가 true로 바뀔 때만 재생, false면 정지
    if (bgmEnabled) {
      soundRef.current.playAsync();
    } else {
      soundRef.current.pauseAsync();
    }

    // (선택 사항) 사용자가 나중에 켤 수도 있으니 상태 저장은 유지하거나,
    // 아예 기능을 끌거라면 저장 로직도 주석 처리해도 됩니다.
    AsyncStorage.setItem("bgmEnabled", String(bgmEnabled));
  }, [bgmEnabled]);

  return (
    <SoundContext.Provider value={{ bgmEnabled, setBgmEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);