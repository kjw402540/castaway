import React from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

export default function OceanLayer({ prevColors, nextColors, animatedOpacity }) {
  const safePrev = Array.isArray(prevColors) ? prevColors : ["#8FBEEA", "#72AEE6"];
  const safeNext = Array.isArray(nextColors) ? nextColors : ["#8FBEEA", "#72AEE6"];

  return (
    <>
      <LinearGradient
        colors={safePrev}
        style={styles.ocean}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <Animated.View style={[styles.ocean, { opacity: animatedOpacity }]}>
        <LinearGradient
          colors={safeNext}
          style={styles.ocean}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
    </>
  );
}
