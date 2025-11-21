// src/screens/hooks/useBackExit.js

import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, ToastAndroid } from 'react-native';
import { useCallback, useRef } from 'react';

// 두 번째 뒤로 가기 클릭을 기다리는 시간 (밀리초)
const TIMEOUT = 2000;

/**
 * Android 뒤로가기 버튼을 최상위 화면에서 두 번 연속 눌렀을 때 
 * 앱을 종료하는 훅 (토스트 메시지 표시).
 */
export function useBackExit() {
  // 마지막으로 뒤로가기 버튼을 누른 시간을 저장하기 위한 ref
  const lastPressTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // 현재 시간과 마지막으로 누른 시간의 차이를 계산
        const timeDiff = Date.now() - lastPressTime.current;

        // 2초(TIMEOUT) 이내에 다시 누른 경우
        if (timeDiff < TIMEOUT) {
          BackHandler.exitApp(); // 앱 종료
          return true; // 이벤트 소비
        }
        
        // 처음 누른 경우: 시간 기록 및 토스트 메시지 표시
        lastPressTime.current = Date.now();
        ToastAndroid.show('뒤로 가기 버튼을 한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);

        return true; // 이벤트 소비
      };

      // 1. 리스너 등록 (이전 에러 해결 방식 적용)
      const backHandlerListener = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // 2. 리스너 해제
        backHandlerListener.remove();
        // 화면을 벗어날 때 lastPressTime도 초기화하여 다른 화면에서 
        // 앱 종료 로직이 꼬이는 것을 방지
        lastPressTime.current = 0;
      };
    }, [])
  );
}