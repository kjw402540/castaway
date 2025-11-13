import { useRef } from 'react';
import { Animated } from 'react-native';

export default function useFadeAnimation(initialValue = 0, duration = 500) {
  const opacity = useRef(new Animated.Value(initialValue)).current;

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return { opacity, fadeIn };
}