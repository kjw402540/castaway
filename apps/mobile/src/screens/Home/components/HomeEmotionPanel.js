// src/screens/Home/components/HomeEmotionPanel.js
import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeEmotionCard from "./HomeEmotionCard";
import { useTheme } from "../../../context/ThemeContext";

export default function HomeEmotionPanel({
  today,
  todayStatus,
  todayDiary,
  showEmotionCard,
  setShowEmotionCard,
}) {
  const storageKey = `emotionCardClosed_${today}`;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(buttonOpacity, {
      toValue: showEmotionCard ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [showEmotionCard]);

  const closeCard = async () => {
    await AsyncStorage.setItem(storageKey, "true");
    setShowEmotionCard(false);
  };

  const reopenCard = async () => {
    await AsyncStorage.removeItem(storageKey);
    setShowEmotionCard(true);
  };

  const showCardContent =
    (todayStatus === "done" || todayStatus === "object_created") &&
    todayDiary?.emotionResult &&
    showEmotionCard;

  return (
    <View>
      {showCardContent && (
        <HomeEmotionCard
          emotionResult={todayDiary.emotionResult}
          onClose={closeCard}
        />
      )}

      {(todayStatus === "done" || todayStatus === "object_created") && (
        <Animated.View
          style={[
            styles.floatingButton,
            {
              opacity: buttonOpacity,
              backgroundColor: theme.sea,
              pointerEvents: showEmotionCard ? "none" : "auto",
            },
          ]}
        >
          <TouchableOpacity onPress={reopenCard}>
            <MaterialCommunityIcons
              name="emoticon-happy-outline"
              size={26}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 34,
    right: 22,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
