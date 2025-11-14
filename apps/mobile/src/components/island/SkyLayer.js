import React from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

export default function SkyLayer({ prevColors, nextColors, animatedOpacity }) {
  const safePrev = Array.isArray(prevColors) ? prevColors : ["#DDE6F5", "#C8D5EA"];
  const safeNext = Array.isArray(nextColors) ? nextColors : ["#DDE6F5", "#C8D5EA"];

  return (
    <>
      <LinearGradient
        colors={safePrev}
        style={styles.sky}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Animated.View style={[styles.sky, { opacity: animatedOpacity }]}>
        <LinearGradient
          colors={safeNext}
          style={styles.sky}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
    </>
  );
}
