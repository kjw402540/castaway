import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useEmotion } from "../../context/EmotionContext";

// 감정별 컬러 맵핑
const emotionColors = {
  joy: ["#A7D8FF", "#FFD580"],      // 밝고 따뜻한 톤
  sadness: ["#6CA0DC", "#1E3A8A"],  // 차분한 파랑
  anger: ["#FF8A80", "#E53935"],    // 붉은 계열
  fear: ["#B39DDB", "#5E35B1"],     // 보라 계열
  neutral: ["#D8ECFF", "#A7D8FF"],  // 기본
};

export default function useEmotionTransition() {
  const { emotion } = useEmotion();
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start(() => bgAnim.setValue(0)); // reset
  }, [emotion]);

  // 색상 전환 비율
  const interpolateColor = (colorFrom, colorTo) => {
    const r = bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colorFrom, colorTo],
    });
    return r;
  };

  const colors = emotionColors[emotion] || emotionColors.neutral;

  return { bgAnim, colors, interpolateColor };
}
