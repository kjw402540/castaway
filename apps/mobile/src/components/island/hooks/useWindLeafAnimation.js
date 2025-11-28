// src/components/island/hooks/useWindLeafAnimation.js
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import useSceneActive from "../../../hooks/useSceneActive";

export default function useWindLeafAnimation(zIndex, index) {
  const rotate = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const rotateAmount = 4 - index * 0.3;
  const moveAmount = 3 - index * 0.2;
  const duration = 2500 + index * 200;

  const play = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: duration + 200,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: duration + 200,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    play();
  }, []);

  useSceneActive([
    { value: rotate, resume: play },
    { value: sway, resume: play },
  ]);

  return {
    transform: [
      {
        rotate: rotate.interpolate({
          inputRange: [0, 1],
          outputRange: [`-${rotateAmount}deg`, `${rotateAmount}deg`],
        }),
      },
      {
        translateX: sway.interpolate({
          inputRange: [0, 1],
          outputRange: [-moveAmount, moveAmount],
        }),
      },
    ],
    zIndex,
  };
}
