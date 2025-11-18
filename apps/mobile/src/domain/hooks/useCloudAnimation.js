import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// 구름이 나타날 수 있는 최대 Y 위치를 화면 높이의 30% 정도로 제한
const MAX_CLOUD_Y = screenHeight * 0.3; 
// 50은 상단바나 안전 영역을 고려한 최소 Y 위치입니다.
const MIN_CLOUD_Y = 50; 
const Y_RANGE = MAX_CLOUD_Y - MIN_CLOUD_Y;

export default function useCloudAnimation(index = 0) {
  const translateX = useRef(new Animated.Value(0)).current;

  // 🔴 Y 위치 수정: 밴드 폭 내에서 랜덤 오프셋을 줄여 겹침 방지
  const baseBand = Y_RANGE / 5; // 5개 구름이 겹치지 않도록 Y 범위 5분할
  const baseY = MIN_CLOUD_Y + (index % 5) * baseBand; // 최소 Y 위치에서 시작
  
  // 🔴 랜덤 오프셋을 baseBand의 40%로 대폭 줄여 밴드 겹침 최소화
  const randomYOffset = (Math.random() - 0.5) * (baseBand * 0.4); 
  
  // 최종 Y 위치
  const randomY = Math.min(MAX_CLOUD_Y, baseY + randomYOffset); 

  // 화면 밖 시작 및 끝 위치 설정 (400 유지)
  const startOffset = 400; 
  const startX = -startOffset; 
  const endX = screenWidth + startOffset; 

  // 이동 속도 (duration)
  const duration = 35000; 

  // 🔴 순차적 지연 간격 증가: 5초에서 7.5초로 늘려 화면 내 거리 확보
  const STAGGER_INTERVAL = 7500; 
  const staggerDelay = index * STAGGER_INTERVAL;

  useEffect(() => {
    translateX.setValue(startX);

    const moveAnimation = Animated.timing(translateX, {
      toValue: endX, 
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const timer = setTimeout(() => {
      Animated.loop(moveAnimation).start();
    }, staggerDelay); 

    return () => clearTimeout(timer);
  }, []); 

  return {
    translateX,
    randomY,
  };
}