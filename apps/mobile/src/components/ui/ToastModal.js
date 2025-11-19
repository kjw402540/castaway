import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, Animated } from "react-native";

export default function ToastModal({ visible, message, onClose }) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
          onClose && onClose();
        });
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <Animated.View style={[styles.box, { opacity }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center",
    paddingBottom: 80, backgroundColor: "rgba(0,0,0,0.0)",
  },
  box: {
    paddingVertical: 12, paddingHorizontal: 20,
    backgroundColor: "#111827", borderRadius: 12,
  },
  text: {
    color: "white", fontSize: 14, fontWeight: "600",
  },
});
