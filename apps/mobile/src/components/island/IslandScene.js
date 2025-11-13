import React, { useEffect } from "react";
import {
  View,
  Image,
  Pressable,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEmotion } from "../../context/EmotionContext";
import useFadeAnimation from "../../domain/hooks/useFadeAnimation";
import { emotionColors } from "../../utils/emotionMap";

const { height } = Dimensions.get("window");

export default function IslandScene({ onPressChest, onPressTurntable }) {
  const { emotion } = useEmotion();
  const { opacity, fadeIn } = useFadeAnimation(0, 800);

  useEffect(() => {
    fadeIn();
  }, [emotion]);

  const { sky, sea } = emotionColors[emotion] || emotionColors.neutral;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      pointerEvents="box-none"
    >
      {/* 하늘 */}
      <Animated.View
        pointerEvents="none"
        style={{
          opacity,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "50%",
        }}
      >
        <LinearGradient
          style={{ flex: 1 }}
          colors={[sky, "#ffffff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* 바다 */}
      <Animated.View
        pointerEvents="none"
        style={{
          opacity,
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LinearGradient
          style={{ flex: 1 }}
          colors={["#66C2FF", sea]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* 섬과 오브젝트 */}
      <View
        style={{
          position: "absolute",
          bottom: height * 0.33,
          alignItems: "center",
          justifyContent: "center",
        }}
        pointerEvents="box-none"
      >
        {/* 나무 */}
        <Text
          style={{
            fontSize: 100,
            position: "absolute",
            bottom: 130,
            left: 90,
            zIndex: 1,
          }}
        >
          🌴
        </Text>

        {/* 섬 */}
        <Image
          source={require("../../../assets/ground.png")}
          style={{
            width: 480,
            height: 240,
            resizeMode: "contain",
          }}
        />

        {/* 바위 */}
        <Image
          source={require("../../../assets/rock.png")}
          style={{
            width: 120,
            height: 120,
            resizeMode: "contain",
            position: "absolute",
            bottom: 85,
            left: 180,
          }}
        />

        {/* 보물상자 */}
        <Pressable
          onPress={onPressChest}
          style={{
            position: "absolute",
            bottom: 80,
            left: 120,
            zIndex: 10,
          }}
          pointerEvents="box-only"
        >
          <Image
            source={require("../../../assets/chest.png")}
            style={{
              width: 90,
              height: 90,
              resizeMode: "contain",
            }}
          />
        </Pressable>

        {/* 턴테이블 */}
        <Pressable
          onPress={onPressTurntable}
          style={{
            position: "absolute",
            bottom: 85,
            right: 120,
            zIndex: 10,
          }}
          pointerEvents="box-only"
        >
          <Image
            source={require("../../../assets/turntable.png")}
            style={{
              width: 90,
              height: 90,
              resizeMode: "contain",
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
